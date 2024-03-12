import { Endpoint } from '../../enums/Endpoint';
import { HttpMethod } from '../../enums/HttpMethod';
import type { CohortUI } from '../../interfaces/cohort/CohortUI';
import { reshape } from '../../libraries/reshape';
import { useApi } from '../useApi';

export const useCohortEndpoint = () => {
   const api = useApi();
   const endpoint = Endpoint.cohort;

   const _delete = async (id: number) => api.call(
      HttpMethod.DELETE,
      endpoint,
      `?experiment_filter_id=${id}`,
   )

   const get = async () => api.call(
      HttpMethod.GET,
      endpoint,
   )

   const post = async (comparator: string, experimentId: number, field: string, ordinal: number, table: string, value: string) => api.call(
      HttpMethod.POST,
      endpoint,
      '',
      [{
         comparator,
         field_name: field,
         ordinal,
         ref_experiment_id: experimentId,
         table_name: table,
         value,
      }]
   )

   const put = async (cohort: CohortUI) => api.call(
      HttpMethod.PUT,
      endpoint,
      '',
      { ...reshape.cohort.UI2DB(cohort) },
   )

   return {
      delete: _delete,
      get,
      post,
      put,
   }
}