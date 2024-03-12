import type { DataType } from '../types/DataType';

export interface DataTypeComparator {
   dataType: DataType,
   comparators: string[],
}