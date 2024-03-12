import type { LabelDisplayedRowsArgs } from '@mui/material';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

export const useDataGridLocaleText = () => {
   const { t: translate } = useTranslation();

   const get = () => {
      return {
         columnHeaderSortIconLabel: translate('Sort'),
         columnMenuHideColumn: translate('Hide column'),
         columnMenuFilter: translate('Filter'),
         columnMenuLabel: translate('Menu'),
         columnMenuManageColumns: translate('Manage columns'),
         columnMenuSortAsc: translate('Sort by ASC'),
         columnMenuSortDesc: translate('Sort by DESC'),
         columnsPanelHideAllButton: translate('Hide all'),
         columnsPanelShowAllButton: translate('Show all'),
         columnsPanelTextFieldLabel: translate('Find column'),
         columnsPanelTextFieldPlaceholder: translate('Column title'),
         MuiTablePagination: {
            labelDisplayedRows: ({ from, to, count }: LabelDisplayedRowsArgs): ReactNode => {
               return `${from}–${to} ${translate('of')} ${count !== -1 ? count : `${translate('of more than')} ${to}`}`;
            },
            labelRowsPerPage: translate('Rows per page'),
         },
      }
   }

   return {
      get,
   }
}