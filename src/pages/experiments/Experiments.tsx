import { AddCircle, AssignmentTurnedInOutlined, CalendarMonthOutlined, CalendarTodayOutlined, DeleteForeverOutlined, ForwardToInboxOutlined, ManageSearchOutlined, VisibilityOutlined, } from '@mui/icons-material';
import { Box, Chip, Switch, Tooltip, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import type { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { DataGrid } from '@mui/x-data-grid';
import dayjs from 'dayjs';
import type { ChangeEvent, MouseEvent, SyntheticEvent } from 'react';
import { useEffect, useState } from 'react';
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
import { useExperimentEndpoint } from '../../common/hooks/endpoints/useExperimentEndpoint';
import { useExperimentTagEndpoint } from '../../common/hooks/endpoints/useExperimentTagEndpoint';
import { useExperimentTagRelationshipEndpoint } from '../../common/hooks/endpoints/useExperimentTagRelationshipEndpoint';
import { useHypothesisEndpoint } from '../../common/hooks/endpoints/useHypothesisEndpoint';
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
import type { ExperimentDB } from '../../common/interfaces/experiment/ExperimentDB';
import type { ExperimentUI } from '../../common/interfaces/experiment/ExperimentUI';
import type { ExperimentTagDB } from '../../common/interfaces/experimentTag/ExperimentTagDB';
import type { ExperimentTagRelationshipDB } from '../../common/interfaces/experimentTagRelationship/ExperimentTagRelationshipDB';
import type { HypothesisDB } from '../../common/interfaces/hypothesis/HypothesisDB';
import type { InAppMessageDB } from '../../common/interfaces/inAppMessage/InAppMessageDB';
import type { InAppMessageTemplateDB } from '../../common/interfaces/inAppMessageTemplate/InAppMessageTemplateDB';
import type { InAppMessageTemplateTagDB } from '../../common/interfaces/inAppMessageTemplateTag/InAppMessageTemplateTagDB';
import type { MessageTagDB } from '../../common/interfaces/messageTag/MessageTagDB';
import type { TextDB } from '../../common/interfaces/text/TextDB';
import type { TextTemplateDB } from '../../common/interfaces/textTemplate/TextTemplateDB';
import type { TextTemplateTagDB } from '../../common/interfaces/textTemplateTag/TextTemplateTagDB';
import { log } from '../../common/libraries/log';
import { reshape } from '../../common/libraries/reshape';
import { useExperimentsStore } from './_hooks/useExperimentsStore';
import { useExperimentStore } from './experiment/_hooks/useExperimentStore';
import { useExperimentTools } from './experiment/_hooks/useExperimentTools';

const Experiments = () => {
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
      setExperimentId,
      setTab,
   ] = useExperimentStore(state => [
      state.setExperimentId,
      state.setTab,
   ]);
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
      setEmails,
      setExperimentTagRelationships,
      setExperimentTags,
      setExperiments,
      setHypotheses,
      setInAppMessageTemplateTags,
      setInAppMessageTemplates,
      setInAppMessages,
      setMessageTags,
      setTextTemplateTags,
      setTextTemplates,
      setTexts,
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
      state.setEmails,
      state.setExperimentTagRelationships,
      state.setExperimentTags,
      state.setExperiments,
      state.setHypotheses,
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
   const cohortEndpoint = useCohortEndpoint();
   const emailEndpoint = useEmailEndpoint();
   const emailTemplateEndpoint = useEmailTemplateEndpoint();
   const emailTemplateTagEndpoint = useEmailTemplateTagEndpoint();
   const experimentEndpoint = useExperimentEndpoint();
   const experimentTagEndpoint = useExperimentTagEndpoint();
   const experimentTagRelationshipEndpoint = useExperimentTagRelationshipEndpoint();
   const experimentTools = useExperimentTools();
   const hypothesisEndpoint = useHypothesisEndpoint();
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
            const { concluded, observing } = Stage;
            return <>
               <RestrictAccess accessKey={accessKey.experimentsListActivateExperiment}>
                  <ShowIf condition={![concluded, observing].includes(experimentTools.getStage(id)) && experimentTools.isOwnedBy(id)}>
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
               <RestrictAccess accessKey={accessKey.experimentsListGoToExperimentDetail}>
                  <Tooltip title={translate('Details')}>
                     <IconButton
                        aria-label={translate('Details')}
                        onClick={goToExperimentForm}
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
            const { concluded, observing } = Stage;
            return [concluded, observing].includes(experimentTools.getStage(id)) ? id : getGridText(id, isDisabled);
         },
      },
      {
         field: 'experiment',
         flex: 45,
         headerName: translate('Experiment'),
         renderCell: (props: GridRenderCellParams) => {
            const { id, isDisabled, name, ownedBy, tags } = props.row;
            const stage = experimentTools.getStage(id);
            const { concluded, observing } = Stage;
            const owner = getUsers().find(user => user.id === ownedBy);
            let ownerText = null;
            if (owner) {
               const ownerName = getUserDisplayName(owner);
               ownerText = [concluded, observing].includes(stage) ? ownerName : getGridText(ownerName, isDisabled);
            }
            const tagArray = tags.split(', ');
            return <>
               <Box sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  width: '100%',
               }}>
                  <Box>
                     {[concluded, observing].includes(stage) ? name : getGridText(name, isDisabled)}
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
         field: 'endOn',
         flex: 1,
         minWidth: 90,
         headerName: translate('End'),
         renderCell: (props: GridRenderCellParams) => {
            const { endOn, id, isDisabled } = props.row;
            const { concluded, observing } = Stage;
            return [concluded, observing].includes(experimentTools.getStage(id)) ? endOn : getGridText(endOn, isDisabled);
         },
      },
      {
         field: 'status',
         filterable: false,
         flex: 1,
         headerName: '',
         renderCell: (props: GridRenderCellParams) => {
            const { id, isDisabled } = props.row;
            const { concluded, observing, scheduled, sending, unscheduled } = Stage;
            const stage = experimentTools.getStage(id);
            const color = ![concluded, observing].includes(stage) && isDisabled ? Color.greyLight : Color.inherit;
            switch (stage) {
               case concluded:
                  return <>
                     <Tooltip title={translate('This experiment has concluded.')}>
                        <AssignmentTurnedInOutlined sx={{ color }}/>
                     </Tooltip>
                  </>
               case observing:
                  return <>
                     <Tooltip title={translate('All messages have been sent and recipient activities are being observed.')}>
                        <VisibilityOutlined sx={{ color }}/>
                     </Tooltip>
                  </>
               case scheduled:
                  return <>
                     <Tooltip title={translate('This experiment has messages that are scheduled to be sent.')}>
                        <CalendarMonthOutlined sx={{ color }}/>
                     </Tooltip>
                  </>
               case sending:
                  return <>
                     <Tooltip title={translate('This experiment is in the process of sending messages.')}>
                        <ForwardToInboxOutlined sx={{ color }}/>
                     </Tooltip>
                  </>
               case unscheduled:
                  return <>
                     <Tooltip title={translate('No messages have been scheduled for this experiment.')}>
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
               <RestrictAccess accessKey={accessKey.experimentsListDeleteExperiment}>
                  <ShowIf condition={experimentTools.isEnabledPendingAndOwnedBy(id)}>
                     <Tooltip title={translate('Delete')}>
                        <IconButton
                           aria-label={translate('Delete')}
                           onClick={deleteExperiment}
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

   const deleteExperiment = (event: MouseEvent<HTMLButtonElement>) => {
      (async () => {
         setShowLoading(true);
         const experimentId = Number(event.currentTarget.value);
         let errorOccurred = false;
         await Promise.all(lookup.emailTemplateTagsByExperiment(experimentId)
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
         await Promise.all(lookup.emailTemplatesByExperiment(experimentId)
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
         await Promise.all(lookup.inAppMessageTemplateTagsByExperiment(experimentId)
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
         await Promise.all(lookup.inAppMessageTemplatesByExperiment(experimentId)
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
         await Promise.all(lookup.textTemplateTagsByExperiment(experimentId)
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
         await Promise.all(lookup.textTemplatesByExperiment(experimentId)
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
         await Promise.all(lookup.cohortsByExperiment(experimentId)
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
         await audienceEndpoint.delete(experimentId);
         await Promise.all(lookup.hypothesesByExperiment(experimentId)
            .map(async hypothesis => {
               if (errorOccurred) return;
               const { id } = hypothesis;
               const { status } = await hypothesisEndpoint.delete(id);
               if (status !== HttpStatusCode.OK) {
                  errorOccurred = true;
                  return;
               }
               const hypotheses = getHypotheses().filter(hypothesis => hypothesis.id !== id);
               setHypotheses(hypotheses);
            }));
         if (errorOccurred) return bail.out('Could not delete hypotheses');
         const { status } = await experimentEndpoint.delete(experimentId);
         if (status !== HttpStatusCode.OK) return bail.out('Could not delete experiment');
         setDeleted(true);
         const experiments = getExperiments().filter(experiment => experiment.id !== experimentId);
         setExperiments(experiments);
         setShowLoading(false);
      })();
   }

   const getRows = () => getExperiments().map(experiment => {
      const { endOn, id, isDisabled, name, ownedBy } = experiment;
      return {
         endOn: endOn?.split('T')[0],
         id,
         isDisabled,
         name,
         ownedBy,
         tags: lookup.tagsByExperiment(id).map(tag => tag.name).join(', '),
      }
   })

   const goToExperimentForm = (event: MouseEvent<HTMLButtonElement>) => {
      const experimentId = Number(event.currentTarget.value);
      setExperimentId(experimentId);
      if (experimentId === 0) setTab(TabName.detail);
      navigate(`${Path.experiments}/${experimentId}`);
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

   const loadExperimentTagRelationships = async () => {
      const { data, status } = await experimentTagRelationshipEndpoint.get();
      if (status !== HttpStatusCode.OK) {
         setShowLoading(false);
         return log.warn('Could not retrive experiment tag relationships');
      }
      const currentExperimentTagRelationships = data.map((experimentTagRelationship: ExperimentTagRelationshipDB) =>
         reshape.experimentTagRelationship.DB2UI(experimentTagRelationship)
      );
      setExperimentTagRelationships(currentExperimentTagRelationships);
   }

   const loadExperimentTags = async () => {
      const { data, status } = await experimentTagEndpoint.get();
      if (status !== HttpStatusCode.OK) {
         setShowLoading(false);
         return log.warn('Could not retrieve experiment tags');
      }
      const currentExperimentTags = data.map((experimentTag: ExperimentTagDB) => reshape.experimentTag.DB2UI(experimentTag));
      setExperimentTags(currentExperimentTags);
   }

   const loadExperiments = () => {
      (async () => {
         const { data, status } = await experimentEndpoint.get();
         if (status !== HttpStatusCode.OK) {
            setShowLoading(false);
            return log.warn('Could not retrieve experiments');
         }
         const experiments: ExperimentUI[] = data.map((experiment: ExperimentDB) => reshape.experiment.DB2UI(experiment));
         const emptyExperimentIds: number[] = [];
         experiments.forEach(experiment => {
            const { id } = experiment;
            const emails = lookup.emailsByExperiment(id);
            const emailTemplates = lookup.emailTemplatesByExperiment(id);
            const inAppMessages = lookup.inAppMessagesByExperiment(id);
            const inAppMessageTemplates = lookup.inAppMessageTemplatesByExperiment(id);
            const texts = lookup.textsByExperiment(id);
            const textTemplates = lookup.textTemplatesByExperiment(id);
            const endOn = dayjs(experiment.endOn).utc(true);
            const now = dayjs().utc();
            if (
               now.isAfter(endOn)
               && (
                  emailTemplates.length + inAppMessageTemplates.length + textTemplates.length === 0
                  || emails.length + inAppMessages.length + texts.length === 0
               )
            ) emptyExperimentIds.push(id);
         })
         const newExperiments = experiments.filter(experiment =>
            experiment.isCampaign !== true && !emptyExperimentIds.includes(experiment.id)
         );
         setExperiments(newExperiments);
         const cohorts = getCohorts().filter(cohort => !emptyExperimentIds.includes(cohort.experimentId));
         setCohorts(cohorts);
         const hypotheses = getHypotheses().filter(hypothesis => !emptyExperimentIds.includes(hypothesis.experimentId));
         setHypotheses(hypotheses);
         const experimentTagRelationships = getExperimentTagRelationships()
            .filter(experimentTagRelationship => !emptyExperimentIds.includes(experimentTagRelationship.experimentId));
         setExperimentTagRelationships(experimentTagRelationships);
      })()
   }

   const loadHypotheses = async () => {
      const { data, status } = await hypothesisEndpoint.get();
      if (status !== HttpStatusCode.OK) {
         log.warn('Could not retrieve hypotheses');
         return;
      }
      const hypotheses = data.map((hypothesis: HypothesisDB) => reshape.hypothesis.DB2UI(hypothesis));
      setHypotheses(hypotheses);
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
         const experimentId = Number(event.target.name);
         const index = getExperiments().findIndex(experiment => experiment.id === experimentId);
         if (index === -1) return bail.out(`Could not find experiment #${experimentId}`);
         const experiments = getExperiments();
         experiments[index].isDisabled = !experiments[index].isDisabled;
         const { status } = await experimentEndpoint.put(experiments[index]);
         if (status !== HttpStatusCode.OK) return bail.out(['Could not update experiment:', experiments[index]]);
         setUpdated(true);
         setExperiments(experiments);
         setShowLoading(false);
      })()
   }

   useEffect(() => {
      (async () => {
         setShowLoading(true);
         await Promise.all([
            loadCohorts(),
            loadEmailTemplateTags(),
            loadEmailTemplates(),
            loadEmails(),
            loadExperimentTagRelationships(),
            loadExperimentTags(),
            loadInAppMessageTemplateTags(),
            loadMessageTags(),
            loadTextTemplateTags(),
         ]);
         await Promise.all([
            loadHypotheses(),
            loadInAppMessages(),
            loadInAppMessageTemplates(),
            loadTexts(),
            loadTextTemplates(),
         ]);
         setTimeout(() => loadExperiments(), 750);
         setShowLoading(false);
      })()
   }, []);

   useEffect(() => {
      setGridHeight(getExperiments().length);
   }, [getExperiments().length, getPageSize()]);

   return <>
      <RestrictAccess accessKey={accessKey.experimentsListViewPage}>
         <Loading open={getShowLoading()}/>
         <DefaultSnackbar
            onClose={closeDeletedSnackbar}
            open={deleted}
            severity={'success'}
            text={'The experiment has been deleted.'}
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
                     <TranslatedText text={'Experiments'}/>
                  </Typography>
                  <RestrictAccess accessKey={accessKey.experimentsListCreateExperiment}>
                     <Tooltip title={translate('Create new Experiment')}>
                        <IconButton
                           aria-label={translate('Create new Experiment')}
                           onClick={goToExperimentForm}
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

export default Experiments;