import type { AccountInfo } from '@azure/msal-browser';
import { EventType } from '@azure/msal-browser';
import { Suspense, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Loading } from '../app/components/Loading';
import { TranslatedText } from '../common/components/TranslatedText';
import { b2cPolicies } from '../common/constants/authorization/b2cPolicies';
import { msalInstance } from '../common/constants/authorization/msalInstance';
import { component } from '../common/constants/component';
import { Path } from '../common/enums/Path';

export const Pages = () => {
   useEffect(() => {
      const callbackId = msalInstance.addEventCallback((event: any) => {
         const { eventType } = event;
         const {
            ACQUIRE_TOKEN_SUCCESS,
            LOGIN_SUCCESS,
         } = EventType;
         const { editProfile, signUpSignIn } = b2cPolicies.names;
         const { authority } = b2cPolicies.authorities.signUpSignIn;
         if (
            ![ACQUIRE_TOKEN_SUCCESS, LOGIN_SUCCESS].includes(eventType)
            || !event.payload.account
            || event.payload.idTokenClaims.tfp !== editProfile
         )
            return;
         const signInAccount = msalInstance.getAllAccounts()
            .find((account: AccountInfo) => {
               if (!account.idTokenClaims) return false;
               const { oid, sub, tfp } = account.idTokenClaims;
               return oid === event.payload.idTokenClaims.oid
                  && sub === event.payload.idTokenClaims.sub
                  && tfp === signUpSignIn;
            });
         const signUpSignInFlowRequest = {
            account: signInAccount,
            authority,
         };
         msalInstance.ssoSilent(signUpSignInFlowRequest);
      });
      return () => {
         if (callbackId) msalInstance.removeEventCallback(callbackId);
      };
      // eslint-disable-next-line
   }, []);

   return (
      <Suspense fallback={<Loading open={true}/>}>
         <Routes>
            <Route
               element={component.access}
               path={Path.access}
            />
            <Route
               element={component.admin}
               path={Path.admin}
            />
            <Route
               element={component.permission}
               path={Path.adminPermission}
            />
            <Route
               element={component.permissions}
               path={Path.adminPermissions}
            />
            <Route
               element={component.role}
               path={Path.adminRole}
            />
            <Route
               element={component.roles}
               path={Path.adminRoles}
            />
            <Route
               element={component.user}
               path={Path.adminUser}
            />
            <Route
               element={component.users}
               path={Path.adminUsers}
            />
            <Route
               element={component.campaign}
               path={Path.campaign}
            />
            <Route
               element={component.campaigns}
               path={Path.campaigns}
            />
            <Route
               element={component.experiment}
               path={Path.experiment}
            />
            <Route
               element={component.experiments}
               path={Path.experiments}
            />
            <Route
               element={component.home}
               path={Path.home}
            />
            <Route
               element={component.profile}
               path={Path.profile}
            />
            <Route
               element={component.releaseNotes}
               path={Path.releaseNotes}
            />
            <Route
               element={component.unauthorized}
               path={Path.unauthorized}
            />
            <Route
               element={
                  <strong>
                     <TranslatedText text={'Page not found'}/>
                  </strong>
               }
               path={'*'}
            />
         </Routes>
      </Suspense>
   );
};