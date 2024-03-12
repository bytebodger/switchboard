import { Endpoint } from '../../enums/Endpoint';
import { HttpMethod } from '../../enums/HttpMethod';
import type { EmailTemplateUI } from '../../interfaces/emailTemplate/EmailTemplateUI';
import { reshape } from '../../libraries/reshape';
import { useApi } from '../useApi';

export const useEmailTemplateEndpoint = () => {
   const api = useApi();
   const endpoint = Endpoint.emailTemplate;

   const _delete = async (id: number) => api.call(
      HttpMethod.DELETE,
      endpoint,
      `?ref_mode_email_id=${id}`,
   )

   const get = async () => api.call(
      HttpMethod.GET,
      endpoint,
   )

   const post = async (experimentId: number, subject: string, message: string, htmlMessage: string, sendOn: string | null, weight: number) => api.call(
      HttpMethod.POST,
      endpoint,
      '',
      {
         email_message: message,
         email_message_html: htmlMessage,
         email_subject: subject,
         ref_experiment_id: experimentId,
         send_on_datetime_utc: sendOn,
         switchboard_aiml_algorithm_id: null,
         weight,
      }
   )

   const put = async (emailTemplate: EmailTemplateUI) => api.call(
      HttpMethod.PUT,
      endpoint,
      '',
      { ...reshape.emailTemplate.UI2DB(emailTemplate) },
   )

   return {
      delete: _delete,
      get,
      post,
      put,
   }
}