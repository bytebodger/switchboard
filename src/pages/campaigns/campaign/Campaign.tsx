import { ArrowBack, AssignmentTurnedInOutlined, CalendarMonthOutlined, CalendarTodayOutlined, FileCopyOutlined, ForwardToInboxOutlined, HelpOutlined } from '@mui/icons-material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Box, Button, Step, StepButton, Stepper, Tab, Tooltip, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import dayjs from 'dayjs';
import { type SyntheticEvent, useEffect, useState } from 'react';
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
import { useCampaignEndpoint } from '../../../common/hooks/endpoints/useExperimentEndpoint';
import { useCampaignTagRelationshipEndpoint } from '../../../common/hooks/endpoints/useExperimentTagRelationshipEndpoint';
import { useInAppMessageTemplateEndpoint } from '../../../common/hooks/endpoints/useInAppMessageTemplateEndpoint';
import { useInAppMessageTemplateTagEndpoint } from '../../../common/hooks/endpoints/useInAppMessageTemplateTagEndpoint';
import { useTextTemplateEndpoint } from '../../../common/hooks/endpoints/useTextTemplateEndpoint';
import { useTextTemplateTagEndpoint } from '../../../common/hooks/endpoints/useTextTemplateTagEndpoint';
import { useBail } from '../../../common/hooks/useBail';
import { useLookup } from '../../../common/hooks/useLookup';
import { useUXStore } from '../../../common/hooks/useUXStore';
import type { CampaignUI } from '../../../common/interfaces/experiment/ExperimentUI';
import { log } from '../../../common/libraries/log';
import { DataType } from '../../../common/types/DataType';
import { useCampaignsStore } from '../_hooks/useCampaignsStore';
import { CampaignAudienceTab } from './_components/tabs/CampaignAudienceTab';
import { CampaignDetailTab } from './_components/tabs/CampaignDetailTab';
import { CampaignScheduleTab } from './_components/tabs/CampaignScheduleTab';
import { CampaignSentTab } from './_components/tabs/CampaignSentTab';
import { CampaignTemplatesTab } from './_components/tabs/CampaignTemplatesTab';
import { useCampaignStore } from './_hooks/useCampaignStore';
import { useCampaignTools } from './_hooks/useCampaignTools';

