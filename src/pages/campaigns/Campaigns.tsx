import { AddCircle, AssignmentTurnedInOutlined, CalendarMonthOutlined, CalendarTodayOutlined, DeleteForeverOutlined, ForwardToInboxOutlined, ManageSearchOutlined } from '@mui/icons-material';
import { Box, Chip, Switch, Tooltip, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import type { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { DataGrid } from '@mui/x-data-grid';
import { type ChangeEvent, type MouseEvent, type SyntheticEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Loading } from '../../app/components/Loading';
import { useEndpointStore } from '../../app/hooks/useEndpointStore';
import { Column } from '../../common/components/Column';
import { DefaultSnackbar } from '../../common/components/DefaultSnackbar';
import { RestrictAccess } from '../../common/components/RestrictAccess';
import { Row } from '../../common/components/Row';
import { ShowIf } from '../../common/components/ShowIf';
import { TranslatedText } from '../../common/components/TranslatedText';
import { accessKey } from '../../common/constants/accessKey';
import { pageSizes } from '../../common/constants/pageSizes';
import { Color } from '../../common/enums/Color';
import { HtmlElement } from '../../common/enums/HtmlElement';
import { HttpStatusCode } from '../../common/enums/HttpStatusCode';
import { Path } from '../../common/enums/Path';
import { Stage } from '../../common/enums/Stage';
import { TabName } from '../../common/enums/TabName';
import { getDataGridInitialState } from '../../common/functions/getDataGridInitialState';
import { getGridText } from '../../common/functions/getGridText';
import { getUserDisplayName } from '../../common/functions/getUserDisplayName';
import { useAudienceEndpoint } from '../../common/hooks/endpoints/useAudienceEndpoint';
import { useCohortEndpoint } from '../../common/hooks/endpoints/useCohortEndpoint';
import { useEmailEndpoint } from '../../common/hooks/endpoints/useEmailEndpoint';
import { useEmailTemplateEndpoint } from '../../common/hooks/endpoints/useEmailTemplateEndpoint';
import { useEmailTemplateTagEndpoint } from '../../common/hooks/endpoints/useEmailTemplateTagEndpoint';
import { useCampaignEndpoint } from '../../common/hooks/endpoints/useExperimentEndpoint';
import { useCampaignTagEndpoint } from '../../common/hooks/endpoints/useExperimentTagEndpoint';
import { useCampaignTagRelationshipEndpoint } from '../../common/hooks/endpoints/useExperimentTagRelationshipEndpoint';
import { useInAppMessageEndpoint } from '../../common/hooks/endpoints/useInAppMessageEndpoint';
import { useInAppMessageTemplateEndpoint } from '../../common/hooks/endpoints/useInAppMessageTemplateEndpoint';
import { useInAppMessageTemplateTagEndpoint } from '../../common/hooks/endpoints/useInAppMessageTemplateTagEndpoint';
import { useMessageTagEndpoint } from '../../common/hooks/endpoints/useMessageTagEndpoint';
import { useTextEndpoint } from '../../common/hooks/endpoints/useTextEndpoint';
import { useTextTemplateEndpoint } from '../../common/hooks/endpoints/useTextTemplateEndpoint';
import { useTextTemplateTagEndpoint } from '../../common/hooks/endpoints/useTextTemplateTagEndpoint';
import { useBail } from '../../common/hooks/useBail';
import { useDataGridLocaleText } from '../../common/hooks/useDataGridLocaleText';
import { useLookup } from '../../common/hooks/useLookup';
import { useUXStore } from '../../common/hooks/useUXStore';
import type { CohortDB } from '../../common/interfaces/cohort/CohortDB';
import type { EmailDB } from '../../common/interfaces/email/EmailDB';
import type { EmailTemplateDB } from '../../common/interfaces/emailTemplate/EmailTemplateDB';
import type { EmailTemplateTagDB } from '../../common/interfaces/emailTemplateTag/EmailTemplateTagDB';
import type { CampaignDB } from '../../common/interfaces/experiment/ExperimentDB';
import type { CampaignUI } from '../../common/interfaces/experiment/ExperimentUI';
import type { CampaignTagDB } from '../../common/interfaces/experimentTag/ExperimentTagDB';
import type { CampaignTagRelationshipDB } from '../../common/interfaces/experimentTagRelationship/ExperimentTagRelationshipDB';
import type { InAppMessageDB } from '../../common/interfaces/inAppMessage/InAppMessageDB';
import type { InAppMessageTemplateDB } from '../../common/interfaces/inAppMessageTemplate/InAppMessageTemplateDB';
import type { InAppMessageTemplateTagDB } from '../../common/interfaces/inAppMessageTemplateTag/InAppMessageTemplateTagDB';
import type { MessageTagDB } from '../../common/interfaces/messageTag/MessageTagDB';
import type { TextDB } from '../../common/interfaces/text/TextDB';
import type { TextTemplateDB } from '../../common/interfaces/textTemplate/TextTemplateDB';
import type { TextTemplateTagDB } from '../../common/interfaces/textTemplateTag/TextTemplateTagDB';
import { log } from '../../common/libraries/log';
import { reshape } from '../../common/libraries/reshape';
import { useCampaignsStore } from './_hooks/useCampaignsStore';
import { useCampaignStore } from './campaign/_hooks/useCampaignStore';
import { useCampaignTools } from './campaign/_hooks/useCampaignTools';

const Campaigns = () => {
   const [
      getGridHeight,
      getPageSize,
      getShowError,
      getShowLoading,
      setGridHeight,
      setPageSize,
      setShowError,
      setShowLoading,
   ] = useUXStore(state => [
      state.getGridHeight,
      state.getPageSize,
      state.getShowError,
      state.getShowLoading,
      state.setGridHeight,
      state.setPageSize,
      state.setShowError,
      state.setShowLoading,
   ]);
   const [getUsers] = useEndpointStore(state => [state.getUsers]);
   const [
      setCampaignId,
      setTab,
   ] = useCampaignStore(state => [
      state.setCampaignId,
      state.setTab,
   ]);
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
      setCampaignTags,
      setCampaigns,
      setCohorts,
      setEmailTemplateTags,
      setEmailTemplates,
      setEmails,
      setInAppMessageTemplateTags,
      setInAppMessageTemplates,
      setInAppMessages,
      setMessageTags,
      setTextTemplateTags,
      setTextTemplates,
      setTexts,
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
      state.setCampaignTags,
      state.setCampaigns,
      state.setCohorts,
      state.setEmailTemplateTags,
      state.setEmailTemplates,
      state.setEmails,
      state.setInAppMessageTemplateTags,
      state.setInAppMessageTemplates,
      state.setInAppMessages,
      state.setMessageTags,
      state.setTextTemplateTags,
      state.setTextTemplates,
      state.setTexts,
   ])
   const [deleted, setDeleted] = useState(false);
   const [updated, setUpdated] = useState(false);
   const audienceEndpoint = useAudienceEndpoint();
   const bail = useBail();
   const campaignEndpoint = useCampaignEndpoint();
   const campaignTagEndpoint = useCampaignTagEndpoint();
   const campaignTagRelationshipEndpoint = useCampaignTagRelationshipEndpoint();
   const campaignTools = useCampaignTools();
   const cohortEndpoint = useCohortEndpoint();
   const emailEndpoint = useEmailEndpoint();
   const emailTemplateEndpoint = useEmailTemplateEndpoint();
   const emailTemplateTagEndpoint = useEmailTemplateTagEndpoint();
   const inAppMessageEndpoint = useInAppMessageEndpoint();
   const inAppMessageTemplateEndpoint = useInAppMessageTemplateEndpoint();
   const inAppMessageTemplateTagEndpoint = useInAppMessageTemplateTagEndpoint();
   const localeText = useDataGridLocaleText();
   const lookup = useLookup();
   const messageTagEndpoint = useMessageTagEndpoint();
   const navigate = useNavigate();
   const textEndpoint = useTextEndpoint();
   const textTemplateEndpoint = useTextTemplateEndpoint();
   const textTemplateTagEndpoint = useTextTemplateTagEndpoint();
   const { t: translate } = useTranslation();

   const columns: GridColDef[] = [
      {
         field: 'isDisabled',
         filterable: false,
         flex: 1,
         headerName: '',
         renderCell: (props: GridRenderCellParams) => {
            const { id, isDisabled } = props.row;
            const { concluded } = Stage;
            return <>
               <RestrictAccess accessKey={accessKey.campaignsListActivateCampaign}>
                  <ShowIf condition={campaignTools.getStage(id) !== concluded && campaignTools.isOwnedBy(id)}>
                     <Tooltip title={isDisabled ? translate('Paused') : translate('Active')}>
                        <Switch
                           aria-label={isDisabled ? translate('Paused') : translate('Active')}
                           checked={!isDisabled}
                           color={'success'}
                           inputProps={{ name: id }}
                           onChange={toggleIsDisabled}
                           size={'small'}
                        />
                     </Tooltip>
                  </ShowIf>
               </RestrictAccess>
            </>
         },
         sortable: false,
      },
      {
         field: 'details',
         filterable: false,
         flex: 1,
         headerName: '',
         renderCell: (props: GridRenderCellParams) => {
            const { id } = props.row;
            return <>
               <RestrictAccess accessKey={accessKey.campaignsListGoToCampaignDetail}>
                  <Tooltip title={translate('Details')}>
                     <IconButton
                        aria-label={translate('Details')}
                        onClick={goToCampaignForm}
                        sx={{ color: Color.blueNeon }}
                        value={id}
                     >
                        <ManageSearchOutlined/>
                     </IconButton>
                  </Tooltip>
               </RestrictAccess>
            </>
         },
         sortable: false,
      },
      {
         field: 'id',
         flex: 1,
         headerName: translate('ID'),
         renderCell: (props: GridRenderCellParams) => {
            const { id, isDisabled } = props.row;
            const { concluded } = Stage;
            return campaignTools.getStage(id) === concluded ? id : getGridText(id, isDisabled);
         },
      },
      {
         field: 'campaign',
         flex: 45,
         headerName: translate('Campaign'),
         renderCell: (props: GridRenderCellParams) => {
            const { id, isDisabled, name, ownedBy, tags } = props.row;
            const stage = campaignTools.getStage(id);
            const { concluded } = Stage;
            const owner = getUsers().find(user => user.id === ownedBy);
            let ownerText = null;
            if (owner) {
               const ownerName = getUserDisplayName(owner);
               ownerText = stage === concluded ? ownerName : getGridText(ownerName, isDisabled);
            }
            const tagArray = tags.split(', ');
            return <>
               <Box sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  width: '100%',
               }}>
                  <Box>
                     {stage === concluded ? name : getGridText(name, isDisabled)}
                     <Box sx={{ fontSize: '10px' }}>
                        {ownerText}
                     </Box>
                  </Box>
                  <Box sx={{
                     paddingLeft: 2,
                     paddingTop: !owner ? 0 : '6px',
                  }}>
                     {tagArray.map((tag: string) => (
                        <ShowIf
                           condition={!!tag}
                           key={`${id}-${tag}`}
                        >
                           <Chip
                              color={isDisabled ? 'default' : 'secondary'}
                              label={
                                 <>
                                    <ShowIf condition={isDisabled}>
                                       <span style={{ textDecoration: stage === concluded ? 'inherit' : 'line-through' }}>
                                          {tag}
                                       </span>
                                    </ShowIf>
                                    <ShowIf condition={!isDisabled}>
                                       {tag}
                                    </ShowIf>
                                 </>
                              }
                              size={'small'}
                              sx={{
                                 fontSize: 10,
                                 marginRight: 1,
                              }}
                           />
                        </ShowIf>
                     ))}
                  </Box>
               </Box>
            </>
         },
      },
      {
         field: 'status',
         filterable: false,
         flex: 1,
         headerName: '',
         renderCell: (props: GridRenderCellParams) => {
            const { id, isDisabled } = props.row;
            const { concluded, scheduled, sending, unscheduled } = Stage;
            const stage = campaignTools.getStage(id);
            const color = stage !== concluded && isDisabled ? Color.greyLight : Color.inherit;
            switch (stage) {
               case concluded:
                  return <>
                     <Tooltip title={translate('This campaign has concluded.')}>
                        <AssignmentTurnedInOutlined sx={{ color }}/>
                     </Tooltip>
                  </>
               case scheduled:
                  return <>
                     <Tooltip title={translate('This campaign has messages that are scheduled to be sent.')}>
                        <CalendarMonthOutlined sx={{ color }}/>
                     </Tooltip>
                  </>
               case sending:
                  return <>
                     <Tooltip title={translate('This campaign is in the process of sending messages.')}>
                        <ForwardToInboxOutlined sx={{ color }}/>
                     </Tooltip>
                  </>
               case unscheduled:
                  return <>
                     <Tooltip title={translate('No messages have been scheduled for this campaign.')}>
                        <CalendarTodayOutlined sx={{ color }}/>
                     </Tooltip>
                  </>
            }
         },
      },
      {
         field: 'delete',
         filterable: false,
         flex: 1,
         headerName: '',
         renderCell: (props: GridRenderCellParams) => {
            const { id } = props.row;
            return <>
               <RestrictAccess accessKey={accessKey.campaignsListDeleteCampaign}>
                  <ShowIf condition={campaignTools.isEnabledPendingAndOwnedBy(id)}>
                     <Tooltip title={translate('Delete')}>
                        <IconButton
                           aria-label={translate('Delete')}
                           onClick={deleteCampaign}
                           sx={{ color: Color.red }}
                           value={id}
                        >
                           <DeleteForeverOutlined/>
                        </IconButton>
                     </Tooltip>
                  </ShowIf>
               </RestrictAccess>
            </>
         },
         sortable: false,
      },
   ]

   const closeDeletedSnackbar = (_event?: SyntheticEvent | Event, reason?: string) => {
      reason !== 'clickaway' && setDeleted(false);
   }

   const closeErrorSnackbar = (_event?: SyntheticEvent | Event, reason?: string) => {
      reason !== 'clickaway' && setShowError(false);
   }

   const closeUpdatedSnackbar = (_event?: SyntheticEvent | Event, reason?: string) => {
      reason !== 'clickaway' && setUpdated(false);
   }

   const deleteCampaign = (event: MouseEvent<HTMLButtonElement>) => {
      (async () => {
         setShowLoading(true);
         const campaignId = Number(event.currentTarget.value);
         let errorOccurred = false;
         await Promise.all(lookup.emailTemplateTagsByCampaign(campaignId)
            .map(async emailTemplateTag => {
               if (errorOccurred) return;
               const { id } = emailTemplateTag;
               const { status } = await emailTemplateTagEndpoint.delete(id);
               if (status !== HttpStatusCode.OK) {
                  errorOccurred = true;
                  return;
               }
               const emailTemplateTags = getEmailTemplateTags().filter(emailTemplateTag => emailTemplateTag.id !== id);
               setEmailTemplateTags(emailTemplateTags);
            }));
         if (errorOccurred) return bail.out('Could not delete email template tags');
         await Promise.all(lookup.emailTemplatesByCampaign(campaignId)
            .map(async emailTemplate => {
               if (errorOccurred) return;
               const { id } = emailTemplate;
               const { status } = await emailTemplateEndpoint.delete(id);
               if (status !== HttpStatusCode.OK) {
                  errorOccurred = true;
                  return;
               }
               const emailTemplates = getEmailTemplates().filter(emailTemplate => emailTemplate.id !== id);
               setEmailTemplates(emailTemplates);
            }));
         if (errorOccurred) return bail.out('Could not delete email templates');
         await Promise.all(lookup.inAppMessageTemplateTagsByCampaign(campaignId)
            .map(async inAppMessageTemplateTag => {
               if (errorOccurred) return;
               const { id } = inAppMessageTemplateTag;
               const { status } = await inAppMessageTemplateTagEndpoint.delete(id);
               if (status !== HttpStatusCode.OK) {
                  errorOccurred = true;
                  return;
               }
               const inAppMessageTemplateTags = getInAppMessageTemplateTags()
                  .filter(inAppMessageTemplateTag => inAppMessageTemplateTag.id !== id);
               setInAppMessageTemplateTags(inAppMessageTemplateTags);
            }));
         if (errorOccurred) return bail.out('Could not delete in-app message template tags');
         await Promise.all(lookup.inAppMessageTemplatesByCampaign(campaignId)
            .map(async inAppMessageTemplate => {
               if (errorOccurred) return;
               const { id } = inAppMessageTemplate;
               const { status } = await inAppMessageTemplateEndpoint.delete(id);
               if (status !== HttpStatusCode.OK) {
                  errorOccurred = true;
                  return;
               }
               const inAppMessageTemplates = getInAppMessageTemplates()
                  .filter(inAppMessageTemplate => inAppMessageTemplate.id !== id);
               setInAppMessageTemplates(inAppMessageTemplates);
            }));
         if (errorOccurred) return bail.out('Could not delete in-app message templates');
         await Promise.all(lookup.textTemplateTagsByCampaign(campaignId)
            .map(async textTemplateTag => {
               if (errorOccurred) return;
               const { id } = textTemplateTag;
               const { status } = await textTemplateTagEndpoint.delete(id);
               if (status !== HttpStatusCode.OK) {
                  errorOccurred = true;
                  return;
               }
               const textTemplateTags = getTextTemplateTags().filter(textTemplateTag => textTemplateTag.id !== id);
               setTextTemplateTags(textTemplateTags);
            }));
         if (errorOccurred) return bail.out('Could not delete text template tags');
         await Promise.all(lookup.textTemplatesByCampaign(campaignId)
            .map(async textTemplate => {
               if (errorOccurred) return;
               const { id } = textTemplate;
               const { status } = await textTemplateEndpoint.delete(id);
               if (status !== HttpStatusCode.OK) {
                  errorOccurred = true;
                  return;
               }
               const textTemplates = getTextTemplates().filter(textTemplate => textTemplate.id !== id);
               setTextTemplates(textTemplates);
            }));
         if (errorOccurred) return bail.out('Could not delete email templates');
         await Promise.all(lookup.cohortsByCampaign(campaignId)
            .map(async cohort => {
               if (errorOccurred) return;
               const { id } = cohort;
               const { status } = await cohortEndpoint.delete(id);
               if (status !== HttpStatusCode.OK) {
                  errorOccurred = true;
                  return;
               }
               const cohorts = getCohorts().filter(cohort => cohort.id !== id);
               setCohorts(cohorts);
            }));
         await audienceEndpoint.delete(campaignId);
         const { status } = await campaignEndpoint.delete(campaignId);
         if (status !== HttpStatusCode.OK) return bail.out('Could not delete campaign');
         setDeleted(true);
         const campaigns = getCampaigns().filter(campaign => campaign.id !== campaignId);
         setCampaigns(campaigns);
         setShowLoading(false);
      })();
   }

   const getRows = () => getCampaigns().map(campaign => {
      const { id, isDisabled, name, ownedBy } = campaign;
      return {
         id,
         isDisabled,
         name,
         ownedBy,
         tags: lookup.tagsByCampaign(id).map(tag => tag.name).join(', '),
      }
   })

   const goToCampaignForm = (event: MouseEvent<HTMLButtonElement>) => {
      const campaignId = Number(event.currentTarget.value);
      setCampaignId(campaignId);
      if (campaignId === 0) setTab(TabName.detail);
      navigate(`${Path.campaigns}/${campaignId}`);
   }

   const loadCohorts = async () => {
      const { data, status } = await cohortEndpoint.get();
      if (status !== HttpStatusCode.OK) {
         log.warn('Could not retrieve cohorts');
         return;
      }
      const cohorts = data.map((cohort: CohortDB) => reshape.cohort.DB2UI(cohort));
      setCohorts(cohorts);
   }

   const loadEmails = async () => {
      const { data, status } = await emailEndpoint.get();
      if (status !== HttpStatusCode.OK) {
         log.warn('Could not retrieve emails');
         return;
      }
      const emails = data.map((email: EmailDB) => reshape.email.DB2UI(email));
      setEmails(emails);
   }

   const loadEmailTemplates = async () => {
      const { data, status } = await emailTemplateEndpoint.get();
      if (status !== HttpStatusCode.OK) {
         log.warn('Could not retrieve email templates');
         return;
      }
      const emailTemplates = data.map((emailTemplate: EmailTemplateDB) => reshape.emailTemplate.DB2UI(emailTemplate));
      setEmailTemplates(emailTemplates);
   }

   const loadEmailTemplateTags = async () => {
      const { data, status } = await emailTemplateTagEndpoint.get();
      if (status !== HttpStatusCode.OK) {
         log.warn('Could not retrieve email template tags');
         return;
      }
      const emailTemplateTags = data.map((emailTemplateTag: EmailTemplateTagDB) => reshape.emailTemplateTag.DB2UI(emailTemplateTag));
      setEmailTemplateTags(emailTemplateTags);
   }

   const loadCampaignTagRelationships = async () => {
      const { data, status } = await campaignTagRelationshipEndpoint.get();
      if (status !== HttpStatusCode.OK) {
         setShowLoading(false);
         return log.warn('Could not retrive campaign tag relationships');
      }
      const campaignTagRelationships = data.map((campaignTagRelationship: CampaignTagRelationshipDB) =>
         reshape.campaignTagRelationship.DB2UI(campaignTagRelationship)
      );
      setCampaignTagRelationships(campaignTagRelationships);
   }

   const loadCampaignTags = async () => {
      const { data, status } = await campaignTagEndpoint.get();
      if (status !== HttpStatusCode.OK) {
         setShowLoading(false);
         return log.warn('Could not retrieve campaign tags');
      }
      const campaignTags = data.map((campaignTag: CampaignTagDB) => reshape.campaignTag.DB2UI(campaignTag));
      setCampaignTags(campaignTags);
   }

   const loadCampaigns = () => {
      (async () => {
         const { data, status } = await campaignEndpoint.get();
         if (status !== HttpStatusCode.OK) {
            setShowLoading(false);
            return log.warn('Could not retrieve campaigns');
         }
         const campaigns: CampaignUI[] = data.map((campaign: CampaignDB) => reshape.campaign.DB2UI(campaign));
         const emptyCampaignIds: number[] = [];
         campaigns.forEach(campaign => {
            const { id } = campaign;
            const emails = lookup.emailsByCampaign(id);
            const emailTemplates = lookup.emailTemplatesByCampaign(id);
            const inAppMessages = lookup.inAppMessagesByCampaign(id);
            const inAppMessageTemplates = lookup.inAppMessageTemplatesByCampaign(id);
            const texts = lookup.textsByCampaign(id);
            const textTemplates = lookup.textTemplatesByCampaign(id);
            if (
               campaignTools.getStage(id) === Stage.concluded
               && (
                  emailTemplates.length + inAppMessageTemplates.length + textTemplates.length === 0
                  || emails.length + inAppMessages.length + texts.length === 0
               )
            ) emptyCampaignIds.push(id);
         })
         const newCampaigns = campaigns.filter(campaign => campaign.isCampaign === true && !emptyCampaignIds.includes(campaign.id));
         setCampaigns(newCampaigns);
         const cohorts = getCohorts().filter(cohort => !emptyCampaignIds.includes(cohort.experimentId));
         setCohorts(cohorts);
         const campaignTagRelationships = getCampaignTagRelationships()
            .filter(campaignTagRelationship => !emptyCampaignIds.includes(campaignTagRelationship.experimentId));
         setCampaignTagRelationships(campaignTagRelationships);
      })()
   }

   const loadInAppMessages = async () => {
      const { data, status } = await inAppMessageEndpoint.get();
      if (status !== HttpStatusCode.OK) {
         log.warn('Could not retrieve in-app messages');
         return;
      }
      const inAppMessages = data.map((inAppMessage: InAppMessageDB) => reshape.inAppMessage.DB2UI(inAppMessage));
      setInAppMessages(inAppMessages);
   }

   const loadInAppMessageTemplateTags = async () => {
      const { data, status } = await inAppMessageTemplateTagEndpoint.get();
      if (status !== HttpStatusCode.OK) {
         log.warn('Could not retrieve in-app message template tags');
         return;
      }
      const inAppMessageTemplateTags = data.map((inAppMessageTemplateTag: InAppMessageTemplateTagDB) =>
         reshape.inAppMessageTemplateTag.DB2UI(inAppMessageTemplateTag)
      );
      setInAppMessageTemplateTags(inAppMessageTemplateTags);
   }

   const loadInAppMessageTemplates = async () => {
      const { data, status } = await inAppMessageTemplateEndpoint.get();
      if (status !== HttpStatusCode.OK) {
         log.warn('Could not retrieve in-app message templates');
         return;
      }
      const inAppMessageTemplates = data.map((inAppMessageTemplate: InAppMessageTemplateDB) =>
         reshape.inAppMessageTemplate.DB2UI(inAppMessageTemplate)
      );
      setInAppMessageTemplates(inAppMessageTemplates);
   }

   const loadMessageTags = async () => {
      const { data, status } = await messageTagEndpoint.get();
      if (status !== HttpStatusCode.OK) {
         log.warn('Could not retrieve message tags');
         return;
      }
      const messageTags = data.map((messageTag: MessageTagDB) => reshape.messageTag.DB2UI(messageTag));
      setMessageTags(messageTags);
   }

   const loadTexts = async () => {
      const { data, status } = await textEndpoint.get();
      if (status !== HttpStatusCode.OK) {
         log.warn('Could not retrieve texts');
         return;
      }
      const texts = data.map((text: TextDB) => reshape.text.DB2UI(text));
      setTexts(texts);
   }

   const loadTextTemplates = async () => {
      const { data, status } = await textTemplateEndpoint.get();
      if (status !== HttpStatusCode.OK) {
         log.warn('Could not retrieve text templates');
         return;
      }
      const textTemplates = data.map((textTemplate: TextTemplateDB) => reshape.textTemplate.DB2UI(textTemplate));
      setTextTemplates(textTemplates);
   }

   const loadTextTemplateTags = async () => {
      const { data, status } = await textTemplateTagEndpoint.get();
      if (status !== HttpStatusCode.OK) {
         log.warn('Could not retrieve text template tags');
         return;
      }
      const textTemplateTags = data.map((textTemplateTag: TextTemplateTagDB) => reshape.textTemplateTag.DB2UI(textTemplateTag));
      setTextTemplateTags(textTemplateTags);
   }

   const toggleIsDisabled = (event: ChangeEvent<HTMLInputElement>) => {
      (async () => {
         setShowLoading(true);
         const campaignId = Number(event.target.name);
         const index = getCampaigns().findIndex(campaign => campaign.id === campaignId);
         if (index === -1) return bail.out(`Could not find campaign #${campaignId}`);
         const campaigns = getCampaigns();
         campaigns[index].isDisabled = !campaigns[index].isDisabled;
         const { status } = await campaignEndpoint.put(campaigns[index]);
         if (status !== HttpStatusCode.OK) return bail.out(['Could not update campaign:', campaigns[index]]);
         setUpdated(true);
         setCampaigns(campaigns);
         setShowLoading(false);
      })()
   }

   useEffect(() => {
      (async () => {
         setShowLoading(true);
         await Promise.all([
            loadCampaignTagRelationships(),
            loadCampaignTags(),
            loadCohorts(),
            loadEmailTemplateTags(),
            loadEmailTemplates(),
            loadEmails(),
            loadInAppMessageTemplateTags(),
            loadMessageTags(),
            loadTextTemplateTags(),
         ]);
         await Promise.all([
            loadInAppMessages(),
            loadInAppMessageTemplates(),
            loadTexts(),
            loadTextTemplates(),
         ]);
         setTimeout(() => loadCampaigns(), 750);
         setShowLoading(false);
      })()
   }, []);

   useEffect(() => {
      setGridHeight(getCampaigns().length);
   }, [getCampaigns().length, getPageSize()]);

   return <>
      <RestrictAccess accessKey={accessKey.campaignsListViewPage}>
         <Loading open={getShowLoading()}/>
         <DefaultSnackbar
            onClose={closeDeletedSnackbar}
            open={deleted}
            severity={'success'}
            text={'The campaign has been deleted.'}
         />
         <DefaultSnackbar
            onClose={closeUpdatedSnackbar}
            open={updated}
            severity={'success'}
            text={'The campaign has been updated.'}
         />
         <DefaultSnackbar
            onClose={closeErrorSnackbar}
            open={getShowError()}
            severity={'error'}
            text={'An error occurred.'}
         />
         <Row>
            <Column xs={12} sm={12} md={12} lg={12} xl={10}>
               <Box sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
               }}>
                  <Typography
                     sx={{ marginBottom: 2 }}
                     variant={HtmlElement.h5}
                  >
                     <TranslatedText text={'Campaigns'}/>
                  </Typography>
                  <RestrictAccess accessKey={accessKey.campaignsListCreateCampaign}>
                     <Tooltip title={translate('Create new Campaign')}>
                        <IconButton
                           aria-label={translate('Create new Campaign')}
                           onClick={goToCampaignForm}
                           value={0}
                        >
                           <AddCircle sx={{
                              color: Color.greenTemplate,
                              stroke: Color.white,
                           }}/>
                        </IconButton>
                     </Tooltip>
                  </RestrictAccess>
               </Box>
               <div style={{
                  height: getGridHeight(),
                  minWidth: 800,
                  width: '100%',
               }}>
                  <DataGrid
                     columns={columns}
                     density={'compact'}
                     disableRowSelectionOnClick={true}
                     initialState={getDataGridInitialState()}
                     localeText={localeText.get()}
                     onPaginationModelChange={setPageSize}
                     pageSizeOptions={pageSizes}
                     rows={getRows()}
                  />
               </div>
            </Column>
         </Row>
      </RestrictAccess>
   </>
}

export default Campaigns;