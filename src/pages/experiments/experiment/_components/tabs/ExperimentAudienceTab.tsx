import { AddCircle, DeleteForeverOutlined, HelpOutlined } from '@mui/icons-material';
import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import type { MouseEvent, SyntheticEvent } from 'react';
import { Fragment, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Loading } from '../../../../../app/components/Loading';
import { Column } from '../../../../../common/components/Column';
import { DefaultSnackbar } from '../../../../../common/components/DefaultSnackbar';
import { HelpDialog } from '../../../../../common/components/HelpDialog';
import { RestrictAccess } from '../../../../../common/components/RestrictAccess';
import { Row } from '../../../../../common/components/Row';
import { ShowIf } from '../../../../../common/components/ShowIf';
import { TranslatedText } from '../../../../../common/components/TranslatedText';
import { accessKey } from '../../../../../common/constants/accessKey';
import { cohortTables } from '../../../../../common/constants/cohortTables';
import { comparator } from '../../../../../common/constants/comparator';
import { dataTypeComparators } from '../../../../../common/constants/dataTypeComparators';
import { Color } from '../../../../../common/enums/Color';
import { HttpStatusCode } from '../../../../../common/enums/HttpStatusCode';
import { Topic } from '../../../../../common/enums/Topic';
import { getNumber } from '../../../../../common/functions/getNumber';
import { useAudienceCountEndpoint } from '../../../../../common/hooks/endpoints/useAudienceCountEndpoint';
import { useAudienceEndpoint } from '../../../../../common/hooks/endpoints/useAudienceEndpoint';
import { useCohortEndpoint } from '../../../../../common/hooks/endpoints/useCohortEndpoint';
import { useBail } from '../../../../../common/hooks/useBail';
import { useLookup } from '../../../../../common/hooks/useLookup';
import { useUXStore } from '../../../../../common/hooks/useUXStore';
import { useExperimentsStore } from '../../../_hooks/useExperimentsStore';
import { useExperimentStore } from '../../_hooks/useExperimentStore';
import { useExperimentTools } from '../../_hooks/useExperimentTools';
import { ExperimentAudienceDialog } from '../dialogs/ExperimentAudienceDialog';
import { ExperimentCohortDialog } from '../dialogs/ExperimentCohortDialog';

