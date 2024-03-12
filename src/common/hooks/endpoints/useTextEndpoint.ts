import { Endpoint } from '../../enums/Endpoint';
import { HttpMethod } from '../../enums/HttpMethod';
import { useApi } from '../useApi';

export const useTextEndpoint = () => {
   const api = useApi();
   const endpoint = Endpoint.sentTextMessage;

   const get = async () => api.call(
      HttpMethod.GET,
      endpoint,
   )

   return {
      get,
   }
}