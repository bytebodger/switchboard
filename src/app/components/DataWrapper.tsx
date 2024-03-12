import dayjs from 'dayjs';
import type { ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { msalInstance } from '../../common/constants/authorization/msalInstance';
import { HttpStatusCode } from '../../common/enums/HttpStatusCode';
import { Milliseconds } from '../../common/enums/Milliseconds';
import { Path } from '../../common/enums/Path';
import { SessionItem } from '../../common/enums/SessionItem';
import { getNumber } from '../../common/functions/getNumber';
import { getString } from '../../common/functions/getString';
import { logOut } from '../../common/functions/logOut';
import { parseApiId } from '../../common/functions/parseApiId';
import { usePermissionEndpoint } from '../../common/hooks/endpoints/usePermissionEndpoint';
import { usePimVerifyEndpoint } from '../../common/hooks/endpoints/usePimVerifyEndpoint';
import { useRoleEndpoint } from '../../common/hooks/endpoints/useRoleEndpoint';
import { useRolePermissionEndpoint } from '../../common/hooks/endpoints/useRolePermissionEndpoint';
import { useUserEndpoint } from '../../common/hooks/endpoints/useUserEndpoint';
import { useUserRoleEndpoint } from '../../common/hooks/endpoints/useUserRoleEndpoint';
import type { PermissionDB } from '../../common/interfaces/permission/PermissionDB';
import type { RoleDB } from '../../common/interfaces/role/RoleDB';
import type { RolePermissionDB } from '../../common/interfaces/rolePermission/RolePermissionDB';
import type { UserDB } from '../../common/interfaces/user/UserDB';
import type { UserUI } from '../../common/interfaces/user/UserUI';
import type { UserRoleDB } from '../../common/interfaces/userRole/UserRoleDB';
import { log } from '../../common/libraries/log';
import { reshape } from '../../common/libraries/reshape';
import { session } from '../../common/libraries/session';
import { useEndpointStore } from '../hooks/useEndpointStore';
import { Loading } from './Loading';

interface Props {
   children: ReactNode;
}

export const DataWrapper = ({ children }: Props) => {
   const [
      getPermissions,
      getRolePermissions,
      getRoles,
      getUser,
      getUserRoles,
      getUsers,
      setPermissions,
      setRolePermissions,
      setRoles,
      setUser,
      setUserRoles,
      setUsers,
   ] = useEndpointStore(state => [
      state.getPermissions,
      state.getRolePermissions,
      state.getRoles,
      state.getUser,
      state.getUserRoles,
      state.getUsers,
      state.setPermissions,
      state.setRolePermissions,
      state.setRoles,
      state.setUser,
      state.setUserRoles,
      state.setUsers,
   ])
   const [searchParams] = useSearchParams();
   const [showLoading, setShowLoading] = useState(!!getUser());
   const navigate = useNavigate();
   const permissionEndpoint = usePermissionEndpoint();
   const pimInProgress = useRef(false);
   const pimVerifyEndpoint = usePimVerifyEndpoint();
   const roleEndpoint = useRoleEndpoint();
   const rolePermissionEndpoint = useRolePermissionEndpoint();
   const userEndpoint = useUserEndpoint();
   const userRoleEndpoint = useUserRoleEndpoint();

   const beRole = getString(searchParams.get('role'));
   const beUser = getString(searchParams.get('user'));

   const assignDefaultRole = (userId: number) => {
      (async () => {
         const currentUserRoles = getUserRoles();
         const userHasARole = currentUserRoles.some(userRole => !userRole.isDisabled && userRole.userId === userId);
         if (userHasARole) return;
         const viewerRole = getRoles().find(role => !role.isDisabled && role.name === 'Viewer');
         if (!viewerRole) return;
         const { data, status } = await userRoleEndpoint.post(viewerRole.id, userId);
         if (status !== HttpStatusCode.created) return;
         const newUserRoleId = parseApiId(data);
         currentUserRoles.push({
            disabledOn: null,
            id: newUserRoleId,
            isDisabled: false,
            roleDescription: null,
            roleId: viewerRole.id,
            roleName: viewerRole.name,
            userId,
         })
         setUserRoles(currentUserRoles);
      })();
   }

   const loadPermissions = () => {
      (async () => {
         if (getPermissions().length) return;
         const { data, status } = await permissionEndpoint.get();
         if (status !== HttpStatusCode.OK) return;
         const newPermissions = data.map((permission: PermissionDB) => reshape.permission.DB2UI(permission));
         setPermissions(newPermissions);
      })();
   }

   const loadPimVerify = async (user: UserUI) => {
      if (pimInProgress.current) return true;
      const { data, status } = await pimVerifyEndpoint.post(user.ssoObjectId);
      if (status !== HttpStatusCode.OK) return false;
      const pim = reshape.pim.DB2UI(data);
      return pim.isSuccess;
   }

   const loadRolePermissions = () => {
      (async () => {
         if (getRolePermissions().length) return;
         const { data, status } = await rolePermissionEndpoint.get();
         if (status !== HttpStatusCode.OK) return;
         const newRolePermissions = data.map((rolePermission: RolePermissionDB) => reshape.rolePermission.DB2UI(rolePermission));
         setRolePermissions(newRolePermissions);
      })();
   }

   const loadRoles = () => {
      (async () => {
         if (getRoles().length) return;
         const { data, status } = await roleEndpoint.get();
         if (status !== HttpStatusCode.OK) return;
         const newRoles = data.map((role: RoleDB) => reshape.role.DB2UI(role));
         setRoles(newRoles);
         loadUserRoles();
      })();
   }

   const loadUserRoles = () => {
      (async () => {
         if (getUserRoles().length) return;
         const { data, status } = await userRoleEndpoint.get();
         if (status !== HttpStatusCode.OK) return;
         const newUserRoles = data.map((userRole: UserRoleDB) => reshape.userRole.DB2UI(userRole));
         setUserRoles(newUserRoles);
         const user = getUser();
         if (!user) return;
         assignDefaultRole(user.id);
      })();
   }

   const loadUsers = async (email: string) => {
      if (getUsers().length && getUser()) return true;
      const { data, status } = await userEndpoint.get();
      if (status !== HttpStatusCode.OK) {
         log.error('User data could not be retrieved');
         return false;
      }
      if (!Array.isArray(data)) {
         log.error('User data is incorrect:', data);
         return false;
      }
      const newUsers = data.map((user: UserDB) => reshape.user.DB2UI(user));
      setUsers(newUsers);
      const thisUser = newUsers.find((user: UserUI) => user.email === email);
      if (!thisUser) {
         navigate(Path.unauthorized);
         return;
      }
      setUser(thisUser);
      await pimVerifyEndpoint.post(thisUser.ssoObjectId);
      return true;
   }

   useEffect(() => {
      const { emails = [] } = msalInstance.getActiveAccount()?.idTokenClaims ?? {};
      (async () => {
         setShowLoading(true);
         const userLoaded = await loadUsers(emails[0]);
         if (!userLoaded) {
            setShowLoading(false);
            return;
         }
         const user = getUser();
         if (!user) return;
         pimInProgress.current = true;
         const userVerified = await loadPimVerify(user);
         if (!userVerified) {
            setShowLoading(false);
            return;
         }
         const currentTime = dayjs().utc().valueOf();
         const loginTime = session.getItem(SessionItem.loginTime, currentTime);
         setTimeout(() => logOut(), (Milliseconds.hour * 23) - (currentTime - loginTime));
         setShowLoading(false);
         loadPermissions();
         loadRolePermissions();
         loadRoles();
      })();
   }, []);

   useEffect(() => {
      if (process.env.REACT_APP_ENV === 'PROD') return;

      const impersonateRole = () => {
         if (!beRole) return;
         const role = getRoles().find(role => !role.isDisabled && role.name.toLowerCase() === beRole.toLowerCase());
         if (!role) return;
         const userId = getNumber(getUser()?.id);
         const newUserRoles = getUserRoles().filter(userRole => userRole.userId !== userId);
         newUserRoles.push({
            disabledOn: null,
            id: -1,
            isDisabled: false,
            roleDescription: null,
            roleId: role.id,
            roleName: role.name,
            userId,
         })
         setUserRoles(newUserRoles);
      }

      const impersonateUser = () => {
         if (!beUser) return;
         const user = getUsers().find(user => !user.isDisabled && user.email.toLowerCase() === beUser.toLowerCase());
         if (!user) return;
         setUser(user);
      }

      impersonateUser();
      impersonateRole();
   }, [beRole, beUser]);

   return <>
      <Loading open={showLoading}/>
      {children}
   </>
};