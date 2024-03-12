import { Endpoint } from '../../enums/Endpoint';
import { HttpMethod } from '../../enums/HttpMethod';
import { useApi } from '../useApi';

export const useAudienceEndpoint = () => {
   const api = useApi();
   const audienceEndpoint = Endpoint.audience;
   const updateExperimentAudienceEndpoint = Endpoint.updateAudience;

   const _delete = async (experimentId: number) => api.call(
      HttpMethod.DELETE,
      updateExperimentAudienceEndpoint,
      `/${experimentId}`,
   )

   const get = async (experimentId: number) => api.call(
      HttpMethod.GET,
      audienceEndpoint,
      `/${experimentId}`,
   )

   const post = async (experimentId: number) => api.call(
      HttpMethod.POST,
      updateExperimentAudienceEndpoint,
      `/${experimentId}`,
   )

   return {
      delete: _delete,
      get,
      post,
   }
}