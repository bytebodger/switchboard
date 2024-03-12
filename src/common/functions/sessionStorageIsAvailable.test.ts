import { sessionStorageIsAvailable } from './sessionStorageIsAvailable';

describe('sessionStorageIsAvailable function', () => {
   test('sessionStorage is available in the jest console', () => {
      expect(sessionStorageIsAvailable()).toEqual(true);
   });
})