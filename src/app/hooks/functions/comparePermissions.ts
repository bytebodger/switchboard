import type { PermissionUI } from '../../../common/interfaces/permission/PermissionUI';

export const comparePermissions = (a: PermissionUI, b: PermissionUI) => {
   if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
   if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
   if (a.description.toLowerCase() < b.description.toLowerCase()) return -1;
   if (a.description.toLowerCase() > b.description.toLowerCase()) return 1;
   return 0;
}