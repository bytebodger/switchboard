import type { SessionItem } from '../enums/SessionItem';
import { sessionStorageIsAvailable } from '../functions/sessionStorageIsAvailable';
import type { GenericObject } from '../types/GenericObject';

let temp: GenericObject = {};

export const session = (() => {
   const canUseSession = sessionStorageIsAvailable();
   const noDefaultSupplied = '__noDefaultValueSupplied__';

   const clear = () => {
      if (canUseSession) sessionStorage.clear();
      temp = {};
   }

   const getItem = (itemName: SessionItem | string, defaultValue: any = noDefaultSupplied) => {
      if (canUseSession) {
         const item = sessionStorage.getItem(itemName);
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

   const removeItem = (itemName: SessionItem | string) => {
      if (canUseSession) sessionStorage.removeItem(itemName);
      else if (Object.hasOwn(temp, itemName)) delete temp[itemName];
      return true;
   }

   const setItem = (itemName: SessionItem | string, itemValue: any) => {
      if (canUseSession) {
         const valueToBeSerialized = { value: itemValue };
         const serializedValue = JSON.stringify(valueToBeSerialized);
         sessionStorage.setItem(itemName, serializedValue);
      } else temp[itemName] = itemValue;
   }

   return {
      clear,
      getItem,
      removeItem,
      setItem,
   }
})();