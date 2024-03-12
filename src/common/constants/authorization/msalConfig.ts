import { LogLevel } from '@azure/msal-browser';
import { log } from '../../libraries/log';
import { b2cPolicies } from './b2cPolicies';

const ua = window.navigator.userAgent;
const msie = ua.indexOf('MSIE ');
const msie11 = ua.indexOf('Trident/');
const msedge = ua.indexOf('Edge/');
const firefox = ua.indexOf('Firefox');
const isIE = msie > 0 || msie11 > 0;
const isEdge = msedge > 0;
const isFirefox = firefox > 0; // Only needed if you need to support the redirect flow in Firefox incognito

export const msalConfig = {
   auth: {
      authority: b2cPolicies.authorities.signUpSignIn.authority,
      clientId: `${process.env.REACT_APP_CLIENT_ID}`,
      knownAuthorities: [b2cPolicies.authorityDomain],
      postLogoutRedirectUri: '/',
      redirectUri: `${process.env.REACT_APP_BASE_URL}`,
   },
   cache: {
      cacheLocation: 'localStorage',
      storeAuthStateInCookie: isIE || isEdge || isFirefox,
   },
   system: {
      allowNativeBroker: false,
      loggerOptions: {
         loggerCallback: (level: LogLevel, message: string, containsPii: boolean) => {
            if (containsPii) return;
            switch (level) {
               case LogLevel.Error:
                  log.error(message);
                  return;
               case LogLevel.Info:
                  if (process.env.REACT_APP_SHOW_MSAL_OUTPUT === 'TRUE') log.info(message);
                  return;
               case LogLevel.Verbose:
                  log.debug(message);
                  return;
               case LogLevel.Warning:
                  log.warn(message);
            }
         }
      }
   }
};