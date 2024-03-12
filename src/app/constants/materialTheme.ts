import { createTheme } from '@mui/material';
import { Color } from '../../common/enums/Color';

export const materialTheme = createTheme({
   components: {
      MuiMenuItem: {
         styleOverrides: {
            root: {
               whiteSpace: 'unset',
               wordBreak: 'break-all',
            },
         },
      },
   },
   palette: {
      primary: {
         contrastText: Color.white,
         dark: Color.greenDark,
         light: Color.greenDark,
         main: Color.greenDark,
      },
      secondary: {
         contrastText: Color.white,
         dark: Color.orangeDark,
         light: Color.orangeLight,
         main: Color.orange,
      },
      text: {
         primary: Color.grey,
      },
   },
})