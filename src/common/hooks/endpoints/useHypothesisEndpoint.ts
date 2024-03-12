import { Endpoint } from '../../enums/Endpoint';
import { HttpMethod } from '../../enums/HttpMethod';
import type { HypothesisUI } from '../../interfaces/hypothesis/HypothesisUI';
import { reshape } from '../../libraries/reshape';
import { useApi } from '../useApi';

export const useHypothesisEndpoint = () => {
   const api = useApi();
   const endpoint = Endpoint.hypothesis;

   const _delete = async (id: number) => api.call(
      HttpMethod.DELETE,
      endpoint,
      `?experiment_hypothesis_id=${id}`,
   )

   const get = async () => api.call(
      HttpMethod.GET,
      endpoint,
   )

   const post = async (experimentId: number, hypothesis: string) => api.call(
      HttpMethod.POST,
      endpoint,
      '',
      {
         hypothesis,
         ref_experiment_id: experimentId,
      }
   )

   const put = async (hypothesis: HypothesisUI) => api.call(
      HttpMethod.PUT,
      endpoint,
      '',
      { ...reshape.hypothesis.UI2DB(hypothesis) },
   )

   return {
      delete: _delete,
      get,
      post,
      put,
   }
}