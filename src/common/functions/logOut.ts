import { BrowserUtils } from '@azure/msal-browser';
import { msalInstance } from '../constants/authorization/msalInstance';
import { session } from '../libraries/session';

export const logOut = () => {
   session.clear();
   msalInstance.logoutRedirect({
      account: msalInstance.getActiveAccount(),
      onRedirectNavigate: () => !BrowserUtils.isInIframe()
   });
}