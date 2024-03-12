export const localStorageIsAvailable = () => {
   try {
      const testKey = '__some_random_key_you_are_never_going_to_use__';
      localStorage.setItem(testKey, testKey);
      localStorage.removeItem(testKey);
      return true;
   } catch (e) {
      return false;
   }
};
