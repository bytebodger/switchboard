import { Endpoint } from '../../enums/Endpoint';
import { HttpMethod } from '../../enums/HttpMethod';
import type { ExperimentTagUI } from '../../interfaces/experimentTag/ExperimentTagUI';
import { reshape } from '../../libraries/reshape';
import { useApi } from '../useApi';

export const useExperimentTagRelationshipEndpoint = () => {
   const api = useApi();
   const endpoint = Endpoint.experimentTagRelationship;

   const _delete = async (id: number) => api.call(
      HttpMethod.DELETE,
      endpoint,
      `?experiment_tag_id=${id}`,
   )

   const get = async () => api.call(
      HttpMethod.GET,
      endpoint,
   )

   const post = async (experimentId: number, experimentTagId: number) => api.call(
      HttpMethod.POST,
      endpoint,
      '',
      {
         ref_experiment_id: experimentId,
         ref_experiment_tag_id: experimentTagId,
      }
   )

   const put = async (experimentTag: ExperimentTagUI) => api.call(
      HttpMethod.PUT,
      endpoint,
      '',
      { ...reshape.experimentTag.UI2DB(experimentTag) },
   )

   return {
      delete: _delete,
      get,
      post,
      put,
   }
}

export const useCampaignTagRelationshipEndpoint = useExperimentTagRelationshipEndpoint;