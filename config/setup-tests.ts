import '@testing-library/jest-dom';
import { createSerializer } from '@emotion/jest';
import i18n from 'i18next';
import 'jest-extended';
import 'jest-extended/all';
import { initReactI18next } from 'react-i18next';


expect.addSnapshotSerializer(createSerializer());

await i18n
    .use(initReactI18next)
    .init({
        lng: 'dev',
        interpolation: { escapeValue: false }
    });
