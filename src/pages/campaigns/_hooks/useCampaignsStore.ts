import { create } from 'zustand';
import { SessionItem } from '../../../common/enums/SessionItem';
import { compareCohorts } from '../../../common/functions/compareCohorts';
import { compareEmails } from '../../../common/functions/compareEmails';
import { compareEmailTemplates } from '../../../common/functions/compareEmailTemplates';
import { compareCampaigns } from '../../../common/functions/compareExperiments';
import { compareCampaignTags } from '../../../common/functions/compareExperimentTags';
import { compareInAppMessages } from '../../../common/functions/compareInAppMessages';
import { compareInAppMessageTemplates } from '../../../common/functions/compareInAppMessageTemplates';
import { compareMessageTags } from '../../../common/functions/compareMessageTags';
import { compareTexts } from '../../../common/functions/compareTexts';
import { compareTextTemplates } from '../../../common/functions/compareTextTemplates';
import type { CohortUI } from '../../../common/interfaces/cohort/CohortUI';
import type { EmailUI } from '../../../common/interfaces/email/EmailUI';
import type { EmailTemplateUI } from '../../../common/interfaces/emailTemplate/EmailTemplateUI';
import type { EmailTemplateTagUI } from '../../../common/interfaces/emailTemplateTag/EmailTemplateTagUI';
import type { CampaignUI } from '../../../common/interfaces/experiment/ExperimentUI';
import type { CampaignTagUI } from '../../../common/interfaces/experimentTag/ExperimentTagUI';
import type { CampaignTagRelationshipUI } from '../../../common/interfaces/experimentTagRelationship/ExperimentTagRelationshipUI';
import type { InAppMessageUI } from '../../../common/interfaces/inAppMessage/InAppMessageUI';
import type { InAppMessageTemplateUI } from '../../../common/interfaces/inAppMessageTemplate/InAppMessageTemplateUI';
import type { InAppMessageTemplateTagUI } from '../../../common/interfaces/inAppMessageTemplateTag/InAppMessageTemplateTagUI';
import type { MessageTagUI } from '../../../common/interfaces/messageTag/MessageTagUI';
import type { TextUI } from '../../../common/interfaces/text/TextUI';
import type { TextTemplateUI } from '../../../common/interfaces/textTemplate/TextTemplateUI';
import type { TextTemplateTagUI } from '../../../common/interfaces/textTemplateTag/TextTemplateTagUI';
import { session } from '../../../common/libraries/session';

interface State {
   // values
   campaignTagRelationships: CampaignTagRelationshipUI[],
   campaignTags: CampaignTagUI[],
   campaigns: CampaignUI[],
   cohorts: CohortUI[],
   emailTemplateTags: EmailTemplateTagUI[],
   emailTemplates: EmailTemplateUI[],
   emails: EmailUI[],
   inAppMessageTemplateTags: InAppMessageTemplateTagUI[],
   inAppMessageTemplates: InAppMessageTemplateUI[],
   inAppMessages: InAppMessageUI[],
   messageTags: MessageTagUI[],
   textTemplateTags: TextTemplateTagUI[],
   textTemplates: TextTemplateUI[],
   texts: TextUI[],
   // getters
   getCampaignTagRelationships: () => CampaignTagRelationshipUI[],
   getCampaignTags: () => CampaignTagUI[],
   getCampaigns: () => CampaignUI[],
   getCohorts: () => CohortUI[],
   getEmailTemplateTags: () => EmailTemplateTagUI[],
   getEmailTemplates: () => EmailTemplateUI[],
   getEmails: () => EmailUI[],
   getInAppMessageTemplateTags: () => InAppMessageTemplateTagUI[],
   getInAppMessageTemplates: () => InAppMessageTemplateUI[],
   getInAppMessages: () => InAppMessageUI[],
   getMessageTags: () => MessageTagUI[],
   getTextTemplateTags: () => TextTemplateTagUI[],
   getTextTemplates: () => TextTemplateUI[],
   getTexts: () => TextUI[],
   // setters
   setCampaignTagRelationships: (campaignTagRelationships: CampaignTagRelationshipUI[]) => void,
   setCampaignTags: (campaignTags: CampaignTagUI[]) => void,
   setCampaigns: (campaigns: CampaignUI[]) => void,
   setCohorts: (cohorts: CohortUI[]) => void,
   setEmailTemplateTags: (emailTemplateTags: EmailTemplateTagUI[]) => void,
   setEmailTemplates: (emailTemplates: EmailTemplateUI[]) => void,
   setEmails: (emails: EmailUI[]) => void,
   setInAppMessageTemplateTags: (inAppMessageTemplateTags: InAppMessageTemplateTagUI[]) => void,
   setInAppMessageTemplates: (inAppMessageTemplates: InAppMessageTemplateUI[]) => void,
   setInAppMessages: (inAppMessages: InAppMessageUI[]) => void,
   setMessageTags: (messageTags: MessageTagUI[]) => void,
   setTextTemplateTags: (textTemplateTags: TextTemplateTagUI[]) => void,
   setTextTemplates: (textTemplates: TextTemplateUI[]) => void,
   setTexts: (texts: TextUI[]) => void,
}

