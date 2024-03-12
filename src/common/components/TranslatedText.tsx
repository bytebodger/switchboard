import { useTranslation } from 'react-i18next';
import { translations } from '../../app/constants/translations';
import { HtmlElement } from '../enums/HtmlElement';
import { Language } from '../enums/Language';
import { log } from '../libraries/log';
import type { GenericObject } from '../types/GenericObject';

interface Props {
   elementProps?: GenericObject;
   elementType?: HtmlElement;
   text: string;
}

export const TranslatedText = (props: Props) => {
   const prop = {
      elementProps: {},
      elementType: HtmlElement.span,
      ...props,
   }
   const { i18n, t: translate } = useTranslation();

   if (i18n.language !== Language.english && !Object.hasOwn(translations[i18n.language].translation, prop.text))
      log.warn(`!!!Could not find a translation for: ${prop.text}!!!`);

   if (prop.elementType === HtmlElement.div)
      return (
         <div
            aria-label={translate(prop.text)}
            {...prop.elementProps}
         >
            {translate(prop.text)}
         </div>
      )
   else
      return (
         <span
            aria-label={translate(prop.text)}
            {...prop.elementProps}
         >
            {translate(prop.text)}
         </span>
      )
}