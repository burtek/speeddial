/* eslint-disable @typescript-eslint/naming-convention */
// eslint-disable-next-line spaced-comment
/// <reference types="vite/client" />

interface SpeeddialEnv {
    readonly SENTRY_AUTH_TOKEN: string;
    readonly SENTRY_DSN: string;
    readonly SENTRY_ORG: string;
    readonly SENTRY_PROJECT: string;
    readonly VITE_VERCEL_GIT_COMMIT_SHA: string;
    readonly VITE_SENTRY_DSN: string;
    readonly VITE_VERCEL_ENV: 'production' | 'development' | 'preview' | 'test';
    readonly SENTRY_PROJECT_ID: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface -- augmention
interface ImportMetaEnv extends SpeeddialEnv {}

declare namespace NodeJS {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface -- augmention
    export interface ProcessEnv extends SpeeddialEnv {}
}


interface ImportMeta {
    readonly env: ImportMetaEnv;
}
