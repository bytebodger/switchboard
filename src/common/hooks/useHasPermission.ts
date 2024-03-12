import { useEndpointStore } from '../../app/hooks/useEndpointStore';
import type { Permission } from '../enums/Permission';
import { useLookup } from './useLookup';

export const useHasPermission = () => {
   const [getUser] = useEndpointStore(state => [state.getUser]);
   const lookup = useLookup();

   const check = (permissions: Permission[] | Permission) => {
      const user = getUser();
      if (!user) return false;
      const { id } = user;
      const userPermissions = lookup.permissionsByUser(id).map(permission => permission.name as Permission);
      if (Array.isArray(permissions)) return userPermissions.some(userPermission => permissions.includes(userPermission));
      return userPermissions.includes(permissions);
   }

   return {
      check,
   }
}