import type { HypothesisUI } from '../../../common/interfaces/hypothesis/HypothesisUI';

export const compareHypotheses = (a: HypothesisUI, b: HypothesisUI) => a.id - b.id;