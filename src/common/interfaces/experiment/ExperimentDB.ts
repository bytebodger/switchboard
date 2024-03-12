export interface ExperimentDB {
   campaign_flag: boolean | null,
   disabled_datetime_utc: string | null,
   disabled_flag: boolean | null,
   experiment_begin_datetime_utc: string | null,
   experiment_desc: string | null,
   experiment_end_datetime_utc: string | null,
   experiment_name: string,
   owner_ref_user_id: number | null,
   ref_experiment_id: number,
   row_created_datetime_utc: string | null,
   row_created_user_id: number,
   row_modified_datetime_utc: string | null,
   row_modified_user_id: number,
   sender_ref_user_id: number | null,
   sender_ref_user_name: string,
   success_metric: string | null,
}

export interface CampaignDB extends ExperimentDB {}