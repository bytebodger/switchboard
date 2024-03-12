import type { MessageTagUI } from '../interfaces/messageTag/MessageTagUI';

export const compareMessageTags = (a: MessageTagUI, b: MessageTagUI) => {
   if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
   if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
   return 0;
}