import { Endpoint } from '../../enums/Endpoint';
import { HttpMethod } from '../../enums/HttpMethod';
import type { InAppMessageTemplateTagUI } from '../../interfaces/inAppMessageTemplateTag/InAppMessageTemplateTagUI';
import { reshape } from '../../libraries/reshape';
import { useApi } from '../useApi';

export const useInAppMessageTemplateTagEndpoint = () => {
   const api = useApi();
   const endpoint = Endpoint.inAppMessageTemplateTag;

   const _delete = async (id: number) => api.call(
      HttpMethod.DELETE,
      endpoint,
      `?mode_in_app_message_tag_id=${id}`,
   )

   const get = async () => api.call(
      HttpMethod.GET,
      endpoint,
   )

   const post = async (inAppMessageTemplateTagId: number, messageTagId: number) => api.call(
      HttpMethod.POST,
      endpoint,
      '',
      {
         ref_mode_in_app_message_id: inAppMessageTemplateTagId,
         ref_mode_tag_id: messageTagId,
      }
   )

   const put = async (inAppMessageTemplateTag: InAppMessageTemplateTagUI) => api.call(
      HttpMethod.PUT,
      endpoint,
      '',
      { ...reshape.inAppMessageTemplateTag.UI2DB(inAppMessageTemplateTag) },
   )

   return {
      delete: _delete,
      get,
      post,
      put,
   }
}