import { Endpoint } from '../../enums/Endpoint';
import { HttpMethod } from '../../enums/HttpMethod';
import type { UserUI } from '../../interfaces/user/UserUI';
import { reshape } from '../../libraries/reshape';
import { useApi } from '../useApi';

export const useUserEndpoint = () => {
   const api = useApi();
   const endpoint = Endpoint.user;

   const _delete = async (id: number) => api.call(
      HttpMethod.DELETE,
      endpoint,
      `?ref_user_id=${id}`,
   )

   const get = async () => api.call(
      HttpMethod.GET,
      endpoint,
   )

   const put = async (user: UserUI) => api.call(
      HttpMethod.PUT,
      endpoint,
      '',
      { ...reshape.user.UI2DB(user) },
   )

   return {
      delete: _delete,
      get,
      put,
   }
}