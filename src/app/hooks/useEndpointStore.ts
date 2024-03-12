import { create } from 'zustand';
import { SessionItem } from '../../common/enums/SessionItem';
import type { PermissionUI } from '../../common/interfaces/permission/PermissionUI';
import type { RoleUI } from '../../common/interfaces/role/RoleUI';
import type { RolePermissionUI } from '../../common/interfaces/rolePermission/RolePermissionUI';
import type { UserUI } from '../../common/interfaces/user/UserUI';
import type { UserRoleUI } from '../../common/interfaces/userRole/UserRoleUI';
import { session } from '../../common/libraries/session';
import { comparePermissions } from './functions/comparePermissions';
import { compareRoles } from './functions/compareRoles';
import { compareUsers } from './functions/compareUsers';

interface State {
   // values
   permissions: PermissionUI[],
   rolePermissions: RolePermissionUI[],
   roles: RoleUI[],
   user: UserUI | null,
   userRoles: UserRoleUI[],
   users: UserUI[],
   // getters
   getPermissions: () => PermissionUI[],
   getRolePermissions: () => RolePermissionUI[],
   getRoles: () => RoleUI[],
   getUser: () => UserUI | null,
   getUserRoles: () => UserRoleUI[],
   getUsers: () => UserUI[],
   // setters
   reset: () => void,
   setPermissions: (permissions: PermissionUI[]) => void,
   setRolePermissions: (rolePermissions: RolePermissionUI[]) => void,
   setRoles: (roles: RoleUI[]) => void,
   setUser: (user: UserUI | null) => void,
   setUserRoles: (userRole: UserRoleUI[]) => void,
   setUsers: (users: UserUI[]) => void,
}

export const useEndpointStore = create<State>()((set, get) => ({
   // values
   permissions: session.getItem(SessionItem.permissions, []),
   rolePermissions: session.getItem(SessionItem.rolePermissions, []),
   roles: session.getItem(SessionItem.roles, []),
   user: session.getItem(SessionItem.user),
   userRoles: session.getItem(SessionItem.userRoles, []),
   users: session.getItem(SessionItem.users, []),
   // getters
   getPermissions: () => get().permissions,
   getRolePermissions: () => get().rolePermissions,
   getRoles: () => get().roles,
   getUser: () => get().user,
   getUserRoles: () => get().userRoles,
   getUsers: () => get().users,
   // setters
   reset: () => set(() => ({
      permissions: [],
      rolePermissions: [],
      roles: [],
      user: null,
      userRoles: [],
      users: [],
   })),
   setPermissions: permissions => {
      const sortedPermissions = permissions.sort(comparePermissions);
      session.setItem(SessionItem.permissions, sortedPermissions);
      set(() => ({ permissions: sortedPermissions }));
   },
   setRolePermissions: rolePermissions => {
      session.setItem(SessionItem.rolePermissions, rolePermissions);
      set(() => ({ rolePermissions }));
   },
   setRoles: roles => {
      const sortRoles = roles.sort(compareRoles);
      session.setItem(SessionItem.roles, sortRoles);
      set(() => ({ roles: sortRoles }));
   },
   setUser: user => {
      session.setItem(SessionItem.user, user);
      set(() => ({ user }));
   },
   setUserRoles: userRoles => {
      session.setItem(SessionItem.userRoles, userRoles);
      set(() => ({ userRoles }));
   },
   setUsers: users => {
      const sortedUsers = users.sort(compareUsers);
      session.setItem(SessionItem.users, sortedUsers);
      set(() => ({ users: sortedUsers }));
   },
}))