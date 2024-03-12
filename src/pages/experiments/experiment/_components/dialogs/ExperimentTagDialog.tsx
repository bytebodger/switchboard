import { Box, Button, Chip, TextField } from '@mui/material';
import type { ChangeEvent, MouseEvent, SyntheticEvent } from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Loading } from '../../../../../app/components/Loading';
import { DefaultSnackbar } from '../../../../../common/components/DefaultSnackbar';
import { ShowIf } from '../../../../../common/components/ShowIf';
import { SlidingDialog } from '../../../../../common/components/SlidingDialog';
import { TranslatedText } from '../../../../../common/components/TranslatedText';
import { HttpStatusCode } from '../../../../../common/enums/HttpStatusCode';
import { parseApiId } from '../../../../../common/functions/parseApiId';
import { useExperimentTagEndpoint } from '../../../../../common/hooks/endpoints/useExperimentTagEndpoint';
import { useExperimentTagRelationshipEndpoint } from '../../../../../common/hooks/endpoints/useExperimentTagRelationshipEndpoint';
import { useBail } from '../../../../../common/hooks/useBail';
import { useLookup } from '../../../../../common/hooks/useLookup';
import { useUXStore } from '../../../../../common/hooks/useUXStore';
import type { GenericFunction } from '../../../../../common/types/GenericFunction';
import { useExperimentsStore } from '../../../_hooks/useExperimentsStore';
import { useExperimentStore } from '../../_hooks/useExperimentStore';

interface Props {
   experimentId: number,
   onClose: GenericFunction,
   open: boolean,
}

export const ExperimentTagDialog = ({ experimentId, onClose, open }: Props) => {
   const [
      getTagName,
      setTagName,
   ] = useExperimentStore(state => [
      state.getTagName,
      state.setTagName,
   ])
   const [
      getExperimentTagRelationships,
      getExperimentTags,
      setExperimentTagRelationships,
      setExperimentTags,
   ] = useExperimentsStore(state => [
      state.getExperimentTagRelationships,
      state.getExperimentTags,
      state.setExperimentTagRelationships,
      state.setExperimentTags,
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
   const [added, setAdded] = useState(false);
   const bail = useBail();
   const experimentTagEndpoint = useExperimentTagEndpoint();
   const experimentTagRelationshipEndpoint = useExperimentTagRelationshipEndpoint();
   const lookup = useLookup();
   const { t: translate } = useTranslation();

   const addTag = (passedValue: MouseEvent<HTMLButtonElement> | number) => {
      (async () => {
         setShowLoading(true);
         closeAddTags();
         const experimentTagId = typeof passedValue === 'number' ? passedValue : Number(passedValue.currentTarget.value);
         const { data, status } = await experimentTagRelationshipEndpoint.post(experimentId, experimentTagId);
         if (status !== HttpStatusCode.created)
            return bail.out(`Could not create tag relationship for experiment #${experimentId} and experimentTag #${experimentTagId}`);
         setAdded(true);
         const newExperimentTagRelationshipId = parseApiId(data);
         const experimentTagRelationships = getExperimentTagRelationships();
         experimentTagRelationships.push({
            experimentId,
            experimentTagId,
            id: newExperimentTagRelationshipId,
         })
         setExperimentTagRelationships(experimentTagRelationships);
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
         const { data, status } = await experimentTagEndpoint.post(tagName, tagName);
         if (status !== HttpStatusCode.created) return bail.out(['Could not create tag:', tagName]);
         const newExperimentTagId = parseApiId(data);
         const experimentTags = getExperimentTags();
         experimentTags.push({
            description: tagName,
            id: newExperimentTagId,
            name: tagName,
         })
         setExperimentTags(experimentTags);
         addTag(newExperimentTagId);
      })()
   }

   const getAddActions = () => {
      const isDuplicate = getExperimentTags().some(experimentTag => experimentTag.name.toLowerCase() === getTagName().toLowerCase());
      return (
         <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
         }}>
            <Box sx={{ display: 'inline' }}>
               <ShowIf condition={getTagName().length > 1 && !isDuplicate}>
                  <Button
                     aria-label={translate('Create new Experiment tag')}
                     onClick={createTag}
                     variant={'outlined'}
                  >
                     <TranslatedText text={'Create new Experiment tag'}/>
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

   const getAvailableTags = () => {
      const usedTags = lookup.tagsByExperiment(experimentId).map(experimentTag => experimentTag.name);
      const availableTags = getExperimentTags().filter(experimentTag => !usedTags.includes(experimentTag.name));
      return availableTags.filter(availableTag => availableTag.name.toLowerCase().includes(getTagName().toLowerCase()))
         .map(availableTag => {
            const { id, name } = availableTag;
            return (
               <div key={`tagName-${name}`}>
                  <Button
                     aria-label={name}
                     onClick={addTag}
                     sx={{ padding: 0.2 }}
                     value={id}
                  >
                     <Chip
                        color={'secondary'}
                        label={name}
                        size={'small'}
                        sx={{
                           cursor: 'pointer',
                           fontSize: 10,
                           textTransform: 'none',
                        }}
                     />
                  </Button>
               </div>
            )
         });
   }

   const updateTagName = (event: ChangeEvent<HTMLInputElement>) => setTagName(event.target.value.trimStart());

   return <>
      <Loading open={getShowLoading()}/>
      <DefaultSnackbar
         onClose={closeAddedSnackbar}
         open={added}
         severity={'success'}
         text={'The experiment tag has been added.'}
      />
      <DefaultSnackbar
         onClose={closeErrorSnackbar}
         open={getShowError()}
         severity={'error'}
         text={'An error occurred.'}
      />
      <SlidingDialog
         actions={getAddActions()}
         content={
            <>
               <TextField
                  aria-label={translate('Experiment Tag Name')}
                  inputRef={input => input?.focus()}
                  label={translate('Experiment Tag Name')}
                  name={'experiment-tag-name-field'}
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
                     {getAvailableTags()}
                  </ShowIf>
               </Box>
            </>
         }
         onClose={closeAddTags}
         open={open}
         title={translate('Add experiment tags')}
      />
   </>
}