export interface ExperimentTagDB {
   experiment_tag_name: string,
   expertiment_tag_desc: string,
   ref_experiment_tag_id: number,
}

export interface CampaignTagDB extends ExperimentTagDB {}