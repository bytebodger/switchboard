import { Key } from '@mui/icons-material';
import { ListItem, ListItemIcon, ListItemText, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Column } from '../../common/components/Column';
import { Row } from '../../common/components/Row';
import { TranslatedText } from '../../common/components/TranslatedText';
import { accessKey } from '../../common/constants/accessKey';
import { HtmlElement } from '../../common/enums/HtmlElement';
import type { Permission } from '../../common/enums/Permission';

const Access = () => {
   const { t: translate } = useTranslation();

   const getAccessRows = () => Object.entries(accessKey)
      .map(entry => {
         const [, accessKey] = entry;
         const { feature, permissions } = accessKey;
         return (
            <TableRow key={`accessKeyRow-${feature}`}>
               <TableCell
                  size={'small'}
                  sx={{
                     paddingBottom: 0,
                     paddingTop: 1,
                     verticalAlign: 'top',
                  }}
               >
                  {feature}
               </TableCell>
               <TableCell
                  size={'small'}
                  sx={{
                     paddingBottom: 0,
                     paddingTop: 0,
                  }}
               >
                  {getPermissions(permissions)}
               </TableCell>
            </TableRow>
         )
      })

   const getPermissions = (permissions: Permission[] | Permission) => {
      if (!Array.isArray(permissions))
         return (
            <ListItem
               dense={true}
               sx={{ paddingLeft: 0 }}
            >
               <ListItemIcon>
                  <Key/>
               </ListItemIcon>
               <ListItemText sx={{
                  position: 'relative',
                  right: 24,
               }}>
                  {permissions}
               </ListItemText>
            </ListItem>
         )
      return permissions.map((permission, index) => (
         <ListItem
            dense={true}
            key={`permissionRow-${index}`}
            sx={{ paddingLeft: 0 }}
         >
            <ListItemIcon>
               <Key/>
            </ListItemIcon>
            <ListItemText sx={{
               position: 'relative',
               right: 24,
            }}>
               {permission}
            </ListItemText>
         </ListItem>
      ))
   }

   return <>
      <Typography
         sx={{ marginBottom: 2 }}
         variant={HtmlElement.h5}
      >
         <TranslatedText text={'Access'}/>
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
                              minWidth: 400,
                              paddingBottom: 0.5,
                              paddingTop: 0.5,
                              width: 400,
                           }}>
                              <TranslatedText text={'Feature'}/>
                           </TableCell>
                           <TableCell sx={{
                              paddingBottom: 0.5,
                              paddingTop: 0.5,
                              width: '100%',
                           }}>
                              <TranslatedText text={'Accessible with these Permissions'}/>
                           </TableCell>
                        </TableRow>
                     </TableHead>
                     <TableBody>
                        {getAccessRows()}
                     </TableBody>
                  </Table>
               </TableContainer>
            </Paper>
         </Column>
      </Row>
   </>
}

export default Access;