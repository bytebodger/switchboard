import { AddCircle, DeleteForeverOutlined, SaveOutlined } from '@mui/icons-material';
import { Box, Button, TextField, Tooltip } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import type { ChangeEvent, MouseEvent, ReactNode, SyntheticEvent } from 'react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Loading } from '../../../../../app/components/Loading';
import { Column } from '../../../../../common/components/Column';
import { DefaultSnackbar } from '../../../../../common/components/DefaultSnackbar';
import { RestrictAccess } from '../../../../../common/components/RestrictAccess';
import { Row } from '../../../../../common/components/Row';
import { ShowIf } from '../../../../../common/components/ShowIf';
import { SlidingDialog } from '../../../../../common/components/SlidingDialog';
import { TranslatedText } from '../../../../../common/components/TranslatedText';
import { accessKey } from '../../../../../common/constants/accessKey';
import { Color } from '../../../../../common/enums/Color';
import { HttpStatusCode } from '../../../../../common/enums/HttpStatusCode';
import { getNumber } from '../../../../../common/functions/getNumber';
import { parseApiId } from '../../../../../common/functions/parseApiId';
import { useHypothesisEndpoint } from '../../../../../common/hooks/endpoints/useHypothesisEndpoint';
import { useBail } from '../../../../../common/hooks/useBail';
import { useLookup } from '../../../../../common/hooks/useLookup';
import { useUXStore } from '../../../../../common/hooks/useUXStore';
import { useViewport } from '../../../../../common/hooks/useViewport';
import { log } from '../../../../../common/libraries/log';
import { useExperimentsStore } from '../../../_hooks/useExperimentsStore';
import { useExperimentStore } from '../../_hooks/useExperimentStore';
import { useExperimentTools } from '../../_hooks/useExperimentTools';

