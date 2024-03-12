export interface InAppMessageDB {
   deleted_datetime_utc: string,
   recipient_clicked_datetime_utc: string,
   recipient_person_ref_user_id: number,
   recipient_ref_app_id: number,
   ref_app_id: number,
   ref_mode_in_app_message_id: number,
   row_created_datetime_utc: string,
   row_created_user_id: number,
   row_modified_datetime_utc: string,
   row_modified_user_id: number,
   sb_intervention_guid: string,
   sb_intervention_in_app_message_id: number,
   scheduled_datetime_utc: string,
   sender_person_ref_user_id: number,
   sent_datetime_utc: string,
   spp_person_id: number,
   switchboard_aiml_algorithm_id: number,
}