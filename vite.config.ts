/* eslint-env node */
import { sentryVitePlugin } from '@sentry/vite-plugin';
import viteReact from '@vitejs/plugin-react';
import istanbul from 'vite-plugin-istanbul';
import { VitePWA as vitePWA } from 'vite-plugin-pwa';
import viteTsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';


const plugins = [
    viteTsconfigPaths(),
    viteReact(),
    vitePWA({
        registerType: 'autoUpdate',
        devOptions: { enabled: true },
        strategies: 'generateSW',
        /* eslint-disable @typescript-eslint/naming-convention */
        manifest: {
            id: '/',
            name: 'Speeddial',
            short_name: 'Speeddial',
            icons: [
                {
                    src: 'favicon.ico',
                    sizes: '64x64',
                    type: 'image/x-icon'
                },
                {
                    src: 'logo64.png',
                    sizes: '64x64',
                    type: 'image/png'
                },
                {
                    src: 'logo192.png',
                    sizes: '192x192',
                    type: 'image/png'
                },
                {
                    src: 'logo512.png',
                    sizes: '512x512',
                    type: 'image/png'
                }
            ],
            start_url: '.',
            display: 'standalone',
            theme_color: '#000000',
            background_color: '#ffffff'
        },
        /* eslint-enable @typescript-eslint/naming-convention */
        workbox: {
            globPatterns: [
                '**/*.{js,css,html,ico,png,svg,woff,woff2}',
                '**/locales/**/translation.json'
            ]
        }
    }),
    istanbul({
        cypress: true,
        requireEnv: false
    })
];

if (process.env.SENTRY_AUTH_TOKEN) {
    plugins.unshift(
        sentryVitePlugin({
            org: process.env.SENTRY_ORG,
            project: process.env.SENTRY_PROJECT,
            release: { name: process.env.VITE_VERCEL_GIT_COMMIT_SHA },
            authToken: process.env.SENTRY_AUTH_TOKEN,
            sourcemaps: { deleteFilesAfterUpload: '**/*.map' }
        })
    );
}

// https://vitejs.dev/config/
export default defineConfig({
    build: {
        sourcemap: true,
        target: ['chrome89', 'edge89', 'firefox89', 'opera75']
    },
    plugins,
    server: { open: true },
    test: {
        environment: 'jsdom',
        environmentMatchGlobs: [
            ['api/**/*.test.ts', 'edge-runtime']
        ],
        setupFiles: './config/setup-tests.ts',
        globals: true,
        coverage: {
            provider: 'istanbul',
            reporter: ['text', 'json', 'html']
        },
        snapshotFormat: { printBasicPrototype: true }
    }
});
