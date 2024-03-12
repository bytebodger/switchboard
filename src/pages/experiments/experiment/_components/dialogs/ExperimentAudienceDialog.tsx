import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from '@mui/material';
import { type SyntheticEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Loading } from '../../../../../app/components/Loading';
import { Column } from '../../../../../common/components/Column';
import { Row } from '../../../../../common/components/Row';
import { SlidingDialog } from '../../../../../common/components/SlidingDialog';
import { TranslatedText } from '../../../../../common/components/TranslatedText';
import { HttpStatusCode } from '../../../../../common/enums/HttpStatusCode';
import { useAudienceEndpoint } from '../../../../../common/hooks/endpoints/useAudienceEndpoint';
import { useAudienceMemberEndpoint } from '../../../../../common/hooks/endpoints/useAudienceMemberEndpoint';
import { useBail } from '../../../../../common/hooks/useBail';
import { useUXStore } from '../../../../../common/hooks/useUXStore';
import { useViewport } from '../../../../../common/hooks/useViewport';
import type { AudienceMemberDB } from '../../../../../common/interfaces/audienceMember/AudienceMemberDB';
import type { AudienceMemberUI } from '../../../../../common/interfaces/audienceMember/AudienceMemberUI';
import type { PersonDB } from '../../../../../common/interfaces/person/PersonDB';
import type { PersonUI } from '../../../../../common/interfaces/person/PersonUI';
import { reshape } from '../../../../../common/libraries/reshape';
import type { GenericFunction } from '../../../../../common/types/GenericFunction';
import { useExperimentStore } from '../../_hooks/useExperimentStore';

interface Props {
   onClose: GenericFunction,
   open: boolean,
}

