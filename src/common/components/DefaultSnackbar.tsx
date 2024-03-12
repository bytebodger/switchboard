import type { AlertColor } from '@mui/material';
import { Alert, Snackbar } from '@mui/material';
import { snackbarDuration } from '../constants/snackbar/snackbarDuration';
import { snackbarPosition } from '../constants/snackbar/snackbarPosition';
import type { GenericFunction } from '../types/GenericFunction';
import { TranslatedText } from './TranslatedText';

interface Props {
   onClose: GenericFunction,
   open: boolean,
   severity: AlertColor | undefined,
   text: string,
}

export const DefaultSnackbar = ({ onClose, open, severity, text }: Props) => <>
   <Snackbar
      anchorOrigin={snackbarPosition}
      autoHideDuration={snackbarDuration}
      onClose={onClose}
      open={open}
   >
      <Alert severity={severity}>
         <TranslatedText text={text}/>
      </Alert>
   </Snackbar>
</>