import { ErrorBoundary as SentryErrorBoundary } from '@sentry/react';
import type { FC, PropsWithChildren } from 'react';
import { StrictMode } from 'react';
import { createRoot as createReactDOMRoot } from 'react-dom/client';
import { Provider as StoreProvider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import './sentry';
import './i18n';

import { AppLayout } from './app';
import { createStore } from './data';
import { ThemedApp } from './theme/themed-app';


export const { store, persistor } = createStore();

const MaybeUseSentryErrorBoundary: FC<PropsWithChildren<{ useBoundary: boolean }>> = ({ children, useBoundary }) => {
    if (useBoundary) {
        return <SentryErrorBoundary fallback={<p>An error has occurred</p>}>{children}</SentryErrorBoundary>;
    }
    // eslint-disable-next-line react/jsx-no-useless-fragment -- fixes return type - should not be necessary with ts 5.1
    return <>{children}</>;
};

const root = createReactDOMRoot(
    document.getElementById('root') as HTMLElement
);

root.render(
    <StrictMode>
        <MaybeUseSentryErrorBoundary useBoundary={import.meta.env.PROD}>
            <StoreProvider store={store}>
                <PersistGate loading={null} persistor={persistor}>
                    <ThemedApp>
                        <AppLayout />
                    </ThemedApp>
                </PersistGate>
            </StoreProvider>
        </MaybeUseSentryErrorBoundary>
    </StrictMode>
);
