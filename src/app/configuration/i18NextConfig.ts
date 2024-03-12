import i18NextConfig from 'i18next';
import { initReactI18next } from 'react-i18next';
import { Language } from '../../common/enums/Language';
import { translations } from '../constants/translations';

i18NextConfig
   .use(initReactI18next)
   .init({
      interpolation: { escapeValue: false },
      lng: Language.english,
      nsSeparator: false,
      keySeparator: false,
      resources: translations,
   });

export default i18NextConfig;