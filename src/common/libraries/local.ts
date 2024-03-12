import type { LocalItem } from '../enums/LocalItem';
import { localStorageIsAvailable } from '../functions/localStorageIsAvailable';
import type { GenericObject } from '../types/GenericObject';

let temp: GenericObject = {};

export const local = (() => {
   const canUseLocal = localStorageIsAvailable();
   const noDefaultSupplied = '__noDefaultValueSupplied__';

   const clear = () => {
      if (canUseLocal) localStorage.clear();
      temp = {};
   }

   const getItem = (itemName: LocalItem | string, defaultValue: any = noDefaultSupplied) => {
      if (canUseLocal) {
         const item = localStorage.getItem(itemName);
         const valueObject = item ? JSON.parse(item) : null;
         if (valueObject === null) {
            if (defaultValue !== noDefaultSupplied) {
               setItem(itemName, defaultValue);
               return defaultValue;
            }
            return null;
         }
         if (Object.hasOwn(valueObject, 'value')) {
            if (valueObject.value === null && defaultValue !== noDefaultSupplied) {
               setItem(itemName, defaultValue);
               return defaultValue;
            }
            return valueObject.value;
         }
         return null;
      } else {
         if (Object.hasOwn(temp, itemName)) {
            return temp[itemName];
         } else if (defaultValue !== noDefaultSupplied) {
            temp[itemName] = defaultValue;
            return defaultValue;
         }
         return null;
      }
   }

   const removeItem = (itemName: LocalItem | string) => {
      if (canUseLocal) localStorage.removeItem(itemName);
      else if (Object.hasOwn(temp, itemName)) delete temp[itemName];
      return true;
   }

   const setItem = (itemName: LocalItem | string, itemValue: any) => {
      if (canUseLocal) {
         const valueToBeSerialized = { value: itemValue };
         const serializedValue = JSON.stringify(valueToBeSerialized);
         localStorage.setItem(itemName, serializedValue);
      } else temp[itemName] = itemValue;
      return itemValue;
   }

   return {
      clear,
      getItem,
      removeItem,
      setItem,
   }
})();