const Campaign = () => {
   const [
      addButton,
      getAudienceSize,
      getCampaignId,
      getTab,
      resetForm,
      setAudienceSize,
      setCampaignId,
      setTab,
   ] = useCampaignStore(state => [
      state.addButton,
      state.getAudienceSize,
      state.getCampaignId,
      state.getTab,
      state.resetForm,
      state.setAudienceSize,
      state.setCampaignId,
      state.setTab,
   ]);
   const [getUser] = useEndpointStore(state => [state.getUser]);
   const [
      getCampaignTagRelationships,
      getCampaigns,
      getCohorts,
      getEmailTemplateTags,
      getEmailTemplates,
      getInAppMessageTemplateTags,
      getInAppMessageTemplates,
      getTextTemplateTags,
      getTextTemplates,
      setCampaignTagRelationships,
      setCampaigns,
      setCohorts,
      setEmailTemplateTags,
      setEmailTemplates,
      setInAppMessageTemplateTags,
      setInAppMessageTemplates,
      setTextTemplateTags,
      setTextTemplates,
   ] = useCampaignsStore(state => [
      state.getCampaignTagRelationships,
      state.getCampaigns,
      state.getCohorts,
      state.getEmailTemplateTags,
      state.getEmailTemplates,
      state.getInAppMessageTemplateTags,
      state.getInAppMessageTemplates,
      state.getTextTemplateTags,
      state.getTextTemplates,
      state.setCampaignTagRelationships,
      state.setCampaigns,
      state.setCohorts,
      state.setEmailTemplateTags,
      state.setEmailTemplates,
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
   const campaignEndpoint = useCampaignEndpoint();
   const campaignTagRelationshipEndpoint = useCampaignTagRelationshipEndpoint();
   const campaignTools = useCampaignTools();
   const cohortEndpoint = useCohortEndpoint();
   const emailTemplateEndpoint = useEmailTemplateEndpoint();
   const emailTemplateTagEndpoint = useEmailTemplateTagEndpoint();
   const inAppMessageTemplateEndpoint = useInAppMessageTemplateEndpoint();
   const inAppMessageTemplateTagEndpoint = useInAppMessageTemplateTagEndpoint();
   const lookup = useLookup();
   const navigate = useNavigate();
   const params = useParams();
   const textTemplateEndpoint = useTextTemplateEndpoint();
   const textTemplateTagEndpoint = useTextTemplateTagEndpoint();
   const { t: translate } = useTranslation();

   const { concluded, scheduled, sending, unscheduled } = Stage;

   const clone = () => {
      (async () => {
         setShowLoading(true);
         const campaign = getCampaigns().find(campaign => campaign.id === getCampaignId());
         if (!campaign) return bail.out(`Could not find campaign #${getCampaignId()}`);
         const cloneCampaignId = await cloneCampaign(campaign);
         if (!cloneCampaignId) return;
         if (!await cloneCampaignTags(cloneCampaignId)) {
            deleteCampaign(cloneCampaignId);
            return;
         }
         if (!await cloneCohorts(cloneCampaignId)) {
            deleteCampaignTagRelationships(cloneCampaignId);
            deleteCampaign(cloneCampaignId);
            return;
         }
         if (!await cloneMessageTemplates(cloneCampaignId)) {
            deleteCohorts(cloneCampaignId);
            deleteCampaignTagRelationships(cloneCampaignId);
            deleteCampaign(cloneCampaignId);
            return;
         }
         setCampaignId(cloneCampaignId);
         setShowLoading(false);
         navigate(`${Path.campaigns}/${cloneCampaignId}`);
      })()
   }

   const cloneCohorts = async (cloneCampaignId: number) => {
      let errorOccurred = false;
      let cohortsAdded = false;
      await Promise.all(lookup.cohortsByCampaign(getCampaignId())
         .map(async cohort => {
            if (errorOccurred) return;
            const { comparator, field, ordinal, table, value } = cohort;
            const dataType = getCohortDataType(table, field);
            let newValue = value;
            if (dataType === DataType.datetime) newValue = dayjs(value).utc(true).format(Format.dateTime);
            const { data, status } = await cohortEndpoint.post(
               comparator,
               cloneCampaignId,
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
               experimentId: cloneCampaignId,
               field,
               id: newCohortId,
               ordinal,
               table,
               value: newValue,
            })
            setCohorts(cohorts);
         }));
      if (!errorOccurred && cohortsAdded) {
         const { status: audienceCreationStatus } = await audienceEndpoint.post(cloneCampaignId);
         if (audienceCreationStatus !== HttpStatusCode.noContent) {
            errorOccurred = true;
            return bail.out('Could not create audience', false);
         }
         const { data, status: audienceCountStatus } = await audienceCountEndpoint.get(cloneCampaignId);
         if (audienceCountStatus !== HttpStatusCode.OK) return bail.out('Could not retrieve audience size');
         setAudienceSize(Number(data));
      }
      if (errorOccurred) deleteCohorts(cloneCampaignId);
      return !errorOccurred;
   }

   const cloneEmailTemplates = async (cloneCampaignId: number) => {
      let errorOccurred = false;
      const original = getCampaigns().find(campaign => campaign.id === getCampaignId());
      if (!original) {
         errorOccurred = true;
         return bail.out('Could not find original campaign');
      }
      await Promise.all(lookup.emailTemplatesByCampaign(getCampaignId())
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
               cloneCampaignId,
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
               experimentId: cloneCampaignId,
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
      if (errorOccurred) deleteEmailTemplates(cloneCampaignId);
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

   const cloneCampaign = async (original: CampaignUI) => {
      const { description, name, sendFrom, sendFromName, successMetric } = original;
      const endOn = dayjs().utc().add(14, 'day').format(Format.date);
      const userId = getNumber(getUser()?.id);
      const newName = `${name} (${new Date().toISOString()})`;
      const { data: campaignCreateData, status: campaignCreateStatus } = await campaignEndpoint.post(
         newName,
         getString(description),
         dayjs().utc().format(Format.dateTime),
         endOn,
         userId,
         getString(successMetric),
         sendFrom,
         sendFromName,
         true,
      );
      if (campaignCreateStatus !== HttpStatusCode.created)
         return bail.out(['Could not create campaign:', name, description, successMetric], 0);
      const newCampaignId = parseApiId(campaignCreateData);
      const campaigns = getCampaigns();
      const currentDate = dayjs().utc().format(Format.dateTime);
      campaigns.push({
         beginOn: currentDate,
         createdBy: userId,
         createdOn: currentDate,
         description,
         disabledOn: null,
         endOn,
         id: newCampaignId,
         isCampaign: true,
         isDisabled: false,
         modifiedBy: userId,
         modifiedOn: currentDate,
         name: newName,
         ownedBy: userId,
         sendFrom,
         sendFromName,
         successMetric,
      });
      setCampaigns(campaigns);
      return newCampaignId;
   }

   const cloneCampaignTags = async (cloneCampaignId: number) => {
      let errorOccurred = false;
      await Promise.all(getCampaignTagRelationships()
         .filter(campaignTagRelationship => campaignTagRelationship.experimentId === getCampaignId())
         .map(async campaignTagRelationship => {
            if (errorOccurred) return;
            const { experimentTagId } = campaignTagRelationship;
            const { data, status } = await campaignTagRelationshipEndpoint.post(cloneCampaignId, experimentTagId);
            if (status !== HttpStatusCode.created) {
               errorOccurred = true;
               return bail.out(`Could not create tag relationship for campaign #${cloneCampaignId} and campaignTag #${experimentTagId}`);
            }
            const newCampaignTagRelationshipId = parseApiId(data);
            const allCampaignTagRelationships = getCampaignTagRelationships();
            allCampaignTagRelationships.push({
               experimentId: cloneCampaignId,
               experimentTagId,
               id: newCampaignTagRelationshipId,
            })
            setCampaignTagRelationships(allCampaignTagRelationships);
         }));
      if (errorOccurred) deleteCampaignTagRelationships(cloneCampaignId);
      return !errorOccurred;
   }

   const cloneInAppMessageTemplates = async (cloneCampaignId: number) => {
      let errorOccurred = false;
      const campaign = getCampaigns().find(campaign => campaign.id === getCampaignId());
      if (!campaign) {
         errorOccurred = true;
         return bail.out('Could not find original campaign');
      }
      await Promise.all(lookup.inAppMessageTemplatesByCampaign(getCampaignId())
         .map(async inAppMessageTemplate => {
            if (errorOccurred) return;
            const { aimlId, id, message, sendOn, weight } = inAppMessageTemplate;
            const allInAppMessageTemplates = getInAppMessageTemplates();
            const originalBeginOnTime = dayjs(campaign.beginOn).utc(true).valueOf();
            const sendOnTime = dayjs(sendOn).utc(true).valueOf();
            const newBeginOnTime = dayjs().utc().valueOf();
            let newSendOnTime = newBeginOnTime + sendOnTime - originalBeginOnTime;
            if (newSendOnTime <= newBeginOnTime) newSendOnTime = newBeginOnTime + Milliseconds.day;
            const newSendOn = dayjs(newSendOnTime).utc(true).format(Format.dateTime);
            const { data, status } = await inAppMessageTemplateEndpoint.post(
               message,
               cloneCampaignId,
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
               experimentId: cloneCampaignId,
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
      if (errorOccurred) deleteInAppMessageTemplates(cloneCampaignId);
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

   const cloneMessageTemplates = async (cloneCampaignId: number) => {
      const emailTemplatesResult = await cloneEmailTemplates(cloneCampaignId);
      if (!emailTemplatesResult) return false;
      const inAppMessageTemplatesResult = await cloneInAppMessageTemplates(cloneCampaignId);
      if (!inAppMessageTemplatesResult) return false;
      return await cloneTextTemplates(cloneCampaignId);
   }

   const cloneTextTemplates = async (cloneCampaignId: number) => {
      let errorOccurred = false;
      const campaign = getCampaigns().find(campaign => campaign.id === getCampaignId());
      if (!campaign) {
         errorOccurred = true;
         return bail.out('Could not find original campaign');
      }
      await Promise.all(lookup.textTemplatesByCampaign(getCampaignId())
         .map(async textTemplate => {
            if (errorOccurred) return;
            const { aimlId, id, message, sendOn, weight } = textTemplate;
            const allTextTemplates = getTextTemplates();
            const originalBeginOnTime = dayjs(campaign.beginOn).utc(true).valueOf();
            const sendOnTime = dayjs(sendOn).utc(true).valueOf();
            const newBeginOnTime = dayjs().utc().valueOf();
            let newSendOnTime = newBeginOnTime + sendOnTime - originalBeginOnTime;
            if (newSendOnTime <= newBeginOnTime) newSendOnTime = newBeginOnTime + Milliseconds.day;
            const newSendOn = dayjs(newSendOnTime).utc(true).format(Format.dateTime);
            const { data, status } = await textTemplateEndpoint.post(
               cloneCampaignId,
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
               experimentId: cloneCampaignId,
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
      if (errorOccurred) deleteTextTemplates(cloneCampaignId);
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

   const deleteCohorts = (cloneCampaignId: number) => {
      (async () => {
         await audienceEndpoint.delete((cloneCampaignId));
         setAudienceSize(0);
      })()
      getCohorts()
         .filter(cohort => cohort.experimentId === cloneCampaignId)
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

   const deleteEmailTemplates = (cloneCampaignId: number) => {
      getEmailTemplates()
         .filter(emailTemplate => emailTemplate.experimentId === cloneCampaignId)
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

   const deleteEmailTemplateTags = (cloneCampaignId: number) => {
      lookup.emailTemplateTagsByCampaign(cloneCampaignId)
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

   const deleteCampaign = (cloneCampaignId: number) => {
      (async () => {
         setShowLoading(true);
         const { status } = await campaignEndpoint.delete(cloneCampaignId);
         if (status !== HttpStatusCode.OK) return bail.out(`Could not delete campaign #${cloneCampaignId}`);
         const newCampaigns = getCampaigns().filter(campaign => campaign.id !== cloneCampaignId);
         setCampaigns(newCampaigns);
         setShowLoading(false);
      })()
   }

   const deleteCampaignTagRelationships = (cloneCampaignId: number) => {
      getCampaignTagRelationships()
         .filter(campaignTagRelationship => campaignTagRelationship.experimentId === cloneCampaignId)
         .forEach(campaignTagRelationship => {
            (async () => {
               const { id } = campaignTagRelationship;
               const { status } = await campaignTagRelationshipEndpoint.delete(id);
               if (status !== HttpStatusCode.OK) {
                  setShowError(true);
                  log.warn(`Could not remove tag #${id}`);
                  return;
               }
               const newCampaignTagRelationships = getCampaignTagRelationships()
                  .filter(relationship => relationship.id !== id);
               setCampaignTagRelationships(newCampaignTagRelationships);
            })()
         })
   }

   const deleteInAppMessageTemplates = (cloneCampaignId: number) => {
      getInAppMessageTemplates()
         .filter(inAppMessageTemplate => inAppMessageTemplate.experimentId === cloneCampaignId)
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

   const deleteInAppMessageTemplateTags = (cloneCampaignId: number) => {
      lookup.inAppMessageTemplateTagsByCampaign(cloneCampaignId)
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

   const deleteTextTemplates = (cloneCampaignId: number) => {
      getTextTemplates()
         .filter(textTemplate => textTemplate.experimentId === cloneCampaignId)
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

   const deleteTextTemplateTags = (cloneCampaignId: number) => {
      lookup.textTemplateTagsByCampaign(cloneCampaignId)
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
      if (getCampaignId() === 0) return Color.greyLight;
      return lookup.cohortsByCampaign(getCampaignId()).length ? Color.inherit : Color.red;
   }

   const getCampaignName = () => {
      const campaign = getCampaigns().find(campaign => campaign.id === getCampaignId());
      return campaign?.name;
   }

   const getStepSx = (stage: Stage) => {
      const { greenTemplate, greyLight, inherit, white } = Color;
      const currentStage = campaignTools.getStage();
      let color;
      if (currentStage === stage) {
         color = [concluded, unscheduled].includes(stage) ? inherit : campaignTools.getStageColor(stage);
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
            color = stage === unscheduled ? greenTemplate : campaignTools.getStageColor(stage);
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
      if (getCampaignId() === 0) return Color.greyLight;
      const totalEmailTemplates = lookup.emailTemplatesByCampaign(getCampaignId()).length;
      const totalInAppMessageTemplates = lookup.inAppMessageTemplatesByCampaign(getCampaignId()).length;
      const totalTextTemplates = lookup.textTemplatesByCampaign(getCampaignId()).length;
      return totalEmailTemplates + totalInAppMessageTemplates + totalTextTemplates > 0 ? Color.inherit : Color.red;
   }

   const goBack = () => {
      resetForm(getUser());
      navigate(Path.campaigns);
   }

   const launchHelpDialog = () => setHelpOpen(true);

   const updateTab = (_event: SyntheticEvent, newTab: TabName) => setTab(newTab);

   useEffect(() => {
      (async () => {
         const { data, status: audienceCountStatus } = await audienceCountEndpoint.get(getCampaignId());
         if (audienceCountStatus !== HttpStatusCode.OK) return bail.out('Could not retrieve audience size');
         setAudienceSize(Number(data));
      })()
   }, [])

   useEffect(() => {
      const campaignId = getNumber(params.campaignId);
      if (campaignId !== getCampaignId()) setCampaignId(campaignId);
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
      <RestrictAccess accessKey={accessKey.campaignViewPage}>
         <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: 4,
         }}>
            <Box sx={{ flexGrow: 1 }}>
               <Stepper
                  activeStep={campaignTools.getStage()}
                  nonLinear={true}
               >
                  <Step completed={campaignTools.getStage() > unscheduled}>
                     <StepButton
                        disableRipple={true}
                        icon={<CalendarTodayOutlined/>}
                        sx={getStepSx(unscheduled)}
                     >
                        <TranslatedText
                           elementProps={{ style: { color: campaignTools.getStage() === unscheduled ? Color.inherit : Color.greenTemplate } }}
                           text={'Unscheduled'}
                        />
                     </StepButton>
                  </Step>
                  <Step completed={campaignTools.getStage() > scheduled}>
                     <StepButton
                        disableRipple={true}
                        icon={<CalendarMonthOutlined/>}
                        sx={getStepSx(scheduled)}
                     >
                        <TranslatedText
                           elementProps={{ style: { color: campaignTools.getStageColor(scheduled) } }}
                           text={'Scheduled'}
                        />
                     </StepButton>
                  </Step>
                  <Step completed={campaignTools.getStage() > sending}>
                     <StepButton
                        disableRipple={true}
                        icon={<ForwardToInboxOutlined/>}
                        sx={getStepSx(sending)}
                     >
                        <TranslatedText
                           elementProps={{ style: { color: campaignTools.getStageColor(sending) } }}
                           text={'Sending'}
                        />
                     </StepButton>
                  </Step>
                  <Step completed={campaignTools.getStage() === concluded}>
                     <StepButton
                        disableRipple={true}
                        icon={<AssignmentTurnedInOutlined/>}
                        sx={getStepSx(concluded)}
                     >
                        <TranslatedText
                           elementProps={{ style: { color: campaignTools.getStage() === concluded ? Color.inherit : Color.greyLight } }}
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
               <TranslatedText text={getCampaignId() === 0 ? 'New Campaign' : 'Edit'}/>
               <ShowIf condition={getCampaignId() !== 0}>
                  : {getCampaignName()}
               </ShowIf>
            </Typography>
            <Box>
               <RestrictAccess accessKey={accessKey.campaignClone}>
                  <ShowIf condition={getCampaignId() !== 0}>
                     <Tooltip title={translate('Clone this Campaign')}>
                        <span>
                           <IconButton
                              aria-label={translate('Clone this Campaign')}
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
               <RestrictAccess accessKey={accessKey.campaignAddValues}>
                  <ShowIf condition={campaignTools.isEnabledPendingAndOwnedBy()}>
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
                     aria-label={translate('Campaign Tabs')}
                     onChange={updateTab}
                  >
                     <Tab
                        label={translate(TabName.detail)}
                        value={TabName.detail}
                     />
                     <Tab
                        disabled={getCampaignId() === 0}
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
                        disabled={getCampaignId() === 0}
                        label={
                           <Box sx={{ color: getTemplatesColor() }}>
                              <TranslatedText text={TabName.templates}/>
                              {' '}
                              ({
                                 lookup.emailTemplatesByCampaign(getCampaignId()).length
                                 + lookup.inAppMessageTemplatesByCampaign(getCampaignId()).length
                                 + lookup.textTemplatesByCampaign(getCampaignId()).length
                              })
                           </Box>
                        }
                        value={TabName.templates}
                     />
                     <Tab
                        disabled={getCampaignId() === 0}
                        label={
                           <Box sx={{ color: getTemplatesColor() }}>
                              <TranslatedText text={TabName.schedule}/>
                              {' '}
                              ({
                                 lookup.emailTemplatesByCampaign(getCampaignId()).length
                                 + lookup.inAppMessageTemplatesByCampaign(getCampaignId()).length
                                 + lookup.textTemplatesByCampaign(getCampaignId()).length
                              })
                           </Box>
                        }
                        value={TabName.schedule}
                     />
                     <Tab
                        disabled={getCampaignId() === 0}
                        label={
                           <Box>
                              <TranslatedText text={TabName.sent}/>
                              {' '}
                              ({
                                 lookup.emailsByCampaign(getCampaignId()).length
                                 + lookup.inAppMessagesByCampaign(getCampaignId()).length
                                 + lookup.textsByCampaign(getCampaignId()).length
                              })
                           </Box>
                        }
                        value={TabName.sent}
                     />
                  </TabList>
               </Box>
               <TabPanel value={TabName.detail}>
                  <CampaignDetailTab/>
               </TabPanel>
               <TabPanel value={TabName.audience}>
                  <CampaignAudienceTab/>
               </TabPanel>
               <TabPanel value={TabName.templates}>
                  <CampaignTemplatesTab/>
               </TabPanel>
               <TabPanel value={TabName.schedule}>
                  <CampaignScheduleTab/>
               </TabPanel>
               <TabPanel value={TabName.sent}>
                  <CampaignSentTab/>
               </TabPanel>
            </TabContext>
         </Box>
      </RestrictAccess>
   </>
}

export default Campaign;