import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { msalInstance } from '../../common/constants/authorization/msalInstance';
import { CustomNavigationClient } from '../classes/CustomNavigationClient';

interface Props {
   children: ReactNode,
}

export const ClientSideNavigation = ({ children }: Props) => {
   const navigate = useNavigate();
   const navigationClient = new CustomNavigationClient(navigate);
   msalInstance.setNavigationClient(navigationClient);
   const [firstRender, setFirstRender] = useState(true);

   useEffect(() => {
      setFirstRender(false);
   }, []);

   return firstRender ? null : children;
}