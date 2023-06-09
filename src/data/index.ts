import type { StoreEnhancer } from '@reduxjs/toolkit';
import { configureStore } from '@reduxjs/toolkit';
import { createReduxEnhancer as createSentryReduxEnhancer } from '@sentry/react';
import { useDispatch } from 'react-redux';
import { createLogger } from 'redux-logger';
import { persistStore } from 'redux-persist';
import { FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist/es/constants';
import type { PersistPartial } from 'redux-persist/es/persistReducer';

import { persistedReducer as config } from './config';
import { persistedReducer as speeddial } from './speeddial';

// https://redux-toolkit.js.org/usage/usage-guide#use-with-redux-persist
const ignoredActions = [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER];

const sentryReduxEnhancer = createSentryReduxEnhancer() as StoreEnhancer;

export function createStore(addEnhancers = true) {
    const store = configureStore({
        enhancers: addEnhancers ? [sentryReduxEnhancer] : [],
        middleware: getDefaultMiddleware => {
            let middleware = [...getDefaultMiddleware({ serializableCheck: { ignoredActions } })];

            // eslint-disable-next-line no-warning-comments
            // TODO: turn into feature flags manager
            if ((import.meta.env.DEV && import.meta.env.VITE_VERCEL_ENV !== 'test') || new URL(window.location.href).searchParams.has('debug')) {
                middleware = [
                    createLogger({
                        collapsed: true,
                        diff: true
                    }),
                    ...middleware
                ];
            }

            return middleware;
        },
        reducer: { config, speeddial }
    });

    const persistor = persistStore(store);

    return { store, persistor };
}

type RemovePersistPartial<T> = {
    [K in keyof T]: T[K] extends PersistPartial & infer R ? R : T[K]
};

// eslint-disable-next-line @typescript-eslint/no-type-alias
type Store = ReturnType<typeof createStore>['store'];
export type RootState = RemovePersistPartial<ReturnType<Store['getState']>>;
export const useAppDispatch: () => Store['dispatch'] = useDispatch;