export const useCampaignsStore = create<State>()((set, get) => ({
   // values
   campaignTagRelationships: session.getItem(SessionItem.campaignTagRelationships, []),
   campaignTags: session.getItem(SessionItem.campaignTags, []),
   campaigns: session.getItem(SessionItem.campaigns, []),
   cohorts: session.getItem(SessionItem.cohorts, []),
   emailTemplateTags: session.getItem(SessionItem.emailTemplateTags, []),
   emailTemplates: session.getItem(SessionItem.emailTemplates, []),
   emails: session.getItem(SessionItem.emails, []),
   inAppMessageTemplateTags: session.getItem(SessionItem.inAppMessageTemplateTags, []),
   inAppMessageTemplates: session.getItem(SessionItem.inAppMessageTemplates, []),
   inAppMessages: session.getItem(SessionItem.inAppMessages, []),
   messageTags: session.getItem(SessionItem.messageTags, []),
   textTemplateTags: session.getItem(SessionItem.textTemplateTags, []),
   textTemplates: session.getItem(SessionItem.textTemplates, []),
   texts: session.getItem(SessionItem.texts, []),
   // getters
   getCampaignTagRelationships: () => get().campaignTagRelationships,
   getCampaignTags: () => get().campaignTags,
   getCampaigns: () => get().campaigns,
   getCohorts: () => get().cohorts,
   getEmailTemplateTags: () => get().emailTemplateTags,
   getEmailTemplates: () => get().emailTemplates,
   getEmails: () => get().emails,
   getInAppMessageTemplateTags: () => get().inAppMessageTemplateTags,
   getInAppMessageTemplates: () => get().inAppMessageTemplates,
   getInAppMessages: () => get().inAppMessages,
   getMessageTags: () => get().messageTags,
   getTextTemplateTags: () => get().textTemplateTags,
   getTextTemplates: () => get().textTemplates,
   getTexts: () => get().texts,
   // setters
   setCampaignTagRelationships: campaignTagRelationships => {
      session.setItem(SessionItem.campaignTagRelationships, campaignTagRelationships);
      set(() => ({ campaignTagRelationships }));
   },
   setCampaignTags: campaignTags => {
      const sortedCampaignTags = campaignTags.sort(compareCampaignTags);
      session.setItem(SessionItem.campaignTags, sortedCampaignTags);
      set(() => ({ campaignTags: sortedCampaignTags }));
   },
   setCampaigns: campaigns => {
      const sortedCampaigns = campaigns.sort(compareCampaigns);
      session.setItem(SessionItem.campaigns, sortedCampaigns);
      set(() => ({ campaigns: sortedCampaigns }));
   },
   setCohorts: cohorts => {
      const sortedCohorts = cohorts.sort(compareCohorts);
      session.setItem(SessionItem.cohorts, sortedCohorts);
      set(() => ({ cohorts: sortedCohorts }));
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
   setEmails: emails => {
      const sortedEmails = emails.sort(compareEmails);
      session.setItem(SessionItem.emails, sortedEmails);
      set(() => ({ emails: sortedEmails }));
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