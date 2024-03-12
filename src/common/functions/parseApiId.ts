import { getNumber } from './getNumber';

export const parseApiId = (apiData: string) => getNumber(apiData.split(':')[1].trim());