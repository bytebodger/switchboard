import { AddCircle, DeleteForeverOutlined, EditOutlined, Group, Key, VisibilityOutlined } from '@mui/icons-material';
import { Box, Button, Switch, Tooltip, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import type { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { DataGrid } from '@mui/x-data-grid';
import type { ChangeEvent, MouseEvent, ReactNode, SyntheticEvent } from 'react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
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
import { getString } from '../../../common/functions/getString';
import { useRoleEndpoint } from '../../../common/hooks/endpoints/useRoleEndpoint';
import { useBail } from '../../../common/hooks/useBail';
import { useDataGridLocaleText } from '../../../common/hooks/useDataGridLocaleText';
import { useHasPermission } from '../../../common/hooks/useHasPermission';
import { useLookup } from '../../../common/hooks/useLookup';
import { useUXStore } from '../../../common/hooks/useUXStore';
import type { PermissionUI } from '../../../common/interfaces/permission/PermissionUI';
import type { UserUI } from '../../../common/interfaces/user/UserUI';

const Roles = () => {
   const [
      getRoles,
      setRoles,
   ] = useEndpointStore(state => [
      state.getRoles,
      state.setRoles,
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
   const roleEndpoint = useRoleEndpoint();
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
               <RestrictAccess accessKey={accessKey.rolesListActivateRole}>
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
               <RestrictAccess accessKey={accessKey.rolesListGoToRoleDetail}>
                  <Tooltip title={translate(hasAdminWritePermission ? 'Edit' : 'View')}>
                     <IconButton
                        aria-label={translate(hasAdminWritePermission ? 'Edit' : 'View')}
                        onClick={goToRoleForm}
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
         flex: 5,
         headerName: translate('Name'),
         minWidth: 100,
         renderCell: (props: GridRenderCellParams) => getGridText(props.row.name, props.row.isDisabled),
      },
      {
         field: 'description',
         flex: 100,
         headerName: translate('Description'),
         renderCell: (props: GridRenderCellParams) => getGridText(props.row.description, props.row.isDisabled),
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
      {
         field: 'delete',
         filterable: false,
         flex: 1,
         headerName: '',
         renderCell: (props: GridRenderCellParams) => {
            const { id } = props.row;
            return <>
               <RestrictAccess accessKey={accessKey.rolesListDeleteRole}>
                  <ShowIf condition={lookup.permissionsByRole(id).length === 0 && lookup.permissionsByUser(id).length === 0}>
                     <Tooltip title={translate('Delete')}>
                        <IconButton
                           aria-label={translate('Delete')}
                           onClick={checkDeleteRole}
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

   const callDeleteRole = (event: MouseEvent<HTMLButtonElement>) => {
      const roleId = Number(event.currentTarget.value);
      deleteRole(roleId);
   }

   const checkDeleteRole = (event: MouseEvent<HTMLButtonElement>) => {
      const roleId = Number(event.currentTarget.value);
      const relatedPermissions = lookup.permissionsByRole(roleId);
      const relatedUsers = lookup.usersByRole(roleId);
      if (relatedPermissions.length || relatedUsers.length) {
         setDeleteWarningOpen(true);
         updateDeleteWarningContent(roleId, relatedPermissions, relatedUsers);
      } else
         deleteRole(roleId);
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

   const deleteRole = (roleId: number) => {
      (async () => {
         setShowLoading(true);
         setDeleteWarningOpen(false);
         const { status } = await roleEndpoint.delete(roleId);
         if (status !== HttpStatusCode.OK) return bail.out(`Could not delete role #${roleId}`);
         setDeleted(true);
         const newRoles = getRoles().filter(role => role.id !== roleId);
         setRoles(newRoles);
         setShowLoading(false);
      })();
   }

   const getRows = () => getRoles().map(role => {
      const { description, id, isDisabled, name } = role;
      return {
         description: translate(getString(description)),
         id,
         isDisabled,
         name: translate(name),
         relatedPermissions: lookup.permissionsByRole(id).length,
         relatedUsers: lookup.usersByRole(id).length,
      }
   })

   const goToRoleForm = (event: MouseEvent<HTMLButtonElement>) => {
      const roleId = event.currentTarget.value;
      navigate(`${Path.adminRoles}/${roleId}`);
   }

   const toggleIsDisabled = (event: ChangeEvent<HTMLInputElement>) => {
      (async () => {
         setShowLoading(true);
         const roleId = Number(event.target.name);
         const index = getRoles().findIndex(role => role.id === roleId);
         if (index === -1) return bail.out(`Could not find role #${roleId}`);
         const roles = getRoles();
         roles[index].isDisabled = !roles[index].isDisabled;
         const { status } = await roleEndpoint.put(roles[index]);
         if (status !== HttpStatusCode.OK) return bail.out(['Could not toggle isDisabled for role:', roles[index]]);
         setUpdated(true);
         setRoles(roles);
         setShowLoading(false);
      })();
   }

   const updateDeleteWarningContent = (
      roleId: number,
      relatedPermissions: PermissionUI[],
      relatedUsers: UserUI[]
   ) => {
      let relatedPermissionsWarning = null;
      let relatedUsersWarning = null;
      const totalPermissions = relatedPermissions.length;
      const totalUsers = relatedUsers.length;
      if (totalPermissions === 1)
         relatedPermissionsWarning = (
            <div>
               <Typography>
                  1 <TranslatedText text={'active permission is related to this role.'}/>
               </Typography>
            </div>
         )
      else if (totalPermissions > 1)
         relatedPermissionsWarning = (
            <div>
               <Typography>
                  {totalPermissions} <TranslatedText text={'active permissions are related to this role.'}/>
               </Typography>
            </div>
         )
      if (totalUsers === 1)
         relatedUsersWarning = (
            <div>
               <Typography>
                  1 <TranslatedText text={'active user is related to this role.'}/>
               </Typography>
            </div>
         )
      else if (totalUsers > 1)
         relatedUsersWarning = (
            <div>
               <Typography>
                  {totalUsers} <TranslatedText text={'active users are related to this role.'}/>
               </Typography>
            </div>
         )
      setDeleteWarningContent(
         <>
            {relatedPermissionsWarning}
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
               aria-label={'Delete'}
               onClick={callDeleteRole}
               value={roleId}
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
      setGridHeight(getRoles().length);
   }, [getRoles().length, getPageSize()]);

   return <>
      <RestrictAccess accessKey={accessKey.rolesListViewPage}>
         <Loading open={getShowLoading()}/>
         <DefaultSnackbar
            onClose={closeDeletedSnackbar}
            open={deleted}
            severity={'success'}
            text={'The role has been deleted.'}
         />
         <DefaultSnackbar
            onClose={closeUpdatedSnackbar}
            open={updated}
            severity={'success'}
            text={'The role has been updated.'}
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
                     <TranslatedText text={'Roles'}/>
                  </Typography>
                  <Tooltip title={translate('Create new Role')}>
                     <IconButton
                        aria-label={translate('Create new Role')}
                        onClick={goToRoleForm}
                        value={0}
                     >
                        <AddCircle sx={{
                           color: Color.greenTemplate,
                           stroke: Color.white,
                        }}/>
                     </IconButton>
                  </Tooltip>
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

export default Roles;