import type { UserUI } from '../interfaces/user/UserUI';
import { getString } from './getString';

export const getUserDisplayName = (user: UserUI) => {
   const { email, firstName, lastName, middleName } = user;
   let displayName = getString(firstName);
   displayName += displayName && middleName ? ' ' : '';
   displayName += getString(middleName);
   displayName += displayName && lastName ? ' ' : '';
   displayName += getString(lastName);
   const includeParentheses = !!displayName && !!email;
   displayName += displayName && email ? ' ' : '';
   displayName += includeParentheses ? '(' : '';
   displayName += getString(email);
   displayName += includeParentheses ? ')' : '';
   return displayName;
}