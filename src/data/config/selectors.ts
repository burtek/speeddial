import { createSelector } from '@reduxjs/toolkit';

import type { RootState } from '..';

import { sliceName } from './slice';


export const getConfig = (state: RootState) => state[sliceName];

export const getThemeMode = createSelector(getConfig, s => s.themeMode);

export const getIsDialogOpen = createSelector(getConfig, s => s.modalOpen);
