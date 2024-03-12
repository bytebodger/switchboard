import { Box, CssBaseline, Drawer, Typography } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import List from '@mui/material/List';
import { ThemeProvider } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { HtmlElement } from '../common/enums/HtmlElement';
import { Language } from '../common/enums/Language';
import { LocalItem } from '../common/enums/LocalItem';
import { useViewport } from '../common/hooks/useViewport';
import { local } from '../common/libraries/local';
import { Pages } from '../pages/Pages';
import { DataWrapper } from './components/DataWrapper';
import { Header } from './components/Header';
import { LeftNav } from './components/LeftNav';
import { materialTheme } from './constants/materialTheme';

export const TestApp = () => {
   const { i18n } = useTranslation();
   const viewport = useViewport();

   const drawerWidth = viewport.isMobile ? 60 : 240;

   useMemo(() => {
      const language = local.getItem(LocalItem.language, Language.english);
      if (i18n.language !== language) i18n.changeLanguage(language);
   }, []);

   return (
      <ThemeProvider theme={materialTheme}>
         <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DataWrapper>
               <Box sx={{ display: 'flex' }}>
                  <CssBaseline/>
                  <AppBar
                     position={'fixed'}
                     sx={{ zIndex: theme => theme.zIndex.drawer + 1 }}
                  >
                     <Toolbar>
                        <Typography
                           component={HtmlElement.div}
                           noWrap={true}
                           sx={{ width: '100%' }}
                           variant={HtmlElement.h6}
                        >
                           <Header/>
                        </Typography>
                     </Toolbar>
                  </AppBar>
                  <Drawer
                     sx={{
                        '& .MuiDrawer-paper': {
                           boxSizing: 'border-box',
                           width: drawerWidth,
                        },
                        flexShrink: 0,
                        width: drawerWidth,
                     }}
                     variant={'permanent'}
                  >
                     <Toolbar/>
                     <Box sx={{ overflow: 'auto' }}>
                        <List sx={{ padding: 0 }}>
                           <LeftNav/>
                        </List>
                     </Box>
                  </Drawer>
                  <Box
                     component={HtmlElement.main}
                     sx={{
                        flexGrow: 1,
                        p: 3,
                     }}
                  >
                     <Toolbar/>
                     <Pages/>
                  </Box>
               </Box>
            </DataWrapper>
         </LocalizationProvider>
      </ThemeProvider>
   );
}