import type { InAppMessageTemplateUI } from '../interfaces/inAppMessageTemplate/InAppMessageTemplateUI';

export const compareInAppMessageTemplates = (a: InAppMessageTemplateUI, b: InAppMessageTemplateUI) => {
   if (a.message.toLowerCase() < b.message.toLowerCase()) return -1;
   if (a.message.toLowerCase() > b.message.toLowerCase()) return 1;
   return 0;
}