export interface InAppMessageTemplateDB {
   in_app_message: string,
   ref_experiment_id: number,
   ref_mode_in_app_message_id: number,
   row_created_datetime_utc: string,
   row_created_user_id: number,
   row_modified_datetime_utc: string,
   row_modified_user_id: number,
   send_on_datetime_utc: string,
   switchboard_aiml_algorithm_id: number | null,
   weight: number,
}