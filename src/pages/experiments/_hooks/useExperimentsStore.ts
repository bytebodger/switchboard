import { create } from 'zustand';
import { SessionItem } from '../../../common/enums/SessionItem';
import { compareCohorts } from '../../../common/functions/compareCohorts';
import { compareEmails } from '../../../common/functions/compareEmails';
import { compareEmailTemplates } from '../../../common/functions/compareEmailTemplates';
import { compareExperiments } from '../../../common/functions/compareExperiments';
import { compareExperimentTags } from '../../../common/functions/compareExperimentTags';
import { compareInAppMessages } from '../../../common/functions/compareInAppMessages';
import { compareInAppMessageTemplates } from '../../../common/functions/compareInAppMessageTemplates';
import { compareMessageTags } from '../../../common/functions/compareMessageTags';
import { compareTexts } from '../../../common/functions/compareTexts';
import { compareTextTemplates } from '../../../common/functions/compareTextTemplates';
import type { CohortUI } from '../../../common/interfaces/cohort/CohortUI';
import type { EmailUI } from '../../../common/interfaces/email/EmailUI';
import type { EmailTemplateUI } from '../../../common/interfaces/emailTemplate/EmailTemplateUI';
import type { EmailTemplateTagUI } from '../../../common/interfaces/emailTemplateTag/EmailTemplateTagUI';
import type { ExperimentUI } from '../../../common/interfaces/experiment/ExperimentUI';
import type { ExperimentTagUI } from '../../../common/interfaces/experimentTag/ExperimentTagUI';
import type { ExperimentTagRelationshipUI } from '../../../common/interfaces/experimentTagRelationship/ExperimentTagRelationshipUI';
import type { HypothesisUI } from '../../../common/interfaces/hypothesis/HypothesisUI';
import type { InAppMessageUI } from '../../../common/interfaces/inAppMessage/InAppMessageUI';
import type { InAppMessageTemplateUI } from '../../../common/interfaces/inAppMessageTemplate/InAppMessageTemplateUI';
import type { InAppMessageTemplateTagUI } from '../../../common/interfaces/inAppMessageTemplateTag/InAppMessageTemplateTagUI';
import type { MessageTagUI } from '../../../common/interfaces/messageTag/MessageTagUI';
import type { TextUI } from '../../../common/interfaces/text/TextUI';
import type { TextTemplateUI } from '../../../common/interfaces/textTemplate/TextTemplateUI';
import type { TextTemplateTagUI } from '../../../common/interfaces/textTemplateTag/TextTemplateTagUI';
import { session } from '../../../common/libraries/session';
import { compareHypotheses } from '../_functions/compareHypotheses';

interface State {
   // values
   cohorts: CohortUI[],
   emailTemplateTags: EmailTemplateTagUI[],
   emailTemplates: EmailTemplateUI[],
   emails: EmailUI[],
   experimentTagRelationships: ExperimentTagRelationshipUI[],
   experimentTags: ExperimentTagUI[],
   experiments: ExperimentUI[],
   hypotheses: HypothesisUI[],
   inAppMessageTemplateTags: InAppMessageTemplateTagUI[],
   inAppMessageTemplates: InAppMessageTemplateUI[],
   inAppMessages: InAppMessageUI[],
   messageTags: MessageTagUI[],
   textTemplateTags: TextTemplateTagUI[],
   textTemplates: TextTemplateUI[],
   texts: TextUI[],
   // getters
   getCohorts: () => CohortUI[],
   getEmailTemplateTags: () => EmailTemplateTagUI[],
   getEmailTemplates: () => EmailTemplateUI[],
   getEmails: () => EmailUI[],
   getExperimentTagRelationships: () => ExperimentTagRelationshipUI[],
   getExperimentTags: () => ExperimentTagUI[],
   getExperiments: () => ExperimentUI[],
   getHypotheses: () => HypothesisUI[],
   getInAppMessageTemplateTags: () => InAppMessageTemplateTagUI[],
   getInAppMessageTemplates: () => InAppMessageTemplateUI[],
   getInAppMessages: () => InAppMessageUI[],
   getMessageTags: () => MessageTagUI[],
   getTextTemplateTags: () => TextTemplateTagUI[],
   getTextTemplates: () => TextTemplateUI[],
   getTexts: () => TextUI[],
   // setters
   setCohorts: (cohorts: CohortUI[]) => void,
   setEmailTemplateTags: (emailTemplateTags: EmailTemplateTagUI[]) => void,
   setEmailTemplates: (emailTemplates: EmailTemplateUI[]) => void,
   setEmails: (emails: EmailUI[]) => void,
   setExperimentTagRelationships: (experimentTagRelationships: ExperimentTagRelationshipUI[]) => void,
   setExperimentTags: (experimentTags: ExperimentTagUI[]) => void,
   setExperiments: (experiments: ExperimentUI[]) => void,
   setHypotheses: (hypotheses: HypothesisUI[]) => void,
   setInAppMessageTemplateTags: (inAppMessageTemplateTags: InAppMessageTemplateTagUI[]) => void,
   setInAppMessageTemplates: (inAppMessageTemplates: InAppMessageTemplateUI[]) => void,
   setInAppMessages: (inAppMessages: InAppMessageUI[]) => void,
   setMessageTags: (messageTags: MessageTagUI[]) => void,
   setTextTemplateTags: (textTemplateTags: TextTemplateTagUI[]) => void,
   setTextTemplates: (textTemplates: TextTemplateUI[]) => void,
   setTexts: (texts: TextUI[]) => void,
}

