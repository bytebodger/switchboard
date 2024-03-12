import { Endpoint } from '../../enums/Endpoint';
import { HttpMethod } from '../../enums/HttpMethod';
import { useApi } from '../useApi';

export const usePimVerifyEndpoint = () => {
   const api = useApi();
   const endpoint = Endpoint.pimVerify;

   const post = async (ssoObjectId: string) => api.call(
      HttpMethod.POST,
      endpoint,
      '',
      {
         sso_object_id: ssoObjectId,
      },
   )

   return {
      post,
   }
}