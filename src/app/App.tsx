import { MsalProvider } from '@azure/msal-react';
import { ThemeProvider } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import utc from 'dayjs/plugin/utc';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { msalInstance } from '../common/constants/authorization/msalInstance';
import { Language } from '../common/enums/Language';
import { LocalItem } from '../common/enums/LocalItem';
import { local } from '../common/libraries/local';
import { ClientSideNavigation } from './components/ClientSideNavigation';
import { SiteTemplate } from './components/SiteTemplate';
import 'dayjs/locale/es-us.js';
import 'dayjs/locale/en.js';
import { materialTheme } from './constants/materialTheme';
import { initiateMsal } from './functions/initiateMsal';

initiateMsal();
export const App = () => {
   const { i18n } = useTranslation();

   useMemo(() => {
      dayjs.extend(isSameOrAfter);
      dayjs.extend(isSameOrBefore);
      dayjs.extend(utc);
      const language = local.getItem(LocalItem.language, Language.english);
      if (i18n.language !== language) (async () => await i18n.changeLanguage(language))();
      dayjs.locale(language === Language.english ? 'en' : 'es-us');
   }, []);

   return (
      <ClientSideNavigation>
         <MsalProvider instance={msalInstance}>
            <ThemeProvider theme={materialTheme}>
               <LocalizationProvider
                  adapterLocale={dayjs.locale()}
                  dateAdapter={AdapterDayjs}
               >
                  <SiteTemplate/>
               </LocalizationProvider>
            </ThemeProvider>
         </MsalProvider>
      </ClientSideNavigation>
   );
}