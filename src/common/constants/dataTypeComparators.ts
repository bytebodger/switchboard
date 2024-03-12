import type { DataTypeComparator } from '../interfaces/DataTypeComparator';
import { DataType } from '../types/DataType';

export const dataTypeComparators: DataTypeComparator[] = [
   {
      dataType: DataType.datetime,
      comparators: [
         'is before',
         'is after',
      ],
   },
   {
      dataType: DataType.numeric,
      comparators: [
         'equals',
         'does not equal',
         'is greater than or equal to',
         'is greater than',
         'is less than or equal to',
         'is less than',
      ],
   },
   {
      dataType: DataType.string,
      comparators: [
         'equals',
         'does not equal',
      ],
   },
]