export interface ExperimentUI {
   beginOn: string | null,
   createdBy: number,
   createdOn: string | null,
   description: string | null,
   disabledOn: string | null,
   endOn: string | null,
   id: number,
   isCampaign: boolean | null,
   isDisabled: boolean | null,
   modifiedBy: number,
   modifiedOn: string | null,
   name: string,
   ownedBy: number | null,
   sendFrom: number | null,
   sendFromName: string,
   successMetric: string | null,
}

export interface CampaignUI extends ExperimentUI {}