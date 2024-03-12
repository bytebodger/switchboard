import { Endpoint } from '../../enums/Endpoint';
import { HttpMethod } from '../../enums/HttpMethod';
import type { EmailTemplateTagUI } from '../../interfaces/emailTemplateTag/EmailTemplateTagUI';
import { reshape } from '../../libraries/reshape';
import { useApi } from '../useApi';

export const useEmailTemplateTagEndpoint = () => {
   const api = useApi();
   const endpoint = Endpoint.emailTemplateTag;

   const _delete = async (id: number) => api.call(
      HttpMethod.DELETE,
      endpoint,
      `?mode_email_tag_id=${id}`,
   )

   const get = async () => api.call(
      HttpMethod.GET,
      endpoint,
   )

   const post = async (emailTemplateId: number, messageTagId: number) => api.call(
      HttpMethod.POST,
      endpoint,
      '',
      {
         ref_mode_email_id: emailTemplateId,
         ref_mode_tag_id: messageTagId,
      }
   )

   const put = async (emailTemplateTag: EmailTemplateTagUI) => api.call(
      HttpMethod.PUT,
      endpoint,
      '',
      { ...reshape.emailTemplateTag.UI2DB(emailTemplateTag) },
   )

   return {
      delete: _delete,
      get,
      post,
      put,
   }
}