import { Endpoint } from '../../enums/Endpoint';
import { HttpMethod } from '../../enums/HttpMethod';
import type { InAppMessageTemplateUI } from '../../interfaces/inAppMessageTemplate/InAppMessageTemplateUI';
import { reshape } from '../../libraries/reshape';
import { useApi } from '../useApi';

export const useInAppMessageTemplateEndpoint = () => {
   const api = useApi();
   const endpoint = Endpoint.inAppMessageTemplate;

   const _delete = async (id: number) => api.call(
      HttpMethod.DELETE,
      endpoint,
      `?ref_mode_in_app_message_id=${id}`,
   )

   const get = async () => api.call(
      HttpMethod.GET,
      endpoint,
   )

   const post = async (message: string, experimentId: number, sendOn: string | null, weight: number) => api.call(
      HttpMethod.POST,
      endpoint,
      '',
      {
         in_app_message: message,
         ref_experiment_id: experimentId,
         send_on_datetime_utc: sendOn,
         weight,
      }
   )

   const put = async (inAppMessageTemplate: InAppMessageTemplateUI) => api.call(
      HttpMethod.PUT,
      endpoint,
      '',
      { ...reshape.inAppMessageTemplate.UI2DB(inAppMessageTemplate) },
   )

   return {
      delete: _delete,
      get,
      post,
      put,
   }
}