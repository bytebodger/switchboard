import { AddCircle, Clear, HelpOutlined, SaveOutlined } from '@mui/icons-material';
import type { SelectChangeEvent } from '@mui/material';
import { Box, Button, ButtonBase, Chip, FormControl, InputLabel, Select, Switch, TextField, Tooltip, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import { type DateTimeValidationError, MobileDatePicker } from '@mui/x-date-pickers';
import type { FieldChangeHandlerContext } from '@mui/x-date-pickers/internals';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import type { ChangeEvent, MouseEvent, SyntheticEvent } from 'react';
import { useEffect, useRef, useState } from 'react';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { useTranslation } from 'react-i18next';
import { BiSolidEraser } from 'react-icons/bi';
import { useNavigate, useParams } from 'react-router-dom';
import { Loading } from '../../../../../app/components/Loading';
import { useEndpointStore } from '../../../../../app/hooks/useEndpointStore';
import { Column } from '../../../../../common/components/Column';
import { DefaultSnackbar } from '../../../../../common/components/DefaultSnackbar';
import { HelpDialog } from '../../../../../common/components/HelpDialog';
import { RestrictAccess } from '../../../../../common/components/RestrictAccess';
import { Row } from '../../../../../common/components/Row';
import { ShowIf } from '../../../../../common/components/ShowIf';
import { SlidingDialog } from '../../../../../common/components/SlidingDialog';
import { TranslatedText } from '../../../../../common/components/TranslatedText';
import { accessKey } from '../../../../../common/constants/accessKey';
import { Color } from '../../../../../common/enums/Color';
import { Format } from '../../../../../common/enums/Format';
import { HttpStatusCode } from '../../../../../common/enums/HttpStatusCode';
import { MessageTemplate } from '../../../../../common/enums/MessageTemplate';
import { Path } from '../../../../../common/enums/Path';
import { TabName } from '../../../../../common/enums/TabName';
import { Topic } from '../../../../../common/enums/Topic';
import { getNumber } from '../../../../../common/functions/getNumber';
import { getString } from '../../../../../common/functions/getString';
import { getUserDisplayName } from '../../../../../common/functions/getUserDisplayName';
import { parseApiId } from '../../../../../common/functions/parseApiId';
import { useEmailTemplateEndpoint } from '../../../../../common/hooks/endpoints/useEmailTemplateEndpoint';
import { useExperimentEndpoint } from '../../../../../common/hooks/endpoints/useExperimentEndpoint';
import { useExperimentTagRelationshipEndpoint } from '../../../../../common/hooks/endpoints/useExperimentTagRelationshipEndpoint';
import { useInAppMessageTemplateEndpoint } from '../../../../../common/hooks/endpoints/useInAppMessageTemplateEndpoint';
import { useTextTemplateEndpoint } from '../../../../../common/hooks/endpoints/useTextTemplateEndpoint';
import { useBail } from '../../../../../common/hooks/useBail';
import { useLookup } from '../../../../../common/hooks/useLookup';
import { useUXStore } from '../../../../../common/hooks/useUXStore';
import type { EmailTemplateUI } from '../../../../../common/interfaces/emailTemplate/EmailTemplateUI';
import type { ExperimentUI } from '../../../../../common/interfaces/experiment/ExperimentUI';
import type { InAppMessageTemplateUI } from '../../../../../common/interfaces/inAppMessageTemplate/InAppMessageTemplateUI';
import type { TextTemplateUI } from '../../../../../common/interfaces/textTemplate/TextTemplateUI';
import { log } from '../../../../../common/libraries/log';
import { useExperimentsStore } from '../../../_hooks/useExperimentsStore';
import { useExperimentStore } from '../../_hooks/useExperimentStore';
import { useExperimentTools } from '../../_hooks/useExperimentTools';
import { ExperimentTagDialog } from '../dialogs/ExperimentTagDialog';

export const ExperimentDetailTab = () => {
   const [
      getDescription,
      getEndOn,
      getExperimentId,
      getIsDisabled,
      getName,
      getOwnedBy,
      getSendFrom,
      getSendFromName,
      getSuccessMetric,
      resetForm,
      setAddButton,
      setDescription,
      setEndOn,
      setExperimentId,
      setIsDisabled,
      setName,
      setOwnedBy,
      setSuccessMetric,
      setTab,
   ] = useExperimentStore(state => [
      state.getDescription,
      state.getEndOn,
      state.getExperimentId,
      state.getIsDisabled,
      state.getName,
      state.getOwnedBy,
      state.getSendFrom,
      state.getSendFromName,
      state.getSuccessMetric,
      state.resetForm,
      state.setAddButton,
      state.setDescription,
      state.setEndOn,
      state.setExperimentId,
      state.setIsDisabled,
      state.setName,
      state.setOwnedBy,
      state.setSuccessMetric,
      state.setTab,
   ]);
   const [
      getEmailTemplates,
      getExperiments,
      getExperimentTagRelationships,
      getInAppMessageTemplates,
      getTextTemplates,
      setEmailTemplates,
      setExperiments,
      setExperimentTagRelationships,
      setInAppMessageTemplates,
      setTextTemplates,
   ] = useExperimentsStore(state => [
      state.getEmailTemplates,
      state.getExperiments,
      state.getExperimentTagRelationships,
      state.getInAppMessageTemplates,
      state.getTextTemplates,
      state.setEmailTemplates,
      state.setExperiments,
      state.setExperimentTagRelationships,
      state.setInAppMessageTemplates,
      state.setTextTemplates,
   ])
   const [
      getUser,
      getUsers,
   ] = useEndpointStore(state => [
      state.getUser,
      state.getUsers,
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
   const [duplicateWarning, setDuplicateWarning] = useState(false);
   const [helpOpen, setHelpOpen] = useState(false);
   const [open, setOpen] = useState(false);
   const [pickerEndOn, setPickerEndOn] = useState<Dayjs | null>(
      dayjs(getEndOn() ?? dayjs().utc().add(14, 'day').format(Format.date))
   );
   const [tagRemoved, setTagRemoved] = useState(false);
   const [updated, setUpdated] = useState(false);
   const bail = useBail();
   const emailTemplateEndpoint = useEmailTemplateEndpoint();
   const experimentEndpoint = useExperimentEndpoint();
   const experimentTagRelationshipEndpoint = useExperimentTagRelationshipEndpoint();
   const experimentTools = useExperimentTools();
   const inAppMessageTemplateEndpoint = useInAppMessageTemplateEndpoint();
   const lookup = useLookup();
   const navigate = useNavigate();
   const params = useParams();
   const textTemplateEndpoint = useTextTemplateEndpoint();
   const thisExperiment = useRef<ExperimentUI | null>(null);
   const { t: translate } = useTranslation();

   const callResetForm = () => resetForm(getUser());

   const checkTemplateSendTimes = (previousEndOn: string) => {
      const newEndOn = dayjs(getEndOn()).utc(true);
      const oldEndOn = dayjs(previousEndOn).utc(true);
      if (newEndOn.isSameOrAfter(oldEndOn)) return;
      Object.values(MessageTemplate).forEach(type => {
         let updateTemplates = false;
         let templates: EmailTemplateUI[] | InAppMessageTemplateUI[] | TextTemplateUI[];
         switch (type) {
            case MessageTemplate.email:
               templates = getEmailTemplates();
               break;
            case MessageTemplate.inAppMessage:
               templates = getInAppMessageTemplates();
               break;
            case MessageTemplate.text:
               templates = getTextTemplates();
         }
         templates.filter(template => template.experimentId === getExperimentId())
            .forEach(template => {
               (async () => {
                  let sendOn = dayjs(template.sendOn).utc(true);
                  if (sendOn.isSameOrBefore(newEndOn)) return;
                  else if (sendOn.isAfter(newEndOn)) sendOn = newEndOn;
                  template.sendOn = sendOn.format(Format.dateTime);
                  let result;
                  switch (type) {
                     case MessageTemplate.email:
                        result = await emailTemplateEndpoint.put(template as EmailTemplateUI);
                        break;
                     case MessageTemplate.inAppMessage:
                        result = await inAppMessageTemplateEndpoint.put(template as InAppMessageTemplateUI);
                        break;
                     case MessageTemplate.text:
                        result = await textTemplateEndpoint.put(template as TextTemplateUI);
                  }
                  const { status } = result;
                  if (status !== HttpStatusCode.OK) {
                     log.warn('Could not update template:', template);
                     return;
                  }
                  updateTemplates = true;
               })()
            })
         if (updateTemplates) {
            switch (type) {
               case MessageTemplate.email:
                  setEmailTemplates(templates as EmailTemplateUI[]);
                  break;
               case MessageTemplate.inAppMessage:
                  setInAppMessageTemplates(templates as InAppMessageTemplateUI[]);
                  break;
               case MessageTemplate.text:
                  setTextTemplates(templates as TextTemplateUI[]);
            }
         }
      })
   }

   const closeAddedSnackbar = (_event?: SyntheticEvent | Event, reason?: string) => {
      reason !== 'clickaway' && setAdded(false);
   }

   const closeAddTags = () => setOpen(false);

   const closeDuplicateWarning = () => setDuplicateWarning(false);

   const closeErrorSnackbar = (_event?: SyntheticEvent | Event, reason?: string) => {
      reason !== 'clickaway' && setShowError(false);
   }

   const closeHelpDialog = () => setHelpOpen(false);

   const closeTagRemovedSnackbar = (_event?: SyntheticEvent | Event, reason?: string) => {
      reason !== 'clickaway' && setTagRemoved(false);
   }

   const closeUpdatedSnackbar = (_event?: SyntheticEvent | Event, reason?: string) => {
      reason !== 'clickaway' && setUpdated(false);
   }

   const createExperiment = async () => {
      setShowLoading(true);
      const { data, status } = await experimentEndpoint.post(
         getName(),
         getString(getDescription()),
         dayjs().utc().format(Format.dateTime),
         getString(getEndOn()),
         getNumber(getOwnedBy()),
         getString(getSuccessMetric()),
         getSendFrom(),
         getSendFromName(),
         false,
      );
      if (status !== HttpStatusCode.created)
         return bail.out(['Could not create experiment:', getName(), getDescription(), getEndOn(), getSuccessMetric()]);
      setAdded(true);
      const newExperimentId = parseApiId(data);
      const experiments = getExperiments();
      const currentDate = dayjs().utc().format(Format.dateTime);
      const userId = getNumber(getUser()?.id);
      experiments.push({
         beginOn: currentDate,
         createdBy: userId,
         createdOn: currentDate,
         description: getDescription(),
         disabledOn: null,
         endOn: getEndOn(),
         id: newExperimentId,
         isCampaign: false,
         isDisabled: false,
         modifiedBy: userId,
         modifiedOn: currentDate,
         name: getName(),
         ownedBy: getOwnedBy(),
         sendFrom: getSendFrom(),
         sendFromName: getSendFromName(),
         successMetric: getSuccessMetric(),
      });
      setExperiments(experiments);
      setExperimentId(newExperimentId);
      setTab(TabName.hypotheses);
      setShowLoading(false);
      navigate(`${Path.experiments}/${newExperimentId}`);
   };

   const formChangesAreUnsaved = () => {
      const experiment = thisExperiment.current;
      return getDescription() !== experiment?.description
         || dayjs(getEndOn()).utc(true).valueOf() !== dayjs(experiment.endOn).utc(true).valueOf()
         || getName() !== experiment?.name
         || getOwnedBy() !== experiment?.ownedBy
         || getSuccessMetric() !== experiment?.successMetric;
   }

   const formIsEmpty = () => !getDescription() && !getEndOn() && !getName() && getOwnedBy() === 0 && !getSuccessMetric();

   const getGoalItems = () => goals.map(goal => (
      <MenuItem
         aria-label={goal}
         dense={true}
         key={goal}
         value={goal}
      >
         {goal}
      </MenuItem>
   ))

   const getTags = () => lookup.tagsByExperiment(getExperimentId())
      .map(tag => {
         const { id, name } = tag;
         return (
            <Chip
               color={getIsDisabled() ? 'default' : 'secondary'}
               key={`experimentTag-${name}`}
               label={
                  <>
                     <ShowIf condition={experimentTools.isEnabledPendingAndOwnedBy()}>
                        <Tooltip title={translate('Remove tag from this experiment')}>
                           <ButtonBase
                              onClick={removeTag}
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

   const getUserMenuItems = () => getUsers().map(user => {
      const { id, email, isDisabled } = user;
      if (email === 'system.user@sequel.ae') return null;
      return (
         <MenuItem
            aria-label={getUserDisplayName(user)}
            dense={true}
            disabled={isDisabled}
            key={`user-${id}`}
            value={id}
         >
            {getUserDisplayName(user)}
         </MenuItem>
      )
   })

   const goals = [
      'User logs into Community',
   ]

   const launchAddTags = () => setOpen(true);

   const launchHelpDialog = () => setHelpOpen(true);

   const removeTag = (event: MouseEvent<HTMLButtonElement>) => {
      (async () => {
         setShowLoading(true);
         const experimentTagId = Number(event.currentTarget.value);
         const targetExperimentTagRelationship = getExperimentTagRelationships()
            .find(relationship => relationship.experimentId === getExperimentId() && relationship.experimentTagId === experimentTagId);
         if (!targetExperimentTagRelationship)
            return bail.out(`Could not find experimentTagRelationship for experiment #${getExperimentId()} and experimentTag #${experimentTagId}`);
         const { id } = targetExperimentTagRelationship;
         const { status } = await experimentTagRelationshipEndpoint.delete(id);
         if (status !== HttpStatusCode.OK) return bail.out(`Could not remove tag #${id}`);
         setTagRemoved(true);
         const newExperimentTagRelationships = getExperimentTagRelationships()
            .filter(relationship => relationship.id !== id);
         setExperimentTagRelationships(newExperimentTagRelationships);
         setShowLoading(false);
      })()
   }

   const requiredFieldsAreComplete = () => getDescription() && getEndOn() && getName() && getOwnedBy() !== 0 && getSuccessMetric();

   const toggleIsDisabled = () => {
      (async () => {
         setShowLoading(true);
         const index = getExperiments().findIndex(experiment => experiment.id === getExperimentId());
         if (index === -1) return bail.out(`Could not find experiment #${getExperimentId()}`);
         const experiments = getExperiments();
         experiments[index].isDisabled = !experiments[index].isDisabled;
         const { status } = await experimentEndpoint.put(experiments[index]);
         if (status !== HttpStatusCode.OK) return bail.out(['Could not update experiment:', experiments[index]]);
         setIsDisabled(!!experiments[index].isDisabled);
         setUpdated(true);
         setExperiments(experiments);
         setShowLoading(false);
      })()
   }

   const updateDescription = (event: ChangeEvent<HTMLTextAreaElement>) => setDescription(event.target.value.trimStart());

   const updateEndOn = (value: Dayjs | null, _context: FieldChangeHandlerContext<DateTimeValidationError>) => {
      if (value) setEndOn(value.format(Format.date));
      setPickerEndOn(value);
   }

   const updateExperiment = async () => {
      setShowLoading(true);
      const index = getExperiments().findIndex(experiment => experiment.id === getExperimentId());
      if (index === -1) return bail.out(`Could not find experiment #${getExperimentId()}`);
      const experiments = getExperiments();
      const oldEndOn = getString(experiments[index].endOn);
      experiments[index].description = getDescription();
      experiments[index].endOn = getEndOn();
      experiments[index].name = getName();
      experiments[index].ownedBy = getOwnedBy();
      experiments[index].successMetric = getSuccessMetric();
      const { status } = await experimentEndpoint.put(experiments[index]);
      if (status !== HttpStatusCode.OK) return bail.out(['Could not update experiment:', experiments[index]]);
      setTab(TabName.hypotheses);
      checkTemplateSendTimes(oldEndOn);
      setUpdated(true);
      setExperiments(experiments);
      thisExperiment.current = experiments[index];
      setShowLoading(false);
   };

   const updateGoal = (event: SelectChangeEvent) => setSuccessMetric(event.target.value);

   const updateName = (event: ChangeEvent<HTMLInputElement>) => setName(event.target.value.trimStart());

   const updateOwnedBy = (event: SelectChangeEvent<number>) => setOwnedBy(Number(event.target.value));

   const upsertExperiment = () => {
      (async () => {
         const duplicateExists = getExperiments().some(experiment => {
            const sameName = experiment.name === getName();
            return getExperimentId() === 0 ? sameName : experiment.id !== getExperimentId() && sameName;
         })
         if (duplicateExists) {
            setDuplicateWarning(true);
            return;
         }
         return getExperimentId() === 0 ? await createExperiment() : await updateExperiment();
      })();
   }

   useEffect(() => {
      setAddButton(null);
      if (getExperimentId() === 0) {
         resetForm(getUser());
         return;
      }
      const experiment = getExperiments().find(experiment => experiment.id === getExperimentId());
      if (!experiment) {
         log.warn(`Could not find experiment #${getExperimentId()}`);
         navigate(Path.experiments);
         return;
      }
      setDescription(experiment.description);
      setPickerEndOn(dayjs(experiment.endOn).utc(true));
      setIsDisabled(!!experiment.isDisabled);
      setName(experiment.name);
      setOwnedBy(experiment.ownedBy);
      setSuccessMetric(experiment.successMetric);
      thisExperiment.current = experiment;
   }, [getExperimentId()]);

   useEffect(() => {
      const experimentId = getNumber(params.experimentId);
      if (experimentId !== getExperimentId()) setExperimentId(experimentId);
   }, [params])

   return <>
      <Loading open={getShowLoading()}/>
      <DefaultSnackbar
         onClose={closeAddedSnackbar}
         open={added}
         severity={'success'}
         text={'The experiment has been added.'}
      />
      <DefaultSnackbar
         onClose={closeUpdatedSnackbar}
         open={updated}
         severity={'success'}
         text={'The experiment has been updated.'}
      />
      <DefaultSnackbar
         onClose={closeTagRemovedSnackbar}
         open={tagRemoved}
         severity={'success'}
         text={'The experiment tag has been removed.'}
      />
      <DefaultSnackbar
         onClose={closeErrorSnackbar}
         open={getShowError()}
         severity={'error'}
         text={'An error occurred.'}
      />
      <HelpDialog
         onClose={closeHelpDialog}
         open={helpOpen}
         topic={Topic.endDates}
      />
      <SlidingDialog
         actions={
            <Button
               aria-label={translate('Dismiss')}
               onClick={closeDuplicateWarning}
               variant={'outlined'}
            >
               <TranslatedText text={'Dismiss'}/>
            </Button>
         }
         onClose={closeDuplicateWarning}
         open={duplicateWarning}
         title={translate('An Experiment with this name already exists!')}
      />
      <ExperimentTagDialog
         experimentId={getExperimentId()}
         onClose={closeAddTags}
         open={open}
      />
      <Row
         columnSpacing={0}
         rowSpacing={0}
      >
         <Column xs={12} sm={12} md={12} lg={12} xl={10}>
            <Row>
               <Column xs={12}>
                  <TextField
                     aria-label={translate('Name')}
                     disabled={!experimentTools.isEnabledPendingAndOwnedBy()}
                     error={experimentTools.isEnabledPendingAndOwnedBy() && !getString(getName())}
                     label={translate('Name')}
                     name={'name-field'}
                     onChange={updateName}
                     required={true}
                     size={'small'}
                     sx={{ width: '100%' }}
                     value={getString(getName())}
                  />
               </Column>
            </Row>
            <Row>
               <Column xs={12} md={6}>
                  <FormControl
                     error={experimentTools.isEnabledPendingAndOwnedBy() && getNumber(getOwnedBy()) === 0}
                     fullWidth={true}
                     size={'small'}
                  >
                     <InputLabel
                        id={'owner-select-label'}
                        required={true}
                     >
                        <TranslatedText text={'Owner'}/>
                     </InputLabel>
                     <Select
                        aria-label={translate('Select Owner')}
                        disabled={!experimentTools.isEnabledPendingAndOwnedBy()}
                        id={'owner-select'}
                        label={translate('Owner')}
                        labelId={'owner-select-label'}
                        onChange={updateOwnedBy}
                        value={Number(getOwnedBy())}
                     >
                        <MenuItem
                           dense={true}
                           value={0}
                        >
                           <TranslatedText text={'Select Owner'}/>
                        </MenuItem>
                        {getUserMenuItems()}
                     </Select>
                  </FormControl>
               </Column>
               <Column xs={12} md={6}>
                  <FormControl
                     error={experimentTools.isEnabledPendingAndOwnedBy() && !getSuccessMetric()}
                     fullWidth={true}
                     size={'small'}
                  >
                     <InputLabel
                        id={'goal-select-label'}
                        required={true}
                     >
                        <TranslatedText text={'Goal'}/>
                     </InputLabel>
                     <Select
                        aria-label={translate('Select Goal')}
                        disabled={!experimentTools.isEnabledPendingAndOwnedBy()}
                        id={'goal-select'}
                        label={translate('Goal')}
                        labelId={'goal-select-label'}
                        onChange={updateGoal}
                        value={getString(getSuccessMetric())}
                     >
                        <MenuItem
                           dense={true}
                           value={''}
                        >
                           <TranslatedText text={'Select Goal'}/>
                        </MenuItem>
                        {getGoalItems()}
                     </Select>
                  </FormControl>
               </Column>
            </Row>
            <Row>
               <Column xs={12}>
                  <TextField
                     aria-label={translate('Description')}
                     disabled={!experimentTools.isEnabledPendingAndOwnedBy()}
                     error={experimentTools.isEnabledPendingAndOwnedBy() && !getString(getDescription())}
                     label={translate('Description')}
                     multiline={true}
                     name={'description-field'}
                     onChange={updateDescription}
                     required={true}
                     rows={3}
                     size={'small'}
                     sx={{ width: '100%' }}
                     value={getString(getDescription())}
                  />
               </Column>
            </Row>
            <Row>
               <Column
                  sx={{
                     paddingLeft: 1.5,
                     paddingTop: 2,
                  }}
                  xs={12} md={6}
               >
                  <MobileDatePicker
                     aria-label={translate('Ends On')}
                     disabled={!experimentTools.isEnabledPendingAndOwnedBy()}
                     format={Format.dateTime}
                     label={`${translate('Ends On')} *`}
                     maxDate={dayjs().utc().add(1, 'year')}
                     minDate={dayjs().utc()}
                     onChange={updateEndOn}
                     value={pickerEndOn}
                  />
                  <Box sx={{
                     display: 'inline',
                     position: 'relative',
                     top: 16,
                  }}>
                     {' '}
                     <TranslatedText text={'UTC'}/>
                     <Tooltip title={translate('Help on End Dates')}>
                        <Button
                           aria-label={translate('Help on End Dates')}
                           onClick={launchHelpDialog}
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
                  </Box>
               </Column>
            </Row>
            <ShowIf condition={getExperimentId() !== 0 && experimentTools.isEnabledPendingAndOwnedBy()}>
               <Row>
                  <Column
                     sx={{ paddingLeft: 3 }}
                     xs={12} sm={12} md={12} lg={12} xl={10}
                  >
                     <Typography variant={'caption'}>
                        <TranslatedText text={'Experiment Tags'}/>
                     </Typography>
                     <RestrictAccess accessKey={accessKey.experimentAddExperimentTags}>
                        <Tooltip title={translate('Add experiment tags')}>
                           <span>
                              <IconButton
                                 aria-label={translate('Add experiment tags')}
                                 disabled={getIsDisabled()}
                                 onClick={launchAddTags}
                              >
                                 <AddCircle sx={{
                                    bottom: 2,
                                    color: getIsDisabled() ? Color.greyLight : Color.greenTemplate,
                                    fontSize: 16,
                                    position: 'relative',
                                    stroke: Color.white,
                                 }}/>
                              </IconButton>
                           </span>
                        </Tooltip>
                     </RestrictAccess>
                     <Box>
                        {getTags()}
                     </Box>
                  </Column>
               </Row>
            </ShowIf>
            <RestrictAccess accessKey={accessKey.experimentUpdateDetails}>
               <ShowIf condition={experimentTools.isEnabledPendingAndOwnedBy()}>
                  <Row>
                     <Column xs={12}>
                        <Box sx={{
                           display: 'flex',
                           justifyContent: 'space-between',
                        }}>
                           <Tooltip title={translate('Reset')}>
                              <span>
                                 <IconButton
                                    aria-label={translate('Reset')}
                                    disabled={getIsDisabled() || formIsEmpty()}
                                    onClick={callResetForm}
                                    sx={{ color: Color.blueNeon }}
                                 >
                                    <BiSolidEraser fontSize={26}/>
                                 </IconButton>
                              </span>
                           </Tooltip>
                           <Tooltip title={translate('Save')}>
                              <span>
                                 <IconButton
                                    aria-label={translate('Save')}
                                    disabled={getIsDisabled() || !requiredFieldsAreComplete() || !formChangesAreUnsaved()}
                                    onClick={upsertExperiment}
                                    sx={{ color: Color.greenTemplate }}
                                 >
                                    <SaveOutlined/>
                                 </IconButton>
                              </span>
                           </Tooltip>
                        </Box>
                     </Column>
                  </Row>
                  <ShowIf condition={getExperimentId() !== 0}>
                     <Row>
                        <Column xs={12}>
                           <Tooltip title={getIsDisabled() ? translate('Paused') : translate('Active')}>
                              <Switch
                                 aria-label={getIsDisabled() ? translate('Paused') : translate('Active')}
                                 checked={!getIsDisabled()}
                                 color={'success'}
                                 onChange={toggleIsDisabled}
                                 size={'small'}
                              />
                           </Tooltip>
                        </Column>
                     </Row>
                  </ShowIf>
               </ShowIf>
            </RestrictAccess>
         </Column>
      </Row>
   </>
}