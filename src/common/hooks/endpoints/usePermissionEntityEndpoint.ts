import { Endpoint } from '../../enums/Endpoint';
import { HttpMethod } from '../../enums/HttpMethod';
import type { PatchUI } from '../../interfaces/patch/PatchUI';
import { reshape } from '../../libraries/reshape';
import { useApi } from '../useApi';

export const usePermissionEntityEndpoint = () => {
   const api = useApi();
   const endpoint = Endpoint.permissionEntity;

   const patch = async (id: number, updates: PatchUI[]) => api.call(
      HttpMethod.PATCH,
      endpoint,
      `/${id}`,
      updates.map((update: PatchUI) => reshape.patch.UI2DB(update)),
   )

   return {
      patch,
   }
}