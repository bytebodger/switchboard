import { getString } from '../../../common/functions/getString';
import type { RoleUI } from '../../../common/interfaces/role/RoleUI';

export const compareRoles = (a: RoleUI, b: RoleUI) => {
   if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
   if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
   if (getString(a.description).toLowerCase() < getString(b.description).toLowerCase()) return -1;
   if (getString(a.description).toLowerCase() > getString(b.description).toLowerCase()) return 1;
   return 0;
}