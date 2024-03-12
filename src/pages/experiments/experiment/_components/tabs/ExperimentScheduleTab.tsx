import dayjs from 'dayjs';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Column } from '../../../../../common/components/Column';
import { Row } from '../../../../../common/components/Row';
import { TranslatedText } from '../../../../../common/components/TranslatedText';
import { Format } from '../../../../../common/enums/Format';
import { getNumber } from '../../../../../common/functions/getNumber';
import { useLookup } from '../../../../../common/hooks/useLookup';
import type { EmailTemplateUI } from '../../../../../common/interfaces/emailTemplate/EmailTemplateUI';
import type { InAppMessageTemplateUI } from '../../../../../common/interfaces/inAppMessageTemplate/InAppMessageTemplateUI';
import type { TextTemplateUI } from '../../../../../common/interfaces/textTemplate/TextTemplateUI';
import { useExperimentStore } from '../../_hooks/useExperimentStore';
import { useMessageTools } from '../../_hooks/useMessageTools';

export const ExperimentScheduleTab = () => {
   const [
      getAudienceSize,
      getEndOn,
      getExperimentId,
      setAddButton,
      setExperimentId,
   ] = useExperimentStore(state => [
      state.getAudienceSize,
      state.getEndOn,
      state.getExperimentId,
      state.setAddButton,
      state.setExperimentId,
   ]);
   const lookup = useLookup();
   const messageTools = useMessageTools();
   const params = useParams();

   const compareTemplates = (a: EmailTemplateUI | InAppMessageTemplateUI | TextTemplateUI, b: EmailTemplateUI | InAppMessageTemplateUI | TextTemplateUI) => {
      const aSendOn = dayjs(a.sendOn).utc(true);
      const bSendOn = dayjs(b.sendOn).utc(true);
      if (aSendOn.isBefore(bSendOn)) return -1;
      if (aSendOn.isAfter(bSendOn)) return 1;
      return 0;
   }

   const getScheduleRows = () => {
      const emailTemplates = lookup.emailTemplatesByExperiment(getExperimentId());
      const inAppMessageTemplates = lookup.inAppMessageTemplatesByExperiment(getExperimentId());
      const textTemplates = lookup.textTemplatesByExperiment(getExperimentId());
      const allTemplates = [
         ...emailTemplates,
         ...inAppMessageTemplates,
         ...textTemplates,
      ]
      if (allTemplates.length === 0) {
         let narrative = 'There are no messages scheduled to be sent for this experiment.  To schedule message sends, configure one-or-more templates on the TEMPLATES tab.';
         const endOn = dayjs(getEndOn()).utc(true);
         const now = dayjs().utc();
         if (endOn.isBefore(now)) narrative = 'No messages were sent for this experiment because it contained no message templates.';
         return (
            <Row>
               <Column xs={12}>
                  <TranslatedText text={narrative}/>
               </Column>
            </Row>
         )
      }
      allTemplates.sort(compareTemplates);
      return allTemplates.map((template, index) => {
         const { id, weight } = template;
         const weightPercent = Number(messageTools.getWeightPercent(getExperimentId(), weight));
         const sendOn = dayjs(template.sendOn).utc(true);
         const now = dayjs().utc();
         const unsent = sendOn.isAfter(now);
         const recipients = Math.round((getAudienceSize() ?? 0) * (weightPercent / 100));
         const type = Object.hasOwn(template, 'htmlMessage') ? 'Email' : 'In-app message';
         const recipientDisplay = recipients === 1 ? 'recipient' : 'recipients';
         let narrative = `
            ${type} template #${id} was sent to ~${recipients} ${recipientDisplay} at ${sendOn.format(Format.dateTime)} UTC.
         `;
         if (unsent) narrative = `
            ${type} template #${id} will be sent to ~${recipients} ${recipientDisplay} at ${sendOn.format(Format.dateTime)} UTC.
         `;
         return (
            <Row key={`scheduleRow-${id}`}>
               <Column xs={12}>
                  {index + 1}.
                  {' '}
                  {narrative}
               </Column>
            </Row>
         )
      })
   }

   useEffect(() => {
      setAddButton(null);
   }, [])

   useEffect(() => {
      const experimentId = getNumber(params.experimentId);
      if (experimentId !== getExperimentId()) setExperimentId(experimentId);
   }, [params])

   return getScheduleRows();
}