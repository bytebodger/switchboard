import { HelpOutlined, ManageSearchOutlined } from '@mui/icons-material';
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Typography, } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import dayjs from 'dayjs';
import type { MouseEvent, SyntheticEvent } from 'react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Column } from '../../../../../common/components/Column';
import { HelpDialog } from '../../../../../common/components/HelpDialog';
import { Row } from '../../../../../common/components/Row';
import { ShowIf } from '../../../../../common/components/ShowIf';
import { TranslatedText } from '../../../../../common/components/TranslatedText';
import { Color } from '../../../../../common/enums/Color';
import { Format } from '../../../../../common/enums/Format';
import { Topic } from '../../../../../common/enums/Topic';
import { getNumber } from '../../../../../common/functions/getNumber';
import { useLookup } from '../../../../../common/hooks/useLookup';
import { log } from '../../../../../common/libraries/log';
import { useExperimentStore } from '../../_hooks/useExperimentStore';
import { ExperimentRecipientDialog } from '../dialogs/ExperimentRecipientDialog';

export const ExperimentSentTab = () => {
   const [
      getExperimentId,
      getRecipientId,
      setAddButton,
      setExperimentId,
      setRecipientId,
   ] = useExperimentStore(state => [
      state.getExperimentId,
      state.getRecipientId,
      state.setAddButton,
      state.setExperimentId,
      state.setRecipientId,
   ])
   const [expanded, setExpanded] = useState<string | false>(false);
   const [helpOpen, setHelpOpen] = useState(false);
   const [open, setOpen] = useState(false);
   const lookup = useLookup();
   const params = useParams();
   const { t: translate } = useTranslation();

   const emails = lookup.emailsByExperiment(getExperimentId());
   const emailTemplates = lookup.emailTemplatesByExperiment(getExperimentId());
   const inAppMessages = lookup.inAppMessagesByExperiment(getExperimentId());
   const inAppMessageTemplates = lookup.inAppMessageTemplatesByExperiment(getExperimentId());
   const narrowCellSx = {
      minWidth: 100,
      paddingBottom: 0.5,
      paddingTop: 0.5,
   }
   const tableCellSx = {
      paddingBottom: 0.5,
      paddingTop: 0.5,
      verticalAlign: 'middle',
   }
   const texts = lookup.textsByExperiment(getExperimentId());
   const textTemplates = lookup.textTemplatesByExperiment(getExperimentId());
   const wideCellSx = {
      minWidth: 300,
      paddingBottom: 0.5,
      paddingTop: 0.5,
   }

   const closeHelpDialog = () => setHelpOpen(false);

   const closeRecipientDialog = () => setOpen(false);

   const getEmails = () => emails.map(email => {
      const { id, emailTemplateId, personId, sentOn } = email;
      const emailTemplate = emailTemplates.find(emailTemplate => emailTemplate.id === emailTemplateId);
      if (!emailTemplate) {
         log.warn('Could not find email template');
         return null;
      }
      const { sendOn } = emailTemplate;
      return (
         <TableRow key={`email-${id}`}>
            <TableCell
               size={'small'}
               sx={tableCellSx}
            >
               {emailTemplateId}
            </TableCell>
            <TableCell
               size={'small'}
               sx={tableCellSx}
            >
               {dayjs(sendOn).utc(true).format(Format.dateTime)}
               {' '}
               <TranslatedText text={'UTC'}/>
            </TableCell>
            <TableCell
               size={'small'}
               sx={tableCellSx}
            >
               <Tooltip title={translate('Details')}>
                  <IconButton
                     aria-label={translate('Details')}
                     onClick={goToRecipientDetail}
                     sx={{
                        bottom: 2,
                        color: Color.blueNeon,
                        position: 'relative',
                     }}
                     value={personId}
                  >
                     <ManageSearchOutlined/>
                  </IconButton>
               </Tooltip>
               {personId}
            </TableCell>
            <TableCell
               size={'small'}
               sx={tableCellSx}
            >
               {dayjs(sentOn).utc(true).format(Format.dateTime)}
               {' '}
               <TranslatedText text={'UTC'}/>
            </TableCell>
         </TableRow>
      )
   })

   const getInAppMessages = () => inAppMessages.map(inAppMessage => {
      const { id, inAppMessageTemplateId, personId, sentOn } = inAppMessage;
      const inAppMessageTemplate = inAppMessageTemplates
         .find(inAppMessageTemplate => inAppMessageTemplate.id === inAppMessageTemplateId);
      if (!inAppMessageTemplate) {
         log.warn('Could not find in-app message template');
         return null;
      }
      const { sendOn } = inAppMessageTemplate;
      return (
         <TableRow key={`inAppMessage-${id}`}>
            <TableCell
               size={'small'}
               sx={tableCellSx}
            >
               {inAppMessageTemplateId}
            </TableCell>
            <TableCell
               size={'small'}
               sx={tableCellSx}
            >
               {dayjs(sendOn).utc(true).format(Format.dateTime)}
               {' '}
               <TranslatedText text={'UTC'}/>
            </TableCell>
            <TableCell
               size={'small'}
               sx={tableCellSx}
            >
               <Tooltip title={translate('Details')}>
                  <IconButton
                     aria-label={translate('Details')}
                     onClick={goToRecipientDetail}
                     sx={{
                        bottom: 2,
                        color: Color.blueNeon,
                        position: 'relative',
                     }}
                     value={personId}
                  >
                     <ManageSearchOutlined/>
                  </IconButton>
               </Tooltip>
               {personId}
            </TableCell>
            <TableCell
               size={'small'}
               sx={tableCellSx}
            >
               {dayjs(sentOn).utc(true).format(Format.dateTime)}
               {' '}
               <TranslatedText text={'UTC'}/>
            </TableCell>
         </TableRow>
      )
   })

   const getTexts = () => texts.map(text => {
      const { guid, personId, sentOn, textTemplateId } = text;
      const textTemplate = textTemplates.find(textTemplate => textTemplate.id === textTemplateId);
      if (!textTemplate) {
         log.warn('Could not find text template');
         return null;
      }
      const { sendOn } = textTemplate;
      return (
         <TableRow key={`text-${guid}`}>
            <TableCell
               size={'small'}
               sx={tableCellSx}
            >
               {textTemplateId}
            </TableCell>
            <TableCell
               size={'small'}
               sx={tableCellSx}
            >
               {dayjs(sendOn).utc(true).format(Format.dateTime)}
               {' '}
               <TranslatedText text={'UTC'}/>
            </TableCell>
            <TableCell
               size={'small'}
               sx={tableCellSx}
            >
               {personId}
            </TableCell>
            <TableCell
               size={'small'}
               sx={tableCellSx}
            >
               {dayjs(sentOn).utc(true).format(Format.dateTime)}
               {' '}
               <TranslatedText text={'UTC'}/>
            </TableCell>
         </TableRow>
      )
   })

   const goToRecipientDetail = (event: MouseEvent<HTMLButtonElement>) => {
      setRecipientId(Number(event.currentTarget.value));
      setOpen(true);
   }

   const updateExpanded = (panel: string) => (_event: SyntheticEvent, newExpanded: boolean) => setExpanded(newExpanded ? panel : false);

   const getExpanded = (panel: string) => {
      if (expanded === panel) return true;
      if (
         panel === 'emailPanel'
         && emails.length > 0
         && inAppMessages.length === 0
         && texts.length === 0
      )
         return true;
      if (
         panel === 'inAppMessagePanel'
         && emails.length === 0
         && inAppMessages.length > 0
         && texts.length === 0
      )
         return true;
      return panel === 'textPanel'
         && emails.length === 0
         && inAppMessages.length === 0
         && texts.length > 0;
   }

   const launchHelpDialog = () => setHelpOpen(true);

   useEffect(() => {
      setAddButton(null);
   }, [])

   useEffect(() => {
      const experimentId = getNumber(params.experimentId);
      if (experimentId !== getExperimentId()) setExperimentId(experimentId);
   }, [params])

   return <>
      <HelpDialog
         onClose={closeHelpDialog}
         open={helpOpen}
         topic={Topic.sentMessages}
      />
      <ExperimentRecipientDialog
         personId={getRecipientId()}
         onClose={closeRecipientDialog}
         open={open}
      />
      <Row>
         <Column
            xs={12} sm={12} md={12} lg={12} xl={10}
            sx={{
               display: 'flex',
               justifyContent: 'space-between',
            }}
         >
            <Tooltip title={translate('Help on Sent Messages')}>
               <Button
                  aria-label={translate('Help on Sent Messages')}
                  onClick={launchHelpDialog}
                  sx={{
                     marginBottom: 2.1,
                     marginRight: 2,
                     marginTop: 1.5,
                     maxHeight: 8,
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
            <Box sx={{ flexGrow: 1 }}>
               <ShowIf condition={emails.length > 0}>
                  <Accordion
                     aria-label={translate('Emails')}
                     expanded={getExpanded('emailPanel')}
                     onChange={updateExpanded('emailPanel')}
                     sx={{ marginTop: 1 }}
                  >
                     <AccordionSummary
                        aria-controls={'emailPanel-content'}
                        id={'emailPanel-header'}
                     >
                        <Typography>
                           <TranslatedText text={'Emails'}/>
                           {' '}
                           ({emails.length})
                        </Typography>
                     </AccordionSummary>
                     <AccordionDetails>
                        <Paper sx={{
                           overflow: 'hidden',
                           width: '100%',
                        }}>
                           <TableContainer sx={{ maxHeight: '50vh' }}>
                              <Table
                                 aria-label={translate('Email Table')}
                                 stickyHeader={true}
                              >
                                 <TableHead>
                                    <TableRow>
                                       <TableCell sx={narrowCellSx}>
                                          <TranslatedText text={'Template ID'}/>
                                       </TableCell>
                                       <TableCell sx={wideCellSx}>
                                          <TranslatedText text={'Scheduled'}/>
                                       </TableCell>
                                       <TableCell sx={narrowCellSx}>
                                          <TranslatedText text={'Recipient ID'}/>
                                       </TableCell>
                                       <TableCell sx={wideCellSx}>
                                          <TranslatedText text={'Sent On'}/>
                                       </TableCell>
                                    </TableRow>
                                 </TableHead>
                                 <TableBody>
                                    {getEmails()}
                                 </TableBody>
                              </Table>
                           </TableContainer>
                        </Paper>
                     </AccordionDetails>
                  </Accordion>
               </ShowIf>
               <ShowIf condition={inAppMessages.length > 0}>
                  <Accordion
                     aria-label={translate('In-App Messages')}
                     expanded={getExpanded('inAppMessagePanel')}
                     onChange={updateExpanded('inAppMessagePanel')}
                     sx={{ marginTop: 1 }}
                  >
                     <AccordionSummary
                        aria-controls={'inAppMessagePanel-content'}
                        id={'inAppMessageContent-header'}
                     >
                        <Typography>
                           <TranslatedText text={'In-App Messages'}/>
                           {' '}
                           ({inAppMessages.length})
                        </Typography>
                     </AccordionSummary>
                     <AccordionDetails>
                        <Paper sx={{
                           overflow: 'hidden',
                           width: '100%',
                        }}>
                           <TableContainer sx={{ maxHeight: '50vh' }}>
                              <Table
                                 aria-label={translate('In-App Message Table')}
                                 stickyHeader={true}
                              >
                                 <TableHead>
                                    <TableRow>
                                       <TableCell sx={narrowCellSx}>
                                          <TranslatedText text={'Template ID'}/>
                                       </TableCell>
                                       <TableCell sx={wideCellSx}>
                                          <TranslatedText text={'Scheduled'}/>
                                       </TableCell>
                                       <TableCell sx={narrowCellSx}>
                                          <TranslatedText text={'Recipient ID'}/>
                                       </TableCell>
                                       <TableCell sx={wideCellSx}>
                                          <TranslatedText text={'Sent On'}/>
                                       </TableCell>
                                    </TableRow>
                                 </TableHead>
                                 <TableBody>
                                    {getInAppMessages()}
                                 </TableBody>
                              </Table>
                           </TableContainer>
                        </Paper>
                     </AccordionDetails>
                  </Accordion>
               </ShowIf>
               <ShowIf condition={texts.length > 0}>
                  <Accordion
                     aria-label={'Texts'}
                     expanded={getExpanded('textPanel')}
                     onChange={updateExpanded('textPanel')}
                     sx={{ marginTop: 1 }}
                  >
                     <AccordionSummary
                        aria-controls={'textPanel-content'}
                        id={'textPanel-header'}
                     >
                        <Typography>
                           <TranslatedText text={'Texts'}/>
                           {' '}
                           ({texts.length})
                        </Typography>
                     </AccordionSummary>
                     <AccordionDetails>
                        <Paper sx={{
                           overflow: 'hidden',
                           width: '100%',
                        }}>
                           <TableContainer sx={{ maxHeight: '50vh' }}>
                              <Table
                                 aria-label={translate('Text Table')}
                                 stickyHeader={true}
                              >
                                 <TableHead>
                                    <TableRow>
                                       <TableCell sx={narrowCellSx}>
                                          <TranslatedText text={'Template ID'}/>
                                       </TableCell>
                                       <TableCell sx={wideCellSx}>
                                          <TranslatedText text={'Scheduled'}/>
                                       </TableCell>
                                       <TableCell sx={narrowCellSx}>
                                          <TranslatedText text={'Recipient ID'}/>
                                       </TableCell>
                                       <TableCell sx={wideCellSx}>
                                          <TranslatedText text={'Sent On'}/>
                                       </TableCell>
                                    </TableRow>
                                 </TableHead>
                                 <TableBody>
                                    {getTexts()}
                                 </TableBody>
                              </Table>
                           </TableContainer>
                        </Paper>
                     </AccordionDetails>
                  </Accordion>
               </ShowIf>
            </Box>
         </Column>
      </Row>
   </>
}