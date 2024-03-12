import { AddCircle, DeleteForeverOutlined, HelpOutlined, SaveOutlined } from '@mui/icons-material';
import { Accordion, AccordionDetails, AccordionSummary, Button, TextField, Tooltip, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import dayjs from 'dayjs';
import type { ChangeEvent, MouseEvent, SyntheticEvent } from 'react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { Loading } from '../../../../../app/components/Loading';
import { Column } from '../../../../../common/components/Column';
import { DefaultSnackbar } from '../../../../../common/components/DefaultSnackbar';
import { HelpDialog } from '../../../../../common/components/HelpDialog';
import { RestrictAccess } from '../../../../../common/components/RestrictAccess';
import { Row } from '../../../../../common/components/Row';
import { ShowIf } from '../../../../../common/components/ShowIf';
import { TranslatedText } from '../../../../../common/components/TranslatedText';
import { accessKey } from '../../../../../common/constants/accessKey';
import { component } from '../../../../../common/constants/component';
import { Color } from '../../../../../common/enums/Color';
import { Format } from '../../../../../common/enums/Format';
import { HttpStatusCode } from '../../../../../common/enums/HttpStatusCode';
import { MessageTemplate } from '../../../../../common/enums/MessageTemplate';
import { Path } from '../../../../../common/enums/Path';
import { Topic } from '../../../../../common/enums/Topic';
import { compareInAppMessageTemplates } from '../../../../../common/functions/compareInAppMessageTemplates';
import { compareTextTemplates } from '../../../../../common/functions/compareTextTemplates';
import { getNumber } from '../../../../../common/functions/getNumber';
import { getString } from '../../../../../common/functions/getString';
import { useEmailTemplateEndpoint } from '../../../../../common/hooks/endpoints/useEmailTemplateEndpoint';
import { useExperimentEndpoint } from '../../../../../common/hooks/endpoints/useExperimentEndpoint';
import { useInAppMessageTemplateEndpoint } from '../../../../../common/hooks/endpoints/useInAppMessageTemplateEndpoint';
import { useTextTemplateEndpoint } from '../../../../../common/hooks/endpoints/useTextTemplateEndpoint';
import { useBail } from '../../../../../common/hooks/useBail';
import { useLookup } from '../../../../../common/hooks/useLookup';
import { useUXStore } from '../../../../../common/hooks/useUXStore';
import { useViewport } from '../../../../../common/hooks/useViewport';
import type { EmailTemplateUI } from '../../../../../common/interfaces/emailTemplate/EmailTemplateUI';
import type { ExperimentUI } from '../../../../../common/interfaces/experiment/ExperimentUI';
import { local } from '../../../../../common/libraries/local';
import { log } from '../../../../../common/libraries/log';
import type { GenericObject } from '../../../../../common/types/GenericObject';
import { useExperimentsStore } from '../../../_hooks/useExperimentsStore';
import { useExperimentStore } from '../../_hooks/useExperimentStore';
import { useExperimentTools } from '../../_hooks/useExperimentTools';
import { ExperimentMessageTemplateDialog } from '../dialogs/ExperimentMessageTemplateDialog';
import { EmailTemplate } from '../templates/EmailTemplate';
import { InAppMessageTemplate } from '../templates/InAppMessageTemplate';
import { TextTemplate } from '../templates/TextTemplate';

export const ExperimentTemplatesTab = () => {
   const [
      getExperimentId,
      getIsDisabled,
      getSendFrom,
      getSendFromName,
      setAddButton,
      setExperimentId,
      setSendFrom,
      setSendFromName,
   ] = useExperimentStore(state => [
      state.getExperimentId,
      state.getIsDisabled,
      state.getSendFrom,
      state.getSendFromName,
      state.setAddButton,
      state.setExperimentId,
      state.setSendFrom,
      state.setSendFromName,
   ]);
   const [
      getEmailTemplates,
      getExperiments,
      getInAppMessageTemplates,
      getTextTemplates,
      setEmailTemplates,
      setExperiments,
      setInAppMessageTemplates,
      setTextTemplates,
   ] = useExperimentsStore(state => [
      state.getEmailTemplates,
      state.getExperiments,
      state.getInAppMessageTemplates,
      state.getTextTemplates,
      state.setEmailTemplates,
      state.setExperiments,
      state.setInAppMessageTemplates,
      state.setTextTemplates,
   ])
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
   const [accordionOpen, setAccordionOpen] = useState<GenericObject>({});
   const [deleted, setDeleted] = useState(false);
   const [open, setOpen] = useState(false);
   const [sendFromHelpOpen, setSendFromHelpOpen] = useState(false);
   const [updated, setUpdated] = useState(false);
   const [utcHelpOpen, setUtcHelpOpen] = useState(false);
   const bail = useBail();
   const emailTemplateEndpoint = useEmailTemplateEndpoint();
   const experimentEndpoint = useExperimentEndpoint();
   const experimentTools = useExperimentTools();
   const inAppMessageTemplateEndpoint = useInAppMessageTemplateEndpoint();
   const lookup = useLookup();
   const navigate = useNavigate();
   const params = useParams();
   const textTemplateEndpoint = useTextTemplateEndpoint();
   const thisExperiment = useRef<ExperimentUI | null>(null);
   const viewport = useViewport();
   const { t: translate } = useTranslation();

   const closeAddMessageTemplate = () => setOpen(false);

   const closeDeletedSnackbar = (_event?: SyntheticEvent | Event, reason?: string) => {
      reason !== 'clickaway' && setDeleted(false);
   }

   const closeErrorSnackbar = (_event?: SyntheticEvent | Event, reason?: string) => {
      reason !== 'clickaway' && setShowError(false);
   }

   const closeSendFromHelpDialog = () => setSendFromHelpOpen(false);

   const closeUpdatedSnackbar = (_event?: SyntheticEvent | Event, reason?: string) => {
      reason !== 'clickaway' && setUpdated(false);
   }

   const closeUtcHelpDialog = () => setUtcHelpOpen(false);

   const compareEmailTemplates = (a: EmailTemplateUI, b: EmailTemplateUI) => a.id - b.id;

   const deleteEmailTemplate = (event: MouseEvent<HTMLButtonElement>) => {
      (async () => {
         setShowLoading(true);
         const emailTemplateId = Number(event.currentTarget.value);
         const { status } = await emailTemplateEndpoint.delete(emailTemplateId);
         if (status !== HttpStatusCode.OK) return bail.out(`Could not delete email template #${emailTemplateId}`);
         setDeleted(true);
         const newEmailTemplates = getEmailTemplates().filter(emailTemplate => emailTemplate.id !== emailTemplateId);
         setEmailTemplates(newEmailTemplates);
         setShowLoading(false);
      })()
   }

   const deleteInAppMessageTemplate = (event: MouseEvent<HTMLButtonElement>) => {
      (async () => {
         setShowLoading(true);
         const inAppMessageTemplateId = Number(event.currentTarget.value);
         const { status } = await inAppMessageTemplateEndpoint.delete(inAppMessageTemplateId);
         if (status !== HttpStatusCode.OK) return bail.out(`Could not delete in-app message template #${inAppMessageTemplateId}`);
         setDeleted(true);
         const newInAppMessageTemplates = getInAppMessageTemplates()
            .filter(inAppMessageTemplate => inAppMessageTemplate.id !== inAppMessageTemplateId);
         setInAppMessageTemplates(newInAppMessageTemplates);
         setShowLoading(false);
      })()
   }

   const deleteTextTemplate = (event: MouseEvent<HTMLButtonElement>) => {
      (async () => {
         setShowLoading(true);
         const textTemplateId = Number(event.currentTarget.value);
         const { status } = await textTemplateEndpoint.delete(textTemplateId);
         if (status !== HttpStatusCode.OK) return bail.out(`Could not delete text template #${textTemplateId}`);
         setDeleted(true);
         const newTextTemplates = getTextTemplates().filter(textTemplate => textTemplate.id !== textTemplateId);
         setTextTemplates(newTextTemplates);
         setShowLoading(false);
      })()
   }

   const formChangesAreUnsaved = () => {
      const experiment = thisExperiment.current;
      return getSendFrom() !== experiment?.sendFrom || getSendFromName() !== experiment?.sendFromName;
   }

   const getEmailTemplateAccordions = () => getExperimentEmailTemplates().map(emailTemplate => {
      const { id } = emailTemplate;
      return (
         <Row key={`emailTemplate-${id}`}>
            <Column
               sx={{ paddingRight: 0 }}
               xs={11}
            >
               <Accordion
                  aria-label={translate('Email Templates')}
                  expanded={!!accordionOpen[`email-${id}`]}
                  onChange={toggleAccordion(id, MessageTemplate.email)}
               >
                  <AccordionSummary
                     aria-label={`${translate('Email Template')} #{index + 1}`}
                     aria-controls={`emailTemplate${id}-content`}
                     expandIcon={component.expandMore}
                     id={`emailTemplate${id}-header`}
                  >
                     <Typography sx={{
                        flexShrink: 0,
                        width: '33%',
                     }}>
                        <TranslatedText text={'ID'}/> #{id}: <TranslatedText text={'Email Template'}/>
                     </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                     <EmailTemplate template={emailTemplate}/>
                  </AccordionDetails>
               </Accordion>
            </Column>
            <Column
               sx={{ paddingLeft: 0 }}
               xs={1}
            >
               <RestrictAccess accessKey={accessKey.experimentDeleteTemplate}>
                  <ShowIf condition={experimentTools.isEnabledPendingAndOwnedBy()}>
                     <Tooltip title={translate('Delete')}>
                        <span>
                           <IconButton
                              aria-label={translate('Delete')}
                              disabled={getIsDisabled()}
                              onClick={deleteEmailTemplate}
                              sx={{ color: Color.red }}
                              value={id}
                           >
                              <DeleteForeverOutlined/>
                           </IconButton>
                        </span>
                     </Tooltip>
                  </ShowIf>
               </RestrictAccess>
            </Column>
         </Row>
      )
   })

   const getExperimentEmailTemplates = () => getEmailTemplates()
      .sort(compareEmailTemplates)
      .filter(emailTemplate => emailTemplate.experimentId === getExperimentId());

   const getExperimentInAppMessageTemplates = () => getInAppMessageTemplates()
      .sort(compareInAppMessageTemplates)
      .filter(inAppMessageTemplate => inAppMessageTemplate.experimentId === getExperimentId());

   const getExperimentTextTemplates = () => getTextTemplates()
      .sort(compareTextTemplates)
      .filter(textTemplate => textTemplate.experimentId === getExperimentId());

   const getInAppMessageTemplateAccordions = () => getExperimentInAppMessageTemplates().map(inAppMessageTemplate => {
      const { id } = inAppMessageTemplate;
      return (
         <Row key={`inAppMessageTemplate-${id}`}>
            <Column
               sx={{ paddingRight: 0 }}
               xs={11}
            >
               <Accordion
                  aria-label={translate('In-App Message Templates')}
                  expanded={!!accordionOpen[`inAppMessage-${id}`]}
                  onChange={toggleAccordion(id, MessageTemplate.inAppMessage)}
               >
                  <AccordionSummary
                     aria-label={`${translate('In-App Message Template')} #{index + 1}`}
                     aria-controls={`inAppMessageTemplate${id}-content`}
                     expandIcon={component.expandMore}
                     id={`inAppMessageTemplate${id}-header`}
                  >
                     <Typography sx={{
                        flexShrink: 0,
                        width: '33%',
                     }}>
                        <TranslatedText text={'ID'}/> #{id}: <TranslatedText text={'In-App Message Template'}/>
                     </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                     <InAppMessageTemplate template={inAppMessageTemplate}/>
                  </AccordionDetails>
               </Accordion>
            </Column>
            <Column
               sx={{ paddingLeft: 0 }}
               xs={1}
            >
               <RestrictAccess accessKey={accessKey.experimentDeleteTemplate}>
                  <ShowIf condition={experimentTools.isEnabledPendingAndOwnedBy()}>
                     <Tooltip title={translate('Delete')}>
                        <span>
                           <IconButton
                              aria-label={translate('Delete')}
                              disabled={getIsDisabled()}
                              onClick={deleteInAppMessageTemplate}
                              sx={{ color: Color.red }}
                              value={id}
                           >
                              <DeleteForeverOutlined/>
                           </IconButton>
                        </span>
                     </Tooltip>
                  </ShowIf>
               </RestrictAccess>
            </Column>
         </Row>
      )
   })

   const getTextTemplateAccordions = () => getExperimentTextTemplates().map(textTemplate => {
      const { id } = textTemplate;
      return (
         <Row key={`textTemplate-${id}`}>
            <Column
               sx={{ paddingRight: 0 }}
               xs={11}
            >
               <Accordion
                  aria-label={translate('Text Templates')}
                  expanded={!!accordionOpen[`text-${id}`]}
                  onChange={toggleAccordion(id, MessageTemplate.text)}
               >
                  <AccordionSummary
                     aria-label={`${translate('Text Template')} #{index + 1}`}
                     aria-controls={`textTemplate${id}-content`}
                     expandIcon={component.expandMore}
                     id={`textTemplate${id}-header`}
                  >
                     <Typography sx={{
                        flexShrink: 0,
                        width: '33%',
                     }}>
                        <TranslatedText text={'ID'}/> #{id}: <TranslatedText text={'Text Template'}/>
                     </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                     <TextTemplate template={textTemplate}/>
                  </AccordionDetails>
               </Accordion>
            </Column>
            <Column
               sx={{ paddingLeft: 0 }}
               xs={1}
            >
               <RestrictAccess accessKey={accessKey.experimentDeleteTemplate}>
                  <ShowIf condition={experimentTools.isEnabledPendingAndOwnedBy()}>
                     <Tooltip title={translate('Delete')}>
                        <span>
                           <IconButton
                              aria-label={translate('Delete')}
                              disabled={getIsDisabled()}
                              onClick={deleteTextTemplate}
                              sx={{ color: Color.red }}
                              value={id}
                           >
                              <DeleteForeverOutlined/>
                           </IconButton>
                        </span>
                     </Tooltip>
                  </ShowIf>
               </RestrictAccess>
            </Column>
         </Row>
      )
   })

   const launchAddMessageTemplate = () => setOpen(true);

   const launchSendFromHelpDialog = () => setSendFromHelpOpen(true);

   const launchUtcHelpDialog = () => setUtcHelpOpen(true);

   const requiredFieldsAreComplete = () => getSendFrom() && getSendFromName();

   const toggleAccordion = (accordionId: number, templateType: MessageTemplate) => (_event: SyntheticEvent, isExpanded: boolean) => {
      const newAccordionOpen = { ...accordionOpen };
      newAccordionOpen[`${templateType}-${accordionId}`] = isExpanded;
      local.setItem(`${templateType}-${accordionId}`, isExpanded);
      setAccordionOpen(newAccordionOpen);
   }

   const updateExperiment = () => {
      (async () => {
         setShowLoading(true);
         const index = getExperiments().findIndex(experiment => experiment.id === getExperimentId());
         if (index === -1) return bail.out(`Could not find experiment #${getExperimentId()}`);
         const experiments = getExperiments();
         experiments[index].sendFrom = getSendFrom();
         experiments[index].sendFromName = getSendFromName();
         const { status } = await experimentEndpoint.put(experiments[index]);
         if (status !== HttpStatusCode.OK) return bail.out(['Could not update experiment:', experiments[index]]);
         setUpdated(true);
         setExperiments(experiments);
         setShowLoading(false);
      })()
   }

   const updateSendFrom = (event: ChangeEvent<HTMLInputElement>) => setSendFrom(Number(event.target.value));

   const updateSendFromName = (event: ChangeEvent<HTMLInputElement>) => setSendFromName(event.target.value.trimStart());

   useEffect(() => {
      const initialAccordionOpen: GenericObject = {};
      getExperimentEmailTemplates().forEach(emailTemplate => {
         const { id } = emailTemplate;
         initialAccordionOpen[`email-${id}`] = local.getItem(`email-${id}`, false);
      });
      getInAppMessageTemplates().forEach(inAppMessageTemplate => {
         const { id } = inAppMessageTemplate;
         initialAccordionOpen[`inAppMessage-${id}`] = local.getItem(`inAppMessage-${id}`, false);
      })
      getTextTemplates().forEach(textTemplate => {
         const { id } = textTemplate;
         initialAccordionOpen[`text-${id}`] = local.getItem(`text-${id}`, false);
      })
      setAccordionOpen(initialAccordionOpen);
   }, []);

   useEffect(() => {
      if (!getSendFrom() || !getSendFromName()) {
         setAddButton(null);
         return;
      }
      setAddButton(
         <Tooltip title={translate('Add Message Template')}>
            <span>
               <IconButton
                  aria-label={translate('Add Message Template')}
                  onClick={launchAddMessageTemplate}
               >
                  <AddCircle sx={{
                     color: Color.greenTemplate,
                     stroke: Color.white,
                  }}/>
               </IconButton>
            </span>
         </Tooltip>
      )
   }, [getSendFrom(), getSendFromName()]);

   useEffect(() => {
      const urlExperimentId = getNumber(params.experimentId);
      const experimentId = urlExperimentId || getExperimentId();
      const experiment = getExperiments().find(experiment => experiment.id === experimentId);
      if (!experiment) {
         log.warn(`Could not find experiment #${getExperimentId()}`);
         navigate(Path.experiments);
         return;
      }
      if (experiment.sendFrom) setSendFrom(experiment.sendFrom);
      if (experiment.sendFromName) setSendFromName(experiment.sendFromName);
      thisExperiment.current = experiment;
   }, [getExperimentId()]);

   useEffect(() => {
      const experimentId = getNumber(params.experimentId);
      if (experimentId !== getExperimentId()) setExperimentId(experimentId);
   }, [params])

   return <>
      <Loading open={getShowLoading()}/>
      <DefaultSnackbar
         onClose={closeDeletedSnackbar}
         open={deleted}
         severity={'success'}
         text={'The message template has been deleted.'}
      />
      <DefaultSnackbar
         onClose={closeUpdatedSnackbar}
         open={updated}
         severity={'success'}
         text={'The experiment has been updated.'}
      />
      <DefaultSnackbar
         onClose={closeErrorSnackbar}
         open={getShowError()}
         severity={'error'}
         text={'An error occurred.'}
      />
      <HelpDialog
         onClose={closeUtcHelpDialog}
         open={utcHelpOpen}
         topic={Topic.utc}
      />
      <HelpDialog
         onClose={closeSendFromHelpDialog}
         open={sendFromHelpOpen}
         topic={Topic.sendFromValues}
      />
      <ExperimentMessageTemplateDialog
         experimentId={getExperimentId()}
         onClose={closeAddMessageTemplate}
         open={open}
      />
      <ShowIf condition={lookup.inAppMessageTemplatesByExperiment(getExperimentId()).length > 0}>
         <Row
            columnSpacing={0}
            rowSpacing={0}
         >
            <Column xs={12} sm={12} md={12} lg={12} xl={10}>
               <TranslatedText text={'Send Messages From'}/>
               <Tooltip title={translate('Help on Send-From Values')}>
                  <Button
                     aria-label={translate('Help on Send-From Values')}
                     onClick={launchSendFromHelpDialog}
                     sx={{
                        bottom: 8,
                        marginRight: 2,
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
            </Column>
         </Row>
         <Row
            columnSpacing={0}
            rowSpacing={0}
            sx={{
               marginBottom: 2,
               marginTop: 2,
            }}
         >
            <Column xs={12} sm={12} md={12} lg={3} xl={3}>
               <TextField
                  aria-label={translate('Ref User ID')}
                  disabled={!experimentTools.isEnabledPendingAndOwnedBy()}
                  error={experimentTools.isEnabledPendingAndOwnedBy() && !getSendFrom()}
                  label={translate('Ref User ID')}
                  name={'ref-user-id-field'}
                  onChange={updateSendFrom}
                  required={true}
                  size={'small'}
                  sx={{ width: 200 }}
                  type={'number'}
                  value={getNumber(getSendFrom())}
               />
            </Column>
            <Column xs={12} sm={12} md={12} lg={6} xl={7}>
               <TextField
                  aria-label={translate('Display Name')}
                  disabled={!experimentTools.isEnabledPendingAndOwnedBy()}
                  error={experimentTools.isEnabledPendingAndOwnedBy() && !getString(getSendFromName())}
                  label={translate('Display Name')}
                  name={'send-from-name-field'}
                  onChange={updateSendFromName}
                  required={true}
                  size={'small'}
                  sx={{
                     marginTop: viewport.isMobile ? 1 : 0,
                     width: '100%',
                  }}
                  value={getString(getSendFromName())}
               />
            </Column>
            <RestrictAccess accessKey={accessKey.experimentUpdateDetails}>
               <ShowIf condition={experimentTools.isEnabledPendingAndOwnedBy()}>
                  <Column xs={12} sm={12} md={12} lg={1} xl={1}>
                     <Tooltip title={translate('Save')}>
                        <span>
                           <IconButton
                              aria-label={translate('Save')}
                              disabled={getIsDisabled() || !requiredFieldsAreComplete() || !formChangesAreUnsaved()}
                              onClick={updateExperiment}
                              sx={{ color: Color.greenTemplate }}
                           >
                              <SaveOutlined/>
                           </IconButton>
                        </span>
                     </Tooltip>
                  </Column>
               </ShowIf>
            </RestrictAccess>
         </Row>
      </ShowIf>
      <Row>
         <Column
            sx={{ marginBottom: 2 }}
            xs={6}
         >
            <TranslatedText text={'Current Local Time'}/>: {dayjs().format(Format.dateTime)}
         </Column>
         <Column
            sx={{ marginBottom: 2 }}
            xs={6}
         >
            <TranslatedText text={'Current UTC Time'}/>: {dayjs().utc().format(Format.dateTime)}
            <Tooltip title={translate('Help on UTC')}>
               <Button
                  aria-label={translate('Help on UTC')}
                  onClick={launchUtcHelpDialog}
                  sx={{
                     bottom: 8,
                     marginRight: 2,
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
         </Column>
      </Row>
      <Row
         columnSpacing={0}
         rowSpacing={0}
      >
         <Column xs={12} sm={12} md={12} lg={12} xl={10}>
            {getEmailTemplateAccordions()}
            {getInAppMessageTemplateAccordions()}
            {getTextTemplateAccordions()}
         </Column>
      </Row>
   </>
}