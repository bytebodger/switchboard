import { Endpoint } from '../../enums/Endpoint';
import { HttpMethod } from '../../enums/HttpMethod';
import type { UserDemographicUI } from '../../interfaces/userDemographic/UserDemographicUI';
import { reshape } from '../../libraries/reshape';
import { useApi } from '../useApi';

export const useUserDemographicEndpoint = () => {
   const api = useApi();
   const endpoint = Endpoint.userDemographic;

   const get = async (userId: number) => api.call(
      HttpMethod.GET,
      endpoint,
      `/ref_user_id/${userId}`,
   )

   const put = async (userDemographics: UserDemographicUI[]) => api.call(
      HttpMethod.PUT,
      endpoint,
      `/${userDemographics[0].userId}/demographic`,
      userDemographics.map(userDemographic => reshape.userDemographic.UI2DB(userDemographic)),
   )

   return {
      get,
      put,
   }
}