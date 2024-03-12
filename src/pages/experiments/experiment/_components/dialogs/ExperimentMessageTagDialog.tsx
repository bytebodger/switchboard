import { Box, Button, TextField } from '@mui/material';
import dayjs from 'dayjs';
import type { ChangeEvent, MouseEvent, SyntheticEvent } from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Loading } from '../../../../../app/components/Loading';
import { useEndpointStore } from '../../../../../app/hooks/useEndpointStore';
import { DefaultSnackbar } from '../../../../../common/components/DefaultSnackbar';
import { ShowIf } from '../../../../../common/components/ShowIf';
import { SlidingDialog } from '../../../../../common/components/SlidingDialog';
import { TranslatedText } from '../../../../../common/components/TranslatedText';
import { Format } from '../../../../../common/enums/Format';
import { HttpStatusCode } from '../../../../../common/enums/HttpStatusCode';
import { MessageTemplate } from '../../../../../common/enums/MessageTemplate';
import { getNumber } from '../../../../../common/functions/getNumber';
import { parseApiId } from '../../../../../common/functions/parseApiId';
import { useEmailTemplateTagEndpoint } from '../../../../../common/hooks/endpoints/useEmailTemplateTagEndpoint';
import { useInAppMessageTemplateTagEndpoint } from '../../../../../common/hooks/endpoints/useInAppMessageTemplateTagEndpoint';
import { useMessageTagEndpoint } from '../../../../../common/hooks/endpoints/useMessageTagEndpoint';
import { useTextTemplateTagEndpoint } from '../../../../../common/hooks/endpoints/useTextTemplateTagEndpoint';
import { useBail } from '../../../../../common/hooks/useBail';
import { useUXStore } from '../../../../../common/hooks/useUXStore';
import type { EmailTemplateUI } from '../../../../../common/interfaces/emailTemplate/EmailTemplateUI';
import type { InAppMessageTemplateUI } from '../../../../../common/interfaces/inAppMessageTemplate/InAppMessageTemplateUI';
import type { TextTemplateUI } from '../../../../../common/interfaces/textTemplate/TextTemplateUI';
import type { GenericFunction } from '../../../../../common/types/GenericFunction';
import { useExperimentsStore } from '../../../_hooks/useExperimentsStore';
import { useExperimentStore } from '../../_hooks/useExperimentStore';
import { useMessageTools } from '../../_hooks/useMessageTools';

interface Props {
   onClose: GenericFunction,
   open: boolean,
   template: EmailTemplateUI | InAppMessageTemplateUI | TextTemplateUI,
   type: MessageTemplate,
}

