export interface EmailTemplateDB {
   email_message: string,
   email_message_html: string,
   email_subject: string,
   ref_experiment_id: number,
   ref_mode_email_id: number,
   send_on_datetime_utc: string | null,
   switchboard_aiml_algorithm_id: number | null,
   weight: number,
}