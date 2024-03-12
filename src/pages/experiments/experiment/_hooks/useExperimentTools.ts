import dayjs from 'dayjs';
import { useParams } from 'react-router-dom';
import { useEndpointStore } from '../../../../app/hooks/useEndpointStore';
import { Color } from '../../../../common/enums/Color';
import { Permission } from '../../../../common/enums/Permission';
import { Stage } from '../../../../common/enums/Stage';
import { getNumber } from '../../../../common/functions/getNumber';
import { useHasPermission } from '../../../../common/hooks/useHasPermission';
import { useLookup } from '../../../../common/hooks/useLookup';
import { useExperimentsStore } from '../../_hooks/useExperimentsStore';

export const useExperimentTools = () => {
   const [getUser] = useEndpointStore(state => [state.getUser]);
   const [getExperiments] = useExperimentsStore(state => [state.getExperiments]);
   const hasPermission = useHasPermission();
   const lookup = useLookup();
   const params = useParams();

   const urlExperimentId = getNumber(params.experimentId);
   const currentUserId = getNumber(getUser()?.id);

   const getStage = (experimentId: number = urlExperimentId): Stage => {
      const {
         concluded,
         observing,
         scheduled,
         sending,
         unknown,
         unscheduled,
      } = Stage;
      if (experimentId === 0) return unscheduled;
      const experiment = getExperiments().find(experiment => experiment.id === experimentId);
      if (!experiment) return unknown;
      const endOn = dayjs(experiment.endOn).utc(true);
      const now = dayjs().utc();
      if (endOn.isBefore(now)) return concluded;
      const emailTemplates = lookup.emailTemplatesByExperiment(experimentId);
      const inAppMessageTemplates = lookup.inAppMessageTemplatesByExperiment(experimentId);
      const textTemplates = lookup.textTemplatesByExperiment(experimentId);
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
      return emailsUnsent || inAppMessagesUnsent || textsUnsent ? sending : observing;
   }

   const getStageColor = (stage: Stage, experimentId: number = urlExperimentId) => {
      const currentStage = getStage(experimentId);
      if (currentStage === stage) return Color.inherit;
      return currentStage > stage ? Color.greenTemplate : Color.greyLight;
   }

   const getTotalTemplates = (experimentId: number = urlExperimentId) => {
      return lookup.emailTemplatesByExperiment(experimentId).length
         + lookup.inAppMessageTemplatesByExperiment(experimentId).length
         + lookup.textTemplatesByExperiment(experimentId).length;
   }

   const isEnabledPendingAndOwnedBy = (experimentId: number = urlExperimentId, userId: number = currentUserId) => {
      if (experimentId === 0) return true;
      const stage = getStage(experimentId);
      const { scheduled, unscheduled } = Stage;
      const experiment = getExperiments().find(experiment => experiment.id === experimentId);
      if (!experiment) return false;
      return !experiment.isDisabled && [scheduled, unscheduled].includes(stage) && isOwnedBy(experimentId, userId);
   }

   const isOwnedBy = (experimentId: number = urlExperimentId, userId: number = currentUserId) => {
      if (experimentId === 0 || hasPermission.check(Permission.adminWrite) || hasPermission.check(Permission.scientistAdmin))
         return true;
      return getExperiments().some(experiment => experiment.ownedBy === userId && experiment.id === experimentId);
   }

   return {
      getStage,
      getStageColor,
      getTotalTemplates,
      isEnabledPendingAndOwnedBy,
      isOwnedBy,
   }
}