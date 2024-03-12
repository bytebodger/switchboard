import { Endpoint } from '../../enums/Endpoint';
import { HttpMethod } from '../../enums/HttpMethod';
import { useApi } from '../useApi';

export const useInAppMessageEndpoint = () => {
   const api = useApi();
   const endpoint = Endpoint.sentInAppMessage;

   const get = async () => api.call(
      HttpMethod.GET,
      endpoint,
   )

   return {
      get,
   }
}