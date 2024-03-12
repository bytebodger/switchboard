import { Endpoint } from '../../enums/Endpoint';
import { HttpMethod } from '../../enums/HttpMethod';
import { useApi } from '../useApi';

export const useRolePermissionEndpoint = () => {
   const api = useApi();
   const endpoint = Endpoint.rolePermission;

   const _delete = async (id: number) => api.call(
      HttpMethod.DELETE,
      endpoint,
      `?role_app_access_id=${id}`,
   )

   const get = async () => api.call(
      HttpMethod.GET,
      endpoint,
   )

   const post = async (permissionId: number, roleId: number) => api.call(
      HttpMethod.POST,
      endpoint,
      '',
      {
         ref_app_access_id: permissionId,
         ref_role_id: roleId,
      },
   )

   return {
      delete: _delete,
      get,
      post,
   }
}