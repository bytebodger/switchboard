import { ArrowBack, AssignmentTurnedInOutlined, CalendarMonthOutlined, CalendarTodayOutlined, FileCopyOutlined, ForwardToInboxOutlined, HelpOutlined, VisibilityOutlined } from '@mui/icons-material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Box, Button, Step, StepButton, Stepper, Tab, Tooltip, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import dayjs from 'dayjs';
import type { SyntheticEvent } from 'react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { Loading } from '../../../app/components/Loading';
import { useEndpointStore } from '../../../app/hooks/useEndpointStore';
import { DefaultSnackbar } from '../../../common/components/DefaultSnackbar';
import { HelpDialog } from '../../../common/components/HelpDialog';
import { RestrictAccess } from '../../../common/components/RestrictAccess';
import { ShowIf } from '../../../common/components/ShowIf';
import { TranslatedText } from '../../../common/components/TranslatedText';
import { accessKey } from '../../../common/constants/accessKey';
import { Color } from '../../../common/enums/Color';
import { Format } from '../../../common/enums/Format';
import { HtmlElement } from '../../../common/enums/HtmlElement';
import { HttpStatusCode } from '../../../common/enums/HttpStatusCode';
import { Milliseconds } from '../../../common/enums/Milliseconds';
import { Path } from '../../../common/enums/Path';
import { Stage } from '../../../common/enums/Stage';
import { TabName } from '../../../common/enums/TabName';
import { Topic } from '../../../common/enums/Topic';
import { getCohortDataType } from '../../../common/functions/getCohortDataType';
import { getNumber } from '../../../common/functions/getNumber';
import { getString } from '../../../common/functions/getString';
import { parseApiId } from '../../../common/functions/parseApiId';
import { useAudienceCountEndpoint } from '../../../common/hooks/endpoints/useAudienceCountEndpoint';
import { useAudienceEndpoint } from '../../../common/hooks/endpoints/useAudienceEndpoint';
import { useCohortEndpoint } from '../../../common/hooks/endpoints/useCohortEndpoint';
import { useEmailTemplateEndpoint } from '../../../common/hooks/endpoints/useEmailTemplateEndpoint';
import { useEmailTemplateTagEndpoint } from '../../../common/hooks/endpoints/useEmailTemplateTagEndpoint';
import { useExperimentEndpoint } from '../../../common/hooks/endpoints/useExperimentEndpoint';
import { useExperimentTagRelationshipEndpoint } from '../../../common/hooks/endpoints/useExperimentTagRelationshipEndpoint';
import { useHypothesisEndpoint } from '../../../common/hooks/endpoints/useHypothesisEndpoint';
import { useInAppMessageTemplateEndpoint } from '../../../common/hooks/endpoints/useInAppMessageTemplateEndpoint';
import { useInAppMessageTemplateTagEndpoint } from '../../../common/hooks/endpoints/useInAppMessageTemplateTagEndpoint';
import { useTextTemplateEndpoint } from '../../../common/hooks/endpoints/useTextTemplateEndpoint';
import { useTextTemplateTagEndpoint } from '../../../common/hooks/endpoints/useTextTemplateTagEndpoint';
import { useBail } from '../../../common/hooks/useBail';
import { useLookup } from '../../../common/hooks/useLookup';
import { useUXStore } from '../../../common/hooks/useUXStore';
import type { ExperimentUI } from '../../../common/interfaces/experiment/ExperimentUI';
import { log } from '../../../common/libraries/log';
import { DataType } from '../../../common/types/DataType';
import { useExperimentsStore } from '../_hooks/useExperimentsStore';
import { ExperimentAudienceTab } from './_components/tabs/ExperimentAudienceTab';
import { ExperimentDetailTab } from './_components/tabs/ExperimentDetailTab';
import { ExperimentHypothesesTab } from './_components/tabs/ExperimentHypothesesTab';
import { ExperimentScheduleTab } from './_components/tabs/ExperimentScheduleTab';
import { ExperimentSentTab } from './_components/tabs/ExperimentSentTab';
import { ExperimentTemplatesTab } from './_components/tabs/ExperimentTemplatesTab';
import { useExperimentStore } from './_hooks/useExperimentStore';
import { useExperimentTools } from './_hooks/useExperimentTools';

