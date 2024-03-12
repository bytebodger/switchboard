import type { ReactNode } from 'react';
import type { Path } from '../enums/Path';
import type { AccessKey } from './AccessKey';

export interface NavLink {
   accessKey: AccessKey,
   children: NavLink[],
   icon: ReactNode,
   name: string,
   page: Path,
}