import persistReducer from 'redux-persist/es/persistReducer';
import reduxLocalStorage from 'redux-persist/es/storage';

import { reducer, sliceName } from './slice';

export const persistedReducer = persistReducer(
    {
        storage: reduxLocalStorage,
        key: sliceName,
        version: 1,
        blacklist: ['linkEditId']
    },
    reducer
);

export * as selectors from './selectors';
export * from './slice';