export const ExperimentAudienceDialog = ({ onClose, open }: Props) => {
   const [getExperimentId] = useExperimentStore(state => [state.getExperimentId]);
   const [
      getShowLoading,
      setShowLoading,
   ] = useUXStore(state => [
      state.getShowLoading,
      state.setShowLoading,
   ]);
   const [audienceMember, setAudienceMember] = useState<AudienceMemberUI | null>(null);
   const [people, setPeople] = useState<PersonUI[]>([]);
   const [personId, setPersonId] = useState<number | false>(false);
   const audienceEndpoint = useAudienceEndpoint();
   const audienceMemberEndpoint = useAudienceMemberEndpoint();
   const bail = useBail();
   const viewport = useViewport();
   const { t: translate } = useTranslation();

   const getAudienceRows = () => people.map(person => {
      const { sppPersonId } = person;
      return (
         <TableRow key={`person-${sppPersonId}`}>
            <TableCell size={'small'}>
               <Accordion
                  aria-label={translate('People')}
                  expanded={personId === sppPersonId}
                  onChange={updateExpanded(sppPersonId)}
                  sx={{ marginTop: 1 }}
               >
                  <AccordionSummary
                     aria-controls={'personPanel-content'}
                     id={'personPanel-header'}
                  >
                     <Typography>
                        {sppPersonId}
                     </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                     <Paper sx={{
                        overflow: 'hidden',
                        width: '100%',
                     }}>
                        <Row
                           columnSpacing={0}
                           rowSpacing={0}
                           sx={{ padding: 1 }}
                        >
                           <Column xs={2}>
                              <TranslatedText text={'First Name'}/>:
                           </Column>
                           <Column xs={10}>
                              {audienceMember?.firstName}
                           </Column>
                        </Row>
                        <Row
                           columnSpacing={0}
                           rowSpacing={0}
                           sx={{ padding: 1 }}
                        >
                           <Column xs={2}>
                              <TranslatedText text={'Last Name'}/>:
                           </Column>
                           <Column xs={10}>
                              {audienceMember?.lastName}
                           </Column>
                        </Row>
                        <Row
                           columnSpacing={0}
                           rowSpacing={0}
                           sx={{ padding: 1 }}
                        >
                           <Column xs={2}>
                              <TranslatedText text={'Address'}/>:
                           </Column>
                           <Column xs={10}>
                              {audienceMember?.streetAddress}
                           </Column>
                        </Row>
                        <Row
                           columnSpacing={0}
                           rowSpacing={0}
                           sx={{ padding: 1 }}
                        >
                           <Column xs={2}>
                              <TranslatedText text={'City'}/>:
                           </Column>
                           <Column xs={10}>
                              {audienceMember?.city}
                           </Column>
                        </Row>
                        <Row
                           columnSpacing={0}
                           rowSpacing={0}
                           sx={{ padding: 1 }}
                        >
                           <Column xs={2}>
                              <TranslatedText text={'State'}/>:
                           </Column>
                           <Column xs={10}>
                              {audienceMember?.state}
                           </Column>
                        </Row>
                        <Row
                           columnSpacing={0}
                           rowSpacing={0}
                           sx={{ padding: 1 }}
                        >
                           <Column xs={2}>
                              <TranslatedText text={'Zip Code'}/>:
                           </Column>
                           <Column xs={10}>
                              {audienceMember?.zipCode}
                           </Column>
                        </Row>
                        <Row
                           columnSpacing={0}
                           rowSpacing={0}
                           sx={{ padding: 1 }}
                        >
                           <Column xs={2}>
                              <TranslatedText text={'Email'}/>:
                           </Column>
                           <Column xs={10}>
                              {audienceMember?.email}
                           </Column>
                        </Row>
                        <Row
                           columnSpacing={0}
                           rowSpacing={0}
                           sx={{ padding: 1 }}
                        >
                           <Column xs={2}>
                              <TranslatedText text={'Phone'}/>:
                           </Column>
                           <Column xs={10}>
                              {audienceMember?.mobileNumber}
                           </Column>
                        </Row>
                        <Row
                           columnSpacing={0}
                           rowSpacing={0}
                           sx={{ padding: 1 }}
                        >
                           <Column xs={2}>
                              <TranslatedText text={'Gender'}/>:
                           </Column>
                           <Column xs={10}>
                              {audienceMember?.gender}
                           </Column>
                        </Row>
                     </Paper>
                  </AccordionDetails>
               </Accordion>
            </TableCell>
         </TableRow>
      )
   })

   const getSlidingDialogContent = () => <>
      <Row
         columnSpacing={0}
         rowSpacing={0}
      >
         <Column xs={12}>
            <Paper sx={{
               overflow: 'hidden',
               width: '100%',
            }}>
               <TableContainer sx={{ maxHeight: '75vh' }}>
                  <Table
                     aria-label={translate('Audience Table')}
                     stickyHeader={true}
                  >
                     <TableBody>
                        {getAudienceRows()}
                     </TableBody>
                  </Table>
               </TableContainer>
            </Paper>
         </Column>
      </Row>
   </>

   const updateExpanded = (personId: number) => (_event: SyntheticEvent, expanded: boolean) => {
      (async () => {
         setShowLoading(true);
         const { data, status } = await audienceMemberEndpoint.get(personId);
         if (status !== HttpStatusCode.OK) return bail.out('Could not retrieve audience member');
         const audienceMember = data.map((audienceMember: AudienceMemberDB) => reshape.audienceMember.DB2UI(audienceMember))[0];
         setAudienceMember(audienceMember);
         setPersonId(expanded ? personId : false);
         setShowLoading(false);
      })()
   }

   useEffect(() => {
      if (!open) return;
      (async () => {
         setShowLoading(true);
         const { data, status } = await audienceEndpoint.get(getExperimentId());
         if (status !== HttpStatusCode.OK) return bail.out('Could not retrieve audience');
         const people = data.map((person: PersonDB) => reshape.person.DB2UI(person));
         setPeople(people);
         setShowLoading(false);
      })()
   }, [open]);

   return <>
      <Loading open={getShowLoading()}/>
      <SlidingDialog
         actions={
            <Box sx={{
               textAlign: 'right',
               width: '100%',
            }}>
               <Button
                  aria-label={translate('Cancel')}
                  onClick={onClose}
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
         onClose={onClose}
         open={open}
         title={translate('Audience')}
      />
   </>
}