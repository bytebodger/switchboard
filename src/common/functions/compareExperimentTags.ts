import type { ExperimentTagUI } from '../interfaces/experimentTag/ExperimentTagUI';
import { getString } from './getString';

export const compareExperimentTags = (a: ExperimentTagUI, b: ExperimentTagUI) => {
   if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
   if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
   if (getString(a.description).toLowerCase() < getString(b.description).toLowerCase()) return -1;
   if (getString(a.description).toLowerCase() > getString(b.description).toLowerCase()) return 1;
   return 0;
}

export const compareCampaignTags = compareExperimentTags;