import { Endpoint } from '../../enums/Endpoint';
import { HttpMethod } from '../../enums/HttpMethod';
import { useApi } from '../useApi';

export const usePermissionEndpoint = () => {
   const api = useApi();
   const endpoint = Endpoint.permission;

   const _delete = async (id: number) => api.call(
      HttpMethod.DELETE,
      endpoint,
      `?ref_app_access_id=${id}`,
   )

   const get = async () => api.call(
      HttpMethod.GET,
      endpoint,
   )

   const post = async (name: string, description: string) => api.call(
      HttpMethod.POST,
      endpoint,
      '',
      {
         app_access_desc: description,
         app_access_display_name: name,
         app_access_name: name,
      },
   )

   return {
      delete: _delete,
      get,
      post,
   }
}