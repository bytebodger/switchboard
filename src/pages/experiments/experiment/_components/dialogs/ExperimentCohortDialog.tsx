import type { SelectChangeEvent } from '@mui/material';
import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import type { DateTimeValidationError } from '@mui/x-date-pickers';
import { MobileDatePicker } from '@mui/x-date-pickers';
import type { FieldChangeHandlerContext } from '@mui/x-date-pickers/internals';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import type { ChangeEvent, SyntheticEvent } from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Loading } from '../../../../../app/components/Loading';
import { DefaultSnackbar } from '../../../../../common/components/DefaultSnackbar';
import { ShowIf } from '../../../../../common/components/ShowIf';
import { SlidingDialog } from '../../../../../common/components/SlidingDialog';
import { TranslatedText } from '../../../../../common/components/TranslatedText';
import { cohortTables } from '../../../../../common/constants/cohortTables';
import { comparator } from '../../../../../common/constants/comparator';
import { dataTypeComparators } from '../../../../../common/constants/dataTypeComparators';
import { Format } from '../../../../../common/enums/Format';
import { HttpStatusCode } from '../../../../../common/enums/HttpStatusCode';
import { getCohortDataType } from '../../../../../common/functions/getCohortDataType';
import { getNumber } from '../../../../../common/functions/getNumber';
import { getString } from '../../../../../common/functions/getString';
import { parseApiId } from '../../../../../common/functions/parseApiId';
import { useAudienceCountEndpoint } from '../../../../../common/hooks/endpoints/useAudienceCountEndpoint';
import { useAudienceEndpoint } from '../../../../../common/hooks/endpoints/useAudienceEndpoint';
import { useCohortEndpoint } from '../../../../../common/hooks/endpoints/useCohortEndpoint';
import { useBail } from '../../../../../common/hooks/useBail';
import { useLookup } from '../../../../../common/hooks/useLookup';
import { useUXStore } from '../../../../../common/hooks/useUXStore';
import { useViewport } from '../../../../../common/hooks/useViewport';
import { DataType } from '../../../../../common/types/DataType';
import type { GenericFunction } from '../../../../../common/types/GenericFunction';
import { useExperimentsStore } from '../../../_hooks/useExperimentsStore';
import { useExperimentStore } from '../../_hooks/useExperimentStore';

interface Props {
   experimentId: number,
   onClose: GenericFunction,
   open: boolean,
}

