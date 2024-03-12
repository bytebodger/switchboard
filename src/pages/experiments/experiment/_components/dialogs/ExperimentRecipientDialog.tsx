import { Box, Button } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Loading } from '../../../../../app/components/Loading';
import { Column } from '../../../../../common/components/Column';
import { Row } from '../../../../../common/components/Row';
import { SlidingDialog } from '../../../../../common/components/SlidingDialog';
import { TranslatedText } from '../../../../../common/components/TranslatedText';
import { HttpStatusCode } from '../../../../../common/enums/HttpStatusCode';
import { useAudienceMemberEndpoint } from '../../../../../common/hooks/endpoints/useAudienceMemberEndpoint';
import { useBail } from '../../../../../common/hooks/useBail';
import { useUXStore } from '../../../../../common/hooks/useUXStore';
import { useViewport } from '../../../../../common/hooks/useViewport';
import type { AudienceMemberDB } from '../../../../../common/interfaces/audienceMember/AudienceMemberDB';
import type { AudienceMemberUI } from '../../../../../common/interfaces/audienceMember/AudienceMemberUI';
import { reshape } from '../../../../../common/libraries/reshape';
import type { GenericFunction } from '../../../../../common/types/GenericFunction';

interface Props {
   personId: number,
   onClose: GenericFunction,
   open: boolean,
}

export const ExperimentRecipientDialog = ({ personId, onClose, open }: Props) => {
   const [
      getShowLoading,
      setShowLoading,
   ] = useUXStore(state => [
      state.getShowLoading,
      state.setShowLoading,
   ]);
   const [recipient, setRecipient] = useState<AudienceMemberUI | null>(null);
   const audienceMemberEndpoint = useAudienceMemberEndpoint();
   const bail = useBail();
   const viewport = useViewport();
   const { t: translate } = useTranslation();

   const getSlidingDialogContent = () => <>
      <Row
         columnSpacing={0}
         rowSpacing={0}
      >
         <Column xs={2}>
            <TranslatedText text={'First Name'}/>:
         </Column>
         <Column xs={10}>
            {recipient?.firstName}
         </Column>
      </Row>
      <Row
         columnSpacing={0}
         rowSpacing={0}
      >
         <Column xs={2}>
            <TranslatedText text={'Last Name'}/>:
         </Column>
         <Column xs={10}>
            {recipient?.lastName}
         </Column>
      </Row>
      <Row
         columnSpacing={0}
         rowSpacing={0}
      >
         <Column xs={2}>
            <TranslatedText text={'Address'}/>:
         </Column>
         <Column xs={10}>
            {recipient?.streetAddress}
         </Column>
      </Row>
      <Row
         columnSpacing={0}
         rowSpacing={0}
      >
         <Column xs={2}>
            <TranslatedText text={'City'}/>:
         </Column>
         <Column xs={10}>
            {recipient?.city}
         </Column>
      </Row>
      <Row
         columnSpacing={0}
         rowSpacing={0}
      >
         <Column xs={2}>
            <TranslatedText text={'State'}/>:
         </Column>
         <Column xs={10}>
            {recipient?.state}
         </Column>
      </Row>
      <Row
         columnSpacing={0}
         rowSpacing={0}
      >
         <Column xs={2}>
            <TranslatedText text={'Zip Code'}/>:
         </Column>
         <Column xs={10}>
            {recipient?.zipCode}
         </Column>
      </Row>
      <Row
         columnSpacing={0}
         rowSpacing={0}
      >
         <Column xs={2}>
            <TranslatedText text={'Email'}/>:
         </Column>
         <Column xs={10}>
            {recipient?.email}
         </Column>
      </Row>
      <Row
         columnSpacing={0}
         rowSpacing={0}
      >
         <Column xs={2}>
            <TranslatedText text={'Phone'}/>:
         </Column>
         <Column xs={10}>
            {recipient?.mobileNumber}
         </Column>
      </Row>
      <Row
         columnSpacing={0}
         rowSpacing={0}
      >
         <Column xs={2}>
            <TranslatedText text={'Gender'}/>:
         </Column>
         <Column xs={10}>
            {recipient?.gender}
         </Column>
      </Row>
   </>

   useEffect(() => {
      if (!open) return;
      (async () => {
         if (personId === 0) return;
         setShowLoading(true);
         const { data, status } = await audienceMemberEndpoint.get(personId);
         if (status !== HttpStatusCode.OK) return bail.out('Could not retrieve audience member');
         const newRecipient = data.map((audienceMember: AudienceMemberDB) => reshape.audienceMember.DB2UI(audienceMember));
         setRecipient(newRecipient[0]);
         setShowLoading(false);
      })()
   }, [open])

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
         title={`${translate('Recipient')} #${recipient?.personId}`}
      />
   </>
}