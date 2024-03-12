import { Box, Card, CardContent, Typography } from '@mui/material';
import { TranslatedText } from '../../common/components/TranslatedText';
import { HtmlElement } from '../../common/enums/HtmlElement';

const Unauthorized = () => <>
   <Box sx={{
      marginLeft: 'auto',
      marginRight: 'auto',
      marginTop: 4,
      maxWidth: 500,
      minWidth: 275,
   }}>
      <Card variant={'outlined'}>
         <CardContent>
            <Typography
               component={HtmlElement.div}
               sx={{ textAlign: 'center' }}
               variant={HtmlElement.h3}
            >
               401
            </Typography>
            <Typography
               component={HtmlElement.div}
               sx={{ textAlign: 'center' }}
            >
               <TranslatedText text={'Unauthorized Access'}/>
            </Typography>
         </CardContent>
      </Card>
   </Box>
</>

export default Unauthorized;