import type { StoreEnhancer } from '@reduxjs/toolkit';
import { configureStore } from '@reduxjs/toolkit';
import { createReduxEnhancer as createSentryReduxEnhancer } from '@sentry/react';
import { useDispatch } from 'react-redux';
import { persistStore } from 'redux-persist';
import { FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist/es/constants';

import { persistedReducer as config } from './config';
import { persistedReducer as speeddial } from './speeddial';

// https://redux-toolkit.js.org/usage/usage-guide#use-with-redux-persist
const ignoredActions = [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER];

const sentryReduxEnhancer = createSentryReduxEnhancer() as StoreEnhancer;

export const store = configureStore({
    enhancers: defaultEnhancers => [...defaultEnhancers, sentryReduxEnhancer],
    middleware: getDefaultMiddleware => getDefaultMiddleware({ serializableCheck: { ignoredActions } }),
    reducer: { config, speeddial }
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export const useAppDispatch: () => typeof store.dispatch = useDispatch;
