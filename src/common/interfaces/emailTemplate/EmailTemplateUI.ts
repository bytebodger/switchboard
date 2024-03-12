export interface EmailTemplateUI {
   aimlId: number | null,
   experimentId: number,
   htmlMessage: string,
   id: number,
   message: string,
   sendOn: string | null,
   subject: string,
   weight: number,
}