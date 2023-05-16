import { configs, prepareConfig } from '@dtrw/eslint-config';
import { defineFlatConfig } from 'eslint-define-config';


export default defineFlatConfig([
    ...prepareConfig({ jest: { mode: 'vitest' }, json: {}, react: {} }),
    ...configs.node().map(c => ({
        ...c,
        files: ['api/**/*.ts']
    })),
    {
        files: ['**/*.{js,jsx,ts,tsx}', 'vite.config.ts'],
        languageOptions: {
            globals: { JSX: 'readonly' },
            parserOptions: { project: 'tsconfig.json' }
        },
        settings: {
            'import/resolver': {
                typescript: true,
                node: true
            },
            'node': { version: '18' }
        },
        rules: {
            // TODO: update eslint config
            'import/order': ['error', {
                'groups': [
                    'builtin',
                    'external',
                    'internal',
                    'parent',
                    ['index', 'sibling']
                ],
                'newlines-between': 'always',
                'alphabetize': {
                    order: 'asc',
                    orderImportKind: 'asc'
                }
            }]
        }
    }
]);
