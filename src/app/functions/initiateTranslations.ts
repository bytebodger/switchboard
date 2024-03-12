import { act } from '@testing-library/react';
import i18NextConfig from '../configuration/i18NextConfig';

/*
   This only exists to avoid repetition in unit tests.
 */

export const initiateTranslations = async () => {
   await act(async (): Promise<any> => {
      return i18NextConfig.init();
   });
}