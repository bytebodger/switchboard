import { isProduction } from '../constants/isProduction';
import type { GenericArray } from '../types/GenericArray';

export const log = (() => {
   const debug = (...args: GenericArray) => {
      if (isProduction) return;
      console.debug(...args);
   }

   const error = (...args: GenericArray) => {
      if (isProduction) return;
      console.error(...args);
   }

   const info = (...args: GenericArray) => {
      if (isProduction) return;
      console.info(...args);
   }

   const log = (...args: GenericArray) => {
      if (isProduction) return;
      console.log(...args);
   }

   const warn = (...args: GenericArray) => {
      if (isProduction) return;
      console.warn(...args);
   }

   return {
      debug,
      error,
      info,
      log,
      warn,
   }
})();