import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

export type ThemeMode = 'dark' | 'light';

export const initialState = () => ({
    modalOpen: false,
    themeMode: null as ThemeMode | null
});

export const { actions, name: sliceName, reducer } = createSlice({
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
