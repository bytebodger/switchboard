export const sessionStorageIsAvailable = () => {
   try {
      const testKey = '__some_random_key_you_are_never_going_to_use__';
      sessionStorage.setItem(testKey, testKey);
      sessionStorage.removeItem(testKey);
      return true;
   } catch (e) {
      return false;
   }
};