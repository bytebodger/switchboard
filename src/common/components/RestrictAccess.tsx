import type { ReactNode } from 'react';
import { useHasPermission } from '../hooks/useHasPermission';
import type { AccessKey } from '../interfaces/AccessKey';
import { ShowIf } from './ShowIf';

interface Props {
   accessKey: AccessKey,
   children: ReactNode,
}

export const RestrictAccess = ({ accessKey, children }: Props) => {
   const hasPermission = useHasPermission();

   const { feature, permissions } = accessKey;
   const slotTag = Array.isArray(permissions) ? permissions.join(',') : permissions;

   return (
      <slot data-feature={feature} data-permission={slotTag}>
         <ShowIf condition={hasPermission.check(permissions)}>
            {children}
         </ShowIf>
      </slot>
   )
}