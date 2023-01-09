import { ErrorBoundary as SentryErrorBoundary } from '@sentry/react';
import { StrictMode } from 'react';
import { createRoot as createReactDOMRoot } from 'react-dom/client';
import { Provider as StoreProvider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import './sentry';
import './i18n';
import './theme';
import { AppLayout } from './app';
import { persistor, store } from './data';

const root = createReactDOMRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <StrictMode>
        <SentryErrorBoundary fallback={<p>An error has occurred</p>}>
            <StoreProvider store={store}>
                <PersistGate loading={null} persistor={persistor}>
                    <AppLayout />
                </PersistGate>
            </StoreProvider>
        </SentryErrorBoundary>
    </StrictMode>
);
