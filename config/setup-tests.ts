/* eslint-env jest */

import '@testing-library/jest-dom';
import i18n from 'i18next';
// @ts-expect-error -- no type declaration
import * as matchers from 'jest-extended';
import { initReactI18next } from 'react-i18next';

expect.extend(matchers);

await i18n
    .use(initReactI18next)
    .init({
        lng: 'dev',
        interpolation: { escapeValue: false }
    });
