import { arg } from '../constants/arg';
import { createRandomId } from '../functions/createRandomId';
import type { GenericArray } from '../types/GenericArray';
import type { GenericObject } from '../types/GenericObject';
import { session } from './session';

describe('session library', () => {
   const aDecimal = Number(createRandomId(10, arg.dontUseUppercaseLetters, arg.dontUseLowercaseLetters, arg.useNumbers)) / 100;
   const aFalse = false;
   const aFalseString = 'false';
   const anEmptyArray: GenericArray = [];
   const anEmptyObject: GenericObject = {};
   const anEmptyString = '';
   const anInteger = createRandomId(10, arg.dontUseUppercaseLetters, arg.dontUseLowercaseLetters, arg.useNumbers);
   const aNull = null;
   const aPopulatedArray = [
      createRandomId(10, arg.useUppercaseLetters, arg.useLowercaseLetters, arg.dontUseNumbers),
      createRandomId(10, arg.dontUseUppercaseLetters, arg.dontUseLowercaseLetters, arg.useNumbers),
      Number(createRandomId(10, arg.dontUseUppercaseLetters, arg.dontUseLowercaseLetters, arg.useNumbers)) / 100,
      {
         [`${createRandomId(10, arg.useUppercaseLetters, arg.useLowercaseLetters, arg.dontUseNumbers)}`]:
            Number(createRandomId(10, arg.dontUseUppercaseLetters, arg.dontUseLowercaseLetters, arg.useNumbers)),
      },
   ];
   const aPopulatedObject = {
      [`${createRandomId(10, arg.useUppercaseLetters, arg.useLowercaseLetters, arg.dontUseNumbers)}`]:
         createRandomId(10, arg.dontUseUppercaseLetters, arg.dontUseLowercaseLetters, arg.useNumbers),
      [`${createRandomId(10, arg.useUppercaseLetters, arg.useLowercaseLetters, arg.dontUseNumbers)}`]:
         Number(createRandomId(10, arg.dontUseUppercaseLetters, arg.dontUseLowercaseLetters, arg.useNumbers)),
      [`${createRandomId(10, arg.useUppercaseLetters, arg.useLowercaseLetters, arg.dontUseNumbers)}`]:
      Number(createRandomId(10, arg.dontUseUppercaseLetters, arg.dontUseLowercaseLetters, arg.useNumbers)) / 100,
      [`${createRandomId(10, arg.useUppercaseLetters, arg.useLowercaseLetters, arg.dontUseNumbers)}`]: [
         Number(createRandomId(10, arg.dontUseUppercaseLetters, arg.dontUseLowercaseLetters, arg.useNumbers)),
         Number(createRandomId(10, arg.dontUseUppercaseLetters, arg.dontUseLowercaseLetters, arg.useNumbers)),
         Number(createRandomId(10, arg.dontUseUppercaseLetters, arg.dontUseLowercaseLetters, arg.useNumbers)),
      ],
   };
   const aString = createRandomId(10, arg.useUppercaseLetters, arg.useLowercaseLetters, arg.useNumbers);
   const aTrue = true;
   const aTrueString = 'true';

   test('clear() should leave no values in sessionStorage', () => {
      session.setItem('aPopulatedObject', aPopulatedObject);
      session.setItem('aNull', aNull);
      session.setItem('aString', aString);
      session.clear();
      expect(JSON.stringify(sessionStorage)).toEqual('{}');
   });

   test('getItem() should return a NULL if the itemName doesn\'t exist', () => {
      const string = createRandomId(10, arg.useUppercaseLetters, arg.useLowercaseLetters, arg.dontUseNumbers);
      expect(session.getItem(string)).toEqual(null);
   });

   test('getItem() should use defaultValue if the itemName doesn\'t exist', () => {
      const string1 = createRandomId(10, arg.useUppercaseLetters, arg.useLowercaseLetters, arg.dontUseNumbers);
      const string2 = createRandomId(10, arg.useUppercaseLetters, arg.useLowercaseLetters, arg.dontUseNumbers);
      session.getItem(string1, string2);
      expect(session.getItem(string1)).toEqual(string2);
      session.clear();
   });

   test('getItem() should return the proper data type for stored items', () => {
      session.setItem('aDecimal', aDecimal);
      session.setItem('aFalse', aFalse);
      session.setItem('aFalseString', aFalseString);
      session.setItem('anEmptyArray', anEmptyArray);
      session.setItem('anEmptyObject', anEmptyObject);
      session.setItem('anEmptyString', anEmptyString);
      session.setItem('anInteger', anInteger);
      session.setItem('aNull', aNull);
      session.setItem('aPopulatedArray', aPopulatedArray);
      session.setItem('aPopulatedObject', aPopulatedObject);
      session.setItem('aString', aString);
      session.setItem('aTrue', aTrue);
      session.setItem('aTrueString', aTrueString);
      expect(session.getItem('aDecimal')).toEqual(aDecimal);
      expect(session.getItem('aFalse')).toEqual(aFalse);
      expect(session.getItem('aFalseString')).toEqual(aFalseString);
      expect(session.getItem('anEmptyArray')).toEqual(anEmptyArray);
      expect(session.getItem('anEmptyObject')).toEqual(anEmptyObject);
      expect(session.getItem('anEmptyString')).toEqual(anEmptyString);
      expect(session.getItem('anInteger')).toEqual(anInteger);
      expect(session.getItem('aNull')).toEqual(aNull);
      expect(session.getItem('aPopulatedArray')).toEqual(aPopulatedArray);
      expect(session.getItem('aPopulatedObject')).toEqual(aPopulatedObject);
      expect(session.getItem('aString')).toEqual(aString);
      expect(session.getItem('aTrue')).toEqual(aTrue);
      expect(session.getItem('aTrueString')).toEqual(aTrueString);
      session.clear();
   });

   test('removeItem() should remove the item', () => {
      session.setItem('aDecimal', aDecimal);
      session.removeItem('aDecimal');
      expect(session.getItem('aDecimal')).toEqual(null);
      session.clear();
   });
});