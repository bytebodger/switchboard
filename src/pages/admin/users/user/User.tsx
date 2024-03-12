import { AddCircle, ArrowBack, Key, RemoveCircle, SaveOutlined } from '@mui/icons-material';
import PersonIcon from '@mui/icons-material/Person';
import { Box, Switch, TextField, Tooltip, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import { TreeItem, TreeView } from '@mui/x-tree-view';
import type { ChangeEvent, MouseEvent, SyntheticEvent } from 'react';
import { useEffect, useState } from 'react';
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
import { TranslatedText } from '../../../../common/components/TranslatedText';
import { accessKey } from '../../../../common/constants/accessKey';
import { arg } from '../../../../common/constants/arg';
import { component } from '../../../../common/constants/component';
import { Color } from '../../../../common/enums/Color';
import { HtmlElement } from '../../../../common/enums/HtmlElement';
import { HttpStatusCode } from '../../../../common/enums/HttpStatusCode';
import { Path } from '../../../../common/enums/Path';
import { getNumber } from '../../../../common/functions/getNumber';
import { getString } from '../../../../common/functions/getString';
import { getUserDisplayName } from '../../../../common/functions/getUserDisplayName';
import { parseApiId } from '../../../../common/functions/parseApiId';
import { useUserDemographicEndpoint } from '../../../../common/hooks/endpoints/useUserDemographicEndpoint';
import { useUserEndpoint } from '../../../../common/hooks/endpoints/useUserEndpoint';
import { useUserRoleEndpoint } from '../../../../common/hooks/endpoints/useUserRoleEndpoint';
import { useBail } from '../../../../common/hooks/useBail';
import { useLookup } from '../../../../common/hooks/useLookup';
import { useUXStore } from '../../../../common/hooks/useUXStore';
import type { UserDemographicDB } from '../../../../common/interfaces/userDemographic/UserDemographicDB';
import { log } from '../../../../common/libraries/log';
import { reshape } from '../../../../common/libraries/reshape';
import { useUserStore } from './_hooks/useUserStore';

const User = () => {
   const [
      getFirstName,
      getIsDisabled,
      getLastName,
      getUserDemographics,
      setFirstName,
      setIsDisabled,
      setLastName,
      setUserDemographics,
   ] = useUserStore(state => [
      state.getFirstName,
      state.getIsDisabled,
      state.getLastName,
      state.getUserDemographics,
      state.setFirstName,
      state.setIsDisabled,
      state.setLastName,
      state.setUserDemographics,
   ]);
   const [
      getRoles,
      getUserRoles,
      getUser,
      getUsers,
      setUserRoles,
      setUsers,
   ] = useEndpointStore(state => [
      state.getRoles,
      state.getUserRoles,
      state.getUser,
      state.getUsers,
      state.setUserRoles,
      state.setUsers,
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
   const [email, setEmail] = useState('');
   const [firstNameIsEditable, setFirstNameIsEditable] = useState(false);
   const [lastNameIsEditable, setLastNameIsEditable] = useState(false);
   const [removed, setRemoved] = useState(false);
   const [updated, setUpdated] = useState(false);
   const bail = useBail();
   const lookup = useLookup();
   const navigate = useNavigate();
   const params = useParams();
   const userDemographicEndpoint = useUserDemographicEndpoint();
   const userEndpoint = useUserEndpoint();
   const userRoleEndpoint = useUserRoleEndpoint();
   const { t: translate } = useTranslation();

   const userId = getNumber(params.userId);

   const addUser = (event: MouseEvent<HTMLButtonElement>) => {
      (async () => {
         setShowLoading(true);
         const roleId = Number(event.currentTarget.value);
         const { data, status } = await userRoleEndpoint.post(roleId, userId);
         if (status !== HttpStatusCode.created) return bail.out(`Could not add userRole for user #${userId} and role #${roleId}`);
         setAdded(true);
         const newUserRoleId = parseApiId(data);
         const userRoles = getUserRoles();
         userRoles.push({
            disabledOn: null,
            id: newUserRoleId,
            isDisabled: false,
            roleDescription: null,
            roleId,
            roleName: '',
            userId,
         })
         setUserRoles(userRoles);
         setShowLoading(false);
      })();
   }

   const closeAddedSnackbar = (_event?: SyntheticEvent | Event, reason?: string) => {
      reason !== 'clickaway' && setAdded(false);
   }

   const closeErrorSnackbar = (_event?: SyntheticEvent | Event, reason?: string) => {
      reason !== 'clickaway' && setShowError(false);
   }

   const closeRemovedSnackbar = (_event?: SyntheticEvent | Event, reason?: string) => {
      reason !== 'clickaway' && setRemoved(false);
   }

   const closeUpdatedSnackbar = (_event?: SyntheticEvent | Event, reason?: string) => {
      reason !== 'clickaway' && setUpdated(false);
   }

   const formChangesAreUnsaved = () => {
      const thisUser = getUsers().find(user => user.id === userId);
      if (!thisUser) {
         log.warn(`Could not find user #${userId}`);
         return false;
      }
      if (firstNameIsEditable && thisUser.firstName !== getFirstName()) return true;
      return lastNameIsEditable && thisUser.lastName !== getLastName();
   }

   const formIsEmpty = () => {
      let emptyFound = false;
      if (firstNameIsEditable && !getFirstName()) emptyFound = true;
      if (lastNameIsEditable && !getLastName()) emptyFound = true;
      return emptyFound;
   }

   const getAddRemoveIcon = (roleId: number) => {
      const userExistsOnThisRole = getUserRoles().some(userRole => userRole.roleId === roleId && userRole.userId === userId);
      let color = userExistsOnThisRole ? Color.red : Color.greenTemplate;
      if (getIsDisabled()) color = Color.greyLight;
      const sx = {
         bottom: 2,
         color,
         fontSize: 16,
         marginLeft: 0.5,
         position: 'relative',
         stroke: Color.white,
         strokeWidth: 1.5,
      }
      if (userExistsOnThisRole)
         return <>
            <Tooltip title={translate('Remove user from this role')}>
               <span>
                  <IconButton
                     aria-label={translate('Remove user from this role')}
                     onClick={removeUser}
                     value={roleId}
                  >
                     <RemoveCircle sx={sx}/>
                  </IconButton>
               </span>
            </Tooltip>
         </>
      return <>
         <Tooltip title={translate('Add user to this role')}>
            <span>
               <IconButton
                  aria-label={translate('Add user to this role')}
                  onClick={addUser}
                  value={roleId}
               >
                  <AddCircle sx={sx}/>
               </IconButton>
            </span>
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
                     <TranslatedText
                        elementProps={{ style: { marginLeft: 8 } }}
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
                  <RestrictAccess accessKey={accessKey.userAssignRole}>
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
      const currentUserId = userId;
      const userItems = lookup.usersByRole(roleId, arg.includeDisabled)
         .map(user => {
            const { id, isDisabled } = user;
            const displayName = getUserDisplayName(user);
            const style = {
               backgroundColor: currentUserId === id ? Color.orangeDark : 'none',
               borderRadius: 4,
               color: currentUserId === id ? Color.white : Color.inherit,
               fontWeight: currentUserId === id ? 'bold' : 'inherit',
               marginLeft: 8,
               padding: currentUserId === id ? '4px' : 0,
            };
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
                     <span style={style}>
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

   const goBack = () => navigate(Path.adminUsers);

   const removeUser = (event: MouseEvent<HTMLButtonElement>) => {
      (async () => {
         setShowLoading(true);
         const roleId = Number(event.currentTarget.value);
         const targetUserRole = getUserRoles().find(userRole =>
            userRole.roleId === roleId && userRole.userId === userId
         );
         if (!targetUserRole) return bail.out(`Could not find userRole for roleId #${roleId} and userId #${userId}`);
         const { status } = await userRoleEndpoint.delete(targetUserRole.id);
         if (status !== HttpStatusCode.OK) return bail.out(`Could not remove userRole #${targetUserRole.id}`);
         setRemoved(true);
         const newUserRoles = getUserRoles().filter(userRole => userRole.id !== targetUserRole.id);
         setUserRoles(newUserRoles);
         setShowLoading(false);
      })();
   }

   const requiredFieldsAreComplete = () => {
      if (firstNameIsEditable && !getFirstName()) return false;
      else if (lastNameIsEditable && !getLastName()) return false;
      return true;
   }

   const resetForm = () => {
      if (firstNameIsEditable) setFirstName('');
      if (lastNameIsEditable) setLastName('');
   }

   const saveUser = () => {
      (async () => {
         setShowLoading(true);
         const thisUser = getUsers().find(user => user.id === userId);
         if (!thisUser) return bail.out(`Could not find user #${userId}`);
         const updatedUserDemographics = [];
         const userDemographics = getUserDemographics();
         if (firstNameIsEditable && getFirstName() !== thisUser.firstName) {
            const firstNameIndex = getUserDemographics().findIndex(userDemographic => userDemographic.name === 'first_name');
            if (firstNameIndex !== -1) {
               userDemographics[firstNameIndex].value = getFirstName();
               updatedUserDemographics.push(userDemographics[firstNameIndex]);
            }
         }
         if (lastNameIsEditable && getLastName() !== thisUser.lastName) {
            const lastNameIndex = getUserDemographics().findIndex(userDemographic => userDemographic.name === 'last_name');
            if (lastNameIndex !== -1) {
               userDemographics[lastNameIndex].value = getLastName();
               updatedUserDemographics.push(userDemographics[lastNameIndex]);
            }
         }
         if (updatedUserDemographics.length) {
            const { status } = await userDemographicEndpoint.put(updatedUserDemographics);
            if (status !== HttpStatusCode.noContent) return bail.out(['Could not update user demographics', updatedUserDemographics]);
            setUpdated(true);
            setUserDemographics(userDemographics);
            const userIndex = getUsers().findIndex(user => user.id === userId);
            if (userIndex !== -1) {
               const users = getUsers();
               users[userIndex].firstName = getFirstName();
               users[userIndex].lastName = getLastName();
               setUsers(users);
            }
         }
         setShowLoading(false);
      })()
   }

   const toggleIsDisabled = () => {
      (async () => {
         setShowLoading(true);
         const index = getUsers().findIndex(user => user.id === userId);
         if (index === -1) return bail.out(`Could not find user #${userId}`);
         const users = getUsers();
         users[index].isDisabled = !users[index].isDisabled;
         const { status } = await userEndpoint.put(users[index]);
         if (status !== HttpStatusCode.OK) return bail.out(['Could not toggle isDisabled for user:', users[index]]);
         setIsDisabled(users[index].isDisabled);
         setUpdated(true);
         setUsers(users);
         setShowLoading(false);
      })();
   }

   const updateFirstName = (event: ChangeEvent<HTMLInputElement>) => setFirstName(event.target.value.trimStart());

   const updateLastName = (event: ChangeEvent<HTMLInputElement>) => setLastName(event.target.value.trimStart());

   useEffect(() => {
      (async () => {
         const thisUser = getUsers().find(user => user.id === userId);
         if (!thisUser) {
            log.warn(`Could not find user #${userId}`);
            navigate(Path.adminUsers);
            return;
         }
         setEmail(thisUser.email);
         setFirstName(thisUser.firstName);
         setIsDisabled(thisUser.isDisabled);
         setLastName(thisUser.lastName);
         const { data, status } = await userDemographicEndpoint.get(thisUser.id);
         if (status !== HttpStatusCode.OK) {
            log.warn('Could not retrieve user demographics');
            return;
         }
         const userDemographics = data.map((userDemographic: UserDemographicDB) => reshape.userDemographic.DB2UI(userDemographic));
         setUserDemographics(userDemographics);
         const foundFirstName = getUserDemographics().some(userDemographic => userDemographic.name === 'first_name');
         const foundLastName = getUserDemographics().some(userDemographic => userDemographic.name === 'last_name');
         setFirstNameIsEditable(foundFirstName);
         setLastNameIsEditable(foundLastName);
      })()
   }, []);

   return <>
      <RestrictAccess accessKey={accessKey.userViewPage}>
         <Loading open={getShowLoading()}/>
         <DefaultSnackbar
            onClose={closeAddedSnackbar}
            open={added}
            severity={'success'}
            text={'The user has been added.'}
         />
         <DefaultSnackbar
            onClose={closeRemovedSnackbar}
            open={removed}
            severity={'success'}
            text={'The user has been removed.'}
         />
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
            <TranslatedText text={'Edit User'}/>
         </Typography>
         <Row
            columnSpacing={0}
            rowSpacing={0}
         >
            <Column xs={12} sm={12} md={12} lg={12} xl={10}>
               <Row>
                  <Column xs={12} md={6}>
                     <TextField
                        aria-label={translate('First Name')}
                        disabled={getIsDisabled() || !firstNameIsEditable}
                        error={!getIsDisabled() && firstNameIsEditable && !getFirstName()}
                        label={translate('First Name')}
                        name={'first-name-field'}
                        onChange={updateFirstName}
                        required={true}
                        size={'small'}
                        sx={{ width: '100%' }}
                        value={getString(getFirstName())}
                     />
                  </Column>
               </Row>
               <Row>
                  <Column xs={12} md={6}>
                     <TextField
                        aria-label={translate('Last Name')}
                        disabled={getIsDisabled() || !lastNameIsEditable}
                        error={!getIsDisabled() && lastNameIsEditable && !getLastName()}
                        label={translate('Last Name')}
                        name={'last-name-field'}
                        onChange={updateLastName}
                        required={true}
                        size={'small'}
                        sx={{ width: '100%' }}
                        value={getString(getLastName())}
                     />
                  </Column>
               </Row>
               <Row>
                  <Column xs={12} md={6}>
                     <TextField
                        aria-label={translate('Email')}
                        disabled={true}
                        label={translate('Email')}
                        name={'email-field'}
                        size={'small'}
                        sx={{ width: '100%' }}
                        value={getString(email)}
                     />
                  </Column>
               </Row>
               <RestrictAccess accessKey={accessKey.userUpdateDetails}>
                  <ShowIf condition={firstNameIsEditable || lastNameIsEditable}>
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
                                       onClick={saveUser}
                                       sx={{ color: Color.greenTemplate }}
                                    >
                                       <SaveOutlined/>
                                    </IconButton>
                                 </span>
                              </Tooltip>
                           </Box>
                        </Column>
                     </Row>
                  </ShowIf>
               </RestrictAccess>
               <RestrictAccess accessKey={accessKey.userActivateUser}>
                  <Row>
                     <Column xs={12}>
                        <Tooltip title={getIsDisabled() ? translate('Disabled') : translate('Active')}>
                           <Switch
                              aria-label={getIsDisabled() ? translate('Disabled') : translate('Active')}
                              checked={!getIsDisabled()}
                              color={'success'}
                              disabled={userId === getUser()?.id}
                              onChange={toggleIsDisabled}
                              size={'small'}
                           />
                        </Tooltip>
                     </Column>
                  </Row>
               </RestrictAccess>
               {getRelationships()}
            </Column>
         </Row>
      </RestrictAccess>
   </>
}

export default User;