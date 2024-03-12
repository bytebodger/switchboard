export interface UserRoleDB {
   disabled_datetime_utc: string | null,
   disabled_flag: boolean,
   ref_role_id: number,
   ref_user_id: number,
   role_desc: string | null,
   role_name: string,
   user_role_id: number,
}