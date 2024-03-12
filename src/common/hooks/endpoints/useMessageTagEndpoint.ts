import { Endpoint } from '../../enums/Endpoint';
import { HttpMethod } from '../../enums/HttpMethod';
import type { MessageTagUI } from '../../interfaces/messageTag/MessageTagUI';
import { reshape } from '../../libraries/reshape';
import { useApi } from '../useApi';

export const useMessageTagEndpoint = () => {
   const api = useApi();
   const endpoint = Endpoint.messageTag;

   const _delete = async (id: number) => api.call(
      HttpMethod.DELETE,
      endpoint,
      `?ref_mode_tag_id=${id}`,
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
         mode_tag_desc: description,
         mode_tag_name: name,
      }
   )

   const put = async (messageTag: MessageTagUI) => api.call(
      HttpMethod.PUT,
      endpoint,
      '',
      { ...reshape.messageTag.UI2DB(messageTag) },
   )

   return {
      delete: _delete,
      get,
      post,
      put,
   }
}