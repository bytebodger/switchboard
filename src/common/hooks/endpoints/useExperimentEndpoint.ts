import { Endpoint } from '../../enums/Endpoint';
import { HttpMethod } from '../../enums/HttpMethod';
import type { ExperimentUI } from '../../interfaces/experiment/ExperimentUI';
import { reshape } from '../../libraries/reshape';
import { useApi } from '../useApi';

export const useExperimentEndpoint = () => {
   const api = useApi();
   const endpoint = Endpoint.experiment;

   const _delete = async (id: number) => api.call(
      HttpMethod.DELETE,
      endpoint,
      `?ref_experiment_id=${id}`,
   )

   const get = async () => api.call(
      HttpMethod.GET,
      endpoint,
   )

   const post = async (
      name: string,
      description: string,
      beginOn: string,
      endOn: string,
      ownedBy: number,
      successMetric: string,
      sendFrom: number | null,
      sendFromName: string,
      isCampaign: boolean,
   ) => api.call(
      HttpMethod.POST,
      endpoint,
      '',
      {
         campaign_flag: isCampaign,
         disabled_flag: false,
         experiment_begin_datetime_utc: beginOn,
         experiment_desc: description,
         experiment_end_datetime_utc: endOn,
         experiment_name: name,
         owner_ref_user_id: ownedBy,
         sender_ref_user_id: sendFrom,
         sender_ref_user_name: sendFromName,
         success_metric: successMetric,
      }
   )

   const put = async (experiment: ExperimentUI) => api.call(
      HttpMethod.PUT,
      endpoint,
      '',
      { ...reshape.experiment.UI2DB(experiment) },
   )

   return {
      delete: _delete,
      get,
      post,
      put,
   }
}

export const useCampaignEndpoint = useExperimentEndpoint;