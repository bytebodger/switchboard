import { AddCircle, ArrowBack, Key, RemoveCircle, SaveOutlined } from '@mui/icons-material';
import PersonIcon from '@mui/icons-material/Person';
import { Box, Button, Switch, TextField, Tooltip, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import { TreeItem, TreeView } from '@mui/x-tree-view';
import dayjs from 'dayjs';
import type { ChangeEvent, MouseEvent, SyntheticEvent } from 'react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BiSolidEraser } from 'react-icons/bi';
import { TbBrandRedhat } from 'react-icons/tb';
import { useNavigate, useParams } from 'react-router-dom';
import { Loading } from '../../../../app/components/Loading';
import { useEndpointStore } from '../../../../app/hooks/useEndpointStore';
import { Column } from '../../../../common/components/Column';
import { DefaultSnackbar } from '../../../../common/components/DefaultSnackbar';
import { RestrictAccess } from '../../../../common/components/RestrictAccess';
import { Row } from '../../../../common/components/Row';
import { ShowIf } from '../../../../common/components/ShowIf';
import { SlidingDialog } from '../../../../common/components/SlidingDialog';
import { TranslatedText } from '../../../../common/components/TranslatedText';
import { accessKey } from '../../../../common/constants/accessKey';
import { arg } from '../../../../common/constants/arg';
import { component } from '../../../../common/constants/component';
import { Color } from '../../../../common/enums/Color';
import { Format } from '../../../../common/enums/Format';
import { HtmlElement } from '../../../../common/enums/HtmlElement';
import { HttpStatusCode } from '../../../../common/enums/HttpStatusCode';
import { Path } from '../../../../common/enums/Path';
import { getNumber } from '../../../../common/functions/getNumber';
import { getString } from '../../../../common/functions/getString';
import { getUserDisplayName } from '../../../../common/functions/getUserDisplayName';
import { parseApiId } from '../../../../common/functions/parseApiId';
import { usePermissionEndpoint } from '../../../../common/hooks/endpoints/usePermissionEndpoint';
import { usePermissionEntityEndpoint } from '../../../../common/hooks/endpoints/usePermissionEntityEndpoint';
import { useRolePermissionEndpoint } from '../../../../common/hooks/endpoints/useRolePermissionEndpoint';
import { useBail } from '../../../../common/hooks/useBail';
import { useLookup } from '../../../../common/hooks/useLookup';
import { useUXStore } from '../../../../common/hooks/useUXStore';
import type { PermissionUI } from '../../../../common/interfaces/permission/PermissionUI';
import { log } from '../../../../common/libraries/log';
import { usePermissionStore } from './_hooks/usePermissionStore';

const Permission = () => {
   const [
      getPermissions,
      getRolePermissions,
      getRoles,
      getUser,
      setPermissions,
      setRolePermissions,
   ] = useEndpointStore(state => [
      state.getPermissions,
      state.getRolePermissions,
      state.getRoles,
      state.getUser,
      state.setPermissions,
      state.setRolePermissions,
   ]);
   const [
      getDescription,
      getIsDisabled,
      getName,
      setDescription,
      setIsDisabled,
      setName,
   ] = usePermissionStore(state => [
      state.getDescription,
      state.getIsDisabled,
      state.getName,
      state.setDescription,
      state.setIsDisabled,
      state.setName,
   ]);
   const [
      getShowError,
      getShowLoading,
      setShowError,
      setShowLoading,
   ] = useUXStore(state => [
      state.getShowError,
      state.getShowLoading,
      state.setShowError,
      state.setShowLoading,
   ]);
   const [added, setAdded] = useState(false);
   const [duplicateWarning, setDuplicateWarning] = useState(false);
   const [removed, setRemoved] = useState(false);
   const [updated, setUpdated] = useState(false);
   const bail = useBail();
   const lookup = useLookup();
   const navigate = useNavigate();
   const original = useRef<PermissionUI | null>(null);
   const params = useParams();
   const permissionEndpoint = usePermissionEndpoint();
   const permissionEntityEndpoint = usePermissionEntityEndpoint();
   const rolePermissionEndpoint = useRolePermissionEndpoint();
   const { t: translate } = useTranslation();

   const permissionId = getNumber(params.permissionId);

   const addPermission = (event: MouseEvent<HTMLButtonElement>) => {
      (async () => {
         setShowLoading(true);
         const roleId = Number(event.currentTarget.value);
         const { data, status } = await rolePermissionEndpoint.post(permissionId, roleId);
         if (status !== HttpStatusCode.created) return bail.out(`Could not add rolePermission for role #${roleId} and permission #${permissionId}`);
         setAdded(true);
         const newRolePermissionId = parseApiId(data);
         const rolePermissions = getRolePermissions();
         rolePermissions.push({
            createdBy: getNumber(getUser()?.id),
            createdOn: dayjs().utc().format(Format.dateTime),
            id: newRolePermissionId,
            modifiedBy: getNumber(getUser()?.id),
            modifiedOn: dayjs().utc().format(Format.dateTime),
            permissionId,
            roleId,
         })
         setRolePermissions(rolePermissions);
         setShowLoading(false);
      })();
   }

   const closeAddedSnackbar = (_event?: SyntheticEvent | Event, reason?: string) => {
      reason !== 'clickaway' && setAdded(false);
   }

   const closeDuplicateWarning = () => setDuplicateWarning(false);

   const closeErrorSnackbar = (_event?: SyntheticEvent | Event, reason?: string) => {
      reason !== 'clickaway' && setShowError(false);
   }

   const closeRemovedSnackbar = (_event?: SyntheticEvent | Event, reason?: string) => {
      reason !== 'clickaway' && setRemoved(false);
   }

   const closeUpdatedSnackbar = (_event?: SyntheticEvent | Event, reason?: string) => {
      reason !== 'clickaway' && setUpdated(false);
   }

   const createPermission = async () => {
      setShowLoading(true);
      const { data, status } = await permissionEndpoint.post(getName(), getDescription());
      if (status !== HttpStatusCode.created) return bail.out(['Could not create permission:', getName(), getDescription()]);
      setAdded(true);
      const newPermissionId = parseApiId(data);
      const permissions = getPermissions();
      permissions.push({
         description: getDescription(),
         disabledOn: '',
         displayName: getName(),
         id: newPermissionId,
         isDisabled: false,
         name: getName(),
      });
      setPermissions(permissions);
      setShowLoading(false);
      navigate(`${Path.adminPermissions}/${newPermissionId}`);
   };

   const formChangesAreUnsaved = () => getDescription() !== original.current?.description || getName() !== original.current?.name;

   const formIsEmpty = () => !getDescription() && !getName();

   const getAddRemoveIcon = (roleId: number) => {
      const permissionExistsOnThisRole = getRolePermissions().some(
         rolePermission => rolePermission.roleId === roleId && rolePermission.permissionId === permissionId
      );
      let color = permissionExistsOnThisRole ? Color.red : Color.greenTemplate;
      if (getIsDisabled()) color = Color.greyLight;
      const sx = {
         bottom: 2,
         color,
         fontSize: 16,
         position: 'relative',
         stroke: Color.white,
         strokeWidth: 1.5,
      }
      if (permissionExistsOnThisRole)
         return <>
            <Tooltip title={translate('Remove permission from this role')}>
               <span>
                  <IconButton
                     aria-label={translate('Remove permission from this role')}
                     disabled={getIsDisabled()}
                     onClick={removePermission}
                     value={roleId}
                  >
                     <RemoveCircle sx={sx}/>
                  </IconButton>
               </span>
            </Tooltip>
         </>
      return <>
         <Tooltip title={translate('Add permission to this role')}>
            <IconButton
               aria-label={translate('Add permission to this role')}
               onClick={addPermission}
               value={roleId}
            >
               <AddCircle sx={sx}/>
            </IconButton>
         </Tooltip>
      </>
   }

   const getRelationships = () => {
      const roleNodes = getRoles().map(role => `role-${role.id}`)
         .concat(getRoles().map(role => `users-${role.id}`))
         .concat(getRoles().map(role => `permissions-${role.id}`));
      return <>
         <Row sx={{ marginTop: 2 }}>
            <Column xs={12}>
               <Typography variant={HtmlElement.h6}>
                  <TranslatedText text={'Relationships'}/>
               </Typography>
               <TreeView
                  defaultCollapseIcon={component.expandMore}
                  defaultExpandIcon={component.chevronRight}
                  expanded={roleNodes}
               >
                  {getRoleTreeRoleItems()}
               </TreeView>
            </Column>
         </Row>
      </>;
   }

   const getRoleTreePermissionItems = (roleId: number) => {
      const currentPermissionId = permissionId;
      const permissionItems = lookup.permissionsByRole(roleId, arg.includeDisabled)
         .map(permission => {
            const { id, isDisabled, name } = permission;
            const elementProps = {
               style: {
                  backgroundColor: currentPermissionId === id ? Color.orangeDark : 'none',
                  borderRadius: 4,
                  color: currentPermissionId === id ? Color.white : Color.inherit,
                  fontWeight: currentPermissionId === id ? 'bold' : 'inherit',
                  marginLeft: 8,
                  padding: currentPermissionId === id ? '4px' : 0,
               },
            };
            return (
               <TreeItem
                  disabled={isDisabled}
                  icon={
                     <Tooltip title={translate('Permission')}>
                        <Key sx={{ marginLeft: '12px' }}/>
                     </Tooltip>
                  }
                  key={`permission-${id}`}
                  label={
                     <TranslatedText
                        elementProps={elementProps}
                        text={name}
                     />
                  }
                  nodeId={`permission-${id}`}
               />
            );
         });
      if (!permissionItems.length) return null;
      return (
         <TreeItem
            label={translate('Users with this role have these permissions')}
            nodeId={`permissions-${roleId}`}
         >
            {permissionItems}
         </TreeItem>
      )
   }

   const getRoleTreeRoleItems = () => getRoles().map(role => {
      const { id, isDisabled, name } = role;
      return (
         <TreeItem
            disabled={isDisabled}
            icon={
               <Tooltip title={translate('Role')}>
                  <span>
                     <TbBrandRedhat/>
                  </span>
               </Tooltip>
            }
            key={`role-${id}`}
            label={
               <>
                  <TranslatedText text={name}/>
                  <RestrictAccess accessKey={accessKey.permissionActivatePermission}>
                     <ShowIf condition={!isDisabled}>
                        {getAddRemoveIcon(id)}
                     </ShowIf>
                  </RestrictAccess>
               </>
            }
            nodeId={`role-${id}`}
         >
            {getRoleTreeUserItems(id)}
            {getRoleTreePermissionItems(id)}
         </TreeItem>
      );
   });

   const getRoleTreeUserItems = (roleId: number) => {
      const userItems = lookup.usersByRole(roleId, arg.includeDisabled)
         .map(user => {
            const { id, isDisabled } = user;
            const displayName = getUserDisplayName(user);
            return (
               <TreeItem
                  disabled={isDisabled}
                  icon={
                     <Tooltip title={translate('User')}>
                        <PersonIcon sx={{ marginLeft: 1 }}/>
                     </Tooltip>
                  }
                  key={`user-${id}`}
                  label={
                     <span style={{ marginLeft: 8 }}>
                        {displayName}
                     </span>
                  }
                  nodeId={`user-${id}`}
               />
            );
         })
      if (!userItems.length) return null;
      return (
         <TreeItem
            label={translate('Users assigned to this role')}
            nodeId={`users-${roleId}`}
         >
            {userItems}
         </TreeItem>
      )
   }

   const goBack = () => {
      resetForm();
      navigate(Path.adminPermissions);
   }

   const removePermission = (event: MouseEvent<HTMLButtonElement>) => {
      (async () => {
         setShowLoading(true);
         const roleId = Number(event.currentTarget.value);
         const targetRolePermission = getRolePermissions()
            .find(
               rolePermission => rolePermission.roleId === roleId && rolePermission.permissionId === permissionId
            );
         if (!targetRolePermission) return bail.out(`Could not find rolePermission for roleId #${roleId} and permissionId #${permissionId}`);
         const { status } = await rolePermissionEndpoint.delete(targetRolePermission.id);
         if (status !== HttpStatusCode.OK) return bail.out(`Could not remove permission #${targetRolePermission.id}`);
         setRemoved(true);
         const newRolePermissions = getRolePermissions().filter(rolePermissions => rolePermissions.id !== targetRolePermission.id);
         setRolePermissions(newRolePermissions);
         setShowLoading(false);
      })();
   }

   const requiredFieldsAreComplete = () => getDescription() && getName();

   const resetForm = () => {
      setDescription('');
      setName('');
   }

   const toggleIsDisabled = () => {
      (async () => {
         setShowLoading(true);
         const index = getPermissions().findIndex(permission => permission.id === permissionId);
         if (index === -1) return bail.out(`Could not find permission #${permissionId}`);
         const permissions = getPermissions();
         const { status } = await permissionEntityEndpoint.patch(permissionId, [{ property: 'disabled_flag', value: !permissions[index].isDisabled }]);
         if (status !== HttpStatusCode.OK) return bail.out(`Could not toggle isDisabled for permission #${permissionId}`);
         setIsDisabled(!permissions[index].isDisabled);
         setUpdated(true);
         permissions[index].isDisabled = !permissions[index].isDisabled;
         setPermissions(permissions);
         setShowLoading(false);
      })();
   }

   const updateDescription = (event: ChangeEvent<HTMLTextAreaElement>) => setDescription(event.target.value.trimStart());

   const updateName = (event: ChangeEvent<HTMLInputElement>) => setName(event.target.value.trimStart());

   const updatePermission = async () => {
      setShowLoading(true);
      const index = getPermissions().findIndex(permission => permission.id === permissionId);
      if (index === -1) return bail.out(`Could not find permission #${permissionId}`);
      const updates = [
         {
            property: 'app_access_desc',
            value: getDescription(),
         },
         {
            property: 'app_access_display_name',
            value: getName(),
         },
         {
            property: 'app_access_name',
            value: getName(),
         },
      ];
      const { status } = await permissionEntityEndpoint.patch(permissionId, updates);
      if (status !== HttpStatusCode.OK) return bail.out([`Could not update permission #${permissionId}:`, updates]);
      setUpdated(true);
      const permissions = getPermissions();
      permissions[index].name = getName();
      permissions[index].description = getDescription();
      permissions[index].displayName = getName();
      setPermissions(permissions);
      original.current = permissions[index];
      setShowLoading(false);
   };

   const upsertPermission = () => {
      (async () => {
         const duplicateExists = getPermissions().some(permission => {
            const sameName = permission.name === getName();
            return permissionId === 0 ? sameName : permission.id !== permissionId && sameName;
         })
         if (duplicateExists) {
            setDuplicateWarning(true);
            return;
         }
         return permissionId === 0 ? await createPermission() : await updatePermission();
      })();
   }

   useEffect(() => {
      if (permissionId === 0) {
         resetForm();
         return;
      }
      const thisPermission = getPermissions().find(permission => permission.id === permissionId);
      if (!thisPermission) {
         log.warn(`Could not find permission #${permissionId}`);
         navigate(Path.adminPermissions);
         return;
      }
      setDescription(thisPermission.description);
      setIsDisabled(thisPermission.isDisabled);
      setName(thisPermission.name);
      original.current = thisPermission;
   }, []);

   return <>
      <RestrictAccess accessKey={accessKey.permissionViewPage}>
         <Loading open={getShowLoading()}/>
         <DefaultSnackbar
            onClose={closeAddedSnackbar}
            open={added}
            severity={'success'}
            text={'The permission has been added.'}
         />
         <DefaultSnackbar
            onClose={closeUpdatedSnackbar}
            open={updated}
            severity={'success'}
            text={'The permission has been updated.'}
         />
         <DefaultSnackbar
            onClose={closeRemovedSnackbar}
            open={removed}
            severity={'success'}
            text={'The permission has been removed.'}
         />
         <DefaultSnackbar
            onClose={closeErrorSnackbar}
            open={getShowError()}
            severity={'error'}
            text={'An error occurred.'}
         />
         <SlidingDialog
            actions={
               <Button
                  aria-label={translate('Dismiss')}
                  onClick={closeDuplicateWarning}
                  variant={'outlined'}
               >
                  <TranslatedText text={'Dismiss'}/>
               </Button>
            }
            onClose={closeDuplicateWarning}
            open={duplicateWarning}
            title={translate('A Permission with this name already exists!')}
         />
         <Typography
            sx={{ marginBottom: 2 }}
            variant={HtmlElement.h5}
         >
            <Tooltip title={translate('Return')}>
               <IconButton
                  aria-label={translate('Return')}
                  onClick={goBack}
                  sx={{
                     bottom: 2,
                     stroke: Color.blueNeon,
                     position: 'relative',
                  }}
               >
                  <ArrowBack sx={{ strokeWidth: 2 }}/>
               </IconButton>
            </Tooltip>
            <TranslatedText text={permissionId === 0 ? 'New Permission' : 'Edit Permission'}/>
         </Typography>
         <Row
            columnSpacing={0}
            rowSpacing={0}
         >
            <Column xs={12} sm={12} md={12} lg={12} xl={10}>
               <Row>
                  <Column xs={12} md={6}>
                     <TextField
                        aria-label={translate('Full Name')}
                        disabled={getIsDisabled()}
                        error={!getIsDisabled() && !getString(getName())}
                        label={translate('Full Name')}
                        name={'full-name-field'}
                        onChange={updateName}
                        required={true}
                        size={'small'}
                        sx={{ width: '100%' }}
                        value={getString(getName())}
                     />
                  </Column>
               </Row>
               <Row>
                  <Column xs={12}>
                     <TextField
                        aria-label={translate('Description')}
                        disabled={getIsDisabled()}
                        error={!getIsDisabled() && !getString(getDescription())}
                        label={translate('Description')}
                        multiline={true}
                        name={'description-field'}
                        onChange={updateDescription}
                        required={true}
                        rows={3}
                        size={'small'}
                        sx={{ width: '100%' }}
                        value={getString(getDescription())}
                     />
                  </Column>
               </Row>
               <RestrictAccess accessKey={accessKey.permissionSavePermission}>
                  <Row>
                     <Column xs={12}>
                        <Box sx={{
                           display: 'flex',
                           justifyContent: 'space-between',
                        }}>
                           <Tooltip title={translate('Reset')}>
                              <span>
                                 <IconButton
                                    aria-label={translate('Reset')}
                                    disabled={getIsDisabled() || formIsEmpty()}
                                    onClick={resetForm}
                                    sx={{ color: Color.blueNeon }}
                                 >
                                    <BiSolidEraser fontSize={26}/>
                                 </IconButton>
                              </span>
                           </Tooltip>
                           <Tooltip title={translate('Save')}>
                              <span>
                                 <IconButton
                                    aria-label={translate('Save')}
                                    disabled={getIsDisabled() || !requiredFieldsAreComplete() || !formChangesAreUnsaved()}
                                    onClick={upsertPermission}
                                    sx={{ color: Color.greenTemplate }}
                                 >
                                    <SaveOutlined/>
                                 </IconButton>
                              </span>
                           </Tooltip>
                        </Box>
                     </Column>
                  </Row>
                  <ShowIf condition={permissionId !== 0}>
                     <Row>
                        <Column xs={12}>
                           <Tooltip title={getIsDisabled() ? translate('Disabled') : translate('Active')}>
                              <Switch
                                 aria-label={getIsDisabled() ? translate('Disabled') : translate('Active')}
                                 checked={!getIsDisabled()}
                                 color={'success'}
                                 onChange={toggleIsDisabled}
                                 size={'small'}
                              />
                           </Tooltip>
                        </Column>
                     </Row>
                     {getRelationships()}
                  </ShowIf>
               </RestrictAccess>
            </Column>
         </Row>
      </RestrictAccess>
   </>;
};

export default Permission;