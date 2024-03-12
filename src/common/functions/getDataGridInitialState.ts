import { LocalItem } from '../enums/LocalItem';
import { local } from '../libraries/local';

export const getDataGridInitialState = () => ({
   pagination: {
      paginationModel: {
         page: 0,
         pageSize: local.getItem(LocalItem.pageSize, 10),
      },
   },
})