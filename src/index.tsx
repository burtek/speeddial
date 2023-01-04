import { ErrorBoundary as SentryErrorBoundary } from '@sentry/react';
import { StrictMode } from 'react';
import { createRoot as createReactDOMRoot } from 'react-dom/client';

import './sentry';
import './i18n';
import './theme';
import { AppLayout } from './app';

const root = createReactDOMRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <StrictMode>
        <SentryErrorBoundary fallback={<p>An error has occurred</p>}>
            <AppLayout />
        </SentryErrorBoundary>
    </StrictMode>
);
