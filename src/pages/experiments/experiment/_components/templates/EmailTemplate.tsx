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
import { useEmailTemplateEndpoint } from '../../../../../common/hooks/endpoints/useEmailTemplateEndpoint';
import { useEmailTemplateTagEndpoint } from '../../../../../common/hooks/endpoints/useEmailTemplateTagEndpoint';
import { useBail } from '../../../../../common/hooks/useBail';
import { useUXStore } from '../../../../../common/hooks/useUXStore';
import type { EmailTemplateUI } from '../../../../../common/interfaces/emailTemplate/EmailTemplateUI';
import { useExperimentsStore } from '../../../_hooks/useExperimentsStore';
import { useExperimentTools } from '../../_hooks/useExperimentTools';
import { useMessageTools } from '../../_hooks/useMessageTools';
import { ExperimentMessageTagDialog } from '../dialogs/ExperimentMessageTagDialog';
import { useTemplateStore } from './_hooks/useTemplateStore';

interface Props {
   template: EmailTemplateUI,
}

export const EmailTemplate = ({ template }: Props) => {
   const [
      getEmailTemplates,
      getEmailTemplateTags,
      setEmailTemplates,
      setEmailTemplateTags,
   ] = useExperimentsStore(state => [
      state.getEmailTemplates,
      state.getEmailTemplateTags,
      state.setEmailTemplates,
      state.setEmailTemplateTags,
   ]);
   const [
      getHtmlBody,
      getSendOn,
      getSubject,
      getTextBody,
      getWeight,
      setHtmlBody,
      setSendOn,
      setSubject,
      setTextBody,
      setWeight,
   ] = useTemplateStore(state => [
      state.getHtmlBody,
      state.getSendOn,
      state.getSubject,
      state.getTextBody,
      state.getWeight,
      state.setHtmlBody,
      state.setSendOn,
      state.setSubject,
      state.setTextBody,
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
   const [bodyHelpOpen, setBodyHelpOpen] = useState(false);
   const [htmlEditorOpen, setHtmlEditorOpen] = useState(false);
   const [messageTagOpen, setMessageTagOpen] = useState(false);
   const [removed, setRemoved] = useState(false);
   const [textEditorOpen, setTextEditorOpen] = useState(false);
   const [updated, setUpdated] = useState(false);
   const [weightsHelpOpen, setWeightsHelpOpen] = useState(false);
   const bail = useBail();
   const emailTemplateEndpoint = useEmailTemplateEndpoint();
   const emailTemplateTagEndpoint = useEmailTemplateTagEndpoint();
   const experimentTools = useExperimentTools();
   const focusDiv = useRef<HTMLDivElement | null>(null);
   const messageTools = useMessageTools();
   const { t: translate } = useTranslation();

   const closeAddTags = () => setMessageTagOpen(false);

   const closeBodyHelpDialog = () => setBodyHelpOpen(false);

   const closeHtmlEditor = () => setHtmlEditorOpen(false);

   const closeErrorSnackbar = (_event?: SyntheticEvent | Event, reason?: string) => {
      reason !== 'clickaway' && setShowError(false);
   }

   const closeRemovedSnackbar = (_event?: SyntheticEvent | Event, reason?: string) => {
      reason !== 'clickaway' && setRemoved(false);
   }

   const closeTextEditor = () => setTextEditorOpen(false);

   const closeUpdatedSnackbar = (_event?: SyntheticEvent | Event, reason?: string) => {
      reason !== 'clickaway' && setUpdated(false);
   }

   const closeWeightsHelpDialog = () => setWeightsHelpOpen(false);

   const launchAddTags = () => setMessageTagOpen(true);

   const launchBodyHelpOpen = (event: MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();
      setBodyHelpOpen(true);
   }

   const launchHtmlEditor = () => {
      focusDiv.current?.focus();
      setHtmlEditorOpen(true);
   }

   const launchTextEditor = () => {
      focusDiv.current?.focus();
      setTextEditorOpen(true);
   }

   const launchWeightsHelpDialog = () => setWeightsHelpOpen(true);

   const removeTag = (event: MouseEvent<HTMLButtonElement>) => {
      (async () => {
         setShowLoading(true);
         const messageTagId = Number(event.currentTarget.value);
         const targetEmailTemplateTag = getEmailTemplateTags()
            .find(emailTemplateTag =>
               emailTemplateTag.emailTemplateId === template.id && emailTemplateTag.messageTagId === messageTagId
            );
         if (!targetEmailTemplateTag)
            return bail.out(`Could not find emailTemplateTag for emailTemplate #${template.id} and messageTag #${messageTagId}`);
         const { id } = targetEmailTemplateTag;
         const { status } = await emailTemplateTagEndpoint.delete(id);
         if (status !== HttpStatusCode.OK) return bail.out(`Could not remove tag #${id}`);
         setRemoved(true);
         const newEmailTemplateTags = getEmailTemplateTags().filter(emailTemplateTag => emailTemplateTag.id !== id);
         setEmailTemplateTags(newEmailTemplateTags);
         setShowLoading(false);
      })()
   }

   const saveHtmlBody = (newHtmlBody: string) => {
      closeHtmlEditor();
      setHtmlBody(newHtmlBody);
      updateEmailTemplate();
   }

   const saveSendOn = () => {
      const emailTemplate = getEmailTemplates().find(emailTemplate => emailTemplate.id === template.id);
      if (!emailTemplate) return;
      if (dayjs(emailTemplate.sendOn).utc(true).valueOf() === dayjs(getSendOn()).utc(true).valueOf()) return;
      updateEmailTemplate();
   }

   const saveSubject = () => {
      const emailTemplate = getEmailTemplates().find(emailTemplate => emailTemplate.id === template.id);
      if (!emailTemplate) return;
      if (emailTemplate.subject === getSubject()) return;
      updateEmailTemplate();
   }

   const saveTextBody = (newTextBody: string) => {
      closeTextEditor();
      setTextBody(newTextBody);
      updateEmailTemplate();
   }

   const updateEmailTemplate = () => {
      (async () => {
         setShowLoading(true);
         const index = getEmailTemplates().findIndex(emailTemplate => emailTemplate.id === template.id);
         if (index === -1) return bail.out(`Could not find email template #${template.id}`);
         const emailTemplates = getEmailTemplates();
         emailTemplates[index].htmlMessage = getHtmlBody();
         emailTemplates[index].message = getTextBody();
         emailTemplates[index].sendOn = dayjs(getSendOn()).utc(true).format(Format.dateTime);
         emailTemplates[index].subject = getSubject();
         emailTemplates[index].weight = getWeight();
         const { status } = await emailTemplateEndpoint.put(emailTemplates[index]);
         if (status !== HttpStatusCode.OK) return bail.out(['Could not update email template:', emailTemplates[index]]);
         setUpdated(true);
         setEmailTemplates(emailTemplates);
         setShowLoading(false);
      })()
   }

   const updateSendOn = (value: Dayjs | null, _context: FieldChangeHandlerContext<DateTimeValidationError>) => setSendOn(value);

   const updateSubject = (event: ChangeEvent<HTMLInputElement>) => setSubject(event.target.value.trimStart());

   const updateWeight = (event: ChangeEvent<HTMLInputElement>) => {
      (async () => {
         setShowLoading(true);
         let newWeight = Number(event.target.value);
         if (newWeight < 1) newWeight = 1;
         setWeight(newWeight);
         const index = getEmailTemplates().findIndex(emailTemplate => emailTemplate.id === template.id);
         if (index === -1) return bail.out(`Could not find email template #${template.id}`);
         const emailTemplates = getEmailTemplates();
         emailTemplates[index].weight = newWeight;
         const { status } = await emailTemplateEndpoint.put(emailTemplates[index]);
         if (status !== HttpStatusCode.OK) return bail.out(['Could not update email template:', emailTemplates[index]]);
         setUpdated(true);
         setEmailTemplates(emailTemplates);
         setShowLoading(false);
      })()
   }

   useEffect(() => {
      setHtmlBody(template.htmlMessage);
      setSendOn(dayjs(template.sendOn).utc(true));
      setSubject(template.subject);
      setTextBody(template.message);
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
         content={getTextBody()}
         onClose={closeTextEditor}
         onSave={saveTextBody}
         open={textEditorOpen}
         title={translate('Text Body')}
      />
      <CodeEditorDialog
         content={getHtmlBody()}
         onClose={closeHtmlEditor}
         onSave={saveHtmlBody}
         open={htmlEditorOpen}
         title={translate('HTML Body')}
      />
      <HelpDialog
         onClose={closeWeightsHelpDialog}
         open={weightsHelpOpen}
         topic={Topic.weights}
      />
      <HelpDialog
         onClose={closeBodyHelpDialog}
         open={bodyHelpOpen}
         topic={Topic.bodyFields}
      />
      <ExperimentMessageTagDialog
         onClose={closeAddTags}
         open={messageTagOpen}
         template={template}
         type={MessageTemplate.email}
      />
      <Row>
         <Column xs={10}>
            <Row>
               <Column xs={12}>
                  <TextField
                     aria-label={translate('Subject')}
                     disabled={!experimentTools.isEnabledPendingAndOwnedBy()}
                     error={experimentTools.isEnabledPendingAndOwnedBy() && !getSubject()}
                     label={translate('Subject')}
                     name={'subject-body-field'}
                     onBlur={saveSubject}
                     onChange={updateSubject}
                     required={true}
                     size={'small'}
                     sx={{ width: '100%' }}
                     value={getSubject()}
                  />
               </Column>
            </Row>
            <Row>
               <Column xs={6}>
                  <TextField
                     aria-label={translate('Text Body')}
                     disabled={!experimentTools.isEnabledPendingAndOwnedBy()}
                     error={experimentTools.isEnabledPendingAndOwnedBy() && !getTextBody()}
                     inputProps={{ readOnly: true }}
                     label={
                        <>
                           <TranslatedText text={'Text Body'}/>
                           <Tooltip title={translate('Help on Body Fields')}>
                              <Button
                                 aria-label={translate('Help on Body Fields')}
                                 onClick={launchBodyHelpOpen}
                                 sx={{
                                    bottom: 6,
                                    maxHeight: 8,
                                    minWidth: 0,
                                    paddingLeft: 0.3,
                                    paddingRight: 0,
                                    position: 'relative',
                                 }}
                              >
                                 <HelpOutlined sx={{
                                    color: Color.orange,
                                    fontSize: '1em',
                                 }}/>
                              </Button>
                           </Tooltip>
                        </>
                     }
                     multiline={true}
                     name={'text-body-field'}
                     onClick={launchTextEditor}
                     onFocus={launchTextEditor}
                     required={true}
                     rows={10}
                     size={'small'}
                     sx={{ width: '100%' }}
                     value={getTextBody()}
                  />
               </Column>
               <Column xs={6}>
                  <TextField
                     aria-label={translate('HTML Body')}
                     disabled={!experimentTools.isEnabledPendingAndOwnedBy()}
                     error={experimentTools.isEnabledPendingAndOwnedBy() && !getHtmlBody()}
                     inputProps={{ readOnly: true }}
                     label={
                        <>
                           <TranslatedText text={'HTML Body'}/>
                           <Tooltip title={translate('Help on Body Fields')}>
                              <Button
                                 aria-label={translate('Help on Body Fields')}
                                 onClick={launchBodyHelpOpen}
                                 sx={{
                                    bottom: 6,
                                    maxHeight: 8,
                                    minWidth: 0,
                                    paddingLeft: 0.3,
                                    paddingRight: 0,
                                    position: 'relative',
                                 }}
                              >
                                 <HelpOutlined sx={{
                                    color: Color.orange,
                                    fontSize: '1em',
                                 }}/>
                              </Button>
                           </Tooltip>
                        </>
                     }
                     multiline={true}
                     name={'html-body-field'}
                     onClick={launchHtmlEditor}
                     onFocus={launchHtmlEditor}
                     required={true}
                     rows={10}
                     size={'small'}
                     sx={{ width: '100%' }}
                     value={getHtmlBody()}
                  />
               </Column>
            </Row>
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
      <Row
         columnSpacing={0}
         rowSpacing={0}
      >
         <Column xs={12}>
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
                     {messageTools.getTags(MessageTemplate.email, template.id, removeTag)}
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
                        onClick={launchWeightsHelpDialog}
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