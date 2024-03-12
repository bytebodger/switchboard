import type { DataType } from '../types/DataType';

export interface Column {
   dataType: DataType,
   displayName: string,
   name: string,
}