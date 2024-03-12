import type { Monaco } from '@monaco-editor/react';
import { Editor } from '@monaco-editor/react';
import { Box, Button } from '@mui/material';
import List from '@mui/material/List';
import { editor } from 'monaco-editor';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useMessageTools } from '../../pages/experiments/experiment/_hooks/useMessageTools';
import { useViewport } from '../hooks/useViewport';
import type { GenericFunction } from '../types/GenericFunction';
import { Column } from './Column';
import { Row } from './Row';
import { SlidingDialog } from './SlidingDialog';
import { TranslatedText } from './TranslatedText';
import IStandaloneCodeEditor = editor.IStandaloneCodeEditor;

interface Props {
   content: string,
   onClose: GenericFunction,
   onSave: GenericFunction,
   open: boolean,
   title: string,
}

export const CodeEditorDialog = ({ content, onClose, onSave, open, title }: Props) => {
   const editorRef = useRef<IStandaloneCodeEditor | null>(null);
   const messageTools = useMessageTools();
   const viewport = useViewport();
   const { t: translate } = useTranslation();

   const close = () => {
      editorRef.current?.setValue(content);
      onClose();
   }

   const getContent = () => {
      return <>
         <Row>
            <Column xs={10}>
               <Editor
                  defaultLanguage={'html'}
                  defaultValue={content}
                  onMount={loadEditorRef}
               />
            </Column>
            <Column xs={2}>
               <Box>
                  <TranslatedText text={'Variables'}/>:
                  <List sx={{ fontSize: '0.7em' }}>
                     {messageTools.getVariables()}
                  </List>
               </Box>
            </Column>
         </Row>
      </>
   }

   const loadEditorRef = (editor: IStandaloneCodeEditor, _monaco: Monaco) => {
      editorRef.current = editor;
   }

   const returnValue = () => onSave(editorRef.current?.getValue());

   return <SlidingDialog
      actions={
         <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
         }}>
            <Box sx={{ display: 'inline' }}>
               <Button
                  aria-label={translate('Save')}
                  onClick={returnValue}
                  variant={'outlined'}
               >
                  <TranslatedText text={'Save'}/>
               </Button>
            </Box>
            <Button
               aria-label={translate('Close')}
               onClick={close}
               variant={'outlined'}
            >
               <TranslatedText text={'Close'}/>
            </Button>
         </Box>
      }
      content={getContent()}
      dialogProps={{
         sx: {
            '& .MuiDialog-container': {
               '& .MuiPaper-root': {
                  height: '100%',
                  maxHeight: viewport.isMobile ? '120vh' : '95vh',
                  maxWidth: viewport.isMobile ? '120vw' : '95vw',
                  width: '100%',
               },
            },
         },
      }}
      onClose={close}
      open={open}
      title={title}
   />
}