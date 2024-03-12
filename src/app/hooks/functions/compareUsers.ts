import { getUserDisplayName } from '../../../common/functions/getUserDisplayName';
import type { UserUI } from '../../../common/interfaces/user/UserUI';

export const compareUsers = (a: UserUI, b: UserUI) => {
   const aDisplayName = getUserDisplayName(a);
   const bDisplayName = getUserDisplayName(b);
   if (aDisplayName.toLowerCase() < bDisplayName.toLowerCase()) return -1;
   if (aDisplayName.toLowerCase() > bDisplayName.toLowerCase()) return 1;
   return 0;
}