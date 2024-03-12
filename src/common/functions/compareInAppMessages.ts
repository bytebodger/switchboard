import type { InAppMessageUI } from '../interfaces/inAppMessage/InAppMessageUI';

export const compareInAppMessages = (a: InAppMessageUI, b: InAppMessageUI) => {
   if (a.sendOn < b.sendOn) return -1;
   if (a.sendOn > b.sendOn) return 1;
   if (a.sentOn < b.sentOn) return -1;
   if (a.sentOn > b.sentOn) return 1;
   return 0;
}