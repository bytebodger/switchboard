import type { Permission } from '../enums/Permission';

export interface AccessKey {
   feature: string,
   permissions: Permission[] | Permission,
}