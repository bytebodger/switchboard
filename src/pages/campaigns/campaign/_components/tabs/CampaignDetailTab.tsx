import { AddCircle, Clear, SaveOutlined } from '@mui/icons-material';
import { Box, Button, ButtonBase, Chip, FormControl, InputLabel, Select, type SelectChangeEvent, Switch, TextField, Tooltip, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import dayjs from 'dayjs';
import { type ChangeEvent, type MouseEvent, type SyntheticEvent, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BiSolidEraser } from 'react-icons/bi';
import { useNavigate, useParams } from 'react-router-dom';
import { Loading } from '../../../../../app/components/Loading';
import { useEndpointStore } from '../../../../../app/hooks/useEndpointStore';
import { Column } from '../../../../../common/components/Column';
import { DefaultSnackbar } from '../../../../../common/components/DefaultSnackbar';
import { RestrictAccess } from '../../../../../common/components/RestrictAccess';
import { Row } from '../../../../../common/components/Row';
import { ShowIf } from '../../../../../common/components/ShowIf';
import { SlidingDialog } from '../../../../../common/components/SlidingDialog';
import { TranslatedText } from '../../../../../common/components/TranslatedText';
import { accessKey } from '../../../../../common/constants/accessKey';
import { Color } from '../../../../../common/enums/Color';
import { Format } from '../../../../../common/enums/Format';
import { HttpStatusCode } from '../../../../../common/enums/HttpStatusCode';
import { Path } from '../../../../../common/enums/Path';
import { TabName } from '../../../../../common/enums/TabName';
import { getNumber } from '../../../../../common/functions/getNumber';
import { getString } from '../../../../../common/functions/getString';
import { getUserDisplayName } from '../../../../../common/functions/getUserDisplayName';
import { parseApiId } from '../../../../../common/functions/parseApiId';
import { useCampaignEndpoint } from '../../../../../common/hooks/endpoints/useExperimentEndpoint';
import { useCampaignTagRelationshipEndpoint } from '../../../../../common/hooks/endpoints/useExperimentTagRelationshipEndpoint';
import { useBail } from '../../../../../common/hooks/useBail';
import { useLookup } from '../../../../../common/hooks/useLookup';
import { useUXStore } from '../../../../../common/hooks/useUXStore';
import type { CampaignUI } from '../../../../../common/interfaces/experiment/ExperimentUI';
import { log } from '../../../../../common/libraries/log';
import { useCampaignsStore } from '../../../_hooks/useCampaignsStore';
import { useCampaignStore } from '../../_hooks/useCampaignStore';
import { useCampaignTools } from '../../_hooks/useCampaignTools';
import { CampaignTagDialog } from '../dialogs/CampaignTagDialog';

export const CampaignDetailTab = () => {
   const [
      getCampaignId,
      getDescription,
      getIsDisabled,
      getName,
      getOwnedBy,
      getSendFrom,
      getSendFromName,
      resetForm,
      setAddButton,
      setCampaignId,
      setDescription,
      setIsDisabled,
      setName,
      setOwnedBy,
      setTab,
   ] = useCampaignStore(state => [
      state.getCampaignId,
      state.getDescription,
      state.getIsDisabled,
      state.getName,
      state.getOwnedBy,
      state.getSendFrom,
      state.getSendFromName,
      state.resetForm,
      state.setAddButton,
      state.setCampaignId,
      state.setDescription,
      state.setIsDisabled,
      state.setName,
      state.setOwnedBy,
      state.setTab,
   ]);
   const [
      getCampaignTagRelationships,
      getCampaigns,
      setCampaignTagRelationships,
      setCampaigns,
   ] = useCampaignsStore(state => [
      state.getCampaignTagRelationships,
      state.getCampaigns,
      state.setCampaignTagRelationships,
      state.setCampaigns,
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
   const [open, setOpen] = useState(false);
   const [tagRemoved, setTagRemoved] = useState(false);
   const [updated, setUpdated] = useState(false);
   const bail = useBail();
   const campaignEndpoint = useCampaignEndpoint();
   const campaignTagRelationshipEndpoint = useCampaignTagRelationshipEndpoint();
   const campaignTools = useCampaignTools();
   const lookup = useLookup();
   const navigate = useNavigate();
   const params = useParams();
   const thisCampaign = useRef<CampaignUI | null>(null);
   const { t: translate } = useTranslation();

   const callResetForm = () => resetForm(getUser());

   const closeAddedSnackbar = (_event?: SyntheticEvent | Event, reason?: string) => {
      reason !== 'clickaway' && setAdded(false);
   }

   const closeAddTags = () => setOpen(false);

   const closeDuplicateWarning = () => setDuplicateWarning(false);

   const closeErrorSnackbar = (_event?: SyntheticEvent | Event, reason?: string) => {
      reason !== 'clickaway' && setShowError(false);
   }

   const closeTagRemovedSnackbar = (_event?: SyntheticEvent | Event, reason?: string) => {
      reason !== 'clickaway' && setTagRemoved(false);
   }

   const closeUpdatedSnackbar = (_event?: SyntheticEvent | Event, reason?: string) => {
      reason !== 'clickaway' && setUpdated(false);
   }

   const createCampaign = async () => {
      setShowLoading(true);
      const { data, status } = await campaignEndpoint.post(
         getName(),
         getString(getDescription()),
         dayjs().utc().format(Format.dateTime),
         dayjs().utc().add(1, 'year').format(Format.date),
         getNumber(getOwnedBy()),
         '',
         getSendFrom(),
         getSendFromName(),
         true,
      );
      if (status !== HttpStatusCode.created)
         return bail.out(['Could not create campaign:', getName(), getDescription()]);
      setAdded(true);
      const newCampaignId = parseApiId(data);
      const campaigns = getCampaigns();
      const currentDate = dayjs().utc().format(Format.dateTime);
      const userId = getNumber(getUser()?.id);
      campaigns.push({
         beginOn: currentDate,
         createdBy: userId,
         createdOn: currentDate,
         description: getDescription(),
         disabledOn: null,
         endOn: dayjs().utc().add(1, 'year').format(Format.date),
         id: newCampaignId,
         isCampaign: true,
         isDisabled: false,
         modifiedBy: userId,
         modifiedOn: currentDate,
         name: getName(),
         ownedBy: getOwnedBy(),
         sendFrom: getSendFrom(),
         sendFromName: getSendFromName(),
         successMetric: '',
      });
      setCampaigns(campaigns);
      setCampaignId(newCampaignId);
      setTab(TabName.audience);
      setShowLoading(false);
      navigate(`${Path.campaigns}/${newCampaignId}`);
   };

   const formChangesAreUnsaved = () => {
      const campaign = thisCampaign.current;
      return getDescription() !== campaign?.description
         || getName() !== campaign?.name
         || getOwnedBy() !== campaign?.ownedBy;
   }

   const formIsEmpty = () => !getDescription() && !getName() && getOwnedBy() === 0;

   const getTags = () => lookup.tagsByCampaign(getCampaignId())
      .map(tag => {
         const { id, name } = tag;
         return (
            <Chip
               color={getIsDisabled() ? 'default' : 'secondary'}
               key={`campaignTag-${name}`}
               label={
                  <>
                     <ShowIf condition={campaignTools.isEnabledPendingAndOwnedBy()}>
                        <Tooltip title={translate('Remove tag from this campaign')}>
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

   const launchAddTags = () => setOpen(true);

   const removeTag = (event: MouseEvent<HTMLButtonElement>) => {
      (async () => {
         setShowLoading(true);
         const campaignTagId = Number(event.currentTarget.value);
         const targetCampaignTagRelationship = getCampaignTagRelationships()
            .find(relationship => relationship.experimentId === getCampaignId() && relationship.experimentTagId === campaignTagId);
         if (!targetCampaignTagRelationship)
            return bail.out(`Could not find campaignTagRelationship for campaign #${getCampaignId()} and campaignTag #${campaignTagId}`);
         const { id } = targetCampaignTagRelationship;
         const { status } = await campaignTagRelationshipEndpoint.delete(id);
         if (status !== HttpStatusCode.OK) return bail.out(`Could not remove tag #${id}`);
         setTagRemoved(true);
         const newCampaignTagRelationships = getCampaignTagRelationships()
            .filter(relationship => relationship.id !== id);
         setCampaignTagRelationships(newCampaignTagRelationships);
         setShowLoading(false);
      })()
   }

   const requiredFieldsAreComplete = () => getDescription() && getName() && getOwnedBy() !== 0;

   const toggleIsDisabled = () => {
      (async () => {
         setShowLoading(true);
         const index = getCampaigns().findIndex(campaign => campaign.id === getCampaignId());
         if (index === -1) return bail.out(`Could not find campaign #${getCampaignId()}`);
         const campaigns = getCampaigns();
         campaigns[index].isDisabled = !campaigns[index].isDisabled;
         const { status } = await campaignEndpoint.put(campaigns[index]);
         if (status !== HttpStatusCode.OK) return bail.out(['Could not update campaign:', campaigns[index]]);
         setIsDisabled(!!campaigns[index].isDisabled);
         setUpdated(true);
         setCampaigns(campaigns);
         setShowLoading(false);
      })()
   }

   const updateDescription = (event: ChangeEvent<HTMLTextAreaElement>) => setDescription(event.target.value.trimStart());

   const updateCampaign = async () => {
      setShowLoading(true);
      const index = getCampaigns().findIndex(campaign => campaign.id === getCampaignId());
      if (index === -1) return bail.out(`Could not find campaign #${getCampaignId()}`);
      const campaigns = getCampaigns();
      campaigns[index].description = getDescription();
      campaigns[index].name = getName();
      campaigns[index].ownedBy = getOwnedBy();
      const { status } = await campaignEndpoint.put(campaigns[index]);
      if (status !== HttpStatusCode.OK) return bail.out(['Could not update campaign:', campaigns[index]]);
      setTab(TabName.audience);
      setUpdated(true);
      setCampaigns(campaigns);
      thisCampaign.current = campaigns[index];
      setShowLoading(false);
   };

   const updateName = (event: ChangeEvent<HTMLInputElement>) => setName(event.target.value.trimStart());

   const updateOwnedBy = (event: SelectChangeEvent<number>) => setOwnedBy(Number(event.target.value));

   const upsertCampaign = () => {
      (async () => {
         const duplicateExists = getCampaigns().some(campaign => {
            const sameName = campaign.name === getName();
            return getCampaignId() === 0 ? sameName : campaign.id !== getCampaignId() && sameName;
         })
         if (duplicateExists) {
            setDuplicateWarning(true);
            return;
         }
         return getCampaignId() === 0 ? await createCampaign() : await updateCampaign();
      })();
   }

   useEffect(() => {
      setAddButton(null);
      if (getCampaignId() === 0) {
         resetForm(getUser());
         return;
      }
      const campaign = getCampaigns().find(campaign => campaign.id === getCampaignId());
      if (!campaign) {
         log.warn(`Could not find campaign #${getCampaignId()}`);
         navigate(Path.campaigns);
         return;
      }
      setDescription(campaign.description);
      setIsDisabled(!!campaign.isDisabled);
      setName(campaign.name);
      setOwnedBy(campaign.ownedBy);
      thisCampaign.current = campaign;
   }, [getCampaignId()]);

   useEffect(() => {
      const campaignId = getNumber(params.campaignId);
      if (campaignId !== getCampaignId()) setCampaignId(campaignId);
   }, [params])

   return <>
      <Loading open={getShowLoading()}/>
      <DefaultSnackbar
         onClose={closeAddedSnackbar}
         open={added}
         severity={'success'}
         text={'The campaign has been added.'}
      />
      <DefaultSnackbar
         onClose={closeUpdatedSnackbar}
         open={updated}
         severity={'success'}
         text={'The campaign has been updated.'}
      />
      <DefaultSnackbar
         onClose={closeTagRemovedSnackbar}
         open={tagRemoved}
         severity={'success'}
         text={'The campaign tag has been removed.'}
      />
      <DefaultSnackbar
         onClose={closeErrorSnackbar}
         open={getShowError()}
         severity={'error'}
         text={'An error occurred.'}
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
         title={translate('A Campaign with this name already exists!')}
      />
      <CampaignTagDialog
         campaignId={getCampaignId()}
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
                     disabled={!campaignTools.isEnabledPendingAndOwnedBy()}
                     error={campaignTools.isEnabledPendingAndOwnedBy() && !getString(getName())}
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
               <Column xs={12}>
                  <FormControl
                     error={campaignTools.isEnabledPendingAndOwnedBy() && getNumber(getOwnedBy()) === 0}
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
                        disabled={!campaignTools.isEnabledPendingAndOwnedBy()}
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
            </Row>
            <Row>
               <Column xs={12}>
                  <TextField
                     aria-label={translate('Description')}
                     disabled={!campaignTools.isEnabledPendingAndOwnedBy()}
                     error={campaignTools.isEnabledPendingAndOwnedBy() && !getString(getDescription())}
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
            <ShowIf condition={getCampaignId() !== 0 && campaignTools.isEnabledPendingAndOwnedBy()}>
               <Row>
                  <Column
                     sx={{ paddingLeft: 3 }}
                     xs={12} sm={12} md={12} lg={12} xl={10}
                  >
                     <Typography variant={'caption'}>
                        <TranslatedText text={'Campaign Tags'}/>
                     </Typography>
                     <RestrictAccess accessKey={accessKey.campaignAddCampaignTags}>
                        <Tooltip title={translate('Add campaign tags')}>
                           <span>
                              <IconButton
                                 aria-label={translate('Add campaign tags')}
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
            <RestrictAccess accessKey={accessKey.campaignUpdateDetails}>
               <ShowIf condition={campaignTools.isEnabledPendingAndOwnedBy()}>
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
                                    onClick={upsertCampaign}
                                    sx={{ color: Color.greenTemplate }}
                                 >
                                    <SaveOutlined/>
                                 </IconButton>
                              </span>
                           </Tooltip>
                        </Box>
                     </Column>
                  </Row>
                  <ShowIf condition={getCampaignId() !== 0}>
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