export const ExperimentCohortDialog = ({ experimentId, onClose, open }: Props) => {
   const [setAudienceSize] = useExperimentStore(state => [state.setAudienceSize]);
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
   const [added, setAdded] = useState(false);
   const [column, setColumn] = useState('');
   const [condition, setCondition] = useState('');
   const [table, setTable] = useState('');
   const [valueDate, setValueDate] = useState<Dayjs | null>(null);
   const [valueNumber, setValueNumber] = useState<number | null>(null);
   const [valueString, setValueString] = useState('');
   const bail = useBail();
   const audienceCountEndpoint = useAudienceCountEndpoint();
   const audienceEndpoint = useAudienceEndpoint();
   const cohortEndpoint = useCohortEndpoint();
   const lookup = useLookup();
   const viewport = useViewport();
   const { t: translate } = useTranslation();

   const addCohort = () => {
      (async () => {
         closeAddCohort();
         setShowLoading(true);
         const dataType = getCohortDataType(table, column);
         let value;
         switch (dataType) {
            case DataType.datetime:
               value = dayjs(valueDate).utc(true).format(Format.dateTime);
               break;
            case DataType.numeric:
               value = getString(valueNumber);
               break;
            default:
               value = valueString;
         }
         const cohorts = getCohorts();
         let ordinal = 1;
         lookup.cohortsByExperiment(experimentId)
            .forEach(cohort => {
               if (cohort.ordinal >= ordinal) ordinal = cohort.ordinal + 1;
            })
         const { data, status } = await cohortEndpoint.post(
            condition,
            experimentId,
            column,
            ordinal,
            table,
            value,
         )
         if (status !== HttpStatusCode.created) return bail.out('Could not create cohort');
         setAdded(true);
         const newCohortId = parseApiId(data);
         cohorts.push({
            comparator: condition,
            experimentId,
            field: column,
            id: newCohortId,
            ordinal,
            table,
            value,
         })
         setCohorts(cohorts);
         const deleteResult = await audienceEndpoint.delete(experimentId);
         if (deleteResult.status !== HttpStatusCode.noContent && deleteResult.response.status !== HttpStatusCode.notFound)
            return bail.out('Could not delete audience');
         const { status: audiencePostStatus } = await audienceEndpoint.post(experimentId);
         if (audiencePostStatus !== HttpStatusCode.noContent) return bail.out('Could not create audience');
         const { data: audienceGetData, status: audienceGetStatus } = await audienceCountEndpoint.get(experimentId);
         if (audienceGetStatus !== HttpStatusCode.OK) return bail.out('Could not retrieve audience count');
         setAudienceSize(Number(audienceGetData));
         setShowLoading(false);
      })()
   }

   const closeAddCohort = () => {
      setColumn('');
      setCondition('');
      setTable('');
      setValueDate(null);
      setValueNumber(null);
      setValueString('');
      onClose();
   }

   const closeAddedSnackbar = (_event?: SyntheticEvent | Event, reason?: string) => {
      reason !== 'clickaway' && setAdded(false);
   }

   const closeErrorSnackbar = (_event?: SyntheticEvent | Event, reason?: string) => {
      reason !== 'clickaway' && setShowError(false);
   }

   const getColumnMenuItems = () => cohortTables.filter(cohortTable => cohortTable.name === table)
      .map(table => table.columns.map(column => {
         const { displayName, name } = column;
         return (
            <MenuItem
               dense={true}
               key={name}
               value={name}
            >
               <TranslatedText text={displayName}/>
            </MenuItem>
         )
      }))

   const getConditionMenuItems = () => Object.entries(comparator)
      .filter(entry => {
         const cohortTableObject = cohortTables.find(cohortTable => cohortTable.name === table);
         if (!cohortTableObject) return false;
         const columnObject = cohortTableObject.columns.find(thisColumn => thisColumn.name === column);
         if (!columnObject) return false;
         const { dataType } = columnObject;
         const dataTypeComparator = dataTypeComparators.find(comparator => comparator.dataType === dataType);
         if (!dataTypeComparator) return false;
         const [name] = entry;
         return dataTypeComparator.comparators.includes(name);
      })
      .map(entry => {
         const [displayName, name] = entry;
         return (
            <MenuItem
               dense={true}
               key={name}
               value={name}
            >
               <TranslatedText text={displayName}/>
            </MenuItem>
         )
      })

   const getSlidingDialogContent = () => <>
      <Box>
         <FormControl
            size={'small'}
            sx={{
               marginTop: 1,
               width: viewport.isMobile ? '100%' : '50%',
            }}
         >
            <InputLabel id={'table-select-label'}>
               <TranslatedText text={'Table'}/>
            </InputLabel>
            <Select
               aria-label={translate('Select Table')}
               id={'table-select'}
               label={translate('Table')}
               labelId={'table-select-label'}
               onChange={updateTable}
               value={table}
            >
               <MenuItem
                  dense={true}
                  value={''}
               >
                  <TranslatedText text={'Select Table'}/>
               </MenuItem>
               {getTableMenuItems()}
            </Select>
         </FormControl>
      </Box>
      <ShowIf condition={!!table}>
         <Box sx={{ marginTop: 1 }}>
            <FormControl
               size={'small'}
               sx={{
                  marginTop: 1,
                  width: viewport.isMobile ? '100%' : '50%',
               }}
            >
               <InputLabel id={'column-select-label'}>
                  <TranslatedText text={'Column'}/>
               </InputLabel>
               <Select
                  aria-label={translate('Select Column')}
                  id={'column-select'}
                  label={translate('Column')}
                  labelId={'column-select-label'}
                  onChange={updateColumn}
                  value={column}
               >
                  <MenuItem
                     dense={true}
                     value={''}
                  >
                     <TranslatedText text={'Select Column'}/>
                  </MenuItem>
                  {getColumnMenuItems()}
               </Select>
            </FormControl>
         </Box>
      </ShowIf>
      <ShowIf condition={!!column}>
         <Box sx={{ marginTop: 1 }}>
            <FormControl
               size={'small'}
               sx={{
                  marginTop: 1,
                  width: viewport.isMobile ? '100%' : '50%',
               }}
            >
               <InputLabel id={'condition-select-label'}>
                  <TranslatedText text={'Condition'}/>
               </InputLabel>
               <Select
                  aria-label={translate('Select Condition')}
                  id={'condition-select'}
                  label={translate('Condition')}
                  labelId={'condition-select-label'}
                  onChange={updateCondition}
                  value={condition}
               >
                  <MenuItem
                     dense={true}
                     value={''}
                  >
                     <TranslatedText text={'Select Condition'}/>
                  </MenuItem>
                  {getConditionMenuItems()}
               </Select>
            </FormControl>
         </Box>
      </ShowIf>
      <ShowIf condition={!!condition}>
         <Box sx={{ marginTop: 2 }}>
            {getValueInput()}
         </Box>
      </ShowIf>
   </>

   const getTableMenuItems = () => cohortTables.map(cohortTable => {
      const { displayName, name } = cohortTable;
      return (
         <MenuItem
            dense={true}
            key={name}
            value={name}
         >
            <TranslatedText text={displayName}/>
         </MenuItem>
      )
   })

   const getValueInput = () => {
      const dataType = getCohortDataType(table, column);
      switch (dataType) {
         case DataType.datetime:
            return (
               <MobileDatePicker
                  aria-label={translate('Value')}
                  format={Format.dateTime}
                  label={`${translate('Value')}`}
                  onChange={updateValueDate}
                  value={valueDate}
               />
            )
         case DataType.numeric:
            return (
               <TextField
                  aria-label={translate('Value')}
                  label={translate('Value')}
                  name={'value-field'}
                  onChange={updateValueNumber}
                  size={'small'}
                  sx={{ width: 100 }}
                  type={'number'}
                  value={getNumber(valueNumber)}
               />
            )
         case DataType.string:
            return (
               <TextField
                  aria-label={translate('Value')}
                  label={translate('Value')}
                  name={'value-field'}
                  onChange={updateValueString}
                  size={'small'}
                  value={valueString}
               />
            )
      }
   }

   const updateColumn = (event: SelectChangeEvent) => setColumn(event.target.value);

   const updateCondition = (event: SelectChangeEvent) => {
      setValueDate(null);
      setValueNumber(null);
      setValueString('');
      setCondition(event.target.value);
   }

   const updateTable = (event: SelectChangeEvent) => setTable(event.target.value);

   const updateValueDate = (value: Dayjs | null, _context: FieldChangeHandlerContext<DateTimeValidationError>) => setValueDate(value);

   const updateValueNumber = (event: ChangeEvent<HTMLInputElement>) => setValueNumber(Number(event.target.value));

   const updateValueString = (event: ChangeEvent<HTMLInputElement>) => setValueString(event.target.value.trimStart());

   return <>
      <Loading open={getShowLoading()}/>
      <DefaultSnackbar
         onClose={closeAddedSnackbar}
         open={added}
         severity={'success'}
         text={'The cohort has been added.'}
      />
      <DefaultSnackbar
         onClose={closeErrorSnackbar}
         open={getShowError()}
         severity={'error'}
         text={'An error occurred.'}
      />
      <SlidingDialog
         actions={
            <Box sx={{
               display: 'flex',
               justifyContent: 'space-between',
               width: '100%',
            }}>
               <ShowIf condition={!!valueDate || !!valueNumber || !!valueString}>
                  <Button
                     aria-label={translate('Add')}
                     onClick={addCohort}
                     variant={'outlined'}
                  >
                     <TranslatedText text={'Add'}/>
                  </Button>
               </ShowIf>
               <ShowIf condition={!valueDate && !valueNumber && !valueString}>
                  <Box/>
               </ShowIf>
               <Button
                  aria-label={translate('Cancel')}
                  onClick={closeAddCohort}
                  variant={'outlined'}
               >
                  <TranslatedText text={'Cancel'}/>
               </Button>
            </Box>
         }
         content={getSlidingDialogContent()}
         dialogProps={{
            sx: {
               '& .MuiDialog-container': {
                  '& .MuiPaper-root': {
                     height: '100%',
                     maxHeight: viewport.isMobile ? '120vh' : '80vh',
                     maxWidth: viewport.isMobile ? '120vw' : '50vw',
                     width: '100%',
                  },
               },
            },
         }}
         onClose={closeAddCohort}
         open={open}
         title={translate('Add Cohort')}
      />
   </>
}