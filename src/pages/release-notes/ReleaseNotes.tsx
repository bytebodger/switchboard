import { NewReleasesOutlined } from '@mui/icons-material';
import { Box, List, ListItem, ListItemIcon, ListItemText, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, } from '@mui/material';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import packageJson from '../../../package.json';
import { Column } from '../../common/components/Column';
import { Row } from '../../common/components/Row';
import { TranslatedText } from '../../common/components/TranslatedText';
import { HtmlElement } from '../../common/enums/HtmlElement';

const ReleaseNotes = () => {
   const { t: translate } = useTranslation();

   const releases = [
      {
         date: '2024-03-07',
         notes: [
            <>Added the content to the SCHEDULE tab.</>,
         ],
         version: '1.0.55',
      },
      {
         date: '2024-03-07',
         notes: [
            <>Fixed bug when saving cohort datetimes.</>,
            <>Added logic to DELETE an audience if there are no cohorts on the experiment.</>,
            <>Added Community Users -{'>'} Account Creation Time to the list of available cohorts.</>,
            <>Renamed MESSAGES tab to SENT.</>,
            <>Added SCHEDULE tab (its contents have not yet been deployed).</>,
         ],
         version: '1.0.53',
      },
      {
         date: '2024-03-05',
         notes: [
            <>Converted all time comparisons and datetime management to use dayjs.</>,
            <>Fixed bug that wasn't saving most-recent tab after being selected.</>,
            <>Fixed bug that occurred when you refreshed on the TEMPLATES tab.</>,
            <>Set minDateTime and minTime on mobile date pickers so past values can't be chosen for Send On or Ends on.</>,
         ],
         version: '1.0.52',
      },
      {
         date: '2024-03-04',
         notes: [
            <>Fixed bug whereby message body fields weren't saving.</>,
         ],
         version: '1.0.51',
      },
      {
         date: '2024-03-04',
         notes: [
            <>Added screen_name variable.</>,
            <>Added Variables display to the message body code editors.</>,
         ],
         version: '1.0.50',
      },
      {
         date: '2024-03-04',
         notes: [
            <>Added body fields help and optimized HelpDialog.</>,
         ],
         version: '1.0.49',
      },
      {
         date: '2024-03-04',
         notes: [
            <>Added send-from values help dialog.</>,
            <>Hid send-from value fields when there are no in-app messages on the experiment.</>,
         ],
         version: '1.0.48',
      },
      {
         date: '2024-03-04',
         notes: [
            <>Removed duplicate templates from the add-message-template dialog.</>,
         ],
         version: '1.0.47',
      },
      {
         date: '2024-03-04',
         notes: [
            <>Fixed Current UTC Time display.</>,
         ],
         version: '1.0.46',
      },
      {
         date: '2024-03-01',
         notes: [
            <>Implemented CodeEditorDialog for editing all message body fields in a maximum display.</>,
            <>Removed manual save buttons from message templates.</>,
            <>Fixed bug when retrieving UTC datetime strings.</>,
         ],
         version: '1.0.45',
      },
      {
         date: '2024-02-28',
         notes: [
            <>Fixed bug that enabled the save button on message templates even when there was no change needing to be saved.</>,
         ],
         version: '1.0.44',
      },
      {
         date: '2024-02-27',
         notes: [
            <>Fixed bug preventing the save of new End Date values.</>,
         ],
         version: '1.0.43',
      },
      {
         date: '2024-02-26',
         notes: [
            <>Added UTC help.</>,
            <>Added End Dates help.</>,
         ],
         version: '1.0.42',
      },
      {
         date: '2024-02-26',
         notes: [
            <>Added Weights help.</>,
            <>Added Stages help.</>,
            <>Added Messages help.</>,
            <>Set template weight to disabled when the experiment has only one template.</>,
         ],
         version: '1.0.41',
      },
      {
         date: '2024-02-21',
         notes: [
            <>Fixed bug that kept hypotheses from being saved on new experiment records.</>,
         ],
         version: '1.0.40',
      },
      {
         date: '2024-02-21',
         notes: [
            <>Fixed display of greater-than less-than condition for datetime values on the Audience tab.</>,
            <>Set Details tab to autoforward to Hypotheses whenever Details are saved.</>,
            <>Upped the delay on loadExperiments() to avoid rate-limiting.</>,
         ],
         version: '1.0.39',
      },
      {
         date: '2024-02-20',
         notes: [
            <>Set Ref User ID and Display Name to default to the Lore Team values.</>,
         ],
         version: '1.0.38',
      },
      {
         date: '2024-02-20',
         notes: [
            <>Added "00:00 UTC" clarification to End Date display.</>,
         ],
         version: '1.0.37',
      },
      {
         date: '2024-02-20',
         notes: [
            <>Set tabs to autoforward to HYPOTHESES after creating a new experiment.</>,
         ],
         version: '1.0.36',
      },
      {
         date: '2024-02-20',
         notes: [
            <>Removed experiment tab sequencing.</>,
         ],
         version: '1.0.35',
      },
      {
         date: '2024-02-20',
         notes: [
            <>Changed datetime conditions from "is greater than" and "is less than" to "is after" and "is before".</>,
         ],
         version: '1.0.34',
      },
      {
         date: '2024-02-20',
         notes: [
            <>Clarified stage stepper display.</>,
            <>Added help dialog to explain stages.</>,
         ],
         version: '1.0.33',
      },
      {
         date: '2024-02-09',
         notes: [
            <>Added HelpDialog and created first instance on Audience tab.</>,
         ],
         version: '1.0.32',
      },
      {
         date: '2024-02-08',
         notes: [
            <>Hid the delete icon on the Roles and Permissions list if they have active associations.</>,
         ],
         version: '1.0.31',
      },
      {
         date: '2024-02-08',
         notes: [
            <>Converted Tense to Stage.</>,
            <>Added Stage icons to the experiment stepper and set colors to show green (for completed), black (for in-progress), and grey (for to-be completed).</>,
         ],
         version: '1.0.30',
      },
      {
         date: '2024-02-08',
         notes: [
            <>Streamlined all of the UTC datetime calculations.</>,
         ],
         version: '1.0.29',
      },
      {
         date: '2024-02-07',
         notes: [
            <>Fixed the ability to delete an experiment, accounting for all of the ancillary records associated with the experiment.</>,
         ],
         version: '1.0.28',
      },
      {
         date: '2024-02-06',
         notes: [
            <>Speeding up the data load in Experiments.</>,
         ],
         version: '1.0.27',
      },
      {
         date: '2024-02-06',
         notes: [
            <>Made the current LeftNav link clickable.</>,
         ],
         version: '1.0.26',
      },
      {
         date: '2024-02-06',
         notes: [
            <>Updated Tense to include unscheduled, scheduled, sending, observing, and concluded - in that order.</>,
            <>Fixed some areas where time.addOffset() should be time.removeOffset().</>,
            <>Added stepper to the top of the experiment screen to show its current progress.</>,
            <>Added the observing Tense to getTense() to show when experiments have sent all their messages but are not yet concluded.</>,
         ],
         version: '1.0.25',
      },
      {
         date: '2024-02-05',
         notes: [
            <>Fixed time calculations.</>,
         ],
         version: '1.0.24',
      },
      {
         date: '2024-02-05',
         notes: [
            <>Fixed a bug that was emptying out the beginOn value when saving experiment details.</>,
         ],
         version: '1.0.23',
      },
      {
         date: '2024-02-05',
         notes: [
            <>Added AudienceDialog that allows the user to inspect the audience members.</>,
         ],
         version: '1.0.22',
      },
      {
         date: '2024-02-04',
         notes: [
            <>Reworked data loading on the Experiments list screen to that the unfiltered list doesn't show before the filtered list is calculated.</>,
         ],
         version: '1.0.21',
      },
      {
         date: '2024-02-02',
         notes: [
            <>Fixed calculation of default send times on new message templates created during cloning.</>,
            <>Converted every cloning function that expected a result from async calls inside a forEach() loop to use await Promise.all() and map() instead of forEach().</>,
         ],
         version: '1.0.20',
      },
      {
         date: '2024-02-01',
         notes: [
            <>Added the removal of audience (SPP) in the event that cloning fails and the cloned audience filters are deleted.</>,
         ],
         version: '1.0.19',
      },
      {
         date: '2024-02-01',
         notes: [
            <>Fixed bug that kept the SPP (audience) from being built when cloning due to failure to await the promises from the creation of filters.</>,
         ],
         version: '1.0.18',
      },
      {
         date: '2024-01-31',
         notes: [
            <>Set Audience Size to resolve to 0 by default.</>,
            <>Set experiment cloning to properly save the sendFromName value.</>,
            <>Fixed getTense to properly evaluate based upon GMT time.</>,
         ],
         version: '1.0.17',
      },
      {
         date: '2024-01-31',
         notes: [
            <>Added sequential logic so new experiments are always created on the Details tab, followed by Hypotheses, followed by the Audience tab, and finally followed by the Templates tab.</>,
            <>Added setTimeouts() to data loading calls to avoid rate-limiting.</>,
            <>Set the removeEmptyExperiments() function to also remove concluded experiments that had NO message sends associated with them.</>,
         ],
         version: '1.0.16',
      },
      {
         date: '2024-01-30',
         notes: [
            <>Implemented Audience Member endpoint.</>,
            <>Added recipient dialog to show detail for each recipient from the Messages tab.</>,
         ],
         version: '1.0.15',
      },
      {
         date: '2024-01-30',
         notes: [
            <>Added the calculation of audience size when first loading the experiment screen.</>,
            <>Added the calculation of total messages to the Messages tab.</>,
            <>Created the UI for the Messages tab to show all previously-sent emails, in-app messages, and texts associated with this experiment.</>,
            <>Updated the display of email, in-app message, and text templates on the Templates tab to show the template ID.</>,
            <>Added Current Local Time to the Templates tab.</>,
         ],
         version: '1.0.14',
      },
      {
         date: '2024-01-28',
         notes: [
            <>Refactored email, in-app message, and text endpoints to match the values returned from endpoints.</>,
            <>Disabled the error highlighting on the MobileDateTimePickers.</>,
            <>Renamed the Messages tab to Templates.</>,
            <>Added a NEW Messages tab that will hold the records of sent messages.</>,
            <>Updated tab displays to show the number of hypotheses, audience members, and templates held therein.</>,
            <>Added lookups for the number of sent emails, in-app messages, and texts associated with each experiment.</>,
         ],
         version: '1.0.13',
      },
      {
         date: '2024-01-27',
         notes: [
            <>Implemented the email, in-app message, and text endpoints and set them to load on the Experiment List screen.</>,
         ],
         version: '1.0.12',
      },
      {
         date: '2024-01-25',
         notes: [
            <>Added "GMT" after all Send On dates; Added Current GMT Time to the Messages tab.</>,
            <>Fixed the missing reset on the isDisabled value on the Details tab for new experiments.</>,
         ],
         version: '1.0.11',
      },
      {
         date: '2024-01-24',
         notes: [
            <>Set experiments to sort first by endOn in descending order, then by ID in descending order.</>,
            <>Added a separate save action for Ref User ID and Display Name under Send Messages From.</>,
            <>Deprecated the experiment beginOn field and updated logic to show experiments as concluded, unscheduled, scheduled, or running based on the number of pending message templates.</>,
            <>Converted the date range picker under experiment details to a single date picker.</>,
            <>Reworked logic in the time() hook.</>,
            <>Updated the Messages tab to show as black (NOT red) as long as there is a minimum of 1 message template on the experiment.</>,
            <>Added new icons on the experiments list screen to indicate concluded, scheduled, unscheduled, or running.</>,
            <>Set the experiments list screen to remove concluded experiments that had no activity (i.e., no message templates).</>,
            <>Removed the grey-and-lined-through display of experiments list entries when the experiment is concluded.</>,
         ],
         version: '1.0.10',
      },
      {
         date: '2024-01-23',
         notes: [
            <>Changed Tenses to completed, running, scheduled, unknown, and unscheduled.</>,
            <>Updated Experiments list to reflect each experiment's current status (tense).</>,
         ],
         version: '1.0.9',
      },
      {
         date: '2024-01-22',
         notes: [
            <>Fix to ensure that message templates are always displayed on experiments that are disabled, in the past, or owned by someone else.</>,
            <>Set fields to be disabled once an experiment starts. "Starts" is defined by being between the experiment's start and end dates AND no messages having been sent.</>,
         ],
         version: '1.0.8',
      },
      {
         date: '2024-01-08',
         notes: [
            <>Refactoring.</>,
         ],
         version: '1.0.7',
      },
      {
         date: '2024-01-05',
         notes: [
            <>Refactoring.</>,
         ],
         version: '1.0.6',
      },
      {
         date: '2023-12-19',
         notes: [
            <>Implemented DefaultSnackbar.</>,
            <>Added email and ref user id options to People table when adding an Audience filter.</>,
         ],
         version: '1.0.5',
      },
      {
         date: '2023-12-18',
         notes: [
            <>Consolidated logic for email, in-app messaging, and SMS.</>,
            <>Added support for send messages FROM values.</>,
            <>Re-enabled selection of email template creation.</>,
            <>Implemented useBail() hook for smoother transitioning after async errors.</>,
         ],
         version: '1.0.4',
      },
      {
         date: '2023-11-28',
         notes: [
            <>Moved TreeItem and TreeView components from deprecated @mui/lab package to @mui/x-tree-view package.</>,
         ],
         version: '1.0.3',
      },
      {
         date: '2023-11-28',
         notes: [
            <>Commented out the ability to add email and SMS message templates to experiments until the backend support for these has been implemented.</>,
         ],
         version: '1.0.2',
      },
      {
         date: '2023-11-28',
         notes: [
            <>Changed role impersonation to be triggered by ?role=ROLE-NAME.</>,
            <>Added ability to impersonate users in non-prod by using ?user=EMAIL-ADDRESS.</>,
         ],
         version: '1.0.1',
      },
      {
         date: '2023-11-28',
         notes: [
            <>Added ability to impersonate roles in non-prod by using ?impersonate=ROLE-NAME.</>,
         ],
         version: '1.0.0',
      },
      {
         date: '2023-10-03',
         notes: [
            <>Implemented TextTemplate and TextTemplateTag endpoints.</>,
            <>Added checks for sendOn times of in-app messages and texts when the experiment dates are updated.</>,
            <>Added loading of in-app message tags, text templates, and text tags when experiment is loaded.</>,
            <>Added logic for selecting/cloning text templates.</>,
            <>Added logic for management of text tags.</>,
            <>Added TextTemplate component.</>,
            <>Added lookups for messageTagsByTextTemplate, tagsByTextTemplate, and textTemplatesByExperiment.</>,
         ],
         version: '0.1.12',
      },
      {
         date: '2023-09-29',
         notes: [
            <>Added ability to add blank or cloned in-app message templates to an experiment.</>,
            <>Added viewport.isMobile convenience method.</>,
            <>Added lookup for messageTagsByInAppMessageTemplate.</>,
         ],
         version: '0.1.11',
      },
      {
         date: '2023-09-28',
         notes: [
            <>Implemented InAppMessageTemplateTag endpoints.</>,
            <>Implemented InAppMessageTemplate endpoints.</>,
            <>Implemented ExperimentFilter endpoints.</>,
            <>Updated Messages tab to display both email and in-app messages.</>,
            <>Loaded in-app messages on load of Experiment page.</>,
            <>Added lookups for inAppMessageTemplatesByExperiment and tagsByInAppMessageTemplate.</>,
         ],
         version: '0.1.10',
      },
      {
         date: '2023-09-27',
         notes: [
            <>Implemented InAppMessageTemplate endpoints.</>,
         ],
         version: '0.1.9',
      },
      {
         date: '2023-09-27',
         notes: [
            <>Implemented ExperimentFilter endpoints.</>,
         ],
         version: '0.1.8',
      },
      {
         date: '2023-09-27',
         notes: [
            <>Added check to update template sendOn time when the experiment dates are updated.</>,
            <>Added name fields to all text inputs.</>,
            <>Fixed translation for "Cancel".</>,
         ],
         version: '0.1.7',
      },
      {
         date: '2023-08-23',
         notes: [
            <>Set conditions across the Experiment record to ensure it is only edited by the Owner, an Admin, or someone with Scientist.Admin privileges.</>,
            <>Reworked shared-store variables to ensure that we're only ever dealing with the latest value in the store.</>,
            <>Removed the system user (system.user@sequel.ae) from selectable menus.</>,
         ],
         version: '0.1.6',
      },
      {
         date: '2023-08-23',
         notes: [
            <>Expanded permissions to ensure that anyone with write access can also always read.</>,
            <>Changed user sort to accommodate full display name.</>,
            <>Integrated Owner value into Experiments list page and Detail tab.</>,
            <>Added red error displays to all empty required fields.</>,
            <>Added support for the UserDemographic endpoints.</>,
            <>Added ability to update User first/last names.</>,
            <>Disabled Permission/Role/User updates when the record has been disabled.</>,
         ],
         version: '0.1.5',
      },
      {
         date: '2023-08-23',
         notes: [
            <>Added support for owner and isDisabled values in the Experiment endpoint.</>,
            <>Darkened the template theme green color to heighten contrast.</>,
            <>Converted null coalescors to use native JS casting.</>,
            <>Added ability to toggle active/disabled from the Experiments list screen and the Experiment Detail tab.</>,
            <>Set all Experiment fields as disabled if the Experiment itself is disabled.</>,
         ],
         version: '0.1.4',
      },
      {
         date: '2023-08-22',
         notes: [
            <>Reworked date range picker logic to account for the time offset in the browser.</>,
            <>Fixed bug that kept date time picker months from being translated when the language is switched.</>,
            <>Fixed bug that kept the experiment name from being displayed on new experiments.</>,
         ],
         version: '0.1.3',
      },
      {
         date: '2023-08-21',
         notes: [
            <>Changed logic for displaying Current Version on Release Notes.</>,
            <>Updated Edit icons in Permissions, Roles, and Users to dynamically display the Visibility icon for those who only have Admin.read permission.</>,
            <>Updated cursor to default when hovering over the related roles/users/permissions in the Admin list screens.</>,
         ],
         version: '0.1.2',
      },
      {
         date: '2023-08-21',
         notes: [
            <>Added Info menu to top nav.</>,
            <>Added Access screen accessible from Info menu.</>,
            <>Added Release Notes screen accessible from Info menu.</>,
            <>Changed castings to use native JS types.</>
         ],
         version: '0.1.1',
      },
   ]

   const getNotes = (notes: ReactNode[]) => notes.map((note, index) => (
      <ListItem
         key={`noteRow-${index}`}
         sx={{ paddingLeft: 0 }}
      >
         <Box sx={{
            display: 'flex',
            height: '100%',
            marginTop: 'auto',
         }}>
            <ListItemIcon sx={{
               marginRight: 0,
               marginTop: 0.5,
            }}>
               <NewReleasesOutlined/>
            </ListItemIcon>
            <ListItemText sx={{
               position: 'relative',
               right: 24,
            }}>
               {note}
            </ListItemText>
         </Box>
      </ListItem>
   ))

   const getReleases = () => releases.map((release, index) => {
      const { date, notes, version } = release;
      return (
         <TableRow key={`releaseRow-${index}`}>
            <TableCell
               size={'small'}
               sx={{
                  paddingBottom: 0,
                  paddingTop: 1,
                  verticalAlign: 'top',
               }}
            >
               {version}
            </TableCell>
            <TableCell
               size={'small'}
               sx={{
                  paddingBottom: 0,
                  paddingTop: 1,
                  verticalAlign: 'top',
               }}
            >
               {date}
            </TableCell>
            <TableCell
               size={'small'}
               sx={{
                  paddingBottom: 0,
                  paddingTop: 0,
               }}
            >
               <List
                  dense={true}
                  sx={{
                     paddingBottom: 0,
                     paddingTop: 0,
                  }}
               >
                  {getNotes(notes)}
               </List>
            </TableCell>
         </TableRow>
      )
   })

   return <>
      <Typography variant={HtmlElement.h5}>
         <TranslatedText text={'Release Notes'}/>
      </Typography>
      <Typography sx={{ marginBottom: 2 }}>
         <TranslatedText text={'Current Version'}/>: {packageJson.version}
      </Typography>
      <Row>
         <Column xs={12} sm={12} md={12} lg={10} xl={8}>
            <Paper sx={{
               overflow: 'hidden',
               width: '100%',
            }}>
               <TableContainer sx={{ maxHeight: '75vh' }}>
                  <Table
                     aria-label={translate('Release Notes Table')}
                     stickyHeader={true}
                  >
                     <TableHead>
                        <TableRow>
                           <TableCell sx={{
                              minWidth: 100,
                              paddingBottom: 0.5,
                              paddingTop: 0.5,
                              width: 100,
                           }}>
                              <TranslatedText text={'Version'}/>
                           </TableCell>
                           <TableCell sx={{
                              minWidth: 200,
                              paddingBottom: 0.5,
                              paddingTop: 0.5,
                              width: 200,
                           }}>
                              <TranslatedText text={'Date'}/>
                           </TableCell>
                           <TableCell sx={{
                              paddingBottom: 0.5,
                              paddingTop: 0.5,
                              width: '100%',
                           }}>
                              <TranslatedText text={'Notes'}/>
                           </TableCell>
                        </TableRow>
                     </TableHead>
                     <TableBody>
                        {getReleases()}
                     </TableBody>
                  </Table>
               </TableContainer>
            </Paper>
         </Column>
      </Row>
   </>
}

export default ReleaseNotes;