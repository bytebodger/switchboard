import type { SelectChangeEvent } from '@mui/material';
import { Box, Button, Chip, FormControl, InputLabel, Select, TextField, Tooltip } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import dayjs from 'dayjs';
import type { ChangeEvent, KeyboardEvent, MouseEvent, SyntheticEvent } from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BiSolidEraser } from 'react-icons/bi';
import { Loading } from '../../../../../app/components/Loading';
import { useEndpointStore } from '../../../../../app/hooks/useEndpointStore';
import { DefaultSnackbar } from '../../../../../common/components/DefaultSnackbar';
import { ShowIf } from '../../../../../common/components/ShowIf';
import { SlidingDialog } from '../../../../../common/components/SlidingDialog';
import { TranslatedText } from '../../../../../common/components/TranslatedText';
import { Color } from '../../../../../common/enums/Color';
import { Format } from '../../../../../common/enums/Format';
import { HttpStatusCode } from '../../../../../common/enums/HttpStatusCode';
import { MessageTemplate } from '../../../../../common/enums/MessageTemplate';
import { getNumber } from '../../../../../common/functions/getNumber';
import { parseApiId } from '../../../../../common/functions/parseApiId';
import { useEmailTemplateEndpoint } from '../../../../../common/hooks/endpoints/useEmailTemplateEndpoint';
import { useInAppMessageTemplateEndpoint } from '../../../../../common/hooks/endpoints/useInAppMessageTemplateEndpoint';
import { useTextTemplateEndpoint } from '../../../../../common/hooks/endpoints/useTextTemplateEndpoint';
import { useBail } from '../../../../../common/hooks/useBail';
import { useLookup } from '../../../../../common/hooks/useLookup';
import { useUXStore } from '../../../../../common/hooks/useUXStore';
import { useViewport } from '../../../../../common/hooks/useViewport';
import type { EmailTemplateUI } from '../../../../../common/interfaces/emailTemplate/EmailTemplateUI';
import type { InAppMessageTemplateUI } from '../../../../../common/interfaces/inAppMessageTemplate/InAppMessageTemplateUI';
import type { TextTemplateUI } from '../../../../../common/interfaces/textTemplate/TextTemplateUI';
import type { GenericFunction } from '../../../../../common/types/GenericFunction';
import type { GenericObject } from '../../../../../common/types/GenericObject';
import { useExperimentsStore } from '../../../_hooks/useExperimentsStore';

interface Props {
   experimentId: number,
   onClose: GenericFunction,
   open: boolean,
}

