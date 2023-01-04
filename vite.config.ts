/* eslint-env node */
import sentryVitePlugin from '@sentry/vite-plugin';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import viteTsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig({
    build: { target: ['chrome89', 'edge89', 'firefox89', 'opera75'] },
    plugins: [
        sentryVitePlugin({
            org: process.env.SENTRY_ORG,
            project: process.env.SENTRY_PROJECT,
            include: './dist',
            authToken: process.env.SENTRY_AUTH_TOKEN
        }),
        react(),
        viteTsconfigPaths()
    ],
    server: { open: true }
});
