/* eslint-disable @typescript-eslint/naming-convention */
// eslint-disable-next-line spaced-comment
/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_VERCEL_GIT_COMMIT_SHA: string;
    readonly VITE_SENTRY_DSN: string;
}

// eslint-disable-next-line @typescript-eslint/no-redeclare
interface ImportMeta {
    readonly env: ImportMetaEnv;
}
