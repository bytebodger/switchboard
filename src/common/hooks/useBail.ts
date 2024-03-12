import { log } from '../libraries/log';
import { useUXStore } from './useUXStore';

export const useBail = () => {
   const [
      setShowError,
      setShowLoading,
   ] = useUXStore(state => [
      state.setShowError,
      state.setShowLoading,
   ]);

   const out = (output: any[] | string, returnValue: any = undefined) => {
      setShowLoading(false);
      setShowError(true);
      if (output.length) {
         if (Array.isArray(output)) log.warn(...output);
         else log.warn(output);
      }
      if (typeof returnValue !== 'undefined') return returnValue;
   }

   return {
      out,
   }
}