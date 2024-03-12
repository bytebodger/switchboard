import type { AxiosRequestConfig } from 'axios';
import axios from 'axios';
import { loginRequest } from '../constants/authorization/loginRequest';
import { msalInstance } from '../constants/authorization/msalInstance';
import type { Endpoint } from '../enums/Endpoint';
import { HttpMethod } from '../enums/HttpMethod';
import { getString } from '../functions/getString';
import { log } from '../libraries/log';
import type { GenericArray } from '../types/GenericArray';
import type { GenericObject } from '../types/GenericObject';
import { useAuthentication } from './useAuthentication';

export const useApi = () => {
   const baseUrl = process.env.REACT_APP_API_BASE_URL;
   const authentication = useAuthentication();

   const call = async (
      method: HttpMethod,
      endpoint: Endpoint,
      pathSuffix?: string,
      data?: GenericObject | GenericArray,
      config?: AxiosRequestConfig,
   ) => {
      if (process.env.REACT_APP_UNIT_TESTING !== 'TRUE') {
         const account = msalInstance.getActiveAccount();
         if (!account) return Promise.reject(new Error('No active account'));
         try {
            const { accessToken } = await msalInstance.acquireTokenSilent({
               ...loginRequest,
               account,
            });
            axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
         } catch (error) {
            log.warn(error);
            authentication.logOut();
         }
      }
      const url = `${baseUrl}${endpoint}${getString(pathSuffix)}`;
      switch (method) {
         case HttpMethod.DELETE:
            return axios.delete(url, config)
               .catch(async (error) => Promise.resolve(error));
         case HttpMethod.GET:
            return axios.get(url, config)
               .catch(async (error) => Promise.resolve(error));
         case HttpMethod.PATCH:
            return axios.patch(url, data, config)
               .catch(async (error) => Promise.resolve(error));
         case HttpMethod.POST:
            return axios.post(url, data, config)
               .catch(async (error) => Promise.resolve(error));
         case HttpMethod.PUT:
            return axios.put(url, data, config)
               .catch(async (error) => Promise.resolve(error));
         default:
            log.warn(`Unknown HttpMethod ${method}`);
            return Promise.reject(new Error(`Unknown HttpMethod ${method}`));
      }
   }

   return {
      call,
   }
}