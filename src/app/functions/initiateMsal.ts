import type { AuthenticationResult, EventMessage } from '@azure/msal-browser';
import { EventType } from '@azure/msal-browser';
import { msalInstance } from '../../common/constants/authorization/msalInstance';

export const initiateMsal = () => {
   if (!msalInstance.getActiveAccount() && msalInstance.getAllAccounts().length > 0) msalInstance.setActiveAccount(msalInstance.getAllAccounts()[0]);
   msalInstance.enableAccountStorageEvents();
   msalInstance.addEventCallback((event: EventMessage) => {
      const { eventType } = event;
      const { LOGIN_SUCCESS } = EventType;
      if (eventType !== LOGIN_SUCCESS || !event.payload) return;
      const payload = event.payload as AuthenticationResult;
      const account = payload.account;
      msalInstance.setActiveAccount(account);
   });
}