import { Endpoint } from '../../enums/Endpoint';
import { HttpMethod } from '../../enums/HttpMethod';
import { useApi } from '../useApi';

export const useUserRoleEndpoint = () => {
   const api = useApi();
   const endpoint = Endpoint.userRole;

   const _delete = async (id: number) => api.call(
      HttpMethod.DELETE,
      endpoint,
      `?user_role_id=${id}`,
   )

   const get = async () => api.call(
      HttpMethod.GET,
      endpoint,
   )

   const post = async (roleId: number, userId: number) => api.call(
      HttpMethod.POST,
      endpoint,
      '',
      {
         ref_role_id: roleId,
         ref_user_id: userId,
      }
   )

   return {
      delete: _delete,
      get,
      post,
   }
}