import { Key, KeyboardArrowRight, Language, Logout, MoreVert, NewReleasesOutlined, PermContactCalendar } from '@mui/icons-material';
import PersonIcon from '@mui/icons-material/Person';
import { Box, ListItemIcon, Tooltip } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import dayjs from 'dayjs';
import { NestedMenuItem } from 'mui-nested-menu';
import type { MouseEvent } from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { TranslatedText } from '../../common/components/TranslatedText';
import { menuSlotProps } from '../../common/constants/menuSlotProps';
import { Color } from '../../common/enums/Color';
import { Language as LanguageEnum } from '../../common/enums/Language';
import 'dayjs/locale/es-us.js';
import { LocalItem } from '../../common/enums/LocalItem';
import { Path } from '../../common/enums/Path';
import { logOut } from '../../common/functions/logOut';
import { local } from '../../common/libraries/local';
import 'dayjs/locale/en.js';

export const Header = () => {
   const [infoAnchorElement, setInfoAnchorElement] = useState<HTMLElement | null>(null);
   const [sessionAnchorElement, setSessionAnchorElement] = useState<HTMLElement | null>(null);
   const infoMenuIsOpen = !!infoAnchorElement;
   const navigate = useNavigate();
   const sessionMenuIsOpen = !!sessionAnchorElement;
   const { t: translate, i18n } = useTranslation();

   const changeLanguage = (event: MouseEvent<HTMLElement>) => {
      const { value: language } = event.currentTarget.dataset;
      if (i18n.language !== language) {
         i18n.changeLanguage(language);
         dayjs.locale(language === LanguageEnum.english ? 'en' : 'es-us');
         local.setItem(LocalItem.language, language);
      }
   }

   const closeInfoMenu = () => setInfoAnchorElement(null);

   const closeSessionMenu = () => setSessionAnchorElement(null);

   const goToAccess = () => navigate(Path.access);

   const goToProfile = () => navigate(Path.profile);

   const goToReleaseNotes = () => navigate(Path.releaseNotes);

   const openInfoMenu = (event: MouseEvent<HTMLElement>) => setInfoAnchorElement(event.currentTarget);

   const openSessionMenu = (event: MouseEvent<HTMLElement>) => setSessionAnchorElement(event.currentTarget);

   return <>
      <Box sx={{
         display: 'flex',
         justifyContent: 'space-between',
      }}>
         <Box sx={{
            marginLeft: '110px',
            marginTop: 1,
         }}>
            <Link
               style={{
                  color: Color.white,
                  fontSize: '1.4em',
                  letterSpacing: '0.1rem',
                  textDecoration: 'none',
               }}
               to={Path.home}
            >
               <TranslatedText text={'Switchboard'}/>
            </Link>
         </Box>
         <Box sx={{
            alignItems: 'center',
            display: 'flex',
            textAlign: 'center',
         }}>
            <Tooltip title={translate('Info')}>
               <IconButton
                  aria-controls={sessionMenuIsOpen ? 'info-menu' : undefined}
                  aria-expanded={sessionMenuIsOpen ? 'true' : undefined}
                  aria-haspopup={true}
                  onClick={openInfoMenu}
                  size={'small'}
                  sx={{ ml: 2 }}
               >
                  <MoreVert sx={{ color: Color.white }}/>
               </IconButton>
            </Tooltip>
            <Tooltip title={translate('Session')}>
               <IconButton
                  aria-controls={sessionMenuIsOpen ? 'session-menu' : undefined}
                  aria-expanded={sessionMenuIsOpen ? 'true' : undefined}
                  aria-haspopup={true}
                  onClick={openSessionMenu}
                  size={'small'}
                  sx={{ ml: 2 }}
               >
                  <Avatar sx={{
                     backgroundColor: Color.white,
                     color: Color.greenTemplate,
                     height: 32,
                     width: 32,
                  }}>
                     <PersonIcon/>
                  </Avatar>
               </IconButton>
            </Tooltip>
         </Box>
         <Menu
            anchorEl={infoAnchorElement}
            anchorOrigin={{
               horizontal: 'right',
               vertical: 'bottom',
            }}
            aria-label={translate('Info Menu')}
            id={'info-menu'}
            onClick={closeInfoMenu}
            onClose={closeInfoMenu}
            open={infoMenuIsOpen}
            slotProps={menuSlotProps}
            transformOrigin={{
               horizontal: 'right',
               vertical: 'top',
            }}
         >
            <MenuItem
               aria-label={translate('Select Access')}
               onClick={goToAccess}
               sx={{ paddingLeft: 1 }}
            >
               <ListItemIcon sx={{
                  marginRight: '4px',
                  minWidth: '20px !important',
               }}>
                  <Key fontSize={'small'}/>
               </ListItemIcon>
               <TranslatedText text={'Access'}/>
            </MenuItem>
            <MenuItem
               aria-label={translate('Select Release Notes')}
               onClick={goToReleaseNotes}
               sx={{ paddingLeft: 1 }}
            >
               <ListItemIcon sx={{
                  marginRight: '4px',
                  minWidth: '20px !important',
               }}>
                  <NewReleasesOutlined fontSize={'small'}/>
               </ListItemIcon>
               <TranslatedText text={'Release Notes'}/>
            </MenuItem>
         </Menu>
         <Menu
            anchorEl={sessionAnchorElement}
            anchorOrigin={{
               horizontal: 'right',
               vertical: 'bottom',
            }}
            aria-label={translate('Session Menu')}
            id={'session-menu'}
            onClick={closeSessionMenu}
            onClose={closeSessionMenu}
            open={sessionMenuIsOpen}
            slotProps={menuSlotProps}
            transformOrigin={{
               horizontal: 'right',
               vertical: 'top',
            }}
         >
            <MenuItem
               aria-label={translate('Select Profile')}
               onClick={goToProfile}
               sx={{ paddingLeft: 1 }}
            >
               <ListItemIcon sx={{
                  marginRight: '4px',
                  minWidth: '20px !important',
               }}>
                  <PermContactCalendar fontSize={'small'}/>
               </ListItemIcon>
               <TranslatedText text={'Profile'}/>
            </MenuItem>
            <MenuItem
               aria-label={translate('Select Logout')}
               onClick={logOut}
               sx={{ paddingLeft: 1 }}
            >
               <ListItemIcon sx={{
                  marginRight: '4px',
                  minWidth: '20px !important',
               }}>
                  <Logout fontSize={'small'}/>
               </ListItemIcon>
               <TranslatedText text={'Logout'}/>
            </MenuItem>
            <NestedMenuItem
               aria-label={translate('Language Menu')}
               MenuProps={{
                  anchorOrigin: {
                     horizontal: 'left',
                     vertical: 'bottom',
                  },
               }}
               label={translate('Language')}
               leftIcon={
                  <Language
                     fontSize={'small'}
                     style={{ opacity: 0.54 }}
                  />
               }
               parentMenuOpen={sessionMenuIsOpen}
               rightIcon={
                  <KeyboardArrowRight
                     fontSize={'small'}
                     style={{ opacity: 0.54 }}
                  />
               }
            >
               <MenuItem
                  aria-label={'Select English'}
                  data-value={LanguageEnum.english}
                  disabled={i18n.language === LanguageEnum.english}
                  onClick={changeLanguage}
               >
                  English
               </MenuItem>
               <MenuItem
                  aria-label={'Seleccionar Español'}
                  data-value={LanguageEnum.spanish}
                  disabled={i18n.language === LanguageEnum.spanish}
                  onClick={changeLanguage}
               >
                  Español
               </MenuItem>
            </NestedMenuItem>
         </Menu>
      </Box>
   </>
}