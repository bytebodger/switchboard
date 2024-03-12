import { localStorageIsAvailable } from './localStorageIsAvailable';

describe('localStorageIsAvailable function', () => {
   test('localStorage is available in the jest console', () => {
      expect(localStorageIsAvailable()).toEqual(true);
   });
})