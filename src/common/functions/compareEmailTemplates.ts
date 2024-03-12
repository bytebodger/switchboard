import type { EmailTemplateUI } from '../interfaces/emailTemplate/EmailTemplateUI';

export const compareEmailTemplates = (a: EmailTemplateUI, b: EmailTemplateUI) => {
   if (a.subject.toLowerCase() < b.subject.toLowerCase()) return -1;
   if (a.subject.toLowerCase() > b.subject.toLowerCase()) return 1;
   return 0;
}