export const ExperimentMessageTagDialog = ({ onClose, open, template, type }: Props) => {
   const [getUser] = useEndpointStore(state => [state.getUser]);
   const [
      getTagName,
      setTagName,
   ] = useExperimentStore(state => [
      state.getTagName,
      state.setTagName,
   ])
   const [
      getEmailTemplateTags,
      getInAppMessageTemplateTags,
      getMessageTags,
      getTextTemplateTags,
      setEmailTemplateTags,
      setInAppMessageTemplateTags,
      setMessageTags,
      setTextTemplateTags,
   ] = useExperimentsStore(state => [
      state.getEmailTemplateTags,
      state.getInAppMessageTemplateTags,
      state.getMessageTags,
      state.getTextTemplateTags,
      state.setEmailTemplateTags,
      state.setInAppMessageTemplateTags,
      state.setMessageTags,
      state.setTextTemplateTags,
   ]);
   const [
      getShowError,
      getShowLoading,
      setShowError,
      setShowLoading,
   ] = useUXStore(state => [
      state.getShowError,
      state.getShowLoading,
      state.setShowError,
      state.setShowLoading,
   ]);
   const [added, setAdded] = useState(false);
   const bail = useBail();
   const emailTemplateTagEndpoint = useEmailTemplateTagEndpoint();
   const inAppMessageTemplateTagEndpoint = useInAppMessageTemplateTagEndpoint();
   const messageTools = useMessageTools();
   const messageTagEndpoint = useMessageTagEndpoint();
   const textTemplateTagEndpoint = useTextTemplateTagEndpoint();
   const { t: translate } = useTranslation();

   const addTag = (passedValue: MouseEvent<HTMLButtonElement> | number) => {
      (async () => {
         setShowLoading(true);
         closeAddTags();
         const messageTagId = typeof passedValue === 'number' ? passedValue : Number(passedValue.currentTarget.value);
         let result;
         switch (type) {
            case MessageTemplate.email:
               result = await emailTemplateTagEndpoint.post(template.id, messageTagId);
               break;
            case MessageTemplate.inAppMessage:
               result = await inAppMessageTemplateTagEndpoint.post(template.id, messageTagId);
               break;
            case MessageTemplate.text:
               result = await textTemplateTagEndpoint.post(template.id, messageTagId);
         }
         const { data, status } = result;
         if (status !== HttpStatusCode.created)
            return bail.out(`Could not create tag relationship for ${type} template #${template.id} and messageTag #${messageTagId}`);
         setAdded(true);
         const newTemplateTagId = parseApiId(data);
         const userId = getNumber(getUser()?.id);
         const currentDate = dayjs().utc().format(Format.dateTime);
         switch (type) {
            case MessageTemplate.email: {
               const emailTemplateTags = getEmailTemplateTags();
               emailTemplateTags.push({
                  emailTemplateId: template.id,
                  id: newTemplateTagId,
                  messageTagId,
               })
               setEmailTemplateTags(emailTemplateTags);
               break;
            }
            case MessageTemplate.inAppMessage: {
               const inAppMessageTemplateTags = getInAppMessageTemplateTags();
               inAppMessageTemplateTags.push({
                  createdBy: userId,
                  createdOn: currentDate,
                  id: newTemplateTagId,
                  inAppMessageTemplateId: template.id,
                  messageTagId,
                  modifiedBy: userId,
                  modifiedOn: currentDate,
               })
               setInAppMessageTemplateTags(inAppMessageTemplateTags);
               break;
            }
            case MessageTemplate.text: {
               const textTemplateTags = getTextTemplateTags();
               textTemplateTags.push({
                  createdBy: userId,
                  createdOn: currentDate,
                  id: newTemplateTagId,
                  textTemplateId: template.id,
                  messageTagId,
                  modifiedBy: userId,
                  modifiedOn: currentDate,
               })
               setTextTemplateTags(textTemplateTags);
            }
         }
         setShowLoading(false);
      })()
   }

   const closeAddedSnackbar = (_event?: SyntheticEvent | Event, reason?: string) => {
      reason !== 'clickaway' && setAdded(false);
   }

   const closeAddTags = () => {
      setTagName('');
      onClose();
   }

   const closeErrorSnackbar = (_event?: SyntheticEvent | Event, reason?: string) => {
      reason !== 'clickaway' && setShowError(false);
   }

   const createTag = () => {
      (async () => {
         setShowLoading(true);
         const tagName = getTagName();
         closeAddTags();
         const { data, status } = await messageTagEndpoint.post(tagName, tagName);
         if (status !== HttpStatusCode.created) return bail.out(['Could not create tag:', tagName]);
         const newMessageTagId = parseApiId(data);
         const messageTags = getMessageTags();
         messageTags.push({
            description: tagName,
            id: newMessageTagId,
            name: tagName,
         })
         setMessageTags(messageTags);
         addTag(newMessageTagId);
      })()
   }

   const getAddActions = () => {
      const isDuplicate = getMessageTags().some(messageTag => messageTag.name.toLowerCase() === getTagName().toLowerCase());
      return (
         <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
         }}>
            <Box sx={{ display: 'inline' }}>
               <ShowIf condition={getTagName().length > 1 && !isDuplicate}>
                  <Button
                     aria-label={translate('Create new Message tag')}
                     onClick={createTag}
                     variant={'outlined'}
                  >
                     <TranslatedText text={'Create new Message tag'}/>
                  </Button>
               </ShowIf>
            </Box>
            <Button
               aria-label={translate('Cancel')}
               onClick={closeAddTags}
               variant={'outlined'}
            >
               <TranslatedText text={'Cancel'}/>
            </Button>
         </Box>
      )
   }

   const getAddContent = () => <>
      <TextField
         aria-label={translate('Message Tag Name')}
         inputRef={input => input?.focus()}
         label={translate('Message Tag Name')}
         name={'message-tag-name-field'}
         onChange={updateTagName}
         required={true}
         size={'small'}
         sx={{
            marginBottom: 1,
            marginTop: 1,
            width: '100%',
         }}
         value={getTagName()}
      />
      <Box sx={{
         height: '25vh',
         minHeight: '25vh',
         minWidth: '25vw',
         overflow: 'auto',
      }}>
         <ShowIf condition={!!getTagName()}>
            {messageTools.getAvailableTags(type, template.id, addTag)}
         </ShowIf>
      </Box>
   </>

   const updateTagName = (event: ChangeEvent<HTMLInputElement>) => setTagName(event.target.value.trimStart());

   return <>
      <Loading open={getShowLoading()}/>
      <DefaultSnackbar
         onClose={closeAddedSnackbar}
         open={added}
         severity={'success'}
         text={'The message tag has been added.'}
      />
      <DefaultSnackbar
         onClose={closeErrorSnackbar}
         open={getShowError()}
         severity={'error'}
         text={'An error occurred.'}
      />
      <SlidingDialog
         actions={getAddActions()}
         content={getAddContent()}
         onClose={closeAddTags}
         open={open}
         title={translate('Add message tags')}
      />
   </>
}