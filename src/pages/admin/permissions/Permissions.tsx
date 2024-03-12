import { AddCircle, DeleteForeverOutlined, EditOutlined, Group, VisibilityOutlined } from '@mui/icons-material';
import { Box, Button, Switch, Tooltip, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import type { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { DataGrid } from '@mui/x-data-grid';
import type { ChangeEvent, MouseEvent, ReactNode, SyntheticEvent } from 'react';
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
import { SlidingDialog } from '../../../common/components/SlidingDialog';
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
import { usePermissionEndpoint } from '../../../common/hooks/endpoints/usePermissionEndpoint';
import { usePermissionEntityEndpoint } from '../../../common/hooks/endpoints/usePermissionEntityEndpoint';
import { useBail } from '../../../common/hooks/useBail';
import { useDataGridLocaleText } from '../../../common/hooks/useDataGridLocaleText';
import { useHasPermission } from '../../../common/hooks/useHasPermission';
import { useLookup } from '../../../common/hooks/useLookup';
import { useUXStore } from '../../../common/hooks/useUXStore';
import type { RoleUI } from '../../../common/interfaces/role/RoleUI';
import type { UserUI } from '../../../common/interfaces/user/UserUI';

const Permissions = () => {
   const [
      getPermissions,
      setPermissions,
   ] = useEndpointStore(state => [
      state.getPermissions,
      state.setPermissions,
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
   const [deleteWarningActions, setDeleteWarningActions] = useState<ReactNode>(null);
   const [deleteWarningContent, setDeleteWarningContent] = useState<ReactNode>(null);
   const [deleteWarningOpen, setDeleteWarningOpen] = useState(false);
   const [deleted, setDeleted] = useState(false);
   const [updated, setUpdated] = useState(false);
   const bail = useBail();
   const hasPermission = useHasPermission();
   const localeText = useDataGridLocaleText();
   const lookup = useLookup();
   const navigate = useNavigate();
   const permissionEndpoint = usePermissionEndpoint();
   const permissionEntityEndpoint = usePermissionEntityEndpoint();
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
               <RestrictAccess accessKey={accessKey.permissionsListActivatePermission}>
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
               <RestrictAccess accessKey={accessKey.permissionsListGoToPermissionDetail}>
                  <Tooltip title={translate(hasAdminWritePermission ? 'Edit' : 'View')}>
                     <IconButton
                        aria-label={translate(hasAdminWritePermission ? 'Edit' : 'View')}
                        onClick={goToPermissionForm}
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
         field: 'name',
         flex: 10,
         headerName: translate('Name'),
         minWidth: 150,
         renderCell: (props: GridRenderCellParams) => getGridText(props.row.name, props.row.isDisabled),
      },
      {
         field: 'description',
         flex: 100,
         headerName: translate('Description'),
         renderCell: (props: GridRenderCellParams) => getGridText(props.row.description, props.row.isDisabled),
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
         field: 'relatedUsers',
         filterable: false,
         flex: 1,
         renderCell: (props: GridRenderCellParams) => {
            const { isDisabled, relatedUsers } = props.row;
            return <>
               <Tooltip title={translate('Related users')}>
                  <div style={{
                     cursor: 'default',
                     marginRight: 12,
                     textAlign: 'right',
                     width: '100%',
                  }}>
                     {getGridText(relatedUsers, isDisabled)}
                  </div>
               </Tooltip>
            </>
         },
         renderHeader: () => <Group/>,
      },
      {
         field: 'delete',
         filterable: false,
         flex: 1,
         headerName: '',
         renderCell: (props: GridRenderCellParams) => {
            const { id } = props.row;
            return <>
               <RestrictAccess accessKey={accessKey.permissionsListDeletePermission}>
                  <ShowIf condition={lookup.rolesByPermission(id).length === 0 && lookup.usersByPermission(id).length === 0}>
                     <Tooltip title={translate('Delete')}>
                        <IconButton
                           aria-label={translate('Delete')}
                           onClick={checkDeletePermission}
                           sx={{ color: Color.red }}
                           value={id}
                        >
                           <DeleteForeverOutlined/>
                        </IconButton>
                     </Tooltip>
                  </ShowIf>
               </RestrictAccess>
            </>
         },
         sortable: false,
      },
   ]

   const callDeletePermission = (event: MouseEvent<HTMLButtonElement>) => {
      const permissionId = Number(event.currentTarget.value);
      deletePermission(permissionId);
   }

   const checkDeletePermission = (event: MouseEvent<HTMLButtonElement>) => {
      const permissionId = Number(event.currentTarget.value);
      const relatedRoles = lookup.rolesByPermission(permissionId);
      const relatedUsers = lookup.usersByPermission(permissionId);
      if (relatedRoles.length || relatedUsers.length) {
         setDeleteWarningOpen(true);
         updateDeleteWarningContent(permissionId, relatedRoles, relatedUsers);
      } else
         deletePermission(permissionId);
   }

   const closeDeletedSnackbar = (_event?: SyntheticEvent | Event, reason?: string) => {
      reason !== 'clickaway' && setDeleted(false);
   }

   const closeDeleteWarning = () => setDeleteWarningOpen(false);

   const closeErrorSnackbar = (_event?: SyntheticEvent | Event, reason?: string) => {
      reason !== 'clickaway' && setShowError(false);
   }

   const closeUpdatedSnackbar = (_event?: SyntheticEvent | Event, reason?: string) => {
      reason !== 'clickaway' && setUpdated(false);
   }

   const deletePermission = (permissionId: number) => {
      (async () => {
         setShowLoading(true);
         setDeleteWarningOpen(false);
         const { status } = await permissionEndpoint.delete(permissionId);
         if (status !== HttpStatusCode.OK) return bail.out(`Could not delete permission #${permissionId}`);
         setDeleted(true);
         const newPermissions = getPermissions().filter(permission => permission.id !== permissionId);
         setPermissions(newPermissions);
         setShowLoading(false);
      })();
   }

   const getRows = () => getPermissions().map(permission => {
      const { description, id, isDisabled, name } = permission;
      return {
         description: translate(description),
         id,
         isDisabled,
         name: translate(name),
         relatedRoles: lookup.rolesByPermission(id).length,
         relatedUsers: lookup.usersByPermission(id).length,
      }
   })

   const goToPermissionForm = (event: MouseEvent<HTMLButtonElement>) => {
      const permissionId = event.currentTarget.value;
      navigate(`${Path.adminPermissions}/${permissionId}`);
   }

   const toggleIsDisabled = (event: ChangeEvent<HTMLInputElement>) => {
      (async () => {
         setShowLoading(true);
         const permissionId = Number(event.target.name);
         const index = getPermissions().findIndex(permission => permission.id === permissionId);
         if (index === -1) return bail.out(`Could not find permission #${permissionId}`);
         const permissions = getPermissions();
         const { status } = await permissionEntityEndpoint.patch(permissionId, [{ property: 'disabled_flag', value: !permissions[index].isDisabled }]);
         if (status !== HttpStatusCode.OK) return bail.out(`Could not toggle isDisabled for permission #${permissionId}`);
         setUpdated(true);
         permissions[index].isDisabled = !permissions[index].isDisabled;
         setPermissions(permissions);
         setShowLoading(false);
      })();
   }

   const updateDeleteWarningContent = (
      permissionId: number,
      relatedRoles: RoleUI[],
      relatedUsers: UserUI[]
   ) => {
      let relatedRolesWarning = null;
      let relatedUsersWarning = null;
      const totalRoles = relatedRoles.length;
      const totalUsers = relatedUsers.length;
      if (totalRoles === 1)
         relatedRolesWarning = (
            <div>
               <Typography>
                  1 <TranslatedText text={'active role is related to this permission.'}/>
               </Typography>
            </div>
         )
      else if (totalRoles > 1)
         relatedRolesWarning = (
            <div>
               <Typography>
                  {totalRoles} <TranslatedText text={'active roles are related to this permission.'}/>
               </Typography>
            </div>
         )
      if (totalUsers === 1)
         relatedUsersWarning = (
            <div>
               <Typography>
                  1 <TranslatedText text={'active user is related to this permission.'}/>
               </Typography>
            </div>
         )
      else if (totalUsers > 1)
         relatedUsersWarning = (
            <div>
               <Typography>
                  {totalUsers} <TranslatedText text={'active users are related to this permission.'}/>
               </Typography>
            </div>
         )
      setDeleteWarningContent(
         <>
            {relatedRolesWarning}
            {relatedUsersWarning}
         </>
      )
      setDeleteWarningActions(
         <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
         }}>
            <Button
               aria-label={translate('Delete')}
               onClick={callDeletePermission}
               value={permissionId}
               variant={'outlined'}
            >
               <TranslatedText text={'Delete'}/>
            </Button>
            <Button
               aria-label={'Cancel'}
               onClick={closeDeleteWarning}
               variant={'outlined'}
            >
               <TranslatedText text={'Cancel'}/>
            </Button>
         </Box>
      )
   }

   useEffect(() => {
      setGridHeight(getPermissions().length);
   }, [getPermissions().length, getPageSize()]);

   return <>
      <RestrictAccess accessKey={accessKey.permissionsListViewPage}>
         <Loading open={getShowLoading()}/>
         <DefaultSnackbar
            onClose={closeDeletedSnackbar}
            open={deleted}
            severity={'success'}
            text={'The permission has been deleted.'}
         />
         <DefaultSnackbar
            onClose={closeUpdatedSnackbar}
            open={updated}
            severity={'success'}
            text={'The permission has been updated.'}
         />
         <DefaultSnackbar
            onClose={closeErrorSnackbar}
            open={getShowError()}
            severity={'error'}
            text={'An error occurred.'}
         />
         <SlidingDialog
            actions={deleteWarningActions}
            content={deleteWarningContent}
            onClose={closeDeleteWarning}
            open={deleteWarningOpen}
            title={translate('Are you sure?')}
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
                     <TranslatedText text={'Permissions'}/>
                  </Typography>
                  <RestrictAccess accessKey={accessKey.permissionsListCreatePermission}>
                     <Tooltip title={translate('Create new Permission')}>
                        <IconButton
                           aria-label={translate('Create new Permission')}
                           onClick={goToPermissionForm}
                           value={0}
                        >
                           <AddCircle sx={{
                              color: Color.greenTemplate,
                              stroke: Color.white,
                           }}/>
                        </IconButton>
                     </Tooltip>
                  </RestrictAccess>
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

export default Permissions;