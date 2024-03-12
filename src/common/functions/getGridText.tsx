import { Color } from '../enums/Color';

export const getGridText = (value: string, isDisabled: boolean) => <>
   <span style={{
      color: isDisabled ? Color.greyLight : Color.inherit,
      textDecoration: isDisabled ? 'line-through' : 'inherit',
   }}>
      {value}
   </span>
</>