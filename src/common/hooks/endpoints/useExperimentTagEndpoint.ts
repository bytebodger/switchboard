import { Endpoint } from '../../enums/Endpoint';
import { HttpMethod } from '../../enums/HttpMethod';
import type { ExperimentTagUI } from '../../interfaces/experimentTag/ExperimentTagUI';
import { reshape } from '../../libraries/reshape';
import { useApi } from '../useApi';

export const useExperimentTagEndpoint = () => {
   const api = useApi();
   const endpoint = Endpoint.experimentTag;

   const _delete = async (id: number) => api.call(
      HttpMethod.DELETE,
      endpoint,
      `?ref_experiment_tag_id=${id}`,
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
         experiment_tag_name: name,
         expertiment_tag_desc: description,
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

export const useCampaignTagEndpoint = useExperimentTagEndpoint;