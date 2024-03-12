import { EditOutlined, Key, VisibilityOutlined } from '@mui/icons-material';
import { Box, Switch, Tooltip, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import type { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { DataGrid } from '@mui/x-data-grid';
import type { ChangeEvent, MouseEvent, SyntheticEvent } from 'react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TbBrandRedhat } from 'react-icons/tb';
import { useNavigate } from 'react-router-dom';
import { Loading } from '../../../app/components/Loading';
import { useEndpointStore } from '../../../app/hooks/useEndpointStore';
import { Column } from '../../../common/components/Column';
import { DefaultSnackbar } from '../../../common/components/DefaultSnackbar';
import { RestrictAccess } from '../../../common/components/RestrictAccess';
import { Row } from '../../../common/components/Row';
import { ShowIf } from '../../../common/components/ShowIf';
import { TranslatedText } from '../../../common/components/TranslatedText';
import { accessKey } from '../../../common/constants/accessKey';
import { pageSizes } from '../../../common/constants/pageSizes';
import { Color } from '../../../common/enums/Color';
import { HtmlElement } from '../../../common/enums/HtmlElement';
import { HttpStatusCode } from '../../../common/enums/HttpStatusCode';
import { Path } from '../../../common/enums/Path';
import { Permission } from '../../../common/enums/Permission';
import { getDataGridInitialState } from '../../../common/functions/getDataGridInitialState';
import { getGridText } from '../../../common/functions/getGridText';
import { getUserDisplayName } from '../../../common/functions/getUserDisplayName';
import { useUserEndpoint } from '../../../common/hooks/endpoints/useUserEndpoint';
import { useBail } from '../../../common/hooks/useBail';
import { useDataGridLocaleText } from '../../../common/hooks/useDataGridLocaleText';
import { useHasPermission } from '../../../common/hooks/useHasPermission';
import { useLookup } from '../../../common/hooks/useLookup';
import { useUXStore } from '../../../common/hooks/useUXStore';

const Users = () => {
   const [
      getUser,
      getUsers,
      setUsers,
   ] = useEndpointStore(state => [
      state.getUser,
      state.getUsers,
      state.setUsers,
   ])
   const [
      getGridHeight,
      getPageSize,
      getShowError,
      getShowLoading,
      setGridHeight,
      setPageSize,
      setShowError,
      setShowLoading,
   ] = useUXStore(state => [
      state.getGridHeight,
      state.getPageSize,
      state.getShowError,
      state.getShowLoading,
      state.setGridHeight,
      state.setPageSize,
      state.setShowError,
      state.setShowLoading,
   ]);
   const [updated, setUpdated] = useState(false);
   const bail = useBail();
   const hasPermission = useHasPermission();
   const localeText = useDataGridLocaleText();
   const lookup = useLookup();
   const navigate = useNavigate();
   const userEndpoint = useUserEndpoint();
   const { t: translate } = useTranslation();

   const columns: GridColDef[] = [
      {
         field: 'isDisabled',
         filterable: false,
         flex: 1,
         headerName: '',
         renderCell: (props: GridRenderCellParams) => {
            const { id, isDisabled } = props.row;
            return <>
               <ShowIf condition={id !== getUser()?.id}>
                  <RestrictAccess accessKey={accessKey.usersListActivateUser}>
                     <Tooltip title={isDisabled ? translate('Disabled') : translate('Active')}>
                        <Switch
                           aria-label={isDisabled ? translate('Disabled') : translate('Active')}
                           checked={!isDisabled}
                           color={'success'}
                           inputProps={{ name: id }}
                           onChange={toggleIsDisabled}
                           size={'small'}
                        />
                     </Tooltip>
                  </RestrictAccess>
               </ShowIf>
            </>
         },
         sortable: false,
      },
      {
         field: 'edit',
         filterable: false,
         flex: 1,
         headerName: '',
         renderCell: (props: GridRenderCellParams) => {
            const { id } = props.row;
            const hasAdminWritePermission = hasPermission.check(Permission.adminWrite);
            return <>
               <RestrictAccess accessKey={accessKey.usersListGoToUserDetail}>
                  <Tooltip title={translate(hasAdminWritePermission ? 'Edit' : 'View')}>
                     <IconButton
                        aria-label={translate(hasAdminWritePermission ? 'Edit' : 'View')}
                        onClick={goToUserForm}
                        sx={{ color: Color.blueNeon }}
                        value={id}
                     >
                        <ShowIf condition={hasAdminWritePermission}>
                           <EditOutlined/>
                        </ShowIf>
                        <ShowIf condition={!hasAdminWritePermission}>
                           <VisibilityOutlined/>
                        </ShowIf>
                     </IconButton>
                  </Tooltip>
               </RestrictAccess>
            </>
         },
         sortable: false,
      },
      {
         field: 'id',
         flex: 1,
         headerName: translate('ID'),
         renderCell: (props: GridRenderCellParams) => getGridText(props.row.id, props.row.isDisabled),
      },
      {
         field: 'user',
         flex: 20,
         headerName: translate('User'),
         minWidth: 200,
         renderCell: (props: GridRenderCellParams) => getGridText(getUserDisplayName(props.row.user), props.row.isDisabled),
      },
      {
         field: 'relatedRoles',
         filterable: false,
         flex: 1,
         renderCell: (props: GridRenderCellParams) => {
            const { isDisabled, relatedRoles } = props.row;
            return <>
               <Tooltip title={translate('Related roles')}>
                  <div style={{
                     cursor: 'default',
                     marginRight: 12,
                     textAlign: 'right',
                     width: '100%',
                  }}>
                     {getGridText(relatedRoles, isDisabled)}
                  </div>
               </Tooltip>
            </>
         },
         renderHeader: () => <TbBrandRedhat fontSize={22}/>,
      },
      {
         field: 'relatedPermissions',
         filterable: false,
         flex: 1,
         renderCell: (props: GridRenderCellParams) => {
            const { isDisabled, relatedPermissions } = props.row;
            return <>
               <Tooltip title={translate('Related permissions')}>
                  <div style={{
                     cursor: 'default',
                     marginRight: 12,
                     textAlign: 'right',
                     width: '100%',
                  }}>
                     {getGridText(relatedPermissions, isDisabled)}
                  </div>
               </Tooltip>
            </>
         },
         renderHeader: () => <Key/>,
      },
   ]

   const closeErrorSnackbar = (_event?: SyntheticEvent | Event, reason?: string) => {
      reason !== 'clickaway' && setShowError(false);
   }

   const closeUpdatedSnackbar = (_event?: SyntheticEvent | Event, reason?: string) => {
      reason !== 'clickaway' && setUpdated(false);
   }

   const getRows = () => getUsers().filter(user => user.email !== 'system.user@sequel.ae')
      .map(user => {
         if (user.email === 'system.user@sequel.ae') return null;
         const { email, firstName, id, isDisabled, lastName } = user;
         return {
            email,
            firstName,
            id,
            isDisabled,
            lastName,
            relatedPermissions: lookup.permissionsByUser(id).length,
            relatedRoles: lookup.rolesByUser(id).length,
            user,
         }
      })

   const goToUserForm = (event: MouseEvent<HTMLButtonElement>) => {
      const userId = event.currentTarget.value;
      navigate(`${Path.adminUsers}/${userId}`);
   }

   const toggleIsDisabled = (event: ChangeEvent<HTMLInputElement>) => {
      (async () => {
         setShowLoading(true);
         const userId = Number(event.target.name);
         const index = getUsers().findIndex(user => user.id === userId);
         if (index === -1) return bail.out(`Could not find user #${userId}`);
         const users = getUsers();
         users[index].isDisabled = !users[index].isDisabled;
         const { status } = await userEndpoint.put(users[index]);
         if (status !== HttpStatusCode.OK) return bail.out(['Could not toggle isDisabled for user:', users[index]]);
         setUpdated(true);
         setUsers(users);
         setShowLoading(false);
      })();
   }

   useEffect(() => {
      setGridHeight(getUsers().length);
   }, [getUsers().length, getPageSize()]);

   return <>
      <RestrictAccess accessKey={accessKey.usersListViewPage}>
         <Loading open={getShowLoading()}/>
         <DefaultSnackbar
            onClose={closeUpdatedSnackbar}
            open={updated}
            severity={'success'}
            text={'The user has been updated.'}
         />
         <DefaultSnackbar
            onClose={closeErrorSnackbar}
            open={getShowError()}
            severity={'error'}
            text={'An error occurred.'}
         />
         <Row>
            <Column xs={12} sm={12} md={12} lg={12} xl={10}>
               <Box sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
               }}>
                  <Typography
                     sx={{ marginBottom: 2 }}
                     variant={HtmlElement.h5}
                  >
                     <TranslatedText text={'Users'}/>
                  </Typography>
               </Box>
               <div style={{
                  height: getGridHeight(),
                  minWidth: 800,
                  width: '100%',
               }}>
                  <DataGrid
                     columns={columns}
                     density={'compact'}
                     disableRowSelectionOnClick={true}
                     initialState={getDataGridInitialState()}
                     localeText={localeText.get()}
                     onPaginationModelChange={setPageSize}
                     pageSizeOptions={pageSizes}
                     rows={getRows()}
                  />
               </div>
            </Column>
         </Row>
      </RestrictAccess>
   </>
}

export default Users;