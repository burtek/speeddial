import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import dayjs from 'dayjs';

import { createAppAsyncThunk } from '@@data/redux-toolkit';


export type ThemeMode = 'dark' | 'light';

export const initialState = () => ({
    modalOpen: false,
    themeMode: null as ThemeMode | null
});

// window.URL.revokeObjectURL must not be called immediately
const DL_JSON_OBJECT_URL_TIMEOUT = 1500;
const exportSettings = createAppAsyncThunk(
    'config/exportSettings',
    () => new Promise<void>(resolve => {
        const blob = new Blob([JSON.stringify({ ...localStorage })], { type: 'application/json' });

        const dlink = document.createElement('a');
        dlink.download = `speeddial-config-${dayjs().format('YYYYMMDD-HHmmss')}.json`;
        dlink.href = window.URL.createObjectURL(blob);

        dlink.click();
        setTimeout(() => {
            window.URL.revokeObjectURL(dlink.href);
            dlink.remove();
            resolve();
        }, DL_JSON_OBJECT_URL_TIMEOUT);
    })
);

const importSettings = createAppAsyncThunk(
    'config/importSettings',
    (_, thunkApi) => new Promise<void>(resolve => {
        const ulink = document.createElement('input');
        ulink.type = 'file';
        ulink.accept = 'application/json';

        ulink.addEventListener('change', async () => {
            const file = ulink.files?.[0];

            if (file) {
                thunkApi.extra.pausePersistor();

                const contents = await file.text();
                const json = JSON.parse(contents) as Record<string, string>;

                for (const key in json) {
                    if (Object.hasOwn(json, key)) {
                        localStorage.setItem(key, json[key]);
                    }
                }

                window.location.reload();
            }

            ulink.remove();
            resolve();
        });
        ulink.addEventListener('cancel', () => {
            ulink.remove();
            resolve();
        });

        ulink.click();
    })
);

const { actions: sliceActions, name: sliceName, reducer } = createSlice({
    name: 'config',
    initialState,
    reducers: {
        openModal(state) {
            state.modalOpen = true;
        },
        closeModal(state) {
            state.modalOpen = false;
        },

        setThemeMode(state, { payload }: PayloadAction<{ mode: ThemeMode | null }>) {
            state.themeMode = payload.mode;
        }
    }
});

export const actions = {
    ...sliceActions,
    exportSettings,
    importSettings
};

export { sliceName, reducer };
