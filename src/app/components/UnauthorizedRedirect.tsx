import { InteractionStatus } from '@azure/msal-browser';
import { useIsAuthenticated, useMsal } from '@azure/msal-react';
import { useEffect } from 'react';
import { loginRequest } from '../../common/constants/authorization/loginRequest';
import { msalInstance } from '../../common/constants/authorization/msalInstance';
import { log } from '../../common/libraries/log';
import { Loading } from './Loading';

export const UnauthorizedRedirect = () => {
   const { inProgress } = useMsal();
   const isAuthenticated = useIsAuthenticated();

   useEffect(() => {
      if (inProgress === InteractionStatus.None && !isAuthenticated)
         msalInstance.loginRedirect(loginRequest)
            .catch((error: any) => log.log(error));
   }, [inProgress, isAuthenticated]);

   return <Loading open={true}/>;
};