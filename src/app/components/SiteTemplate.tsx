import { AuthenticatedTemplate, UnauthenticatedTemplate } from '@azure/msal-react';
import { Box, CssBaseline, Drawer, Typography } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import List from '@mui/material/List';
import Toolbar from '@mui/material/Toolbar';
import { Color } from '../../common/enums/Color';
import { HtmlElement } from '../../common/enums/HtmlElement';
import { useViewport } from '../../common/hooks/useViewport';
import { Pages } from '../../pages/Pages';
import halfLogo from '../images/half-logo.png';
import { DataWrapper } from './DataWrapper';
import { Header } from './Header';
import { LeftNav } from './LeftNav';
import { UnauthorizedRedirect } from './UnauthorizedRedirect';

export const SiteTemplate = () => {
   const viewport = useViewport();

   const drawerWidth = viewport.isMobile ? 60 : 240;

   return <>
      <AuthenticatedTemplate>
         <DataWrapper>
            <Box sx={{ display: 'flex' }}>
               <CssBaseline/>
               <AppBar
                  position={'fixed'}
                  sx={{
                     backgroundColor: Color.greenTemplate,
                     backgroundImage: `url(${halfLogo})`,
                     backgroundPosition: 'top left',
                     backgroundRepeat: 'no-repeat',
                     backgroundSize: '122px 55px',
                     borderBottom: `6px solid ${Color.greyLight}`,
                     zIndex: theme => theme.zIndex.drawer + 1,
                  }}
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
                  <Box sx={{
                     marginTop: 3,
                     overflow: 'auto',
                  }}>
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
      </AuthenticatedTemplate>
      <UnauthenticatedTemplate>
         <UnauthorizedRedirect/>
      </UnauthenticatedTemplate>
   </>;
};