const Experiment = () => {
   const [
      addButton,
      getAudienceSize,
      getExperimentId,
      getTab,
      resetForm,
      setAudienceSize,
      setExperimentId,
      setTab,
   ] = useExperimentStore(state => [
      state.addButton,
      state.getAudienceSize,
      state.getExperimentId,
      state.getTab,
      state.resetForm,
      state.setAudienceSize,
      state.setExperimentId,
      state.setTab,
   ]);
   const [getUser] = useEndpointStore(state => [state.getUser]);
   const [
      getCohorts,
      getEmailTemplateTags,
      getEmailTemplates,
      getExperimentTagRelationships,
      getExperiments,
      getHypotheses,
      getInAppMessageTemplateTags,
      getInAppMessageTemplates,
      getTextTemplateTags,
      getTextTemplates,
      setCohorts,
      setEmailTemplateTags,
      setEmailTemplates,
      setExperimentTagRelationships,
      setExperiments,
      setHypotheses,
      setInAppMessageTemplateTags,
      setInAppMessageTemplates,
      setTextTemplateTags,
      setTextTemplates,
   ] = useExperimentsStore(state => [
      state.getCohorts,
      state.getEmailTemplateTags,
      state.getEmailTemplates,
      state.getExperimentTagRelationships,
      state.getExperiments,
      state.getHypotheses,
      state.getInAppMessageTemplateTags,
      state.getInAppMessageTemplates,
      state.getTextTemplateTags,
      state.getTextTemplates,
      state.setCohorts,
      state.setEmailTemplateTags,
      state.setEmailTemplates,
      state.setExperimentTagRelationships,
      state.setExperiments,
      state.setHypotheses,
      state.setInAppMessageTemplateTags,
      state.setInAppMessageTemplates,
      state.setTextTemplateTags,
      state.setTextTemplates,
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
   const audienceCountEndpoint = useAudienceCountEndpoint();
   const audienceEndpoint = useAudienceEndpoint();
   const bail = useBail();
   const cohortEndpoint = useCohortEndpoint();
   const emailTemplateEndpoint = useEmailTemplateEndpoint();
   const emailTemplateTagEndpoint = useEmailTemplateTagEndpoint();
   const experimentEndpoint = useExperimentEndpoint();
   const experimentTagRelationshipEndpoint = useExperimentTagRelationshipEndpoint();
   const experimentTools = useExperimentTools();
   const hypothesisEndpoint = useHypothesisEndpoint();
   const inAppMessageTemplateEndpoint = useInAppMessageTemplateEndpoint();
   const inAppMessageTemplateTagEndpoint = useInAppMessageTemplateTagEndpoint();
   const lookup = useLookup();
   const navigate = useNavigate();
   const params = useParams();
   const textTemplateEndpoint = useTextTemplateEndpoint();
   const textTemplateTagEndpoint = useTextTemplateTagEndpoint();
   const { t: translate } = useTranslation();

   const { concluded, observing, scheduled, sending, unscheduled } = Stage;

   const clone = () => {
      (async () => {
         setShowLoading(true);
         const experiment = getExperiments().find(experiment => experiment.id === getExperimentId());
         if (!experiment) return bail.out(`Could not find experiment #${getExperimentId()}`);
         const cloneExperimentId = await cloneExperiment(experiment);
         if (!cloneExperimentId) return;
         if (!await cloneExperimentTags(cloneExperimentId)) {
            deleteExperiment(cloneExperimentId);
            return;
         }
         if (!await cloneHypotheses(cloneExperimentId)) {
            deleteExperimentTagRelationships(cloneExperimentId);
            deleteExperiment(cloneExperimentId);
            return;
         }
         if (!await cloneCohorts(cloneExperimentId)) {
            deleteHypotheses(cloneExperimentId);
            deleteExperimentTagRelationships(cloneExperimentId);
            deleteExperiment(cloneExperimentId);
            return;
         }
         if (!await cloneMessageTemplates(cloneExperimentId)) {
            deleteCohorts(cloneExperimentId);
            deleteHypotheses(cloneExperimentId);
            deleteExperimentTagRelationships(cloneExperimentId);
            deleteExperiment(cloneExperimentId);
            return;
         }
         setExperimentId(cloneExperimentId);
         setShowLoading(false);
         navigate(`${Path.experiments}/${cloneExperimentId}`);
      })()
   }

   const cloneCohorts = async (cloneExperimentId: number) => {
      let errorOccurred = false;
      let cohortsAdded = false;
      await Promise.all(lookup.cohortsByExperiment(getExperimentId())
         .map(async cohort => {
            if (errorOccurred) return;
            const { comparator, field, ordinal, table, value } = cohort;
            const dataType = getCohortDataType(table, field);
            let newValue = value;
            if (dataType === DataType.datetime) newValue = dayjs(value).utc(true).format(Format.dateTime);
            const { data, status } = await cohortEndpoint.post(
               comparator,
               cloneExperimentId,
               field,
               ordinal,
               table,
               newValue,
            )
            if (status !== HttpStatusCode.created) {
               errorOccurred = true;
               return bail.out('Could not create cohort');
            }
            cohortsAdded = true;
            const newCohortId = parseApiId(data);
            const cohorts = getCohorts();
            cohorts.push({
               comparator,
               experimentId: cloneExperimentId,
               field,
               id: newCohortId,
               ordinal,
               table,
               value: newValue,
            })
            setCohorts(cohorts);
         }));
      if (!errorOccurred && cohortsAdded) {
         const { status: audienceCreationStatus } = await audienceEndpoint.post(cloneExperimentId);
         if (audienceCreationStatus !== HttpStatusCode.noContent) {
            errorOccurred = true;
            return bail.out('Could not create audience', false);
         }
         const { data, status: audienceCountStatus } = await audienceCountEndpoint.get(cloneExperimentId);
         if (audienceCountStatus !== HttpStatusCode.OK) return bail.out('Could not retrieve audience size');
         setAudienceSize(Number(data));
      }
      if (errorOccurred) deleteCohorts(cloneExperimentId);
      return !errorOccurred;
   }

   const cloneEmailTemplates = async (cloneExperimentId: number) => {
      let errorOccurred = false;
      const original = getExperiments().find(experiment => experiment.id === getExperimentId());
      if (!original) {
         errorOccurred = true;
         return bail.out('Could not find original experiment');
      }
      await Promise.all(lookup.emailTemplatesByExperiment(getExperimentId())
         .map(async emailTemplate => {
            if (errorOccurred) return;
            const { aimlId, htmlMessage, id, message, sendOn, subject, weight } = emailTemplate;
            const allEmailTemplates = getEmailTemplates();
            const originalBeginOnTime = dayjs(original.beginOn).utc(true).valueOf();
            const sendOnTime = dayjs(sendOn).utc(true).valueOf();
            const newBeginOnTime = dayjs().utc().valueOf();
            let newSendOnTime = newBeginOnTime + sendOnTime - originalBeginOnTime;
            if (newSendOnTime <= newBeginOnTime) newSendOnTime = newBeginOnTime + Milliseconds.day;
            const newSendOn = dayjs(newSendOnTime).utc(true).format(Format.dateTime);
            const { data, status } = await emailTemplateEndpoint.post(
               cloneExperimentId,
               subject,
               message,
               htmlMessage,
               newSendOn,
               weight,
            );
            if (status !== HttpStatusCode.created) {
               errorOccurred = true;
               return bail.out(['Could not clone email template:', emailTemplate]);
            }
            const newEmailTemplateId = parseApiId(data);
            allEmailTemplates.push({
               aimlId,
               experimentId: cloneExperimentId,
               htmlMessage,
               id: newEmailTemplateId,
               message,
               sendOn: newSendOn,
               subject,
               weight,
            })
            setEmailTemplates(allEmailTemplates);
            errorOccurred = !await cloneEmailTemplateTags(newEmailTemplateId, id);
         }));
      if (errorOccurred) deleteEmailTemplates(cloneExperimentId);
      return !errorOccurred;
   }

   const cloneEmailTemplateTags = async (cloneEmailTemplateId: number, originalEmailTemplateId: number) => {
      let errorOccurred = false;
      await Promise.all(getEmailTemplateTags()
         .filter(emailTemplateTag => emailTemplateTag.emailTemplateId === originalEmailTemplateId)
         .map(async emailTemplateTag => {
            if (errorOccurred) return;
            const { messageTagId } = emailTemplateTag;
            const { data, status } = await emailTemplateTagEndpoint.post(cloneEmailTemplateId, messageTagId);
            if (status !== HttpStatusCode.created) {
               errorOccurred = true;
               return bail.out(`Could not create tag relationship for email template #${cloneEmailTemplateId} and messageTag #${messageTagId}`);
            }
            const newEmailTemplateTagId = parseApiId(data);
            const allEmailTemplateTags = getEmailTemplateTags();
            allEmailTemplateTags.push({
               emailTemplateId: cloneEmailTemplateId,
               id: newEmailTemplateTagId,
               messageTagId,
            })
            setEmailTemplateTags(allEmailTemplateTags);
         }));
      if (errorOccurred) deleteEmailTemplateTags(cloneEmailTemplateId);
      return !errorOccurred;
   }

   const cloneExperiment = async (original: ExperimentUI) => {
      const { description, name, sendFrom, sendFromName, successMetric } = original;
      const endOn = dayjs().utc().add(14, 'day').format(Format.date);
      const userId = getNumber(getUser()?.id);
      const newName = `${name} (${new Date().toISOString()})`;
      const { data: experimentCreateData, status: experimentCreateStatus } = await experimentEndpoint.post(
         newName,
         getString(description),
         dayjs().utc().format(Format.dateTime),
         endOn,
         userId,
         getString(successMetric),
         sendFrom,
         sendFromName,
         false,
      );
      if (experimentCreateStatus !== HttpStatusCode.created)
         return bail.out(['Could not create experiment:', name, description, endOn, successMetric], 0);
      const newExperimentId = parseApiId(experimentCreateData);
      const experiments = getExperiments();
      const currentDate = dayjs().utc().format(Format.dateTime);
      experiments.push({
         beginOn: currentDate,
         createdBy: userId,
         createdOn: currentDate,
         description,
         disabledOn: null,
         endOn,
         id: newExperimentId,
         isCampaign: false,
         isDisabled: false,
         modifiedBy: userId,
         modifiedOn: currentDate,
         name: newName,
         ownedBy: userId,
         sendFrom,
         sendFromName,
         successMetric,
      });
      setExperiments(experiments);
      return newExperimentId;
   }

   const cloneExperimentTags = async (cloneExperimentId: number) => {
      let errorOccurred = false;
      await Promise.all(getExperimentTagRelationships()
         .filter(experimentTagRelationship => experimentTagRelationship.experimentId === getExperimentId())
         .map(async experimentTagRelationship => {
            if (errorOccurred) return;
            const { experimentTagId } = experimentTagRelationship;
            const { data, status } = await experimentTagRelationshipEndpoint.post(cloneExperimentId, experimentTagId);
            if (status !== HttpStatusCode.created) {
               errorOccurred = true;
               return bail.out(`Could not create tag relationship for experiment #${cloneExperimentId} and experimentTag #${experimentTagId}`);
            }
            const newExperimentTagRelationshipId = parseApiId(data);
            const allExperimentTagRelationships = getExperimentTagRelationships();
            allExperimentTagRelationships.push({
               experimentId: cloneExperimentId,
               experimentTagId,
               id: newExperimentTagRelationshipId,
            })
            setExperimentTagRelationships(allExperimentTagRelationships);
         }));
      if (errorOccurred) deleteExperimentTagRelationships(cloneExperimentId);
      return !errorOccurred;
   }

   const cloneHypotheses = async (cloneExperimentId: number) => {
      let errorOccurred = false;
      await Promise.all(lookup.hypothesesByExperiment(getExperimentId())
         .map(async hypothesis => {
            if (errorOccurred) return;
            const { hypothesis: description } = hypothesis;
            const { data, status } = await hypothesisEndpoint.post(
               cloneExperimentId,
               description,
            );
            if (status !== HttpStatusCode.OK) {
               errorOccurred = true;
               return bail.out(['Could not create hypothesis:', hypothesis]);
            }
            const newHypothesisId = parseApiId(data);
            const allHypotheses = getHypotheses();
            allHypotheses.push({
               experimentId: cloneExperimentId,
               hypothesis: description,
               id: newHypothesisId,
            })
            setHypotheses(allHypotheses);
         }));
      if (errorOccurred) deleteHypotheses(cloneExperimentId);
      return !errorOccurred;
   }

   const cloneInAppMessageTemplates = async (cloneExperimentId: number) => {
      let errorOccurred = false;
      const experiment = getExperiments().find(experiment => experiment.id === getExperimentId());
      if (!experiment) {
         errorOccurred = true;
         return bail.out('Could not find original experiment');
      }
      await Promise.all(lookup.inAppMessageTemplatesByExperiment(getExperimentId())
         .map(async inAppMessageTemplate => {
            if (errorOccurred) return;
            const { aimlId, id, message, sendOn, weight } = inAppMessageTemplate;
            const allInAppMessageTemplates = getInAppMessageTemplates();
            const originalBeginOnTime = dayjs(experiment.beginOn).utc(true).valueOf();
            const sendOnTime = dayjs(sendOn).utc(true).valueOf();
            const newBeginOnTime = dayjs().utc().valueOf();
            let newSendOnTime = newBeginOnTime + sendOnTime - originalBeginOnTime;
            if (newSendOnTime <= newBeginOnTime) newSendOnTime = newBeginOnTime + Milliseconds.day;
            const newSendOn = dayjs(newSendOnTime).utc(true).format(Format.dateTime);
            const { data, status } = await inAppMessageTemplateEndpoint.post(
               message,
               cloneExperimentId,
               newSendOn,
               weight,
            );
            if (status !== HttpStatusCode.created) {
               errorOccurred = true;
               return bail.out(['Could not clone in-app message template:', inAppMessageTemplate]);
            }
            const newInAppMessageTemplateId = parseApiId(data);
            const userId = getNumber(getUser()?.id);
            const currentDate = dayjs().utc().format(Format.dateTime);
            allInAppMessageTemplates.push({
               aimlId,
               createdBy: userId,
               createdOn: currentDate,
               experimentId: cloneExperimentId,
               id: newInAppMessageTemplateId,
               message,
               modifiedBy: userId,
               modifiedOn: currentDate,
               sendOn: newSendOn,
               weight,
            })
            setInAppMessageTemplates(allInAppMessageTemplates);
            errorOccurred = !await cloneInAppMessageTemplateTags(newInAppMessageTemplateId, id);
         }));
      if (errorOccurred) deleteInAppMessageTemplates(cloneExperimentId);
      return !errorOccurred;
   }

   const cloneInAppMessageTemplateTags = async (cloneInAppMessageTemplateId: number, originalInAppMessageTemplateId: number) => {
      let errorOccurred = false;
      await Promise.all(getInAppMessageTemplateTags()
         .filter(inAppMessageTemplateTag => inAppMessageTemplateTag.inAppMessageTemplateId === originalInAppMessageTemplateId)
         .map(async inAppMessageTemplateTag => {
            if (errorOccurred) return;
            const { messageTagId } = inAppMessageTemplateTag;
            const { data, status } = await inAppMessageTemplateTagEndpoint.post(cloneInAppMessageTemplateId, messageTagId);
            if (status !== HttpStatusCode.created) {
               errorOccurred = true;
               return bail.out(`Could not create tag relationship for in-app message template #${cloneInAppMessageTemplateId} and messageTag #${messageTagId}`);
            }
            const newInAppMessageTemplateTagId = parseApiId(data);
            const allInAppMessageTemplateTags = getInAppMessageTemplateTags();
            const userId = getNumber(getUser()?.id);
            const currentDate = dayjs().utc().format(Format.dateTime);
            allInAppMessageTemplateTags.push({
               createdBy: userId,
               createdOn: currentDate,
               id: newInAppMessageTemplateTagId,
               inAppMessageTemplateId: cloneInAppMessageTemplateId,
               messageTagId,
               modifiedBy: userId,
               modifiedOn: currentDate,
            })
            setInAppMessageTemplateTags(allInAppMessageTemplateTags);
         }))
      if (errorOccurred) deleteInAppMessageTemplateTags(cloneInAppMessageTemplateId);
      return !errorOccurred;
   }

   const cloneMessageTemplates = async (cloneExperimentId: number) => {
      const emailTemplatesResult = await cloneEmailTemplates(cloneExperimentId);
      if (!emailTemplatesResult) return false;
      const inAppMessageTemplatesResult = await cloneInAppMessageTemplates(cloneExperimentId);
      if (!inAppMessageTemplatesResult) return false;
      return await cloneTextTemplates(cloneExperimentId);
   }

   const cloneTextTemplates = async (cloneExperimentId: number) => {
      let errorOccurred = false;
      const experiment = getExperiments().find(experiment => experiment.id === getExperimentId());
      if (!experiment) {
         errorOccurred = true;
         return bail.out('Could not find original experiment');
      }
      await Promise.all(lookup.textTemplatesByExperiment(getExperimentId())
         .map(async textTemplate => {
            if (errorOccurred) return;
            const { aimlId, id, message, sendOn, weight } = textTemplate;
            const allTextTemplates = getTextTemplates();
            const originalBeginOnTime = dayjs(experiment.beginOn).utc(true).valueOf();
            const sendOnTime = dayjs(sendOn).utc(true).valueOf();
            const newBeginOnTime = dayjs().utc().valueOf();
            let newSendOnTime = newBeginOnTime + sendOnTime - originalBeginOnTime;
            if (newSendOnTime <= newBeginOnTime) newSendOnTime = newBeginOnTime + Milliseconds.day;
            const newSendOn = dayjs(newSendOnTime).utc(true).format(Format.dateTime);
            const { data, status } = await textTemplateEndpoint.post(
               cloneExperimentId,
               newSendOn,
               message,
               weight,
            );
            if (status !== HttpStatusCode.created) {
               errorOccurred = true;
               return bail.out(['Could not clone text template:', textTemplate]);
            }
            const newTextTemplateId = parseApiId(data);
            const userId = getNumber(getUser()?.id);
            const currentDate = dayjs().utc().format(Format.dateTime);
            allTextTemplates.push({
               aimlId,
               createdBy: userId,
               createdOn: currentDate,
               experimentId: cloneExperimentId,
               id: newTextTemplateId,
               message,
               modifiedBy: userId,
               modifiedOn: currentDate,
               sendOn: newSendOn,
               weight,
            })
            setTextTemplates(allTextTemplates);
            errorOccurred = !await cloneTextTemplateTags(newTextTemplateId, id);
         }));
      if (errorOccurred) deleteTextTemplates(cloneExperimentId);
      return !errorOccurred;
   }

   const cloneTextTemplateTags = async (cloneTextTemplateId: number, originalTextTemplateId: number) => {
      let errorOccurred = false;
      await Promise.all(getTextTemplateTags()
         .filter(textTemplateTag => textTemplateTag.textTemplateId === originalTextTemplateId)
         .map(async textTemplateTag => {
            if (errorOccurred) return;
            const { messageTagId } = textTemplateTag;
            const { data, status } = await textTemplateTagEndpoint.post(cloneTextTemplateId, messageTagId);
            if (status !== HttpStatusCode.created) {
               errorOccurred = true;
               return bail.out(`Could not create tag relationship for text template #${cloneTextTemplateId} and messageTag #${messageTagId}`);
            }
            const newTextTemplateTagId = parseApiId(data);
            const allTextTemplateTags = getTextTemplateTags();
            const userId = getNumber(getUser()?.id);
            const currentDate = dayjs().utc().format(Format.dateTime);
            allTextTemplateTags.push({
               createdBy: userId,
               createdOn: currentDate,
               id: newTextTemplateTagId,
               messageTagId,
               modifiedBy: userId,
               modifiedOn: currentDate,
               textTemplateId: cloneTextTemplateId,
            })
            setTextTemplateTags(allTextTemplateTags);
         }));
      if (errorOccurred) deleteTextTemplateTags(cloneTextTemplateId);
      return !errorOccurred;
   }

   const closeErrorSnackbar = (_event?: SyntheticEvent | Event, reason?: string) => {
      reason !== 'clickaway' && setShowError(false);
   }

   const closeHelpDialog = () => setHelpOpen(false);

   const deleteCohorts = (cloneExperimentId: number) => {
      (async () => {
         await audienceEndpoint.delete((cloneExperimentId));
         setAudienceSize(0);
      })()
      getCohorts()
         .filter(cohort => cohort.experimentId === cloneExperimentId)
         .forEach(cohort => {
            (async () => {
               const { id } = cohort;
               const { status } = await cohortEndpoint.delete(id);
               if (status !== HttpStatusCode.OK) {
                  setShowError(true);
                  log.warn(`Could not delete cohort #${id}`);
                  return;
               }
               const cohorts = getCohorts().filter(filter => filter.id !== id);
               setCohorts(cohorts);
            })()
         })
   }

   const deleteEmailTemplates = (cloneExperimentId: number) => {
      getEmailTemplates()
         .filter(emailTemplate => emailTemplate.experimentId === cloneExperimentId)
         .forEach(emailTemplate => {
            (async () => {
               const { id } = emailTemplate;
               const { status } = await emailTemplateEndpoint.delete(id);
               if (status !== HttpStatusCode.OK) {
                  setShowError(true);
                  log.warn(`Could not remove email template #${id}`);
                  return;
               }
               const newEmailTemplates = getEmailTemplates().filter(emailTemplate => emailTemplate.id !== id);
               setEmailTemplates(newEmailTemplates);
            })()
         })
   }

   const deleteEmailTemplateTags = (cloneExperimentId: number) => {
      lookup.emailTemplateTagsByExperiment(cloneExperimentId)
         .forEach(emailTemplateTag => {
            (async () => {
               const { id } = emailTemplateTag;
               const { status } = await emailTemplateTagEndpoint.delete(id);
               if (status !== HttpStatusCode.OK) {
                  setShowError(true);
                  log.warn(`Could not remove tag #${id}`);
                  return;
               }
               const newEmailTemplateTags = getEmailTemplateTags().filter(emailTemplateTag => emailTemplateTag.id !== id);
               setEmailTemplateTags(newEmailTemplateTags);
            })()
         })
   }

   const deleteExperiment = (cloneExperimentId: number) => {
      (async () => {
         setShowLoading(true);
         const { status } = await experimentEndpoint.delete(cloneExperimentId);
         if (status !== HttpStatusCode.OK) return bail.out(`Could not delete experiment #${cloneExperimentId}`);
         const newExperiments = getExperiments().filter(experiment => experiment.id !== cloneExperimentId);
         setExperiments(newExperiments);
         setShowLoading(false);
      })()
   }

   const deleteExperimentTagRelationships = (cloneExperimentId: number) => {
      getExperimentTagRelationships()
         .filter(experimentTagRelationship => experimentTagRelationship.experimentId === cloneExperimentId)
         .forEach(experimentTagRelationship => {
            (async () => {
               const { id } = experimentTagRelationship;
               const { status } = await experimentTagRelationshipEndpoint.delete(id);
               if (status !== HttpStatusCode.OK) {
                  setShowError(true);
                  log.warn(`Could not remove tag #${id}`);
                  return;
               }
               const newExperimentTagRelationships = getExperimentTagRelationships()
                  .filter(relationship => relationship.id !== id);
               setExperimentTagRelationships(newExperimentTagRelationships);
            })()
         })
   }

   const deleteHypotheses = (cloneExperimentId: number) => {
      getHypotheses()
         .filter(hypothesis => hypothesis.experimentId === cloneExperimentId)
         .forEach(hypothesis => {
            (async () => {
               const { id } = hypothesis;
               const { status } = await hypothesisEndpoint.delete(id);
               if (status !== HttpStatusCode.OK) {
                  setShowError(true);
                  log.warn(`Could not delete hypothesis #${id}`);
                  return;
               }
               const newHypotheses = getHypotheses().filter(hypothesis => hypothesis.id !== id);
               setHypotheses(newHypotheses);
            })()
         })
   }

   const deleteInAppMessageTemplates = (cloneExperimentId: number) => {
      getInAppMessageTemplates()
         .filter(inAppMessageTemplate => inAppMessageTemplate.experimentId === cloneExperimentId)
         .forEach(inAppMessageTemplate => {
            (async () => {
               const { id } = inAppMessageTemplate;
               const { status } = await inAppMessageTemplateEndpoint.delete(id);
               if (status !== HttpStatusCode.OK) {
                  setShowError(true);
                  log.warn(`Could not remove in-app message template #${id}`);
                  return;
               }
               const newInAppMessageTemplates = getInAppMessageTemplates()
                  .filter(inAppMessageTemplate => inAppMessageTemplate.id !== id);
               setInAppMessageTemplates(newInAppMessageTemplates);
            })()
         })
   }

   const deleteInAppMessageTemplateTags = (cloneExperimentId: number) => {
      lookup.inAppMessageTemplateTagsByExperiment(cloneExperimentId)
         .forEach(inAppMessageTemplateTag => {
            (async () => {
               const { id } = inAppMessageTemplateTag;
               const { status } = await inAppMessageTemplateTagEndpoint.delete(id);
               if (status !== HttpStatusCode.OK) {
                  setShowError(true);
                  log.warn(`Could not remove tag #${id}`);
                  return;
               }
               const newInAppMessageTemplateTags = getInAppMessageTemplateTags()
                  .filter(inAppMessageTemplateTag => inAppMessageTemplateTag.id !== id);
               setInAppMessageTemplateTags(newInAppMessageTemplateTags);
            })()
         })
   }

   const deleteTextTemplates = (cloneExperimentId: number) => {
      getTextTemplates()
         .filter(textTemplate => textTemplate.experimentId === cloneExperimentId)
         .forEach(textTemplate => {
            (async () => {
               const { id } = textTemplate;
               const { status } = await textTemplateEndpoint.delete(id);
               if (status !== HttpStatusCode.OK) {
                  setShowError(true);
                  log.warn(`Could not remove text template #${id}`);
                  return;
               }
               const newTextTemplates = getTextTemplates().filter(textTemplate => textTemplate.id !== id);
               setTextTemplates(newTextTemplates);
            })()
         })
   }

   const deleteTextTemplateTags = (cloneExperimentId: number) => {
      lookup.textTemplateTagsByExperiment(cloneExperimentId)
         .forEach(textTemplateTag => {
            (async () => {
               const { id } = textTemplateTag;
               const { status } = await textTemplateTagEndpoint.delete(id);
               if (status !== HttpStatusCode.OK) {
                  setShowError(true);
                  log.warn(`Could not remove tag #${id}`);
                  return;
               }
               const newTextTemplateTags = getTextTemplateTags().filter(textTemplateTag => textTemplateTag.id !== id);
               setTextTemplateTags(newTextTemplateTags);
            })()
         })
   }

   const getAudienceColor = () => {
      if (getExperimentId() === 0) return Color.greyLight;
      return lookup.cohortsByExperiment(getExperimentId()).length ? Color.inherit : Color.red;
   }

   const getExperimentName = () => {
      const experiment = getExperiments().find(experiment => experiment.id === getExperimentId());
      return experiment?.name;
   }

   const getHypothesesColor = () => {
      if (getExperimentId() === 0) return Color.greyLight;
      return lookup.hypothesesByExperiment(getExperimentId()).length ? Color.inherit : Color.red;
   }

   const getStepSx = (stage: Stage) => {
      const { greenTemplate, greyLight, inherit, white } = Color;
      const currentStage = experimentTools.getStage();
      let color;
      if (currentStage === stage) {
         color = [concluded, unscheduled].includes(stage) ? inherit : experimentTools.getStageColor(stage);
         return {
            backgroundColor: white,
            border: '2px solid grey',
            borderRadius: 2,
            boxShadow: '4px 4px 4px 4px rgba(0, 0, 0, 0.2)',
            color,
            cursor: 'default',
            paddingBottom: 1,
            paddingTop: 1,
         }
      } else {
         if (stage === concluded) {
            color = greyLight;
         } else {
            color = stage === unscheduled ? greenTemplate : experimentTools.getStageColor(stage);
         }
         return {
            color,
            cursor: 'default',
            paddingBottom: 1,
            paddingTop: 1,
         }
      }
   }

   const getTemplatesColor = () => {
      if (getExperimentId() === 0) return Color.greyLight;
      const totalEmailTemplates = lookup.emailTemplatesByExperiment(getExperimentId()).length;
      const totalInAppMessageTemplates = lookup.inAppMessageTemplatesByExperiment(getExperimentId()).length;
      const totalTextTemplates = lookup.textTemplatesByExperiment(getExperimentId()).length;
      return totalEmailTemplates + totalInAppMessageTemplates + totalTextTemplates > 0 ? Color.inherit : Color.red;
   }

   const goBack = () => {
      resetForm(getUser());
      navigate(Path.experiments);
   }

   const launchHelpDialog = () => setHelpOpen(true);

   const updateTab = (_event: SyntheticEvent, newTab: TabName) => setTab(newTab);

   useEffect(() => {
      (async () => {
         const { data, status: audienceCountStatus } = await audienceCountEndpoint.get(getExperimentId());
         if (audienceCountStatus !== HttpStatusCode.OK) return bail.out('Could not retrieve audience size');
         setAudienceSize(Number(data));
      })()
   }, [])

   useEffect(() => {
      const experimentId = getNumber(params.experimentId);
      if (experimentId !== getExperimentId()) setExperimentId(experimentId);
   }, [params])

   return <>
      <Loading open={getShowLoading()}/>
      <DefaultSnackbar
         onClose={closeErrorSnackbar}
         open={getShowError()}
         severity={'error'}
         text={'An error occurred.'}
      />
      <HelpDialog
         onClose={closeHelpDialog}
         open={helpOpen}
         topic={Topic.stages}
      />
      <RestrictAccess accessKey={accessKey.experimentViewPage}>
         <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: 4,
         }}>
            <Box sx={{ flexGrow: 1 }}>
               <Stepper
                  activeStep={experimentTools.getStage()}
                  nonLinear={true}
               >
                  <Step completed={experimentTools.getStage() > unscheduled}>
                     <StepButton
                        disableRipple={true}
                        icon={<CalendarTodayOutlined/>}
                        sx={getStepSx(unscheduled)}
                     >
                        <TranslatedText
                           elementProps={{ style: { color: experimentTools.getStage() === unscheduled ? Color.inherit : Color.greenTemplate } }}
                           text={'Unscheduled'}
                        />
                     </StepButton>
                  </Step>
                  <Step completed={experimentTools.getStage() > scheduled}>
                     <StepButton
                        disableRipple={true}
                        icon={<CalendarMonthOutlined/>}
                        sx={getStepSx(scheduled)}
                     >
                        <TranslatedText
                           elementProps={{ style: { color: experimentTools.getStageColor(scheduled) } }}
                           text={'Scheduled'}
                        />
                     </StepButton>
                  </Step>
                  <Step completed={experimentTools.getStage() > sending}>
                     <StepButton
                        disableRipple={true}
                        icon={<ForwardToInboxOutlined/>}
                        sx={getStepSx(sending)}
                     >
                        <TranslatedText
                           elementProps={{ style: { color: experimentTools.getStageColor(sending) } }}
                           text={'Sending'}
                        />
                     </StepButton>
                  </Step>
                  <Step completed={experimentTools.getStage() > observing}>
                     <StepButton
                        disableRipple={true}
                        icon={<VisibilityOutlined/>}
                        sx={getStepSx(observing)}
                     >
                        <TranslatedText
                           elementProps={{ style: { color: experimentTools.getStageColor(observing) } }}
                           text={'Observing'}
                        />
                     </StepButton>
                  </Step>
                  <Step completed={experimentTools.getStage() === concluded}>
                     <StepButton
                        disableRipple={true}
                        icon={<AssignmentTurnedInOutlined/>}
                        sx={getStepSx(concluded)}
                     >
                        <TranslatedText
                           elementProps={{ style: { color: experimentTools.getStage() === concluded ? Color.inherit : Color.greyLight } }}
                           text={'Concluded'}
                        />
                     </StepButton>
                  </Step>
               </Stepper>
            </Box>
            <Box>
               <Tooltip title={translate('Help on Stages')}>
                  <Button
                     aria-label={translate('Help on Stages')}
                     onClick={launchHelpDialog}
                     sx={{
                        marginBottom: 2.1,
                        marginLeft: 3,
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
            </Box>
         </Box>
         <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
         }}>
            <Typography variant={HtmlElement.h5}>
               <Tooltip title={translate('Return')}>
                  <IconButton
                     aria-label={translate('Return')}
                     onClick={goBack}
                     sx={{
                        bottom: 2,
                        position: 'relative',
                        stroke: Color.blueNeon,
                     }}
                  >
                     <ArrowBack sx={{ strokeWidth: 2 }}/>
                  </IconButton>
               </Tooltip>
               <TranslatedText text={getExperimentId() === 0 ? 'New Experiment' : 'Edit'}/>
               <ShowIf condition={getExperimentId() !== 0}>
                  : {getExperimentName()}
               </ShowIf>
            </Typography>
            <Box>
               <RestrictAccess accessKey={accessKey.experimentClone}>
                  <ShowIf condition={getExperimentId() !== 0}>
                     <Tooltip title={translate('Clone this Experiment')}>
                        <span>
                           <IconButton
                              aria-label={translate('Clone this Experiment')}
                              onClick={clone}
                           >
                              <FileCopyOutlined sx={{
                                 color: Color.greenTemplate,
                                 stroke: Color.white,
                              }}/>
                           </IconButton>
                        </span>
                     </Tooltip>
                  </ShowIf>
               </RestrictAccess>
               <RestrictAccess accessKey={accessKey.experimentAddValues}>
                  <ShowIf condition={experimentTools.isEnabledPendingAndOwnedBy()}>
                     {addButton}
                  </ShowIf>
               </RestrictAccess>
            </Box>
         </Box>
         <Box sx={{
            typography: 'body1',
            width: '100%',
         }}>
            <TabContext value={getTab()}>
               <Box sx={{
                  borderBottom: 1,
                  borderColor: 'divider',
               }}>
                  <TabList
                     aria-label={translate('Experiment Tabs')}
                     onChange={updateTab}
                  >
                     <Tab
                        label={translate(TabName.detail)}
                        value={TabName.detail}
                     />
                     <Tab
                        disabled={getExperimentId() === 0}
                        label={
                           <Box sx={{ color: getHypothesesColor() }}>
                              <TranslatedText text={TabName.hypotheses}/>
                              {' '}
                              ({lookup.hypothesesByExperiment(getExperimentId()).length})
                           </Box>
                        }
                        value={TabName.hypotheses}
                     />
                     <Tab
                        disabled={getExperimentId() === 0}
                        label={
                           <Box sx={{ color: getAudienceColor() }}>
                              <TranslatedText text={TabName.audience}/>
                              {' '}
                              ({getAudienceSize()})
                           </Box>
                        }
                        value={TabName.audience}
                     />
                     <Tab
                        disabled={getExperimentId() === 0}
                        label={
                           <Box sx={{ color: getTemplatesColor() }}>
                              <TranslatedText text={TabName.templates}/>
                              {' '}
                              ({
                                 lookup.emailTemplatesByExperiment(getExperimentId()).length
                                 + lookup.inAppMessageTemplatesByExperiment(getExperimentId()).length
                                 + lookup.textTemplatesByExperiment(getExperimentId()).length
                              })
                           </Box>
                        }
                        value={TabName.templates}
                     />
                     <Tab
                        disabled={getExperimentId() === 0}
                        label={
                           <Box sx={{ color: getTemplatesColor() }}>
                              <TranslatedText text={TabName.schedule}/>
                              {' '}
                              ({
                                 lookup.emailTemplatesByExperiment(getExperimentId()).length
                                 + lookup.inAppMessageTemplatesByExperiment(getExperimentId()).length
                                 + lookup.textTemplatesByExperiment(getExperimentId()).length
                              })
                           </Box>
                        }
                        value={TabName.schedule}
                     />
                     <Tab
                        disabled={getExperimentId() === 0}
                        label={
                           <Box>
                              <TranslatedText text={TabName.sent}/>
                              {' '}
                              ({
                                 lookup.emailsByExperiment(getExperimentId()).length
                                 + lookup.inAppMessagesByExperiment(getExperimentId()).length
                                 + lookup.textsByExperiment(getExperimentId()).length
                              })
                           </Box>
                        }
                        value={TabName.sent}
                     />
                  </TabList>
               </Box>
               <TabPanel value={TabName.detail}>
                  <ExperimentDetailTab/>
               </TabPanel>
               <TabPanel value={TabName.hypotheses}>
                  <ExperimentHypothesesTab/>
               </TabPanel>
               <TabPanel value={TabName.audience}>
                  <ExperimentAudienceTab/>
               </TabPanel>
               <TabPanel value={TabName.templates}>
                  <ExperimentTemplatesTab/>
               </TabPanel>
               <TabPanel value={TabName.schedule}>
                  <ExperimentScheduleTab/>
               </TabPanel>
               <TabPanel value={TabName.sent}>
                  <ExperimentSentTab/>
               </TabPanel>
            </TabContext>
         </Box>
      </RestrictAccess>
   </>
}

export default Experiment;