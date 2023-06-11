/* eslint no-warning-comments: 1 */
import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import dayjs from 'dayjs';

import { createAppAsyncThunk } from '@@data/redux-toolkit';


export type ThemeMode = 'dark' | 'light';

export const initialState = () => ({
    modalOpen: false,
    themeMode: null as ThemeMode | null
});

// TODO: move logic to service.ts ?
const exportSettings = createAppAsyncThunk(
    'config/exportSettings',
    () => new Promise<void>(resolve => {
        const data = Object.keys(localStorage).reduce<Record<string, string>>((acc, key) => ({
            ...acc,
            [key]: localStorage.getItem(key) as string
        }), {});

        const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });

        const dlink = document.createElement('a');
        dlink.download = `speeddial-config-${dayjs().format('YYYYMMDD-HHmmss')}.json`;
        dlink.href = window.URL.createObjectURL(blob);

        dlink.click();
        setTimeout(() => {
            window.URL.revokeObjectURL(dlink.href);
            dlink.remove();
            resolve();
        }, 1500);
    })
);

// TODO: move logic to service.ts ?
const importSettings = createAppAsyncThunk(
    'config/importSettings',
    (_, thunkApi) => new Promise<void>(resolve => {
        const ulink = document.createElement('input');
        ulink.type = 'file';
        ulink.accept = 'application/json';

        ulink.click();

        ulink.addEventListener('change', async () => {
            const file = ulink.files?.[0];

            if (file) {
                thunkApi.extra.pausePersistor();

                const contents = await file.text();
                const json = JSON.parse(contents) as Record<string, string>;

                Object.keys(json).forEach(key => {
                    localStorage.setItem(key, json[key]);
                });

                window.location.reload();
            }

            ulink.remove();
            resolve();
        });
        ulink.addEventListener('cancel', () => {
            ulink.remove();
            resolve();
        });
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
