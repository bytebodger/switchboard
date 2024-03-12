import type { TextTemplateUI } from '../interfaces/textTemplate/TextTemplateUI';

export const compareTextTemplates = (a: TextTemplateUI, b: TextTemplateUI) => {
   if (a.message.toLowerCase() < b.message.toLowerCase()) return -1;
   if (a.message.toLowerCase() > b.message.toLowerCase()) return 1;
   return 0;
}