import { Endpoint } from '../../enums/Endpoint';
import { HttpMethod } from '../../enums/HttpMethod';
import type { TextTemplateTagUI } from '../../interfaces/textTemplateTag/TextTemplateTagUI';
import { reshape } from '../../libraries/reshape';
import { useApi } from '../useApi';

export const useTextTemplateTagEndpoint = () => {
   const api = useApi();
   const endpoint = Endpoint.textTemplateTag;

   const _delete = async (id: number) => api.call(
      HttpMethod.DELETE,
      endpoint,
      `?mode_text_tag_id=${id}`,
   )

   const get = async () => api.call(
      HttpMethod.GET,
      endpoint,
   )

   const post = async (textTemplateId: number, messageTagId: number) => api.call(
      HttpMethod.POST,
      endpoint,
      '',
      {
         ref_mode_tag_id: messageTagId,
         ref_mode_text_id: textTemplateId,
      }
   )

   const put = async (textTemplateTag: TextTemplateTagUI) => api.call(
      HttpMethod.PUT,
      endpoint,
      '',
      { ...reshape.textTemplateTag.UI2DB(textTemplateTag) },
   )

   return {
      delete: _delete,
      get,
      post,
      put,
   }
}