export interface ExperimentTagRelationshipDB {
   experiment_tag_id: number,
   ref_experiment_id: number,
   ref_experiment_tag_id: number,
}

export interface CampaignTagRelationshipDB extends ExperimentTagRelationshipDB {}