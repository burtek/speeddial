import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';

import type tr from '@@locales/en/translation.json';

declare module 'i18next' {
    interface CustomTypeOptions {
        resources: {
            translation: typeof tr;
        };
    }
}

// eslint-disable-next-line import/no-named-as-default-member
await i18n
    .use(Backend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        debug: import.meta.env.DEV,
        fallbackLng: import.meta.env.DEV ? 'dev' : ['en', 'dev'],
        interpolation: { escapeValue: false },
        load: 'languageOnly',
        supportedLngs: import.meta.env.DEV ? ['pl', 'en', 'dev'] : ['pl', 'en']
    });
