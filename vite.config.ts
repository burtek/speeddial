/* eslint-disable new-cap */
/* eslint-env node */
import SentryVitePlugin from '@sentry/vite-plugin';
import React from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import ViteTsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

// https://vitejs.dev/config/
export default defineConfig({
    build: { target: ['chrome89', 'edge89', 'firefox89', 'opera75'] },
    plugins: [
        SentryVitePlugin({
            org: process.env.SENTRY_ORG,
            project: process.env.SENTRY_PROJECT,
            include: './dist',
            authToken: process.env.SENTRY_AUTH_TOKEN
        }),
        React(),
        ViteTsconfigPaths(),
        VitePWA({
            registerType: 'autoUpdate',
            devOptions: { enabled: true },
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
                    'locales/*/translation.json'
                ]
            }
        })
    ],
    server: { open: true },
    test: {
        environment: 'jsdom',
        setupFiles: './config/setup-tests.ts',
        globals: true,
        coverage: {
            provider: 'istanbul',
            reporter: ['text', 'json', 'html']
        }
    }
});
