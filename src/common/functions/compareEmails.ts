import type { EmailUI } from '../interfaces/email/EmailUI';

export const compareEmails = (a: EmailUI, b: EmailUI) => {
   if (a.sendOn < b.sendOn) return -1;
   if (a.sendOn > b.sendOn) return 1;
   if (a.sentOn < b.sentOn) return -1;
   if (a.sentOn > b.sentOn) return 1;
   return 0;
}