export const ExperimentAudienceTab = () => {
   const [
      getAudienceSize,
      getExperimentId,
      getIsDisabled,
      setAddButton,
      setAudienceSize,
      setExperimentId,
   ] = useExperimentStore(state => [
      state.getAudienceSize,
      state.getExperimentId,
      state.getIsDisabled,
      state.setAddButton,
      state.setAudienceSize,
      state.setExperimentId,
   ]);
   const [
      getCohorts,
      setCohorts,
   ] = useExperimentsStore(state => [
      state.getCohorts,
      state.setCohorts,
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
   const [audienceDialogOpen, setAudienceDialogOpen] = useState(false);
   const [cohortDialogOpen, setCohortDialogOpen] = useState(false);
   const [deleted, setDeleted] = useState(false);
   const [helpOpen, setHelpOpen] = useState(false);
   const audienceCountEndpoint = useAudienceCountEndpoint();
   const audienceEndpoint = useAudienceEndpoint();
   const bail = useBail();
   const cohortEndpoint = useCohortEndpoint();
   const experimentTools = useExperimentTools();
   const lookup = useLookup();
   const params = useParams();
   const { t: translate } = useTranslation();

   const cell25 = {
      maxWidth: 25,
      paddingBottom: 0.5,
      paddingTop: 0.5,
      width: 25,
   }
   const cell100 = {
      minWidth: 100,
      paddingBottom: 0.5,
      paddingTop: 0.5,
      width: 100,
   }
   const cell200 = {
      minWidth: 200,
      paddingBottom: 0.5,
      paddingTop: 0.5,
      width: 200,
   }

   const closeAddCohort = () => setCohortDialogOpen(false);

   const closeAudienceDialog = () => setAudienceDialogOpen(false);

   const closeHelpDialog = () => setHelpOpen(false);

   const closeDeletedSnackbar = (_event?: SyntheticEvent | Event, reason?: string) => {
      reason !== 'clickaway' && setDeleted(false);
   }

   const closeErrorSnackbar = (_event?: SyntheticEvent | Event, reason?: string) => {
      reason !== 'clickaway' && setShowError(false);
   }

   const deleteCohort = (event: MouseEvent<HTMLButtonElement>) => {
      (async () => {
         setShowLoading(true);
         const cohortId = Number(event.currentTarget.value);
         const { status } = await cohortEndpoint.delete(cohortId);
         if (status !== HttpStatusCode.OK) return bail.out(`Could not delete cohort #${cohortId}`);
         setDeleted(true);
         let cohorts = getCohorts().filter(cohort => cohort.id !== cohortId);
         setCohorts(cohorts);
         const deleteResult = await audienceEndpoint.delete(getExperimentId());
         if (deleteResult.status !== HttpStatusCode.noContent && deleteResult.response.status !== HttpStatusCode.notFound)
            return bail.out('Could not delete audience');
         const { status: audiencePostStatus } = await audienceEndpoint.post(getExperimentId());
         if (audiencePostStatus !== HttpStatusCode.noContent) return bail.out('Could not create audience');
         cohorts = lookup.cohortsByExperiment(getExperimentId());
         if (cohorts.length === 0) {
            setShowLoading(false);
            setAudienceSize(0);
            return;
         }
         const { data: audienceGetData, status: audienceGetStatus } = await audienceCountEndpoint.get(getExperimentId());
         if (audienceGetStatus !== HttpStatusCode.OK) return bail.out('Could not retrieve audience count');
         setAudienceSize(Number(audienceGetData));
         setShowLoading(false);
      })()
   }

   const getAudienceButton = () => {
      const audienceSize = getAudienceSize();
      if (!audienceSize) return audienceSize;
      return <>
         <Tooltip title={translate('View')}>
            <Button
               aria-label={translate('View')}
               onClick={launchAudienceDialog}
               size={'small'}
               sx={{
                  marginBottom: 0.5,
                  minWidth: 0,
               }}
               variant={'outlined'}
            >
               {audienceSize}
            </Button>
         </Tooltip>
      </>
   }

   const getCohortRows = () => lookup.cohortsByExperiment(getExperimentId())
      .map((cohort, index) => {
         let { field, id, value } = cohort;
         const table = cohortTables.find(cohortTable => cohortTable.name === cohort.table);
         if (!table) return null;
         const column = table.columns.find(column => column.name === field);
         if (!column) return null;
         const { dataType } = column;
         const cohortComparators = dataTypeComparators.find(comparator => comparator.dataType === dataType);
         if (!cohortComparators) return null;
         let condition = '';
         Object.entries(comparator).forEach(entry => {
            const [key, value] = entry;
            if (value === cohort.comparator && cohortComparators.comparators.some(comparator => comparator === key)) condition = key;
         })
         if (field.includes('datetime_utc')) value += ` ${translate('UTC')}`;
         let spacerRow = null;
         if (index)
            spacerRow = <>
               <TableRow>
                  <TableCell/>
                  <TableCell
                     colSpan={5}
                     size={'small'}
                  >
                     <TranslatedText text={'AND'}/>
                  </TableCell>
               </TableRow>
            </>
         return <Fragment key={`cohortRow-${id}`}>
            {spacerRow}
            <TableRow>
               <TableCell size={'small'}>
                  {index + 1}.
               </TableCell>
               <TableCell size={'small'}>
                  <TranslatedText text={table.displayName}/>
               </TableCell>
               <TableCell size={'small'}>
                  <TranslatedText text={column.displayName}/>
               </TableCell>
               <TableCell size={'small'}>
                  <TranslatedText text={condition}/>
               </TableCell>
               <TableCell size={'small'}>
                  <TranslatedText text={value}/>
               </TableCell>
               <TableCell size={'small'}>
                  <RestrictAccess accessKey={accessKey.experimentDeleteCohort}>
                     <ShowIf condition={experimentTools.isEnabledPendingAndOwnedBy()}>
                        <Tooltip title={translate('Delete')}>
                           <span>
                              <IconButton
                                 aria-label={translate('Delete')}
                                 disabled={getIsDisabled()}
                                 onClick={deleteCohort}
                                 sx={{ color: Color.red }}
                                 value={id}
                              >
                                 <DeleteForeverOutlined/>
                              </IconButton>
                           </span>
                        </Tooltip>
                     </ShowIf>
                  </RestrictAccess>
               </TableCell>
            </TableRow>
         </Fragment>
      })

   const launchAddCohort = () => setCohortDialogOpen(true);

   const launchAudienceDialog = () => setAudienceDialogOpen(true);

   const launchHelpDialog = () => setHelpOpen(true);

   useEffect(() => {
      setAddButton(
         <Tooltip title={translate('Add Cohort')}>
            <span>
               <IconButton
                  aria-label={translate('Add Cohort')}
                  onClick={launchAddCohort}
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
      (async () => {
         const urlExperimentId = getNumber(params.experimentId);
         const experimentId = urlExperimentId || getExperimentId();
         const { data, status } = await audienceCountEndpoint.get(experimentId);
         if (status !== HttpStatusCode.OK) return bail.out('Could not retrieve audience size');
         const audienceSize = Number(data);
         setAudienceSize(audienceSize);
         if (audienceSize === 0) return;
         const cohorts = lookup.cohortsByExperiment(experimentId);
         if (cohorts.length > 0) return;
         const deleteResult = await audienceEndpoint.delete(getExperimentId());
         if (deleteResult.status !== HttpStatusCode.noContent && deleteResult.response.status !== HttpStatusCode.notFound)
            return bail.out('Could not delete audience');
         setAudienceSize(0);
      })()
   }, []);

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
         text={'The cohort has been deleted.'}
      />
      <DefaultSnackbar
         onClose={closeErrorSnackbar}
         open={getShowError()}
         severity={'error'}
         text={'An error occurred.'}
      />
      <ExperimentAudienceDialog
         onClose={closeAudienceDialog}
         open={audienceDialogOpen}
      />
      <ExperimentCohortDialog
         experimentId={getExperimentId()}
         onClose={closeAddCohort}
         open={cohortDialogOpen}
      />
      <HelpDialog
         onClose={closeHelpDialog}
         open={helpOpen}
         topic={Topic.audiences}
      />
      <Row
         columnSpacing={0}
         rowSpacing={0}
      >
         <Column xs={12} sm={12} md={12} lg={12} xl={10}>
            <Paper sx={{
               overflow: 'hidden',
               width: '100%',
            }}>
               <TableContainer sx={{ maxHeight: '50vh' }}>
                  <Table
                     aria-label={translate('Cohort Table')}
                     stickyHeader={true}
                  >
                     <TableHead>
                        <TableRow>
                           <TableCell
                              align={'center'}
                              colSpan={6}
                              sx={{
                                 paddingBottom: 0.5,
                                 paddingTop: 0.5,
                              }}
                           >
                              <TranslatedText text={'Cohorts'}/>
                           </TableCell>
                        </TableRow>
                        <TableRow>
                           <TableCell sx={cell25}/>
                           <TableCell sx={cell200}>
                              <TranslatedText text={'Table'}/>
                           </TableCell>
                           <TableCell sx={cell200}>
                              <TranslatedText text={'Column'}/>
                           </TableCell>
                           <TableCell sx={cell100}>
                              <TranslatedText text={'Condition'}/>
                           </TableCell>
                           <TableCell sx={cell200}>
                              <TranslatedText text={'Value'}/>
                           </TableCell>
                           <TableCell sx={cell25}/>
                        </TableRow>
                     </TableHead>
                     <TableBody>
                        {getCohortRows()}
                     </TableBody>
                  </Table>
               </TableContainer>
            </Paper>
         </Column>
         <ShowIf condition={getAudienceSize() !== null}>
            <Column xs={12} sm={12} md={12} lg={12} xl={10}>
               <Box sx={{
                  marginTop: 4,
                  textAlign: 'right',
               }}>
                  <TranslatedText text={'Approximate Audience Size'}/>: {getAudienceButton()}
                  <Tooltip title={translate('Help on Audiences')}>
                     <Button
                        aria-label={translate('Help on Audiences')}
                        onClick={launchHelpDialog}
                        sx={{
                           marginBottom: 2.1,
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
            </Column>
         </ShowIf>
      </Row>
   </>
}