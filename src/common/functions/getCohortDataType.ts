import { cohortTables } from '../constants/cohortTables';

export const getCohortDataType = (table: string, column: string) => {
   const thisTable = cohortTables.find(cohortTable => cohortTable.name === table);
   if (!thisTable) return null;
   const thisColumn = thisTable.columns.find(tableColumn => tableColumn.name === column);
   if (!thisColumn) return null;
   const { dataType } = thisColumn;
   return dataType;
}