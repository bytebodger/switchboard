import { Dialog, DialogActions, DialogContent, DialogTitle, Slide } from '@mui/material';
import type { TransitionProps } from '@mui/material/transitions';
import type { ReactElement, ReactNode, Ref } from 'react';
import { forwardRef } from 'react';
import type { GenericFunction } from '../types/GenericFunction';
import type { GenericObject } from '../types/GenericObject';
import { ShowIf } from './ShowIf';

const Transition = forwardRef(function Transition (
   props: TransitionProps & { children: ReactElement<any, any> },
   ref: Ref<unknown>,
) {
   // noinspection RequiredAttributes
   return (
      <Slide
         direction={'up'}
         ref={ref}
         {...props}
      />
   )
});

interface Props {
   actions?: ReactNode,
   content?: ReactNode | string,
   dialogProps?: GenericObject,
   onClose?: GenericFunction,
   open: boolean,
   title?: ReactNode | string,
}

export const SlidingDialog = (props: Props) => {
   const prop = {
      actions: null,
      content: null,
      diaglogProps: {},
      onClose: () => {},
      title: null,
      ...props,
   }

   const closeDialog = (event: GenericObject, reason: string) => {
      reason !== 'backdropClick' && prop.onClose(event);
   }

   return (
      <div>
         <Dialog
            TransitionComponent={Transition}
            aria-describedby={'alert-dialog-slide-description'}
            keepMounted={true}
            onClose={closeDialog}
            open={props.open}
            { ...prop.dialogProps }
         >
            <ShowIf condition={!!prop.title}>
               <DialogTitle>
                  {prop.title}
               </DialogTitle>
            </ShowIf>
            <ShowIf condition={!!prop.content}>
               <DialogContent>
                  {prop.content}
               </DialogContent>
            </ShowIf>
            <ShowIf condition={!!prop.actions}>
               <DialogActions>
                  {prop.actions}
               </DialogActions>
            </ShowIf>
         </Dialog>
      </div>
   );
}