import type { CohortUI } from '../interfaces/cohort/CohortUI';

export const compareCohorts = (a: CohortUI, b: CohortUI) => {
   if (a.experimentId < b.experimentId) return -1;
   if (a.experimentId > b.experimentId) return 1;
   if (a.ordinal < b.ordinal) return -1;
   if (a.ordinal > b.ordinal) return 1;
   return 0;
}