export const ExperimentHypothesesTab = () => {
   const [
      getExperimentId,
      getHypothesis,
      getIsDisabled,
      setAddButton,
      setExperimentId,
      setHypothesis,
   ] = useExperimentStore(state => [
      state.getExperimentId,
      state.getHypothesis,
      state.getIsDisabled,
      state.setAddButton,
      state.setExperimentId,
      state.setHypothesis,
   ])
   const [
      getHypotheses,
      setHypotheses,
   ] = useExperimentsStore(state => [
      state.getHypotheses,
      state.setHypotheses,
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
   const [created, setCreated] = useState(false);
   const [deleted, setDeleted] = useState(false);
   const [newHypothesisActions, setNewHypothesisActions] = useState<ReactNode>(null);
   const [newHypothesisContent, setNewHypothesisContent] = useState<ReactNode>(null);
   const [newHypothesisOpen, setNewHypothesisOpen] = useState(false);
   const [updated, setUpdated] = useState(false);
   const bail = useBail();
   const experimentTools = useExperimentTools();
   const hypothesisEndpoint = useHypothesisEndpoint();
   const lookup = useLookup();
   const original = useRef<string[]>([]);
   const params = useParams();
   const viewport = useViewport();
   const { t: translate } = useTranslation();

   const closeCreatedSnackbar = (_event?: SyntheticEvent | Event, reason?: string) => {
      reason !== 'clickaway' && setCreated(false);
   }

   const closeDeletedSnackbar = (_event?: SyntheticEvent | Event, reason?: string) => {
      reason !== 'clickaway' && setDeleted(false);
   }

   const closeErrorSnackbar = (_event?: SyntheticEvent | Event, reason?: string) => {
      reason !== 'clickaway' && setShowError(false);
   }

   const closeNewHypothesis = () => setNewHypothesisOpen(false);

   const closeUpdatedSnackbar = (_event?: SyntheticEvent | Event, reason?: string) => {
      reason !== 'clickaway' && setUpdated(false);
   }

   const createHypothesis = () => {
      (async () => {
         setShowLoading(true);
         closeNewHypothesis();
         const hypothesis = getHypothesis().trim();
         const { data, status } = await hypothesisEndpoint.post(getExperimentId(), hypothesis);
         if (status !== HttpStatusCode.OK) return bail.out(['Could not create hypothesis:', hypothesis]);
         setCreated(true);
         const newHypothesisId = parseApiId(data);
         const hypotheses = getHypotheses();
         hypotheses.push({
            experimentId: getExperimentId(),
            hypothesis,
            id: newHypothesisId,
         })
         setHypotheses(hypotheses);
         resetOriginalHypotheses();
         setShowLoading(false);
      })()
   }

   const deleteHypothesis = (event: MouseEvent<HTMLButtonElement>) => {
      (async () => {
         setShowLoading(true);
         const hypothesisId = Number(event.currentTarget.value);
         const { status } = await hypothesisEndpoint.delete(hypothesisId);
         if (status !== HttpStatusCode.OK) return bail.out(`Could not delete hypothesis #${hypothesisId}`);
         setDeleted(true);
         const newHypotheses = getHypotheses().filter(hypothesis => hypothesis.id !== hypothesisId);
         setHypotheses(newHypotheses);
         resetOriginalHypotheses();
         setShowLoading(false);
      })()
   }

   const formChangesAreUnsaved = () => {
      const hypotheses: string[] = [];
      getHypotheses().forEach(hypothesis => hypotheses.push(hypothesis.hypothesis.trim()));
      return original.current.some((hypothesis, index) => hypothesis !== hypotheses[index]);
   }

   const getHypothesesRows = () => lookup.hypothesesByExperiment(getExperimentId())
      .map((hypothesis, index) => {
         const { hypothesis: value, id } = hypothesis;
         return (
            <Row key={`hypothesis-${id}`}>
               <Column
                  sx={{ paddingRight: 0 }}
                  xs={11}
               >
                  <TextField
                     aria-label={`${translate('Hypothesis #')}${index + 1}`}
                     disabled={!experimentTools.isEnabledPendingAndOwnedBy()}
                     error={experimentTools.isEnabledPendingAndOwnedBy() && !value}
                     inputProps={{ 'data-id': id }}
                     label={`${translate('Hypothesis #')}${index + 1}`}
                     multiline={true}
                     name={'hypothesis-field'}
                     onChange={updateHypothesis}
                     required={true}
                     rows={3}
                     size={'small'}
                     sx={{ width: '100%' }}
                     value={value}
                  />
               </Column>
               <Column
                  sx={{ paddingLeft: 0 }}
                  xs={1}
               >
                  <RestrictAccess accessKey={accessKey.experimentDeleteHypothesis}>
                     <ShowIf condition={experimentTools.isEnabledPendingAndOwnedBy()}>
                        <Tooltip title={translate('Delete')}>
                           <span>
                              <IconButton
                                 aria-label={translate('Delete')}
                                 disabled={getIsDisabled()}
                                 onClick={deleteHypothesis}
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

   const launchNewHypothesis = () => {
      setHypothesis('');
      setNewHypothesisOpen(true);
      updateNewHypothesisSlider();
   }

   const resetOriginalHypotheses = () => {
      original.current = [];
      getHypotheses().forEach(hypothesis => original.current.push(hypothesis.hypothesis.trim()));
   }

   const saveHypotheses = () => {
      const current = getHypotheses();
      original.current.forEach((hypothesis, index) => {
         (async () => {
            if (hypothesis === current[index].hypothesis.trim()) return;
            setShowLoading(true);
            const hypotheses = getHypotheses();
            hypotheses[index].hypothesis = current[index].hypothesis;
            const { status } = await hypothesisEndpoint.put(hypotheses[index]);
            if (status !== HttpStatusCode.OK) return bail.out(['Could not update hypothesis:', hypotheses[index]]);
            setUpdated(true);
            setHypotheses(hypotheses);
            resetOriginalHypotheses();
            setShowLoading(false);
         })()
      })
   }

   const updateHypothesis = (event: ChangeEvent<HTMLTextAreaElement>) => {
      const { value } = event.currentTarget;
      const id = Number(event.currentTarget.dataset.id);
      const index = getHypotheses().findIndex(hypothesis => hypothesis.id === id);
      if (index === -1) {
         log.warn(`Could not find hypothesis #${id}`);
         return;
      }
      const hypotheses = getHypotheses();
      hypotheses[index].hypothesis = value;
      setHypotheses(hypotheses);
   }

   const updateNewHypothesis = (event: ChangeEvent<HTMLTextAreaElement>) => {
      setHypothesis(event.target.value.trimStart());
      updateNewHypothesisSlider();
   }

   const updateNewHypothesisSlider = () => {
      setNewHypothesisActions(
         <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
         }}>
            <Box sx={{ display: 'inline' }}>
               <ShowIf condition={getHypothesis().length > 1}>
                  <Button
                     aria-label={translate('Create')}
                     onClick={createHypothesis}
                     variant={'outlined'}
                  >
                     <TranslatedText text={'Create'}/>
                  </Button>
               </ShowIf>
            </Box>
            <Button
               aria-label={translate('Cancel')}
               onClick={closeNewHypothesis}
               variant={'outlined'}
            >
               <TranslatedText text={'Cancel'}/>
            </Button>
         </Box>
      )
      setNewHypothesisContent(
         <TextField
            aria-label={translate('Hypothesis')}
            inputRef={input => input?.focus()}
            label={translate('Hypothesis')}
            multiline={true}
            name={'new-hypothesis-field'}
            onChange={updateNewHypothesis}
            required={true}
            rows={3}
            size={'small'}
            sx={{
               marginTop: 1,
               width: '100%',
            }}
            value={getHypothesis()}
         />
      )
   }

   useEffect(() => {
      resetOriginalHypotheses();
   }, []);

   useEffect(() => {
      setAddButton(
         <Tooltip title={translate('Create new Hypothesis')}>
            <span>
               <IconButton
                  aria-label={translate('Create new Hypothesis')}
                  onClick={launchNewHypothesis}
               >
                  <AddCircle sx={{
                     color: Color.greenTemplate,
                     stroke: Color.white,
                  }}/>
               </IconButton>
            </span>
         </Tooltip>
      )
   }, []);

   useEffect(() => {
      const experimentId = getNumber(params.experimentId);
      if (experimentId !== getExperimentId()) setExperimentId(experimentId);
   }, [params])

   return <>
      <Loading open={getShowLoading()}/>
      <DefaultSnackbar
         onClose={closeCreatedSnackbar}
         open={created}
         severity={'success'}
         text={'The hypothesis has been created.'}
      />
      <DefaultSnackbar
         onClose={closeUpdatedSnackbar}
         open={updated}
         severity={'success'}
         text={'The hypothesis has been updated.'}
      />
      <DefaultSnackbar
         onClose={closeDeletedSnackbar}
         open={deleted}
         severity={'success'}
         text={'The hypothesis has been deleted.'}
      />
      <DefaultSnackbar
         onClose={closeErrorSnackbar}
         open={getShowError()}
         severity={'error'}
         text={'An error occurred.'}
      />
      <SlidingDialog
         actions={newHypothesisActions}
         content={newHypothesisContent}
         dialogProps={{
            sx: {
               '& .MuiDialog-container': {
                  '& .MuiPaper-root': {
                     maxWidth: viewport.isMobile ? '120vw' : '50vw',
                     width: '100%',
                  },
               },
            },
         }}
         onClose={closeNewHypothesis}
         open={newHypothesisOpen}
         title={translate('Create new Hypothesis')}
      />
      <Row
         columnSpacing={0}
         rowSpacing={0}
      >
         <Column xs={12} sm={12} md={12} lg={12} xl={10}>
            {getHypothesesRows()}
            <RestrictAccess accessKey={accessKey.experimentSaveHypothesis}>
               <ShowIf condition={experimentTools.isEnabledPendingAndOwnedBy()}>
                  <Row>
                     <Column
                        sx={{ paddingRight: 0 }}
                        xs={11}
                     >
                        <Box sx={{
                           textAlign: 'right',
                           width: '100%',
                        }}>
                           <ShowIf condition={lookup.hypothesesByExperiment(getExperimentId()).length > 0}>
                              <Tooltip title={translate('Save')}>
                                 <span>
                                    <IconButton
                                       aria-label={translate('Save')}
                                       disabled={getIsDisabled() || !formChangesAreUnsaved()}
                                       onClick={saveHypotheses}
                                       sx={{ color: Color.greenTemplate }}
                                    >
                                       <SaveOutlined/>
                                    </IconButton>
                                 </span>
                              </Tooltip>
                           </ShowIf>
                        </Box>
                     </Column>
                  </Row>
               </ShowIf>
            </RestrictAccess>
         </Column>
      </Row>
   </>
}