export const ExperimentMessageTemplateDialog = ({ experimentId, onClose, open }: Props) => {
   const [getUser] = useEndpointStore(state => [state.getUser]);
   const [
      getEmailTemplates,
      getExperiments,
      getInAppMessageTemplates,
      getMessageTags,
      getTextTemplates,
      setEmailTemplates,
      setInAppMessageTemplates,
      setTextTemplates,
   ] = useExperimentsStore(state => [
      state.getEmailTemplates,
      state.getExperiments,
      state.getInAppMessageTemplates,
      state.getMessageTags,
      state.getTextTemplates,
      state.setEmailTemplates,
      state.setInAppMessageTemplates,
      state.setTextTemplates,
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
   const [
      emailTemplateMenuAnchorElement,
      setEmailTemplateMenuAnchorElement
   ] = useState<HTMLElement | null>(null);
   const [
      filterByTagMenuAnchorElement,
      setFilterByTagMenuAnchorElement
   ] = useState<HTMLElement | null>(null);
   const [
      inAppMessageTemplateMenuAnchorElement,
      setInAppMessageTemplateMenuAnchorElement
   ] = useState<HTMLElement | null>(null);
   const [messageTagFilter, setMessageTagFilter] = useState(0);
   const [messageType, setMessageType] = useState('');
   const [templateNameFilter, setTemplateNameFilter] = useState('');
   const [
      textTemplateMenuAnchorElement,
      setTextTemplateMenuAnchorElement
   ] = useState<HTMLElement | null>(null);
   const bail = useBail();
   const emailTemplateEndpoint = useEmailTemplateEndpoint();
   const emailTemplateMenuOpen = !!emailTemplateMenuAnchorElement;
   const filterByTagMenuOpen = !!filterByTagMenuAnchorElement;
   const inAppMessageTemplateEndpoint = useInAppMessageTemplateEndpoint();
   const inAppMessageTemplateMenuOpen = !!inAppMessageTemplateMenuAnchorElement;
   const lookup = useLookup();
   const textTemplateEndpoint = useTextTemplateEndpoint();
   const textTemplateMenuOpen = !!textTemplateMenuAnchorElement;
   const viewport = useViewport();
   const { t: translate } = useTranslation();

   const addEmailTemplate = (event: MouseEvent<HTMLElement>) => {
      (async () => {
         closeEmailTemplateMenu();
         closeAddMessageTemplate();
         const emailTemplateId = Number(event.currentTarget.dataset.value);
         return emailTemplateId === 0 ? await createBlankEmailTemplate() : await cloneEmailTemplate(emailTemplateId);
      })()
   }

   const addInAppMessageTemplate = (event: MouseEvent<HTMLElement>) => {
      (async () => {
         closeInAppMessageTemplateMenu();
         closeAddMessageTemplate();
         const inAppMessageTemplateId = Number(event.currentTarget.dataset.value);
         return inAppMessageTemplateId === 0 ? await createBlankInAppMessageTemplate() : await cloneInAppMessageTemplate(inAppMessageTemplateId);
      })()
   }

   const addTextTemplate = (event: MouseEvent<HTMLElement>) => {
      (async () => {
         closeTextTemplateMenu();
         closeAddMessageTemplate();
         const textTemplateId = Number(event.currentTarget.dataset.value);
         return textTemplateId === 0 ? await createBlankTextTemplate() : await cloneTextTemplate(textTemplateId);
      })()
   }

   const clearTemplateNameFilter = () => setTemplateNameFilter('');

   const cloneEmailTemplate = async (emailTemplateId: number) => {
      setShowLoading(true);
      const experiment = getExperiments().find(experiment => experiment.id === experimentId);
      if (!experiment) return bail.out(`Could not find experiment #${experimentId}`);
      const tomorrow = dayjs().utc().add(1, 'day').format(Format.date);
      const index = getEmailTemplates().findIndex(emailTemplate => emailTemplate.id === emailTemplateId);
      if (index === -1) return bail.out(`Could not find email template #${emailTemplateId}`);
      const emailTemplates = getEmailTemplates();
      const { data, status } = await emailTemplateEndpoint.post(
         experimentId,
         emailTemplates[index].subject,
         emailTemplates[index].message,
         emailTemplates[index].htmlMessage,
         tomorrow,
         1,
      );
      if (status !== HttpStatusCode.created) return bail.out(['Could not clone email template:', emailTemplates[index]]);
      setAdded(true);
      const newEmailTemplateId = parseApiId(data);
      emailTemplates.push({
         aimlId: emailTemplates[index].aimlId,
         experimentId,
         htmlMessage: emailTemplates[index].htmlMessage,
         id: newEmailTemplateId,
         message: emailTemplates[index].message,
         sendOn: tomorrow,
         subject: emailTemplates[index].subject,
         weight: 1,
      })
      setEmailTemplates(emailTemplates);
      setShowLoading(false);
   }

   const cloneInAppMessageTemplate = async (inAppMessageTemplateId: number) => {
      setShowLoading(true);
      const experiment = getExperiments().find(experiment => experiment.id === experimentId);
      if (!experiment) return bail.out(`Could not find experiment #${experimentId}`);
      const tomorrow = dayjs().utc().add(1, 'day').format(Format.date);
      const index = getInAppMessageTemplates().findIndex(inAppMessageTemplate => inAppMessageTemplate.id === inAppMessageTemplateId);
      if (index === -1) return bail.out(`Could not find in-app message template #${inAppMessageTemplateId}`);
      const inAppMessageTemplates = getInAppMessageTemplates();
      const { data, status } = await inAppMessageTemplateEndpoint.post(
         inAppMessageTemplates[index].message,
         experimentId,
         tomorrow,
         1,
      );
      if (status !== HttpStatusCode.created) return bail.out(['Could not clone in-app message template:', inAppMessageTemplates[index]]);
      setAdded(true);
      const newInAppMessageTemplateId = parseApiId(data);
      const userId = getNumber(getUser()?.id);
      const currentDate = dayjs().utc().format(Format.dateTime);
      inAppMessageTemplates.push({
         aimlId: inAppMessageTemplates[index].aimlId,
         createdBy: userId,
         createdOn: currentDate,
         experimentId,
         id: newInAppMessageTemplateId,
         message: inAppMessageTemplates[index].message,
         modifiedBy: userId,
         modifiedOn: currentDate,
         sendOn: tomorrow,
         weight: 1,
      })
      setInAppMessageTemplates(inAppMessageTemplates);
      setShowLoading(false);
   }

   const cloneTextTemplate = async (textTemplateId: number) => {
      setShowLoading(true);
      const experiment = getExperiments().find(experiment => experiment.id === experimentId);
      if (!experiment) return bail.out(`Could not find experiment #${experimentId}`);
      const tomorrow = dayjs().utc().add(1, 'day').format(Format.date);
      const index = getTextTemplates().findIndex(textTemplate => textTemplate.id === textTemplateId);
      if (index === -1) return bail.out(`Could not find text template #${textTemplateId}`);
      const textTemplates = getTextTemplates();
      const { data, status } = await textTemplateEndpoint.post(
         experimentId,
         tomorrow,
         textTemplates[index].message,
         1,
      );
      if (status !== HttpStatusCode.created) return bail.out(['Could not clone text template:', textTemplates[index]]);
      setAdded(true);
      const newTextTemplateId = parseApiId(data);
      const userId = getNumber(getUser()?.id);
      const currentDate = dayjs().utc().format(Format.dateTime);
      textTemplates.push({
         aimlId: textTemplates[index].aimlId,
         createdBy: userId,
         createdOn: currentDate,
         experimentId,
         id: newTextTemplateId,
         message: textTemplates[index].message,
         modifiedBy: userId,
         modifiedOn: currentDate,
         sendOn: tomorrow,
         weight: 1,
      })
      setTextTemplates(textTemplates);
      setShowLoading(false);
   }

   const closeAddedSnackbar = (_event?: SyntheticEvent | Event, reason?: string) => {
      reason !== 'clickaway' && setAdded(false);
   }

   const closeAddMessageTemplate = () => {
      setMessageType('');
      setMessageTagFilter(0);
      setTemplateNameFilter('');
      onClose();
   }

   const closeEmailTemplateMenu = () => {
      setTemplateNameFilter('');
      setEmailTemplateMenuAnchorElement(null);
   }

   const closeErrorSnackbar = (_event?: SyntheticEvent | Event, reason?: string) => {
      reason !== 'clickaway' && setShowError(false);
   }

   const closeFilterByTagMenu = () => setFilterByTagMenuAnchorElement(null);

   const closeInAppMessageTemplateMenu = () => {
      setTemplateNameFilter('');
      setInAppMessageTemplateMenuAnchorElement(null);
   }

   const closeTextTemplateMenu = () => {
      setTemplateNameFilter('');
      setTextTemplateMenuAnchorElement(null);
   }

   const createBlankEmailTemplate = async () => {
      setShowLoading(true);
      const experiment = getExperiments().find(experiment => experiment.id === experimentId);
      if (!experiment) return bail.out(`Could not find experiment #${experimentId}`);
      const tomorrow = dayjs().utc().add(1, 'day').format(Format.date);
      const { data, status } = await emailTemplateEndpoint.post(
         experimentId,
         `[${translate('Add Subject')}]`,
         `[${translate('Add Text Body')}]`,
         `[${translate('Add HTML Body')}]`,
         tomorrow,
         1,
      );
      if (status !== HttpStatusCode.created) return bail.out('Could not create blank email template');
      setAdded(true);
      const newEmailTemplateId = parseApiId(data);
      const emailTemplates = getEmailTemplates();
      emailTemplates.push({
         aimlId: null,
         experimentId,
         htmlMessage: `[${translate('Add HTML Body')}]`,
         id: newEmailTemplateId,
         message: `[${translate('Add Text Body')}]`,
         sendOn: tomorrow,
         subject: `[${translate('Add Subject')}]`,
         weight: 1,
      })
      setEmailTemplates(emailTemplates);
      setShowLoading(false);
   }

   const createBlankInAppMessageTemplate = async () => {
      setShowLoading(true);
      const experiment = getExperiments().find(experiment => experiment.id === experimentId);
      if (!experiment) return bail.out(`Could not find experiment #${experimentId}`);
      const tomorrow = dayjs().utc().add(1, 'day').format(Format.date);
      const { data, status } = await inAppMessageTemplateEndpoint.post(
         `[${translate('Add Message')}]`,
         experimentId,
         tomorrow,
         1,
      );
      if (status !== HttpStatusCode.created) return bail.out('Could not create blank in-app message template');
      setAdded(true);
      const newInAppMessageTemplateId = parseApiId(data);
      const inAppMessageTemplates = getInAppMessageTemplates();
      inAppMessageTemplates.push({
         aimlId: null,
         createdBy: getNumber(getUser()?.id),
         createdOn: dayjs().utc().format(Format.dateTime),
         experimentId,
         id: newInAppMessageTemplateId,
         message: `[${translate('Add Message')}]`,
         modifiedBy: getNumber(getUser()?.id),
         modifiedOn: dayjs().utc().format(Format.dateTime),
         sendOn: tomorrow,
         weight: 1,
      })
      setInAppMessageTemplates(inAppMessageTemplates);
      setShowLoading(false);
   }

   const createBlankTextTemplate = async () => {
      setShowLoading(true);
      const experiment = getExperiments().find(experiment => experiment.id === experimentId);
      if (!experiment) return bail.out(`Could not find experiment #${experimentId}`);
      const tomorrow = dayjs().utc().add(1, 'day').format(Format.date);
      const { data, status } = await textTemplateEndpoint.post(
         experimentId,
         tomorrow,
         `[${translate('Add Message')}]`,
         1,
      );
      if (status !== HttpStatusCode.created) return bail.out('Could not create blank text template');
      setAdded(true);
      const newTextTemplateId = parseApiId(data);
      const textTemplates = getTextTemplates();
      textTemplates.push({
         aimlId: null,
         createdBy: getNumber(getUser()?.id),
         createdOn: dayjs().utc().format(Format.dateTime),
         experimentId,
         id: newTextTemplateId,
         message: `[${translate('Add Message')}]`,
         modifiedBy: getNumber(getUser()?.id),
         modifiedOn: dayjs().utc().format(Format.dateTime),
         sendOn: tomorrow,
         weight: 1,
      })
      setTextTemplates(textTemplates);
      setShowLoading(false);
   }

   const getEmailTemplateMenuItems = () => {
      const experimentTemplateCounts: GenericObject = {};
      return getUniqueEmailTemplates()
         .filter(emailTemplate => {
            let hasFilterTag = true;
            if (messageTagFilter !== 0)
               hasFilterTag = lookup.messageTagsByEmailTemplate(emailTemplate.id)
                  .some(messageTag => messageTag.id === messageTagFilter);
            return emailTemplate.experimentId !== experimentId && hasFilterTag;
         }).map(emailTemplate => {
            const { experimentId, id, subject } = emailTemplate;
            let templateName = subject;
            const experiment = getExperiments().find(experiment => experiment.id === experimentId);
            if (experiment) {
               const { name } = experiment;
               if (Object.hasOwn(experimentTemplateCounts, name)) experimentTemplateCounts[name]++;
               else experimentTemplateCounts[name] = 1;
               templateName += ` [${name} #${experimentTemplateCounts[name]}]`;
            }
            if (templateNameFilter && !templateName.toLowerCase().includes(templateNameFilter.toLowerCase())) return null;
            return (
               <Box
                  key={`emailTemplate-${id}`}
                  sx={{
                     borderBottom: 1,
                     borderColor: 'divider',
                  }}
               >
                  <MenuItem
                     aria-label={`${translate('Select')} ${templateName}`}
                     data-value={id}
                     dense={true}
                     onClick={addEmailTemplate}
                     style={{
                        maxWidth: viewport.isMobile ? '110vw' : '100vw',
                        width: viewport.isMobile ? '110vw' : '46vw',
                     }}
                  >
                     <Box>
                        <Box>
                           {templateName}
                        </Box>
                        <Box sx={{ marginLeft: 1 }}>
                           {getEmailTemplateTags(id)}
                        </Box>
                     </Box>
                  </MenuItem>
               </Box>
            )
         })
   }

   const getEmailTemplateTags = (emailTemplateId: number) => lookup.tagsByEmailTemplate(emailTemplateId)
      .map(messageTag => {
         const { id, name } = messageTag;
         return (
            <Chip
               color={'secondary'}
               key={`messageTag-${id}`}
               label={name}
               size={'small'}
               sx={{
                  fontSize: 10,
                  marginRight: 1,
               }}
            />
         )
      })

   const getFilterByMessageTagMenu = () => <>
      <Box sx={{ marginTop: 1 }}>
         <Button
            aria-controls={filterByTagMenuOpen ? 'message-template-tag-menu' : undefined}
            aria-expanded={filterByTagMenuOpen ? 'true' : undefined}
            aria-haspopup={true}
            aria-label={translate('Filter by Message Tag')}
            id={'template-tag-button'}
            onClick={openFilterByTagMenu}
         >
            <TranslatedText text={'Filter by Message Tag'}/>{getFilterTagName()}
         </Button>
         <Menu
            MenuListProps={{ 'aria-labelledby': 'message-template-tag-menu' }}
            anchorEl={filterByTagMenuAnchorElement}
            aria-label={translate('Filter by Message Tag Menu')}
            id={'filter-by-tag-menu'}
            onClose={closeFilterByTagMenu}
            open={filterByTagMenuOpen}
         >
            <Box sx={{
               borderBottom: 2,
               borderColor: 'divider',
               marginBottom: 1,
            }}>
               <MenuItem
                  aria-label={`${translate('Select')} ${translate('Clear')}`}
                  data-value={0}
                  dense={true}
                  onClick={updateMessageTagFilter}
               >
                  <TranslatedText text={'Clear'}/>
               </MenuItem>
            </Box>
            {getFilterTagMenuItems()}
         </Menu>
      </Box>
   </>

   const getFilterTagMenuItems = () => getMessageTags().map(messageTag => {
      const { id, name } = messageTag;
      const messageTagEmailTemplates = lookup.emailTemplatesByMessageTag(messageTag.id);
      const experimentEmailTemplates = lookup.emailTemplatesByExperiment(experimentId);
      const availableEmailTemplates = messageTagEmailTemplates.filter(messageTagEmailTemplate => {
         return !experimentEmailTemplates.some(experimentEmailTemplate => {
            return experimentEmailTemplate.id === messageTagEmailTemplate.id;
         })
      })
      if (!availableEmailTemplates.length) return null;
      return (
         <MenuItem
            aria-label={`${translate('Select')} ${name}`}
            data-value={id}
            dense={true}
            key={`messageTag-${id}`}
            onClick={updateMessageTagFilter}
         >
            <Chip
               color={'secondary'}
               label={`${name} (${availableEmailTemplates.length})`}
               size={'small'}
               sx={{
                  fontSize: 10,
                  marginRight: 1,
               }}
            />
         </MenuItem>
      )
   })

   const getFilterTagName = () => {
      const messageTag = getMessageTags().find(messageTag => messageTag.id === messageTagFilter);
      return (
         <ShowIf condition={messageTagFilter !== 0}>
            : {messageTag?.name}
         </ShowIf>
      )
   }

   const getInAppMessageTemplateMenuItems = () => {
      const experimentTemplateCounts: GenericObject = {};
      return getUniqueInAppMessageTemplates().filter(inAppMessageTemplate => {
         let hasFilterTag = true;
         if (messageTagFilter !== 0)
            hasFilterTag = lookup.messageTagsByInAppMessageTemplate(inAppMessageTemplate.id)
               .some(messageTag => messageTag.id === messageTagFilter);
         return inAppMessageTemplate.experimentId !== experimentId && hasFilterTag;
      }).map(inAppMessageTemplate => {
         const { experimentId, id, message } = inAppMessageTemplate;
         let templateName = message.substring(0, 50);
         templateName += templateName.length < message.length ? '...' : '';
         const experiment = getExperiments().find(experiment => experiment.id === experimentId);
         if (experiment) {
            const { name } = experiment;
            if (Object.hasOwn(experimentTemplateCounts, name)) experimentTemplateCounts[name]++;
            else experimentTemplateCounts[name] = 1;
            templateName += ` [${name} #${experimentTemplateCounts[name]}]`;
         }
         if (templateNameFilter && !templateName.toLowerCase().includes(templateNameFilter.toLowerCase())) return null;
         return (
            <Box
               key={`inAppMessageTemplate-${id}`}
               sx={{
                  borderBottom: 1,
                  borderColor: 'divider',
               }}
            >
               <MenuItem
                  aria-label={`${translate('Select')} ${templateName}`}
                  data-value={id}
                  dense={true}
                  onClick={addInAppMessageTemplate}
                  style={{
                     maxWidth: viewport.isMobile ? '110vw' : '100vw',
                     width: viewport.isMobile ? '110vw' : '46vw',
                  }}
               >
                  <Box>
                     <Box>
                        {templateName}
                     </Box>
                     <Box sx={{ marginLeft: 1 }}>
                        {getInAppMessageTemplateTags(id)}
                     </Box>
                  </Box>
               </MenuItem>
            </Box>
         )
      })
   }

   const getInAppMessageTemplateTags = (inAppMessageTemplateId: number) => lookup.tagsByInAppMessageTemplate(inAppMessageTemplateId)
      .map(messageTag => {
         const { id, name } = messageTag;
         return (
            <Chip
               color={'secondary'}
               key={`messageTag-${id}`}
               label={name}
               size={'small'}
               sx={{
                  fontSize: 10,
                  marginRight: 1,
               }}
            />
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
            <InputLabel id={'message-type-select-label'}>
               <TranslatedText text={'Message Type'}/>
            </InputLabel>
            <Select
               aria-label={translate('Select Message Type')}
               id={'message-type-select'}
               label={translate('Message Type')}
               labelId={'message-type-select-label'}
               onChange={updateMessageType}
               value={messageType}
            >
               <MenuItem
                  dense={true}
                  value={''}
               >
                  <TranslatedText text={'Select Message Type'}/>
               </MenuItem>
               <MenuItem
                  dense={true}
                  value={MessageTemplate.email}
               >
                  <TranslatedText text={'Email'}/>
               </MenuItem>
               <MenuItem
                  dense={true}
                  value={MessageTemplate.inAppMessage}
               >
                  <TranslatedText text={'In-App Message'}/>
               </MenuItem>
               {/* THIS IS COMMENTED OUT UNTIL SMS SUPPORT IS IMPLEMENTED
               <MenuItem
                  dense={true}
                  value={MessageTemplate.text}
               >
                  <TranslatedText text={'Text'}/>
               </MenuItem>
               */}
            </Select>
         </FormControl>
      </Box>
      <ShowIf condition={messageType === MessageTemplate.email}>
         {getFilterByMessageTagMenu()}
         <Box>
            <Button
               aria-controls={emailTemplateMenuOpen ? 'email-template-menu' : undefined}
               aria-expanded={emailTemplateMenuOpen ? 'true' : undefined}
               aria-haspopup={true}
               aria-label={translate('Select Base Template')}
               id={'email-template-button'}
               onClick={openEmailTemplateMenu}
            >
               <TranslatedText text={'Select Base Template'}/>
            </Button>
            <Menu
               MenuListProps={{ 'aria-labelledby': 'email-template-menu' }}
               anchorEl={emailTemplateMenuAnchorElement}
               aria-label={translate('Email Template Menu')}
               id={'email-template-menu'}
               onClose={closeEmailTemplateMenu}
               open={emailTemplateMenuOpen}
            >
               {getTemplateFilter(addEmailTemplate)}
               {getEmailTemplateMenuItems()}
            </Menu>
         </Box>
      </ShowIf>
      <ShowIf condition={messageType === MessageTemplate.inAppMessage}>
         {getFilterByMessageTagMenu()}
         <Box>
            <Button
               aria-controls={inAppMessageTemplateMenuOpen ? 'in-app-message-template-menu' : undefined}
               aria-expanded={inAppMessageTemplateMenuOpen ? 'true' : undefined}
               aria-haspopup={true}
               aria-label={translate('Select Base Template')}
               id={'in-app-message-template-button'}
               onClick={openInAppMessageTemplateMenu}
            >
               <TranslatedText text={'Select Base Template'}/>
            </Button>
            <Menu
               MenuListProps={{ 'aria-labelledby': 'in-app-message-template-menu' }}
               anchorEl={inAppMessageTemplateMenuAnchorElement}
               aria-label={translate('In-App Message Template Menu')}
               id={'in-app-message-template-menu'}
               onClose={closeInAppMessageTemplateMenu}
               open={inAppMessageTemplateMenuOpen}
            >
               {getTemplateFilter(addInAppMessageTemplate)}
               {getInAppMessageTemplateMenuItems()}
            </Menu>
         </Box>
      </ShowIf>
      <ShowIf condition={messageType === MessageTemplate.text}>
         {getFilterByMessageTagMenu()}
         <Box>
            <Button
               aria-controls={textTemplateMenuOpen ? 'text-template-menu' : undefined}
               aria-expanded={textTemplateMenuOpen ? 'true' : undefined}
               aria-haspopup={true}
               aria-label={translate('Select Base Template')}
               id={'text-template-button'}
               onClick={openTextTemplateMenu}
            >
               <TranslatedText text={'Select Base Template'}/>
            </Button>
            <Menu
               MenuListProps={{ 'aria-labelledby': 'text-template-menu' }}
               anchorEl={textTemplateMenuAnchorElement}
               aria-label={translate('Text Template Menu')}
               id={'text-template-menu'}
               onClose={closeTextTemplateMenu}
               open={textTemplateMenuOpen}
            >
               {getTemplateFilter(addTextTemplate)}
               {getTextTemplateMenuItems()}
            </Menu>
         </Box>
      </ShowIf>
   </>

   const getTemplateFilter = (addFunction: typeof addEmailTemplate | typeof addInAppMessageTemplate | typeof addTextTemplate) => {
      return (
         <Box>
            <Box sx={{
               borderBottom: 2,
               borderColor: 'divider',
               display: 'flex',
               justifyContent: 'space-between',
               marginBottom: 1,
            }}>
               <MenuItem style={{ flexGrow: 1 }}>
                  <TextField
                     aria-label={translate('Filter by Template Name')}
                     inputRef={input => input?.focus()}
                     label={translate('Filter by Template Name')}
                     name={'template-name-filter-field'}
                     onChange={updateTemplateNameFilter}
                     onKeyDown={stopPropagation}
                     size={'small'}
                     sx={{
                        marginTop: 1,
                        width: '100%',
                     }}
                     unselectable={'on'}
                     value={templateNameFilter}
                  />
               </MenuItem>
               <Tooltip title={translate('Clear')}>
                  <span>
                     <IconButton
                        aria-label={translate('Clear')}
                        disabled={!templateNameFilter}
                        onClick={clearTemplateNameFilter}
                        sx={{
                           color: Color.blueNeon,
                           marginTop: 2,
                        }}
                     >
                        <BiSolidEraser fontSize={26}/>
                     </IconButton>
                  </span>
               </Tooltip>
            </Box>
            <Box sx={{
               borderBottom: 2,
               borderColor: 'divider',
               marginBottom: 1,
            }}>
               <MenuItem
                  aria-label={`${translate('Select')} ${translate('Blank Template')}`}
                  data-value={0}
                  dense={true}
                  onClick={addFunction}
                  style={{
                     maxWidth: viewport.isMobile ? '110vw' : '100vw',
                     width: viewport.isMobile ? '110vw' : '46vw',
                  }}
               >
                  <TranslatedText text={'Blank Template'}/>
               </MenuItem>
            </Box>
         </Box>
      )
   }

   const getTextTemplateMenuItems = () => {
      const experimentTemplateCounts: GenericObject = {};
      return getUniqueTextMessageTemplates().filter(textTemplate => {
         let hasFilterTag = true;
         if (messageTagFilter !== 0)
            hasFilterTag = lookup.messageTagsByTextTemplate(textTemplate.id)
               .some(messageTag => messageTag.id === messageTagFilter);
         return textTemplate.experimentId !== experimentId && hasFilterTag;
      }).map(textTemplate => {
         const { experimentId, id, message } = textTemplate;
         let templateName = message.substring(0, 50);
         templateName += templateName.length < message.length ? '...' : '';
         const experiment = getExperiments().find(experiment => experiment.id === experimentId);
         if (experiment) {
            const { name } = experiment;
            if (Object.hasOwn(experimentTemplateCounts, name)) experimentTemplateCounts[name]++;
            else experimentTemplateCounts[name] = 1;
            templateName += ` [${name} #${experimentTemplateCounts[name]}]`;
         }
         if (templateNameFilter && !templateName.toLowerCase().includes(templateNameFilter.toLowerCase())) return null;
         return (
            <Box
               key={`textTemplate-${id}`}
               sx={{
                  borderBottom: 1,
                  borderColor: 'divider',
               }}
            >
               <MenuItem
                  aria-label={`${translate('Select')} ${templateName}`}
                  data-value={id}
                  dense={true}
                  onClick={addTextTemplate}
                  style={{
                     maxWidth: viewport.isMobile ? '110vw' : '100vw',
                     width: viewport.isMobile ? '110vw' : '46vw',
                  }}
               >
                  <Box>
                     <Box>
                        {templateName}
                     </Box>
                     <Box sx={{ marginLeft: 1 }}>
                        {getTextTemplateTags(id)}
                     </Box>
                  </Box>
               </MenuItem>
            </Box>
         )
      })
   }

   const getTextTemplateTags = (textTemplateId: number) => lookup.tagsByTextTemplate(textTemplateId)
      .map(messageTag => {
         const { id, name } = messageTag;
         return (
            <Chip
               color={'secondary'}
               key={`messageTag-${id}`}
               label={name}
               size={'small'}
               sx={{
                  fontSize: 10,
                  marginRight: 1,
               }}
            />
         )
      })

   const getUniqueEmailTemplates = () => {
      const uniqueTemplates: EmailTemplateUI[] = [];
      const seenTemplates: string[] = [];
      getEmailTemplates().forEach(emailTemplate => {
         const { htmlMessage, message, subject } = emailTemplate;
         const fullMessage = htmlMessage + message + subject;
         if (!seenTemplates.some(template => template === fullMessage)) {
            uniqueTemplates.push(emailTemplate);
            seenTemplates.push(fullMessage);
         }
      })
      return uniqueTemplates;
   }

   const getUniqueInAppMessageTemplates = () => {
      const uniqueTemplates: InAppMessageTemplateUI[] = [];
      const seenTemplates: string[] = [];
      getInAppMessageTemplates().forEach(inAppMessageTemplate => {
         const { message } = inAppMessageTemplate;
         if (!seenTemplates.some(template => template === message)) {
            uniqueTemplates.push(inAppMessageTemplate);
            seenTemplates.push(message);
         }
      })
      return uniqueTemplates;
   }

   const getUniqueTextMessageTemplates = () => {
      const uniqueTemplates: TextTemplateUI[] = [];
      const seenTemplates: string[] = [];
      getTextTemplates().forEach(textTemplate => {
         const { message } = textTemplate;
         if (!seenTemplates.some(template => template === message)) {
            uniqueTemplates.push(textTemplate);
            seenTemplates.push(message);
         }
      })
      return uniqueTemplates;
   }

   const openEmailTemplateMenu = (event: MouseEvent<HTMLButtonElement>) => setEmailTemplateMenuAnchorElement(event.currentTarget);

   const openFilterByTagMenu = (event: MouseEvent<HTMLButtonElement>) => setFilterByTagMenuAnchorElement(event.currentTarget);

   const openInAppMessageTemplateMenu = (event: MouseEvent<HTMLButtonElement>) => setInAppMessageTemplateMenuAnchorElement(event.currentTarget);

   const openTextTemplateMenu = (event: MouseEvent<HTMLButtonElement>) => setTextTemplateMenuAnchorElement(event.currentTarget);

   const stopPropagation = (event: KeyboardEvent<HTMLDivElement>) => event.stopPropagation();

   const updateMessageTagFilter = (event: MouseEvent<HTMLElement>) => {
      const messageTagId = Number(event.currentTarget.dataset.value);
      setMessageTagFilter(messageTagId);
      closeFilterByTagMenu();
      const templateMenuButton = document.getElementById('email-template-button');
      setEmailTemplateMenuAnchorElement(templateMenuButton);
   }

   const updateMessageType = (event: SelectChangeEvent) => {
      setMessageType(event.target.value);
      setTemplateNameFilter('');
   }

   const updateTemplateNameFilter = (event: ChangeEvent<HTMLInputElement>) => setTemplateNameFilter(event.target.value.trimStart());

   return <>
      <Loading open={getShowLoading()}/>
      <DefaultSnackbar
         onClose={closeAddedSnackbar}
         open={added}
         severity={'success'}
         text={'The message template has been added.'}
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
               textAlign: 'right',
               width: '100%',
            }}>
               <Button
                  aria-label={translate('Cancel')}
                  onClick={closeAddMessageTemplate}
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
         onClose={closeAddMessageTemplate}
         open={open}
         title={translate('Add Message Template')}
      />
   </>
}