import type { ExperimentUI } from '../interfaces/experiment/ExperimentUI';
import { getString } from './getString';

export const compareExperiments = (a: ExperimentUI, b: ExperimentUI) => {
   if (getString(a.endOn).toLowerCase() < getString(b.endOn).toLowerCase()) return 1;
   if (getString(a.endOn).toLowerCase() > getString(b.endOn).toLowerCase()) return -1;
   if (a.id < b.id) return 1;
   if (a.id > b.id) return -1;
   return 0;
}

export const compareCampaigns = compareExperiments;