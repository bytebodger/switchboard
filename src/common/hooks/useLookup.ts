import { useEndpointStore } from '../../app/hooks/useEndpointStore';
import { useExperimentsStore } from '../../pages/experiments/_hooks/useExperimentsStore';
import type { CohortUI } from '../interfaces/cohort/CohortUI';
import type { EmailUI } from '../interfaces/email/EmailUI';
import type { EmailTemplateUI } from '../interfaces/emailTemplate/EmailTemplateUI';
import type { EmailTemplateTagUI } from '../interfaces/emailTemplateTag/EmailTemplateTagUI';
import type { ExperimentTagUI } from '../interfaces/experimentTag/ExperimentTagUI';
import type { HypothesisUI } from '../interfaces/hypothesis/HypothesisUI';
import type { InAppMessageUI } from '../interfaces/inAppMessage/InAppMessageUI';
import type { InAppMessageTemplateUI } from '../interfaces/inAppMessageTemplate/InAppMessageTemplateUI';
import type { InAppMessageTemplateTagUI } from '../interfaces/inAppMessageTemplateTag/InAppMessageTemplateTagUI';
import type { MessageTagUI } from '../interfaces/messageTag/MessageTagUI';
import type { PermissionUI } from '../interfaces/permission/PermissionUI';
import type { RoleUI } from '../interfaces/role/RoleUI';
import type { TextUI } from '../interfaces/text/TextUI';
import type { TextTemplateUI } from '../interfaces/textTemplate/TextTemplateUI';
import type { TextTemplateTagUI } from '../interfaces/textTemplateTag/TextTemplateTagUI';
import type { UserUI } from '../interfaces/user/UserUI';

