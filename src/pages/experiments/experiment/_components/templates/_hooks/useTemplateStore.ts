import type { Dayjs } from 'dayjs';
import { create } from 'zustand';

interface State {
   // values
   htmlBody: string,
   message: string,
   sendOn: Dayjs | null,
   subject: string,
   textBody: string,
   weight: number,
   // getters
   getHtmlBody: () => string,
   getMessage: () => string,
   getSendOn: () => Dayjs | null,
   getSubject: () => string,
   getTextBody: () => string,
   getWeight: () => number,
   // setters
   setHtmlBody: (htmlBody: string) => void,
   setMessage: (message: string) => void,
   setSendOn: (sendOn: Dayjs | null) => void,
   setSubject: (subject: string) => void,
   setTextBody: (textBody: string) => void,
   setWeight: (weight: number) => void,
}

export const useTemplateStore = create<State>()((set, get) => ({
   // values
   htmlBody: '',
   message: '',
   sendOn: null,
   subject: '',
   textBody: '',
   weight: 1,
   // getters
   getHtmlBody: () => get().htmlBody,
   getMessage: () => get().message,
   getSendOn: () => get().sendOn,
   getSubject: () => get().subject,
   getTextBody: () => get().textBody,
   getWeight: () => get().weight,
   // setters
   setHtmlBody: htmlBody => set(() => ({ htmlBody })),
   setMessage: message => set(() => ({ message })),
   setSendOn: sendOn => set(() => ({ sendOn })),
   setSubject: subject => set(() => ({ subject })),
   setTextBody: textBody => set(() => ({ textBody })),
   setWeight: weight => set(() => ({ weight })),
}))