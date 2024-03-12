import type { Column } from './Column';

export interface Table {
   columns: Column[],
   displayName: string,
   name: string,
}