import { Endpoint } from '../../enums/Endpoint';
import { HttpMethod } from '../../enums/HttpMethod';
import { useApi } from '../useApi';

export const useAudienceCountEndpoint = () => {
   const api = useApi();
   const endpoint = Endpoint.audienceCount;

   const get = async (experimentId: number) => api.call(
      HttpMethod.GET,
      endpoint,
      `/${experimentId}`,
   )

   return {
      get,
   }
}