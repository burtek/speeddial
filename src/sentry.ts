import { init as initSentry } from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';

if (import.meta.env.VITE_SENTRY_DSN) {
    initSentry({
        dsn: import.meta.env.VITE_SENTRY_DSN,
        environment: import.meta.env.MODE,
        integrations: [new BrowserTracing()],

        /*
         * Set tracesSampleRate to 1.0 to capture 100%
         * of transactions for performance monitoring.
         * We recommend adjusting this value in production
         */
        tracesSampleRate: 1.0,
        tunnel: '/api/tunnel'
    });
}
