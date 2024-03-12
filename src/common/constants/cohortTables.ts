import type { Table } from '../interfaces/Table';
import { DataType } from '../types/DataType';

export const cohortTables: Table[] = [
   {
      columns: [
         {
            dataType: DataType.datetime,
            displayName: 'Last Login Time',
            name: 'signedin_datetime_utc',
         },
      ],
      displayName: 'Community User Logins',
      name: 'gep_community_user_signedin',
   },
   {
      columns: [
         {
            dataType: DataType.datetime,
            displayName: 'Account Creation Time',
            name: 'account_created_datetime_utc',
         },
      ],
      displayName: 'Community Users',
      name: 'gpp_community',
   },
   {
      columns: [
         {
            dataType: DataType.datetime,
            displayName: 'Date of Birth',
            name: 'date_of_birth',
         },
         {
            dataType: DataType.string,
            displayName: 'Email',
            name: 'email',
         },
         {
            dataType: DataType.numeric,
            displayName: 'Ref User ID',
            name: 'person_ref_user_id',
         },
      ],
      displayName: 'People',
      name: 'gpp_person',
   },
]