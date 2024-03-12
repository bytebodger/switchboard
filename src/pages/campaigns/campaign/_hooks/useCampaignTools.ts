import dayjs from 'dayjs';
import { useParams } from 'react-router-dom';
import { useEndpointStore } from '../../../../app/hooks/useEndpointStore';
import { Color } from '../../../../common/enums/Color';
import { Permission } from '../../../../common/enums/Permission';
import { Stage } from '../../../../common/enums/Stage';
import { getNumber } from '../../../../common/functions/getNumber';
import { useHasPermission } from '../../../../common/hooks/useHasPermission';
import { useLookup } from '../../../../common/hooks/useLookup';
import { useCampaignsStore } from '../../_hooks/useCampaignsStore';

export const useCampaignTools = () => {
   const [getUser] = useEndpointStore(state => [state.getUser]);
   const [getCampaigns] = useCampaignsStore(state => [state.getCampaigns]);
   const hasPermission = useHasPermission();
   const lookup = useLookup();
   const params = useParams();

   const urlCampaignId = getNumber(params.campaignId);
   const currentUserId = getNumber(getUser()?.id);

   const getStage = (campaignId: number = urlCampaignId): Stage => {
      const {
         concluded,
         scheduled,
         sending,
         unknown,
         unscheduled,
      } = Stage;
      if (campaignId === 0) return unscheduled;
      const campaign = getCampaigns().find(campaign => campaign.id === campaignId);
      if (!campaign) return unknown;
      const now = dayjs().utc();
      const emailTemplates = lookup.emailTemplatesByCampaign(campaignId);
      const inAppMessageTemplates = lookup.inAppMessageTemplatesByCampaign(campaignId);
      const textTemplates = lookup.textTemplatesByCampaign(campaignId);
      if (!emailTemplates.length && !inAppMessageTemplates.length && !textTemplates.length) return unscheduled;
      const emailsSent = emailTemplates.some(emailTemplate => dayjs(emailTemplate.sendOn).utc(true).isBefore(now));
      const inAppMessagesSent = inAppMessageTemplates.some(inAppMessageTemplate =>
         dayjs(inAppMessageTemplate.sendOn).utc(true).isBefore(now)
      );
      const textsSent = textTemplates.some(textTemplate => dayjs(textTemplate.sendOn).utc(true).isBefore(now));
      if (!emailsSent && !inAppMessagesSent && !textsSent) return scheduled;
      const emailsUnsent = emailTemplates.some(emailTemplate => dayjs(emailTemplate.sendOn).utc(true).isAfter(now));
      const inAppMessagesUnsent = inAppMessageTemplates.some(inAppMessageTemplate =>
         dayjs(inAppMessageTemplate.sendOn).utc(true).isAfter(now)
      );
      const textsUnsent = textTemplates.some(textTemplate => dayjs(textTemplate.sendOn).utc(true).isAfter(now));
      return emailsUnsent || inAppMessagesUnsent || textsUnsent ? sending : concluded;
   }

   const getStageColor = (stage: Stage, campaignId: number = urlCampaignId) => {
      const currentStage = getStage(campaignId);
      if (currentStage === stage) return Color.inherit;
      return currentStage > stage ? Color.greenTemplate : Color.greyLight;
   }

   const getTotalTemplates = (campaignId: number = urlCampaignId) => {
      return lookup.emailTemplatesByCampaign(campaignId).length
         + lookup.inAppMessageTemplatesByCampaign(campaignId).length
         + lookup.textTemplatesByCampaign(campaignId).length;
   }

   const isEnabledPendingAndOwnedBy = (campaignId: number = urlCampaignId, userId: number = currentUserId) => {
      if (campaignId === 0) return true;
      const stage = getStage(campaignId);
      const { scheduled, unscheduled } = Stage;
      const campaign = getCampaigns().find(campaign => campaign.id === campaignId);
      if (!campaign) return false;
      return !campaign.isDisabled && [scheduled, unscheduled].includes(stage) && isOwnedBy(campaignId, userId);
   }

   const isOwnedBy = (campaignId: number = urlCampaignId, userId: number = currentUserId) => {
      if (campaignId === 0 || hasPermission.check(Permission.adminWrite) || hasPermission.check(Permission.marketerAdmin))
         return true;
      return getCampaigns().some(campaign => campaign.ownedBy === userId && campaign.id === campaignId);
   }

   return {
      getStage,
      getStageColor,
      getTotalTemplates,
      isEnabledPendingAndOwnedBy,
      isOwnedBy,
   }
}