import '@testing-library/jest-dom';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

await i18n
    .use(initReactI18next)
    .init({
        lng: 'dev',
        interpolation: { escapeValue: false }
    });
