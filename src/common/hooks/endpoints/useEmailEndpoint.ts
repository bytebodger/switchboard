import { Endpoint } from '../../enums/Endpoint';
import { HttpMethod } from '../../enums/HttpMethod';
import { useApi } from '../useApi';

export const useEmailEndpoint = () => {
   const api = useApi();
   const endpoint = Endpoint.sentEmail;

   const get = async () => api.call(
      HttpMethod.GET,
      endpoint,
   )

   return {
      get,
   }
}