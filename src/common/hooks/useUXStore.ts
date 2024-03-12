import type { GridPaginationModel } from '@mui/x-data-grid';
import { create } from 'zustand';
import { LocalItem } from '../enums/LocalItem';
import { local } from '../libraries/local';

interface State {
   // values
   gridHeight: number,
   pageSize: number,
   showError: boolean,
   showLoading: boolean,
   // getters
   getGridHeight: () => number,
   getPageSize: () => number,
   getShowError: () => boolean,
   getShowLoading: () => boolean,
   // setters
   setGridHeight: (totalRecords?: number) => void,
   setPageSize: (model: GridPaginationModel) => void,
   setShowError: (showError: boolean) => void,
   setShowLoading: (showLoading: boolean) => void,
}

export const useUXStore = create<State>()((set, get) => ({
   // values
   gridHeight: 93 + (local.getItem(LocalItem.pageSize, 10) * 36),
   pageSize: local.getItem(LocalItem.pageSize, 10),
   showError: false,
   showLoading: false,
   // getters
   getGridHeight: () => get().gridHeight,
   getPageSize: () => get().pageSize,
   getShowError: () => get().showError,
   getShowLoading: () => get().showLoading,
   // setters
   setGridHeight: (totalRecords = 0) => {
      let pageSize = get().pageSize;
      if (totalRecords < pageSize) pageSize = totalRecords;
      if (pageSize < 5) pageSize = 5;
      const gridHeight = 93 + (pageSize * 36);
      set(() => ({ gridHeight }));
   },
   setPageSize: model => {
      const { pageSize } = model;
      const oldPageSize = local.getItem(LocalItem.pageSize);
      if (oldPageSize !== pageSize) local.setItem(LocalItem.pageSize, pageSize);
      set(() => ({ pageSize }));
   },
   setShowError: showError => set(() => ({ showError })),
   setShowLoading: showLoading => set(() => ({ showLoading })),
}))