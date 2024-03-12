import { Endpoint } from '../../enums/Endpoint';
import { HttpMethod } from '../../enums/HttpMethod';
import type { TextTemplateUI } from '../../interfaces/textTemplate/TextTemplateUI';
import { reshape } from '../../libraries/reshape';
import { useApi } from '../useApi';

export const useTextTemplateEndpoint = () => {
   const api = useApi();
   const endpoint = Endpoint.textTemplate;

   const _delete = async (id: number) => api.call(
      HttpMethod.DELETE,
      endpoint,
      `?ref_mode_text_id=${id}`,
   )

   const get = async () => api.call(
      HttpMethod.GET,
      endpoint,
   )

   const post = async (experimentId: number, sendOn: string, message: string, weight: number) => api.call(
      HttpMethod.POST,
      endpoint,
      '',
      {
         ref_experiment_id: experimentId,
         send_on_datetime_utc: sendOn,
         switchboard_aiml_algorithm_id: null,
         text_message: message,
         weight,
      }
   )

   const put = async (textTemplate: TextTemplateUI) => api.call(
      HttpMethod.PUT,
      endpoint,
      '',
      { ...reshape.textTemplate.UI2DB(textTemplate) },
   )

   return {
      delete: _delete,
      get,
      post,
      put,
   }
}