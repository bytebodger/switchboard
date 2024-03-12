import { Clear } from '@mui/icons-material';
import { Button, ButtonBase, Chip, ListItem, Tooltip } from '@mui/material';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { ShowIf } from '../../../../common/components/ShowIf';
import { Color } from '../../../../common/enums/Color';
import { MessageTemplate } from '../../../../common/enums/MessageTemplate';
import { MessageVariable } from '../../../../common/enums/MessageVariable';
import { useLookup } from '../../../../common/hooks/useLookup';
import type { MessageTagUI } from '../../../../common/interfaces/messageTag/MessageTagUI';
import type { GenericFunction } from '../../../../common/types/GenericFunction';
import { useExperimentsStore } from '../../_hooks/useExperimentsStore';
import { useExperimentStore } from './useExperimentStore';
import { useExperimentTools } from './useExperimentTools';

export const useMessageTools = () => {
   const [
      getIsDisabled,
      getTagName,
   ] = useExperimentStore(state => [
      state.getIsDisabled,
      state.getTagName,
   ])
   const [
      getExperiments,
      getMessageTags,
   ] = useExperimentsStore(state => [
      state.getExperiments,
      state.getMessageTags,
   ]);
   const experimentTools = useExperimentTools();
   const lookup = useLookup();
   const { t: translate } = useTranslation();

   const getAvailableTags = (type: MessageTemplate, templateId: number, onClick: GenericFunction) => {
      let usedTags: string[];
      switch (type) {
         case MessageTemplate.email:
            usedTags = lookup.tagsByEmailTemplate(templateId).map(messageTag => messageTag.name);
            break;
         case MessageTemplate.inAppMessage:
            usedTags = lookup.tagsByInAppMessageTemplate(templateId).map(messageTag => messageTag.name);
            break;
         case MessageTemplate.text:
            usedTags = lookup.tagsByTextTemplate(templateId).map(messageTag => messageTag.name);
      }
      const availableTags = getMessageTags().filter(messageTag => !usedTags.includes(messageTag.name));
      return availableTags.filter(availableTag => availableTag.name.toLowerCase().includes(getTagName().toLowerCase()))
         .map(availableTag => {
            const { id, name } = availableTag;
            return (
               <div key={`tagName-${name}`}>
                  <Button
                     aria-label={name}
                     onClick={onClick}
                     sx={{ padding: 0.2 }}
                     value={id}
                  >
                     <Chip
                        color={'secondary'}
                        label={name}
                        size={'small'}
                        sx={{
                           cursor: 'pointer',
                           fontSize: 10,
                           textTransform: 'none',
                        }}
                     />
                  </Button>
               </div>
            )
         });
   }

   const getMaxDate = (experimentId: number) => {
      const experiment = getExperiments().find(experiment => experiment.id === experimentId);
      return dayjs(experiment?.endOn).utc(true);
   }

   const getTags = (type: MessageTemplate, templateId: number, onClick: GenericFunction) => {
      let usedTags: MessageTagUI[];
      switch (type) {
         case MessageTemplate.email:
            usedTags = lookup.tagsByEmailTemplate(templateId);
            break;
         case MessageTemplate.inAppMessage:
            usedTags = lookup.tagsByInAppMessageTemplate(templateId);
            break;
         case MessageTemplate.text:
            usedTags = lookup.tagsByTextTemplate(templateId);
      }
      return usedTags.map(tag => {
         const { id, name } = tag;
         return (
            <Chip
               color={getIsDisabled() ? 'default' : 'secondary'}
               key={`${type}TemplateTag-${name}`}
               label={
                  <>
                     <ShowIf condition={experimentTools.isEnabledPendingAndOwnedBy()}>
                        <Tooltip title={translate('Remove tag from this message template')}>
                           <ButtonBase
                              onClick={onClick}
                              value={id}
                           >
                              <Clear sx={{
                                 bottom: 1,
                                 fontSize: 14,
                                 marginRight: 1,
                                 position: 'relative',
                                 stroke: Color.white,
                                 strokeWidth: 2,
                              }}/>
                           </ButtonBase>
                        </Tooltip>
                     </ShowIf>
                     {name}
                  </>
               }
               size={'small'}
               sx={{
                  fontSize: 10,
                  marginRight: 1,
               }}
            />
         )
      })
   }

   const getVariables = () => Object.values(MessageVariable)
      .map(variable => (
         <ListItem
            key={variable}
            sx={{
               paddingBottom: 0.5,
               paddingLeft: 1,
               paddingTop: 0,
            }}
         >
            {variable}
         </ListItem>
      ))

   const getWeightPercent = (experimentId: number, weight: number) => {
      let totalWeight = 0;
      lookup.emailTemplatesByExperiment(experimentId)
         .forEach(experimentEmailTemplate => {
            if (experimentEmailTemplate.experimentId === experimentId)
               totalWeight += experimentEmailTemplate.weight;
         })
      lookup.inAppMessageTemplatesByExperiment(experimentId)
         .forEach(experimentInAppMessageTemplate => {
            if (experimentInAppMessageTemplate.experimentId === experimentId)
               totalWeight += experimentInAppMessageTemplate.weight;
         })
      lookup.textTemplatesByExperiment(experimentId)
         .forEach(experimentTextTemplate => {
            if (experimentTextTemplate.experimentId === experimentId)
               totalWeight += experimentTextTemplate.weight;
         })
      return totalWeight === weight ? '100' : ((weight / totalWeight) * 100).toFixed(1);
   }

   return {
      getAvailableTags,
      getMaxDate,
      getTags,
      getVariables,
      getWeightPercent,
   }
}