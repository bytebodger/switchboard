import { Add, ArrowBack, Group, Key, RemoveCircle, SaveOutlined } from '@mui/icons-material';
import PersonIcon from '@mui/icons-material/Person';
import { Box, Button, Checkbox, FormControlLabel, FormGroup, Switch, TextField, Tooltip, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import { TreeItem, TreeView } from '@mui/x-tree-view';
import dayjs from 'dayjs';
import type { ChangeEvent, MouseEvent, ReactNode, SyntheticEvent } from 'react';
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
import { useRoleEndpoint } from '../../../../common/hooks/endpoints/useRoleEndpoint';
import { useRolePermissionEndpoint } from '../../../../common/hooks/endpoints/useRolePermissionEndpoint';
import { useUserRoleEndpoint } from '../../../../common/hooks/endpoints/useUserRoleEndpoint';
import { useBail } from '../../../../common/hooks/useBail';
import { useLookup } from '../../../../common/hooks/useLookup';
import { useUXStore } from '../../../../common/hooks/useUXStore';
import type { RoleUI } from '../../../../common/interfaces/role/RoleUI';
import { log } from '../../../../common/libraries/log';
import { usePermissionStore } from '../../permissions/permission/_hooks/usePermissionStore';

const Role = () => {
   const [
      getPermissions,
      getRolePermissions,
      getRoles,
      getUser,
      getUserRoles,
      getUsers,
      setRolePermissions,
      setRoles,
      setUserRoles,
   ] = useEndpointStore(state => [
      state.getPermissions,
      state.getRolePermissions,
      state.getRoles,
      state.getUser,
      state.getUserRoles,
      state.getUsers,
      state.setRolePermissions,
      state.setRoles,
      state.setUserRoles,
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
   const [addPermissionsContent, setAddPermissionsContent] = useState<ReactNode>(null);
   const [addPermissionsOpen, setAddPermissionsOpen] = useState(false);
   const [addUsersContent, setAddUsersContent] = useState<ReactNode>(null);
   const [addUsersOpen, setAddUsersOpen] = useState(false);
   const [duplicateWarning, setDuplicateWarning] = useState(false);
   const [permissionAdded, setPermissionAdded] = useState(false);
   const [permissionRemoved, setPermissionRemoved] = useState(false);
   const [roleAdded, setRoleAdded] = useState(false);
   const [roleUpdated, setRoleUpdated] = useState(false);
   const [userAdded, setUserAdded] = useState(false);
   const [userRemoved, setUserRemoved] = useState(false);
   const bail = useBail();
   const checkedPermissionIds = useRef<number[]>([]);
   const checkedUserIds = useRef<number[]>([]);
   const lookup = useLookup();
   const navigate = useNavigate();
   const original = useRef<RoleUI | null>(null);
   const params = useParams();
   const roleEndpoint = useRoleEndpoint();
   const rolePermissionEndpoint = useRolePermissionEndpoint();
   const userRoleEndpoint = useUserRoleEndpoint();
   const { t: translate } = useTranslation();

   const roleId = getNumber(params.roleId);

   const addPermission = (permissionId: number) => {
      (async () => {
         setShowLoading(true);
         const { data, status } = await rolePermissionEndpoint.post(permissionId, roleId);
         if (status !== HttpStatusCode.created) return bail.out(`Could not add rolePermission for role #${roleId} and permission #${permissionId}`);
         setPermissionAdded(true);
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

   const addPermissions = () => {
      setAddPermissionsOpen(false);
      checkedPermissionIds.current.forEach(permissionId => addPermission(permissionId));
      checkedPermissionIds.current = [];
   }

   const addUser = (userId: number) => {
      (async () => {
         setShowLoading(true);
         const { data, status } = await userRoleEndpoint.post(roleId, userId);
         if (status !== HttpStatusCode.created) return bail.out(`Could not add userRole for user #${userId} and role #${roleId}`);
         setUserAdded(true);
         const newUserRoleId = parseApiId(data);
         const userRoles = getUserRoles();
         userRoles.push({
            disabledOn: null,
            id: newUserRoleId,
            isDisabled: false,
            roleDescription: '',
            roleId,
            roleName: '',
            userId,
         })
         setUserRoles(userRoles);
         setShowLoading(false);
      })();
   }

   const addUsers = () => {
      setAddUsersOpen(false);
      checkedUserIds.current.forEach(userId => addUser(userId));
      checkedUserIds.current = [];
   }

   const closeAddPermissions = () => setAddPermissionsOpen(false);

   const closeAddUsers = () => setAddUsersOpen(false);

   const closeDuplicateWarning = () => setDuplicateWarning(false);

   const closeErrorSnackbar = (_event?: SyntheticEvent | Event, reason?: string) => {
      reason !== 'clickaway' && setShowError(false);
   }

   const closePermissionRemovedSnackbar = (_event?: SyntheticEvent | Event, reason?: string) => {
      reason !== 'clickaway' && setPermissionRemoved(false);
   }

   const closePermissionAddedSnackbar = (_event?: SyntheticEvent | Event, reason?: string) => {
      reason !== 'clickaway' && setPermissionAdded(false);
   }

   const closeRoleAddedSnackbar = (_event?: SyntheticEvent | Event, reason?: string) => {
      reason !== 'clickaway' && setRoleAdded(false);
   }

   const closeRoleUpdatedSnackbar = (_event?: SyntheticEvent | Event, reason?: string) => {
      reason !== 'clickaway' && setRoleUpdated(false);
   }

   const closeUserAddedSnackbar = (_event?: SyntheticEvent | Event, reason?: string) => {
      reason !== 'clickaway' && setUserAdded(false);
   }

   const closeUserRemovedSnackbar = (_event?: SyntheticEvent | Event, reason?: string) => {
      reason !== 'clickaway' && setUserRemoved(false);
   }

   const createRole = async () => {
      setShowLoading(true);
      const { data, status } = await roleEndpoint.post(getName(), getDescription());
      if (status !== HttpStatusCode.created) return bail.out(['Could not create role', getName(), getDescription()]);
      setRoleAdded(true);
      const newRoleId = parseApiId(data);
      const roles = getRoles();
      roles.push({
         description: getDescription(),
         id: newRoleId,
         isDisabled: false,
         name: getName(),
      });
      setRoles(roles);
      setShowLoading(false);
      navigate(`${Path.adminRoles}/${newRoleId}`);
   };

   const formChangesAreUnsaved = () => (getDescription() !== original.current?.description || getName() !== original.current?.name);

   const formIsEmpty = () => (!getDescription() && !getName());

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
      const permissionItems = lookup.permissionsByRole(roleId, arg.includeDisabled)
         .map(permission => {
            const { id, isDisabled, name } = permission;
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
                     <span style={{ marginLeft: 8 }}>
                        <TranslatedText text={name}/>
                        <RestrictAccess accessKey={accessKey.roleRemovePermission}>
                           <Tooltip title={translate('Remove permission from this role')}>
                              <IconButton
                                 aria-label={translate('Remove permission from this role')}
                                 onClick={removePermission}
                                 value={id}
                              >
                                 <RemoveCircle sx={{
                                    color: Color.red,
                                    fontSize: 16,
                                    stroke: Color.white,
                                    strokeWidth: 1.5,
                                 }}/>
                              </IconButton>
                           </Tooltip>
                        </RestrictAccess>
                     </span>
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
      if (role.id !== roleId) return null;
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
               <TranslatedText
                  elementProps={{
                     style: {
                        backgroundColor: Color.orangeDark,
                        borderRadius: 4,
                        color: Color.white,
                        fontWeight: 'bold',
                        padding: '4px',
                     },
                  }}
                  text={name}
               />
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
                        <RestrictAccess accessKey={accessKey.roleRemoveUser}>
                           <Tooltip title={translate('Remove user from this role')}>
                              <IconButton
                                 aria-label={translate('Remove user from this role')}
                                 onClick={removeUser}
                                 value={id}
                              >
                                 <RemoveCircle sx={{
                                    color: Color.red,
                                    fontSize: 16,
                                    stroke: Color.white,
                                    strokeWidth: 1.5,
                                 }}/>
                              </IconButton>
                           </Tooltip>
                        </RestrictAccess>
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
      navigate(Path.adminRoles);
   }

   const launchAddPermissions = () => {
      setAddPermissionsOpen(true);
      checkedPermissionIds.current = [];
      const rolePermissionIds = lookup.permissionsByRole(roleId).map(permission => permission.id);
      const addablePermissions = getPermissions().filter(permission => !rolePermissionIds.includes(permission.id) && !permission.isDisabled);
      const permissionList = addablePermissions.map(permission => {
         const { id, name } = permission;
         return (
            <FormControlLabel
               control={
                  <Checkbox
                     aria-label={translate(name)}
                     onChange={updateCheckedPermissions}
                     value={id}
                  />
               }
               key={`permissionCheckbox-${id}`}
               label={
                  <TranslatedText text={name}/>
               }
            />
         )
      })
      setAddPermissionsContent(
         <FormGroup>
            {permissionList}
         </FormGroup>
      )
   }

   const launchAddUsers = () => {
      setAddUsersOpen(true);
      checkedUserIds.current = [];
      const roleUserIds = lookup.usersByRole(roleId).map(user => user.id);
      const addableUsers = getUsers().filter(user => !roleUserIds.includes(user.id) && !user.isDisabled && user.email !== 'system.user@sequel.ae');
      const usersList = addableUsers.map(user => {
         const { id } = user;
         const displayName = getUserDisplayName(user);
         return (
            <FormControlLabel
               control={
                  <Checkbox
                     aria-label={displayName}
                     onChange={updateCheckedUsers}
                     value={id}
                  />
               }
               key={`userCheckbox-${id}`}
               label={displayName}
            />
         )
      })
      setAddUsersContent(
         <FormGroup>
            {usersList}
         </FormGroup>
      )
   }

   const removePermission = (event: MouseEvent<HTMLButtonElement>) => {
      (async () => {
         setShowLoading(true);
         const permissionId = Number(event.currentTarget.value);
         const targetRolePermission = getRolePermissions()
            .find(
               rolePermission => rolePermission.roleId === roleId && rolePermission.permissionId === permissionId
            );
         if (!targetRolePermission) return bail.out(`Could not find rolePermission for roleId #${roleId} and permissionId #${permissionId}`);
         const { status } = await rolePermissionEndpoint.delete(targetRolePermission.id);
         if (status !== HttpStatusCode.OK) return bail.out(`Could not remove permission #${targetRolePermission.id}`);
         setPermissionRemoved(true);
         const newRolePermission = getRolePermissions().filter(rolePermission => rolePermission.id !== targetRolePermission.id);
         setRolePermissions(newRolePermission);
         setShowLoading(false);
      })();
   }

   const removeUser = (event: MouseEvent<HTMLButtonElement>) => {
      (async () => {
         setShowLoading(true);
         const userId = Number(event.currentTarget.value);
         const targetUserRole = getUserRoles().find(userRole => userRole.userId === userId && userRole.roleId === roleId);
         if (!targetUserRole) return bail.out(`Could not find userRole for roleId #${roleId} and userId #${userId}`);
         const { status } = await userRoleEndpoint.delete(targetUserRole.id);
         if (status !== HttpStatusCode.OK) return bail.out(`Could not remove userRole #${targetUserRole.id}`);
         setUserRemoved(true);
         const newUserRoles = getUserRoles().filter(userRole => userRole.id !== targetUserRole.id);
         setUserRoles(newUserRoles);
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
         const index = getRoles().findIndex(role => role.id === roleId);
         if (index === -1) return bail.out(`Could not find role #${roleId}`);
         const roles = getRoles();
         roles[index].isDisabled = !roles[index].isDisabled;
         const { status } = await roleEndpoint.put(roles[index]);
         if (status !== HttpStatusCode.OK) return bail.out(['Could not toggle isDisabled for role:', roles[index]]);
         setIsDisabled(roles[index].isDisabled);
         setRoleUpdated(true);
         setRoles(roles);
         setShowLoading(false);
      })();
   }

   const updateCheckedPermissions = (event: ChangeEvent<HTMLInputElement>) => {
      const { checked, value } = event.target;
      const permissionId = Number(value);
      if (checked) checkedPermissionIds.current.push(permissionId);
      else checkedPermissionIds.current = checkedPermissionIds.current.filter(checkedPermissionId => checkedPermissionId !== permissionId);
   }

   const updateCheckedUsers = (event: ChangeEvent<HTMLInputElement>) => {
      const { checked, value } = event.target;
      const userId = Number(value);
      if (checked) checkedUserIds.current.push(userId);
      else checkedUserIds.current = checkedUserIds.current.filter(checkedUserId => checkedUserId !== userId);
   }

   const updateDescription = (event: ChangeEvent<HTMLInputElement>) => setDescription(event.target.value.trimStart());

   const updateName = (event: ChangeEvent<HTMLInputElement>) => setName(event.target.value.trimStart());

   const updateRole = async () => {
      setShowLoading(true);
      const index = getRoles().findIndex(role => role.id === roleId);
      if (index === -1) return bail.out(`Could not find role #${roleId}`);
      const roles = getRoles();
      roles[index].description = getDescription();
      roles[index].name = getName();
      const { status } = await roleEndpoint.put(roles[index]);
      if (status !== HttpStatusCode.OK) return bail.out(['Could not update role:', roles[index]]);
      setRoleUpdated(true);
      setRoles(roles);
      original.current = roles[index];
      setShowLoading(false);
   };

   const upsertRole = () => {
      (async () => {
         const duplicateExists = getRoles().some(role => {
            const sameName = role.name === getName();
            return roleId === 0 ? sameName : role.id !== roleId && sameName;
         })
         if (duplicateExists) {
            setDuplicateWarning(true);
            return;
         }
         return roleId === 0 ? await createRole() : await updateRole();
      })();
   }

   useEffect(() => {
      if (roleId === 0) {
         resetForm();
         return;
      }
      const thisRole = getRoles().find(role => role.id === roleId);
      if (!thisRole) {
         log.warn(`Could not find role #${roleId}`);
         navigate(Path.adminRoles);
         return;
      }
      setDescription(getString(thisRole.description));
      setIsDisabled(thisRole.isDisabled);
      setName(thisRole.name);
      original.current = thisRole;
   }, []);

   return <>
      <RestrictAccess accessKey={accessKey.roleViewPage}>
         <Loading open={getShowLoading()}/>
         <DefaultSnackbar
            onClose={closePermissionAddedSnackbar}
            open={permissionAdded}
            severity={'success'}
            text={'The permission has been added.'}
         />
         <DefaultSnackbar
            onClose={closePermissionRemovedSnackbar}
            open={permissionRemoved}
            severity={'success'}
            text={'The permission has been removed.'}
         />
         <DefaultSnackbar
            onClose={closeRoleAddedSnackbar}
            open={roleAdded}
            severity={'success'}
            text={'The role has been added.'}
         />
         <DefaultSnackbar
            onClose={closeRoleUpdatedSnackbar}
            open={roleUpdated}
            severity={'success'}
            text={'The role has been updated.'}
         />
         <DefaultSnackbar
            onClose={closeErrorSnackbar}
            open={getShowError()}
            severity={'error'}
            text={'An error occurred.'}
         />
         <DefaultSnackbar
            onClose={closeUserAddedSnackbar}
            open={userAdded}
            severity={'success'}
            text={'The user has been added.'}
         />
         <DefaultSnackbar
            onClose={closeUserRemovedSnackbar}
            open={userRemoved}
            severity={'success'}
            text={'The user has been removed.'}
         />
         <SlidingDialog
            actions={
               <Box sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  width: '100%',
               }}>
                  <Button
                     aria-label={translate('Add')}
                     onClick={addUsers}
                     variant={'outlined'}
                  >
                     <TranslatedText text={'Add'}/>
                  </Button>
                  <Button
                     aria-label={translate('Cancel')}
                     onClick={closeAddUsers}
                     variant={'outlined'}
                  >
                     <TranslatedText text={'Cancel'}/>
                  </Button>
               </Box>
            }
            content={addUsersContent}
            onClose={closeAddUsers}
            open={addUsersOpen}
            title={translate('Add users to this role')}
         />
         <SlidingDialog
            actions={
               <Box sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  width: '100%',
               }}>
                  <Button
                     aria-label={translate('Add')}
                     onClick={addPermissions}
                     variant={'outlined'}
                  >
                     <TranslatedText text={'Add'}/>
                  </Button>
                  <Button
                     aria-label={translate('Cancel')}
                     onClick={closeAddPermissions}
                     variant={'outlined'}
                  >
                     <TranslatedText text={'Cancel'}/>
                  </Button>
               </Box>
            }
            content={addPermissionsContent}
            onClose={closeAddPermissions}
            open={addPermissionsOpen}
            title={translate('Add permissions to this role')}
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
            title={translate('A Role with this name already exists!')}
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
            <TranslatedText text={roleId === 0 ? 'New Role' : 'Edit Role'}/>
         </Typography>
         <Row
            columnSpacing={0}
            rowSpacing={0}
         >
            <Column xs={12} sm={12} md={12} lg={12} xl={10}>
               <Row>
                  <Column xs={12} md={6}>
                     <TextField
                        aria-label={translate('Name')}
                        disabled={getIsDisabled()}
                        error={!getIsDisabled() && !getString(getName())}
                        label={translate('Name')}
                        name={'name-field'}
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
               <RestrictAccess accessKey={accessKey.roleSaveRole}>
                  <Row>
                     <Column xs={12}>
                        <Box sx={{
                           display: 'flex',
                           justifyContent: 'space-between'
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
                                    onClick={upsertRole}
                                    sx={{ color: Color.greenTemplate }}
                                 >
                                    <SaveOutlined/>
                                 </IconButton>
                              </span>
                           </Tooltip>
                        </Box>
                     </Column>
                  </Row>
                  <ShowIf condition={roleId !== 0}>
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
                  </ShowIf>
               </RestrictAccess>
               <ShowIf condition={roleId !== 0}>
                  {getRelationships()}
                  <RestrictAccess accessKey={accessKey.roleAddPermissionsAndUsers}>
                     <Row>
                        <Column xs={12}>
                           <Box sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              marginTop: 4,
                           }}>
                              <Tooltip title={translate('Add users to this role')}>
                                 <span>
                                    <IconButton
                                       aria-label={translate('Add users to this role')}
                                       disabled={getIsDisabled()}
                                       onClick={launchAddUsers}
                                    >
                                       <Add sx={{
                                          bottom: 4,
                                          fontSize: 12,
                                          left: 4,
                                          position: 'relative',
                                          stroke: getIsDisabled() ? Color.greyLight : Color.greenTemplate,
                                          strokeWidth: 1,
                                       }}/>
                                       <Group sx={{ color: getIsDisabled() ? Color.greyLight : Color.greenTemplate }}/>
                                    </IconButton>
                                 </span>
                              </Tooltip>
                              <Tooltip title={translate('Add permission to this role')}>
                                 <span>
                                    <IconButton
                                       aria-label={'Add permission to this role'}
                                       disabled={getIsDisabled()}
                                       onClick={launchAddPermissions}
                                    >
                                       <Add sx={{
                                          bottom: 4,
                                          fontSize: 12,
                                          left: 2,
                                          position: 'relative',
                                          stroke: getIsDisabled() ? Color.greyLight : Color.greenTemplate,
                                          strokeWidth: 1,
                                       }}/>
                                       <Key sx={{ color: getIsDisabled() ? Color.greyLight : Color.greenTemplate }}/>
                                    </IconButton>
                                 </span>
                              </Tooltip>
                           </Box>
                        </Column>
                     </Row>
                  </RestrictAccess>
               </ShowIf>
            </Column>
         </Row>
      </RestrictAccess>
   </>
}

export default Role;