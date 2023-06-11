/* eslint no-warning-comments: 1 */
import type { StoreEnhancer } from '@reduxjs/toolkit';
import { configureStore } from '@reduxjs/toolkit';
import { createReduxEnhancer as createSentryReduxEnhancer } from '@sentry/react';
import { createLogger } from 'redux-logger';
import type { Persistor } from 'redux-persist';
import { persistStore } from 'redux-persist';
import { FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist/es/constants';
import type { PersistPartial } from 'redux-persist/es/persistReducer';

import { persistedReducer as config } from './config';
import { persistedReducer as speeddial } from './speeddial';

// https://redux-toolkit.js.org/usage/usage-guide#use-with-redux-persist
const ignoredActions = [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER];

const sentryReduxEnhancer = createSentryReduxEnhancer() as StoreEnhancer;

export interface ThunkExtraArgument {
    pausePersistor: () => void;
}

export function createStore(addEnhancers = true) {
    // eslint-disable-next-line prefer-const -- FIXME: broken eslint rule
    let persistor: Persistor;

    const store = configureStore({
        enhancers: addEnhancers ? [sentryReduxEnhancer] : [],
        middleware: getDefaultMiddleware => {
            const middleware = getDefaultMiddleware({
                thunk: {
                    extraArgument: {
                        pausePersistor() {
                            persistor.pause();
                        }
                    } satisfies ThunkExtraArgument
                },
                immutableCheck: true,
                serializableCheck: { ignoredActions }
            });

            // TODO: manage by feature flags
            middleware.unshift(
                createLogger({
                    collapsed: true,
                    diff: false,
                    predicate() {
                        return (import.meta.env.DEV && import.meta.env.VITE_VERCEL_ENV !== 'test')
                            || new URL(window.location.href).searchParams.has('debug');
                    }
                })
            );

            return middleware;
        },
        reducer: { config, speeddial }
    });

    persistor = persistStore(store);

    return { store, persistor };
}

type RemovePersistPartial<T> = {
    [K in keyof T]: T[K] extends PersistPartial & infer R ? R : T[K]
};

// eslint-disable-next-line @typescript-eslint/no-type-alias
export type Store = ReturnType<typeof createStore>['store'];
export type RootState = RemovePersistPartial<ReturnType<Store['getState']>>;
