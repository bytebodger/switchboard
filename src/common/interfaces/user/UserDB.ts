export interface UserDB {
   account_verified_datetime_utc: string | null,
   account_verified_flag: boolean,
   avatar_url: string,
   disabled_datetime_utc: string | null,
   disabled_flag: boolean,
   email: string,
   first_name: string,
   last_name: string,
   middle_name: string,
   ref_user_id: number,
   row_created_by_user_name: string,
   row_modified_by_user_name: string,
   sso_object_id: string,
}