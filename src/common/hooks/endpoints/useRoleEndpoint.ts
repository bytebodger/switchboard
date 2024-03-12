import { Endpoint } from '../../enums/Endpoint';
import { HttpMethod } from '../../enums/HttpMethod';
import type { RoleUI } from '../../interfaces/role/RoleUI';
import { reshape } from '../../libraries/reshape';
import { useApi } from '../useApi';

export const useRoleEndpoint = () => {
   const api = useApi();
   const endpoint = Endpoint.role;

   const _delete = async (id: number) => api.call(
      HttpMethod.DELETE,
      endpoint,
      `?ref_role_id=${id}`,
   )

   const get = async () => api.call(
      HttpMethod.GET,
      endpoint,
   )

   const post = async (roleName: string, roleDescription: string) => api.call(
      HttpMethod.POST,
      endpoint,
      '',
      {
         dp_request_access_flag: false,
         role_desc: roleDescription,
         role_name: roleName,
      },
   )

   const put = async (role: RoleUI) => api.call(
      HttpMethod.PUT,
      endpoint,
      '',
      { ...reshape.role.UI2DB(role) },
   )

   return {
      delete: _delete,
      get,
      post,
      put,
   }
}