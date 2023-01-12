import { ThemeProvider } from '@emotion/react';
import { CssBaseline } from '@mui/material';
import { ErrorBoundary as SentryErrorBoundary } from '@sentry/react';
import type { FC, PropsWithChildren } from 'react';
import { StrictMode } from 'react';
import { createRoot as createReactDOMRoot } from 'react-dom/client';
import { Provider as StoreProvider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import './sentry';
import './i18n';

import { AppLayout } from './app';
import { persistor, store } from './data';
import { useCreateTheme } from './theme';

const MaybeUseSentryErrorBoundary: FC<PropsWithChildren<{ useBoundary: boolean }>> = ({ children, useBoundary }) => {
    if (useBoundary) {
        return <SentryErrorBoundary fallback={<p>An error has occurred</p>}>{children}</SentryErrorBoundary>;
    }
    // eslint-disable-next-line react/jsx-no-useless-fragment -- fixes return type
    return <>{children}</>;
};

const root = createReactDOMRoot(
    document.getElementById('root') as HTMLElement
);

const ThemedApp: FC<PropsWithChildren> = ({ children }) => (
    <ThemeProvider theme={useCreateTheme()}>
        <CssBaseline />
        {children}
    </ThemeProvider>
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
