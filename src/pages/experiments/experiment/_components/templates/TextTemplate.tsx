import { AddCircle, HelpOutlined } from '@mui/icons-material';
import { Box, Button, TextField, Tooltip, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import type { DateTimeValidationError } from '@mui/x-date-pickers';
import { MobileDateTimePicker } from '@mui/x-date-pickers';
import type { FieldChangeHandlerContext } from '@mui/x-date-pickers/internals';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import type { ChangeEvent, MouseEvent, SyntheticEvent } from 'react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Loading } from '../../../../../app/components/Loading';
import { CodeEditorDialog } from '../../../../../common/components/CodeEditorDialog';
import { Column } from '../../../../../common/components/Column';
import { DefaultSnackbar } from '../../../../../common/components/DefaultSnackbar';
import { HelpDialog } from '../../../../../common/components/HelpDialog';
import { RestrictAccess } from '../../../../../common/components/RestrictAccess';
import { Row } from '../../../../../common/components/Row';
import { ShowIf } from '../../../../../common/components/ShowIf';
import { TranslatedText } from '../../../../../common/components/TranslatedText';
import { accessKey } from '../../../../../common/constants/accessKey';
import { Color } from '../../../../../common/enums/Color';
import { Format } from '../../../../../common/enums/Format';
import { HttpStatusCode } from '../../../../../common/enums/HttpStatusCode';
import { MessageTemplate } from '../../../../../common/enums/MessageTemplate';
import { Topic } from '../../../../../common/enums/Topic';
import { useTextTemplateEndpoint } from '../../../../../common/hooks/endpoints/useTextTemplateEndpoint';
import { useTextTemplateTagEndpoint } from '../../../../../common/hooks/endpoints/useTextTemplateTagEndpoint';
import { useBail } from '../../../../../common/hooks/useBail';
import { useUXStore } from '../../../../../common/hooks/useUXStore';
import type { TextTemplateUI } from '../../../../../common/interfaces/textTemplate/TextTemplateUI';
import { useExperimentsStore } from '../../../_hooks/useExperimentsStore';
import { useExperimentTools } from '../../_hooks/useExperimentTools';
import { useMessageTools } from '../../_hooks/useMessageTools';
import { ExperimentMessageTagDialog } from '../dialogs/ExperimentMessageTagDialog';
import { useTemplateStore } from './_hooks/useTemplateStore';

interface Props {
   template: TextTemplateUI,
}

export const TextTemplate = ({ template }: Props) => {
   const [
      getTextTemplateTags,
      getTextTemplates,
      setTextTemplateTags,
      setTextTemplates,
   ] = useExperimentsStore(state => [
      state.getTextTemplateTags,
      state.getTextTemplates,
      state.setTextTemplateTags,
      state.setTextTemplates,
   ]);
   const [
      getMessage,
      getSendOn,
      getWeight,
      setMessage,
      setSendOn,
      setWeight,
   ] = useTemplateStore(state => [
      state.getMessage,
      state.getSendOn,
      state.getWeight,
      state.setMessage,
      state.setSendOn,
      state.setWeight,
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
   const [helpOpen, setHelpOpen] = useState(false);
   const [messageEditorOpen, setMessageEditorOpen] = useState(false);
   const [open, setOpen] = useState(false);
   const [removed, setRemoved] = useState(false);
   const [updated, setUpdated] = useState(false);
   const bail = useBail();
   const experimentTools = useExperimentTools();
   const focusDiv = useRef<HTMLDivElement | null>(null);
   const messageTools = useMessageTools();
   const textTemplateEndpoint = useTextTemplateEndpoint();
   const textTemplateTagEndpoint = useTextTemplateTagEndpoint();
   const { t: translate } = useTranslation();

   const closeAddTags = () => setOpen(false);

   const closeErrorSnackbar = (_event?: SyntheticEvent | Event, reason?: string) => {
      reason !== 'clickaway' && setShowError(false);
   }

   const closeHelpDialog = () => setHelpOpen(false);

   const closeMessageEditor = () => setMessageEditorOpen(false);

   const closeRemovedSnackbar = (_event?: SyntheticEvent | Event, reason?: string) => {
      reason !== 'clickaway' && setRemoved(false);
   }

   const closeUpdatedSnackbar = (_event?: SyntheticEvent | Event, reason?: string) => {
      reason !== 'clickaway' && setUpdated(false);
   }

   const launchAddTags = () => setOpen(true);

   const launchHelpDialog = () => setHelpOpen(true);

   const removeTag = (event: MouseEvent<HTMLButtonElement>) => {
      (async () => {
         setShowLoading(true);
         const messageTagId = Number(event.currentTarget.value);
         const targetTextTemplateTag = getTextTemplateTags()
            .find(textTemplateTag =>
               textTemplateTag.textTemplateId === template.id && textTemplateTag.messageTagId === messageTagId
            );
         if (!targetTextTemplateTag)
            return bail.out(`Could not find textTemplateTag for textTemplate #${template.id} and messageTag #${messageTagId}`);
         const { status } = await textTemplateTagEndpoint.delete(targetTextTemplateTag.id);
         if (status !== HttpStatusCode.OK) return bail.out(`Could not remove tag #${targetTextTemplateTag.id}`);
         setRemoved(true);
         const newTextTemplateTags = getTextTemplateTags()
            .filter(textTemplateTag => textTemplateTag.id !== targetTextTemplateTag.id);
         setTextTemplateTags(newTextTemplateTags);
         setShowLoading(false);
      })()
   }

   const saveMessage = (newMessage: string) => {
      closeMessageEditor();
      setMessage(newMessage);
      updateTextTemplate();
   }

   const saveSendOn = () => {
      const textTemplate = getTextTemplates().find(textTemplate => textTemplate.id === template.id);
      if (!textTemplate) return;
      if (dayjs(textTemplate.sendOn).utc(true).valueOf() === dayjs(getSendOn()).valueOf()) return;
      updateTextTemplate();
   }

   const updateTextTemplate = () => {
      (async () => {
         setShowLoading(true);
         const index = getTextTemplates().findIndex(textTemplate => textTemplate.id === template.id);
         if (index === -1) return bail.out(`Could not find text template #${template.id}`);
         const textTemplates = getTextTemplates();
         textTemplates[index].message = getMessage();
         textTemplates[index].sendOn = dayjs(getSendOn()).utc(true).format(Format.dateTime);
         textTemplates[index].weight = getWeight();
         const { status } = await textTemplateEndpoint.put(textTemplates[index]);
         if (status !== HttpStatusCode.OK) return bail.out(['Could not update text template:', textTemplates[index]]);
         setUpdated(true);
         setTextTemplates(textTemplates);
         setShowLoading(false);
      })()
   }

   const updateMessage = (event: ChangeEvent<HTMLInputElement>) => setMessage(event.target.value.trimStart());

   const updateSendOn = (value: Dayjs | null, _context: FieldChangeHandlerContext<DateTimeValidationError>) => setSendOn(value);

   const updateWeight = (event: ChangeEvent<HTMLInputElement>) => {
      (async () => {
         setShowLoading(true);
         let newWeight = Number(event.target.value);
         if (newWeight < 1) newWeight = 1;
         setWeight(newWeight);
         const index = getTextTemplates().findIndex(textTemplate => textTemplate.id === template.id);
         if (index === -1) return bail.out(`Could not find text template #${template.id}`);
         const textTemplates = getTextTemplates();
         textTemplates[index].weight = newWeight;
         const { status } = await textTemplateEndpoint.put(textTemplates[index]);
         if (status !== HttpStatusCode.OK) return bail.out(['Could not update text template:', textTemplates[index]]);
         setUpdated(true);
         setTextTemplates(textTemplates);
         setShowLoading(false);
      })()
   }

   useEffect(() => {
      setMessage(template.message);
      setSendOn(dayjs(template.sendOn).utc(true));
      setWeight(template.weight);
   }, [template]);

   return <>
      <div
         tabIndex={-1}
         ref={focusDiv}
      />
      <Loading open={getShowLoading()}/>
      <DefaultSnackbar
         onClose={closeUpdatedSnackbar}
         open={updated}
         severity={'success'}
         text={'The message template has been updated.'}
      />
      <DefaultSnackbar
         onClose={closeRemovedSnackbar}
         open={removed}
         severity={'success'}
         text={'The message tag has been removed.'}
      />
      <DefaultSnackbar
         onClose={closeErrorSnackbar}
         open={getShowError()}
         severity={'error'}
         text={'An error occurred.'}
      />
      <CodeEditorDialog
         content={getMessage()}
         onClose={closeMessageEditor}
         onSave={saveMessage}
         open={messageEditorOpen}
         title={translate('Message')}
      />
      <HelpDialog
         onClose={closeHelpDialog}
         open={helpOpen}
         topic={Topic.weights}
      />
      <ExperimentMessageTagDialog
         onClose={closeAddTags}
         open={open}
         template={template}
         type={MessageTemplate.text}
      />
      <Row
         columnSpacing={0}
         rowSpacing={0}
      >
         <Column xs={12}>
            <Row>
               <Column xs={10}>
                  <TextField
                     aria-label={translate('Message')}
                     disabled={!experimentTools.isEnabledPendingAndOwnedBy()}
                     error={experimentTools.isEnabledPendingAndOwnedBy() && !getMessage()}
                     inputProps={{ readOnly: true }}
                     label={translate('Message')}
                     multiline={true}
                     name={'message-field'}
                     onChange={updateMessage}
                     required={true}
                     rows={10}
                     size={'small'}
                     sx={{ width: '100%' }}
                     value={getMessage()}
                  />
               </Column>
               <Column xs={2}>
                  <Box>
                     <TranslatedText text={'Variables'}/>:
                     <List sx={{ fontSize: '0.7em' }}>
                        {messageTools.getVariables()}
                     </List>
                  </Box>
               </Column>
            </Row>
            <Row>
               <Column
                  sx={{
                     paddingBottom: 3,
                     paddingLeft: 3,
                  }}
                  xs={12} sm={12} md={12} lg={12} xl={10}
               >
                  <Typography variant={'caption'}>
                     <TranslatedText text={'Message Tags'}/>
                  </Typography>
                  <RestrictAccess accessKey={accessKey.experimentAddMessageTags}>
                     <ShowIf condition={experimentTools.isEnabledPendingAndOwnedBy()}>
                        <Tooltip title={translate('Add message tags')}>
                           <IconButton
                              aria-label={translate('Add message tags')}
                              onClick={launchAddTags}
                           >
                              <AddCircle sx={{
                                 bottom: 2,
                                 color: Color.greenTemplate,
                                 fontSize: 16,
                                 position: 'relative',
                                 stroke: Color.white,
                              }}/>
                           </IconButton>
                        </Tooltip>
                     </ShowIf>
                  </RestrictAccess>
                  <Box>
                     {messageTools.getTags(MessageTemplate.text, template.id, removeTag)}
                  </Box>
               </Column>
            </Row>
            <Row>
               <Column xs={6}>
                  <TextField
                     aria-label={translate('Weight')}
                     disabled={!experimentTools.isEnabledPendingAndOwnedBy() || experimentTools.getTotalTemplates() === 1}
                     label={translate('Weight')}
                     name={'weight-field'}
                     onChange={updateWeight}
                     required={true}
                     size={'small'}
                     sx={{ width: 100 }}
                     type={'number'}
                     value={getWeight()}
                  />
                  <span style={{
                     paddingLeft: 10,
                     position: 'relative',
                     top: 8,
                  }}>
                     ({messageTools.getWeightPercent(template.experimentId, template.weight)}%)
                  </span>
                  <Tooltip title={translate('Help on Weights')}>
                     <Button
                        aria-label={translate('Help on Weights')}
                        onClick={launchHelpDialog}
                        sx={{
                           marginRight: 2,
                           maxHeight: 8,
                           minWidth: 0,
                           paddingBottom: 0.2,
                           paddingLeft: 0.3,
                           paddingRight: 0,
                           paddingTop: 0.2,
                        }}
                     >
                        <HelpOutlined sx={{
                           color: Color.orange,
                           fontSize: '1em',
                        }}/>
                     </Button>
                  </Tooltip>
               </Column>
               <Column xs={6}>
                  <Box sx={{
                     display: 'flex',
                     justifyContent: 'space-between',
                  }}>
                     <Box>
                        <MobileDateTimePicker
                           ampm={false}
                           aria-label={translate('Send On')}
                           disabled={!experimentTools.isEnabledPendingAndOwnedBy()}
                           format={Format.dateTime}
                           label={`${translate('Send On')} *`}
                           maxDate={messageTools.getMaxDate(template.experimentId)}
                           minDate={dayjs().utc().add(1, 'hour')}
                           minDateTime={dayjs().utc().add(1, 'hour')}
                           minTime={dayjs().utc().add(1, 'hour')}
                           onChange={updateSendOn}
                           onClose={saveSendOn}
                           slotProps={{ textField: { error: false } }}
                           value={getSendOn()}
                        />
                        <span style={{
                           paddingLeft: 10,
                           position: 'relative',
                           top: 16,
                        }}>
                           <TranslatedText text={'UTC'}/>
                        </span>
                     </Box>
                  </Box>
               </Column>
            </Row>
         </Column>
      </Row>
   </>
}