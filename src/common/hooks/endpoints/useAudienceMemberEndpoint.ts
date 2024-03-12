import { Endpoint } from '../../enums/Endpoint';
import { HttpMethod } from '../../enums/HttpMethod';
import { useApi } from '../useApi';

export const useAudienceMemberEndpoint = () => {
   const api = useApi();
   const endpoint = Endpoint.audienceMember;

   const get = async (personId: number) => api.call(
      HttpMethod.GET,
      endpoint,
      `/${personId}`,
   )

   return {
      get,
   }
}