export const useExperimentsStore = create<State>()((set, get) => ({
   // values
   cohorts: session.getItem(SessionItem.cohorts, []),
   emailTemplateTags: session.getItem(SessionItem.emailTemplateTags, []),
   emailTemplates: session.getItem(SessionItem.emailTemplates, []),
   emails: session.getItem(SessionItem.emails, []),
   experimentTagRelationships: session.getItem(SessionItem.experimentTagRelationships, []),
   experimentTags: session.getItem(SessionItem.experimentTags, []),
   experiments: session.getItem(SessionItem.experiments, []),
   hypotheses: session.getItem(SessionItem.hypotheses, []),
   inAppMessageTemplateTags: session.getItem(SessionItem.inAppMessageTemplateTags, []),
   inAppMessageTemplates: session.getItem(SessionItem.inAppMessageTemplates, []),
   inAppMessages: session.getItem(SessionItem.inAppMessages, []),
   messageTags: session.getItem(SessionItem.messageTags, []),
   textTemplateTags: session.getItem(SessionItem.textTemplateTags, []),
   textTemplates: session.getItem(SessionItem.textTemplates, []),
   texts: session.getItem(SessionItem.texts, []),
   // getters
   getCohorts: () => get().cohorts,
   getEmailTemplateTags: () => get().emailTemplateTags,
   getEmailTemplates: () => get().emailTemplates,
   getEmails: () => get().emails,
   getExperimentTagRelationships: () => get().experimentTagRelationships,
   getExperimentTags: () => get().experimentTags,
   getExperiments: () => get().experiments,
   getHypotheses: () => get().hypotheses,
   getInAppMessageTemplateTags: () => get().inAppMessageTemplateTags,
   getInAppMessageTemplates: () => get().inAppMessageTemplates,
   getInAppMessages: () => get().inAppMessages,
   getMessageTags: () => get().messageTags,
   getTextTemplateTags: () => get().textTemplateTags,
   getTextTemplates: () => get().textTemplates,
   getTexts: () => get().texts,
   // setters
   setCohorts: cohorts => {
      const sortedCohorts = cohorts.sort(compareCohorts);
      session.setItem(SessionItem.cohorts, sortedCohorts);
      set(() => ({ cohorts: sortedCohorts }));
   },
   setEmails: emails => {
      const sortedEmails = emails.sort(compareEmails);
      session.setItem(SessionItem.emails, sortedEmails);
      set(() => ({ emails: sortedEmails }));
   },
   setEmailTemplates: emailTemplates => {
      const sortedEmailTemplates = emailTemplates.sort(compareEmailTemplates);
      session.setItem(SessionItem.emailTemplates, sortedEmailTemplates);
      set(() => ({ emailTemplates: sortedEmailTemplates }));
   },
   setEmailTemplateTags: emailTemplateTags => {
      session.setItem(SessionItem.emailTemplateTags, emailTemplateTags);
      set(() => ({ emailTemplateTags }));
   },
   setExperiments: experiments => {
      const sortedExperiments = experiments.sort(compareExperiments);
      session.setItem(SessionItem.experiments, sortedExperiments);
      set(() => ({ experiments: sortedExperiments }));
   },
   setExperimentTagRelationships: experimentTagRelationships => {
      session.setItem(SessionItem.experimentTagRelationships, experimentTagRelationships);
      set(() => ({ experimentTagRelationships }));
   },
   setExperimentTags: experimentTags => {
      const sortedExperimentTags = experimentTags.sort(compareExperimentTags);
      session.setItem(SessionItem.experimentTags, sortedExperimentTags);
      set(() => ({ experimentTags: sortedExperimentTags }));
   },
   setHypotheses: hypotheses => {
      const sortedHypotheses = hypotheses.sort(compareHypotheses);
      session.setItem(SessionItem.hypotheses, sortedHypotheses);
      set(() => ({ hypotheses: sortedHypotheses }));
   },
   setInAppMessages: inAppMessages => {
      const sortedInAppMessages = inAppMessages.sort(compareInAppMessages);
      session.setItem(SessionItem.inAppMessages, sortedInAppMessages);
      set(() => ({ inAppMessages: sortedInAppMessages }));
   },
   setInAppMessageTemplates: inAppMessageTemplates => {
      const sortedInAppMessageTemplates = inAppMessageTemplates.sort(compareInAppMessageTemplates);
      session.setItem(SessionItem.inAppMessageTemplates, sortedInAppMessageTemplates);
      set(() => ({ inAppMessageTemplates: sortedInAppMessageTemplates }));
   },
   setInAppMessageTemplateTags: inAppMessageTemplateTags => {
      session.setItem(SessionItem.inAppMessageTemplateTags, inAppMessageTemplateTags);
      set(() => ({ inAppMessageTemplateTags }));
   },
   setMessageTags: messageTags => {
      const sortedMessageTags = messageTags.sort(compareMessageTags);
      session.setItem(SessionItem.messageTags, sortedMessageTags);
      set(() => ({ messageTags: sortedMessageTags }));
   },
   setTexts: texts => {
      const sortedTexts = texts.sort(compareTexts);
      session.setItem(SessionItem.texts, sortedTexts);
      set(() => ({ texts: sortedTexts }));
   },
   setTextTemplates: textTemplates => {
      const sortedTextTemplates = textTemplates.sort(compareTextTemplates);
      session.setItem(SessionItem.textTemplates, sortedTextTemplates);
      set(() => ({ textTemplates: sortedTextTemplates }));
   },
   setTextTemplateTags: textTemplateTags => {
      session.setItem(SessionItem.textTemplateTags, textTemplateTags);
      set(() => ({ textTemplateTags }));
   },
}))