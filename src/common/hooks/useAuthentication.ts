import { BrowserUtils } from '@azure/msal-browser';
import { useEndpointStore } from '../../app/hooks/useEndpointStore';
import { msalInstance } from '../constants/authorization/msalInstance';
import { session } from '../libraries/session';

export const useAuthentication = () => {
   const [reset] = useEndpointStore(state => [state.reset]);

   const logOut = () => {
      session.clear();
      reset();
      msalInstance.logoutRedirect({
         account: msalInstance.getActiveAccount(),
         onRedirectNavigate: () => !BrowserUtils.isInIframe()
      });
   }

   return {
      logOut,
   }
}