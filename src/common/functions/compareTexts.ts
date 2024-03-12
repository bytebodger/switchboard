import type { TextUI } from '../interfaces/text/TextUI';

export const compareTexts = (a: TextUI, b: TextUI) => {
   if (a.sendOn < b.sendOn) return -1;
   if (a.sendOn > b.sendOn) return 1;
   if (a.sentOn < b.sentOn) return -1;
   if (a.sentOn > b.sentOn) return 1;
   return 0;
}