export const useLookup = () => {
   const [
      getPermissions,
      getRolePermissions,
      getRoles,
      getUserRoles,
      getUsers,
   ] = useEndpointStore(state => [
      state.getPermissions,
      state.getRolePermissions,
      state.getRoles,
      state.getUserRoles,
      state.getUsers,
   ])
   const [
      getCohorts,
      getEmailTemplateTags,
      getEmailTemplates,
      getEmails,
      getExperimentTagRelationships,
      getExperimentTags,
      getExperiments,
      getHypotheses,
      getInAppMessageTemplateTags,
      getInAppMessageTemplates,
      getInAppMessages,
      getMessageTags,
      getTextTemplateTags,
      getTextTemplates,
      getTexts,
   ] = useExperimentsStore(state => [
      state.getCohorts,
      state.getEmailTemplateTags,
      state.getEmailTemplates,
      state.getEmails,
      state.getExperimentTagRelationships,
      state.getExperimentTags,
      state.getExperiments,
      state.getHypotheses,
      state.getInAppMessageTemplateTags,
      state.getInAppMessageTemplates,
      state.getInAppMessages,
      state.getMessageTags,
      state.getTextTemplateTags,
      state.getTextTemplates,
      state.getTexts,
   ])

   const cohortsByCampaign = (campaignId: number) => cohortsByExperiment(campaignId);

   const cohortsByExperiment = (experimentId: number): CohortUI[] => getCohorts().filter(cohort => cohort.experimentId === experimentId);

   const emailsByCampaign = (campaignId: number) => emailsByExperiment(campaignId);

   const emailsByExperiment = (experimentId: number): EmailUI[] => {
      return getEmails().filter(email => {
         return getEmailTemplates().some(emailTemplate => emailTemplate.id === email.emailTemplateId && emailTemplate.experimentId === experimentId);
      })
   }

   const emailTemplatesByCampaign = (campaignId: number) => emailTemplatesByExperiment(campaignId);

   const emailTemplatesByExperiment = (experimentId: number): EmailTemplateUI[] => getEmailTemplates()
      .filter(emailTemplate => emailTemplate.experimentId === experimentId);

   const emailTemplatesByMessageTag = (messageTagId: number): EmailTemplateUI[] => {
      return getEmailTemplates().filter(emailTemplate => {
         return getEmailTemplateTags().some(emailTemplateTag => {
            if (emailTemplateTag.emailTemplateId !== emailTemplate.id || emailTemplateTag.messageTagId !== messageTagId) return false;
            return getMessageTags().some(messageTag => messageTag.id === emailTemplateTag.messageTagId);
         })
      })
   }

   const emailTemplateTagsByCampaign = (campaignId: number) => emailTemplateTagsByExperiment(campaignId);

   const emailTemplateTagsByExperiment = (experimentId: number): EmailTemplateTagUI[] => {
      return getEmailTemplateTags().filter(emailTemplateTag => {
         return getEmailTemplates()
            .some(emailTemplate => emailTemplate.experimentId === experimentId && emailTemplateTag.emailTemplateId === emailTemplate.id);
      })
   }

   const hypothesesByExperiment = (experimentId: number): HypothesisUI[] => getHypotheses().filter(hypothesis => hypothesis.experimentId === experimentId);

   const inAppMessagesByCampaign = (campaignId: number) => inAppMessagesByExperiment(campaignId);

   const inAppMessagesByExperiment = (experimentId: number): InAppMessageUI[] => {
      return getInAppMessages().filter(inAppMessage => {
         return getInAppMessageTemplates().some(inAppMessageTemplate => {
            return inAppMessageTemplate.id === inAppMessage.inAppMessageTemplateId && inAppMessageTemplate.experimentId === experimentId;
         })
      })
   }

   const inAppMessageTemplatesByCampaign = (campaignId: number) => inAppMessageTemplatesByExperiment(campaignId);

   const inAppMessageTemplatesByExperiment = (experimentId: number): InAppMessageTemplateUI[] => getInAppMessageTemplates()
      .filter(inAppMessageTemplate => inAppMessageTemplate.experimentId === experimentId);

   const inAppMessageTemplateTagsByCampaign = (campaignId: number) => inAppMessageTemplateTagsByExperiment(campaignId);

   const inAppMessageTemplateTagsByExperiment = (experimentId: number): InAppMessageTemplateTagUI[] => {
      return getInAppMessageTemplateTags().filter(inAppMessageTemplateTag => {
         return getInAppMessageTemplates().some(inAppMessageTemplate => {
            return inAppMessageTemplate.experimentId === experimentId && inAppMessageTemplateTag.inAppMessageTemplateId === inAppMessageTemplate.id;
         });
      })
   }

   const messageTagsByEmailTemplate = (emailTemplateId: number): MessageTagUI[] => {
      return getMessageTags().filter(messageTag => {
         return getEmailTemplateTags().some(emailTemplateTag => {
            if (emailTemplateTag.messageTagId !== messageTag.id || emailTemplateTag.emailTemplateId !== emailTemplateId) return false;
            return getEmailTemplates().some(emailTemplate => emailTemplateTag.emailTemplateId === emailTemplate.id);
         })
      })
   }

   const messageTagsByInAppMessageTemplate = (inAppMessageTemplateId: number): MessageTagUI[] => {
      return getMessageTags().filter(messageTag => {
         return getInAppMessageTemplateTags().some(inAppMessageTemplateTag => {
            if (inAppMessageTemplateTag.messageTagId !== messageTag.id || inAppMessageTemplateTag.inAppMessageTemplateId !== inAppMessageTemplateId)
               return false;
            return getInAppMessageTemplates()
               .some(inAppMessageTemplate => inAppMessageTemplateTag.inAppMessageTemplateId === inAppMessageTemplate.id);
         })
      })
   }

   const messageTagsByTextTemplate = (textTemplateId: number): MessageTagUI[] => {
      return getMessageTags().filter(messageTag => {
         return getTextTemplateTags().some(textTemplateTag => {
            if (textTemplateTag.messageTagId !== messageTag.id || textTemplateTag.textTemplateId !== textTemplateId) return false;
            return getTextTemplates().some(textTemplate => textTemplateTag.textTemplateId === textTemplate.id);
         })
      })
   }

   const permissionsByRole = (roleId: number, includeDisabled: boolean = false): PermissionUI[] => {
      return getPermissions().filter(permission => {
         if (!includeDisabled && permission.isDisabled) return false;
         return getRolePermissions().some(rolePermission => {
            if (rolePermission.permissionId !== permission.id || rolePermission.roleId !== roleId) return false;
            return getRoles().some(role => !role.isDisabled && role.id === rolePermission.roleId);
         });
      })
   }

   const permissionsByUser = (userId: number, includeDisabled: boolean = false): PermissionUI[] => {
      const relatedRoles = rolesByUser(userId, includeDisabled);
      return getPermissions().filter(permission => {
         if (!includeDisabled && permission.isDisabled) return false;
         return getRolePermissions().some(rolePermission => {
            if (rolePermission.permissionId !== permission.id) return false;
            return relatedRoles.some(role => !role.isDisabled && role.id === rolePermission.roleId);
         })
      })
   }

   const rolesByPermission = (permissionId: number, includeDisabled: boolean = false): RoleUI[] => {
      return getRoles().filter(role => {
         if (!includeDisabled && role.isDisabled) return false;
         return getRolePermissions().some(rolePermission => {
            if (rolePermission.roleId !== role.id || rolePermission.permissionId !== permissionId) return false;
            return getPermissions().some(permission => !permission.isDisabled && permission.id === rolePermission.permissionId);
         })
      })
   }

   const rolesByUser = (userId: number, includeDisabled: boolean = false): RoleUI[] => {
      return getRoles().filter(role => {
         if (!includeDisabled && role.isDisabled) return false;
         return getUserRoles().some(userRole => {
            if (userRole.roleId !== role.id || userRole.userId !== userId) return false;
            return getUsers().some(user => !user.isDisabled && user.id === userRole.userId);
         })
      })
   }

   const tagsByEmailTemplate = (emailTemplateId: number): MessageTagUI[] => {
      return getMessageTags().filter(messageTag => {
         return getEmailTemplateTags().some(emailTemplateTag => {
            if (messageTag.id !== emailTemplateTag.messageTagId) return false;
            return getEmailTemplates().some(emailTemplate => {
               return emailTemplate.id === emailTemplateTag.emailTemplateId && emailTemplate.id === emailTemplateId;
            })
         })
      })
   }

   const tagsByCampaign = (campaignId: number) => tagsByExperiment(campaignId);

   const tagsByExperiment = (experimentId: number): ExperimentTagUI[] => {
      return getExperimentTags().filter(experimentTag => {
         return getExperimentTagRelationships().some(experimentTagRelationship => {
            if (experimentTagRelationship.experimentTagId !== experimentTag.id || experimentTagRelationship.experimentId !== experimentId)
               return false;
            return getExperiments().some(experiment => experiment.id === experimentTagRelationship.experimentId);
         })
      })
   }

   const tagsByInAppMessageTemplate = (inAppMessageTemplateId: number): MessageTagUI[] => {
      return getMessageTags().filter(messageTag => {
         return getInAppMessageTemplateTags().some(inAppMessageTemplateTag => {
            if (messageTag.id !== inAppMessageTemplateTag.messageTagId) return false;
            return getInAppMessageTemplates().some(inAppMessageTemplate => {
               return inAppMessageTemplate.id === inAppMessageTemplateTag.inAppMessageTemplateId && inAppMessageTemplate.id === inAppMessageTemplateId;
            })
         })
      })
   }

   const tagsByTextTemplate = (textTemplateId: number): MessageTagUI[] => {
      return getMessageTags().filter(messageTag => {
         return getTextTemplateTags().some(textTemplateTag => {
            if (messageTag.id !== textTemplateTag.messageTagId) return false;
            return getTextTemplates().some(textTemplate => {
               return textTemplate.id === textTemplateTag.textTemplateId && textTemplate.id === textTemplateId;
            })
         })
      })
   }

   const textsByCampaign = (campaignId: number) => textsByExperiment(campaignId);

   const textsByExperiment = (experimentId: number): TextUI[] => {
      return getTexts().filter(text => {
         return getTextTemplates().some(textTemplate => textTemplate.id === text.textTemplateId && textTemplate.experimentId === experimentId);
      })
   }

   const textTemplatesByCampaign = (campaignId: number) => textTemplatesByExperiment(campaignId);

   const textTemplatesByExperiment = (experimentId: number): TextTemplateUI[] => getTextTemplates()
      .filter(textTemplate => textTemplate.experimentId === experimentId);

   const textTemplateTagsByCampaign = (campaignId: number) => textTemplateTagsByExperiment(campaignId);

   const textTemplateTagsByExperiment = (experimentId: number): TextTemplateTagUI[] => {
      return getTextTemplateTags().filter(textTemplateTag => {
         return getTextTemplates()
            .some(textTemplate => textTemplate.experimentId === experimentId && textTemplateTag.textTemplateId === textTemplate.id);
      })
   }

   const usersByPermission = (permissionId: number, includeDisabled: boolean = false): UserUI[] => {
      const relatedRoles = rolesByPermission(permissionId, includeDisabled);
      return getUsers().filter(user => {
         if ((!includeDisabled && user.isDisabled) || user.email === 'system.user@sequel.ae') return false;
         return getUserRoles().some(userRole => {
            if (userRole.userId !== user.id) return false;
            return relatedRoles.some(role => !role.isDisabled && userRole.roleId === role.id);
         })
      })
   }

   const usersByRole = (roleId: number, includeDisabled: boolean = false): UserUI[] => {
      return getUsers().filter(user => {
         if ((!includeDisabled && user.isDisabled) || user.email === 'system.user@sequel.ae') return false;
         return getUserRoles().some(userRole => {
            if (userRole.roleId !== roleId || userRole.userId !== user.id) return false;
            return getRoles().some(role => !role.isDisabled && role.id === userRole.roleId);
         })
      })
   }

   return {
      cohortsByCampaign,
      cohortsByExperiment,
      emailTemplateTagsByCampaign,
      emailTemplateTagsByExperiment,
      emailTemplatesByCampaign,
      emailTemplatesByExperiment,
      emailTemplatesByMessageTag,
      emailsByCampaign,
      emailsByExperiment,
      hypothesesByExperiment,
      inAppMessageTemplateTagsByCampaign,
      inAppMessageTemplateTagsByExperiment,
      inAppMessageTemplatesByCampaign,
      inAppMessageTemplatesByExperiment,
      inAppMessagesByCampaign,
      inAppMessagesByExperiment,
      messageTagsByEmailTemplate,
      messageTagsByInAppMessageTemplate,
      messageTagsByTextTemplate,
      permissionsByRole,
      permissionsByUser,
      rolesByPermission,
      rolesByUser,
      tagsByCampaign,
      tagsByEmailTemplate,
      tagsByExperiment,
      tagsByInAppMessageTemplate,
      tagsByTextTemplate,
      textTemplateTagsByCampaign,
      textTemplateTagsByExperiment,
      textTemplatesByCampaign,
      textTemplatesByExperiment,
      textsByCampaign,
      textsByExperiment,
      usersByPermission,
      usersByRole,
   }
}