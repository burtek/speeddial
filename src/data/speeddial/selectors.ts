import { createSelector } from '@reduxjs/toolkit';

import type { RootState } from '..';

import type { SpeeddialGroup, SpeeddialLink } from './slice';
import { groupsAdapter, linksAdapter, ROOT_SPEEDDIAL_ID, sliceName } from './slice';


export const getSpeeddial = (state: Pick<RootState, typeof sliceName>) => state[sliceName];

export const getSpeeddialGroups = createSelector(getSpeeddial, s => s.groups);
export const getSpeeddialLinks = createSelector(getSpeeddial, s => s.links);

export const getDialogEditState = createSelector(getSpeeddial, s => s.editDialog);
export const getLinkEditTile = createSelector(
    getDialogEditState,
    state => (state?.type === 'link' ? state : null)
);
export const getGroupEditTile = createSelector(
    getDialogEditState,
    state => (state?.type === 'group' ? state : null)
);

export const groupAdapterSelectors = groupsAdapter.getSelectors(getSpeeddialGroups);
export const linksAdapterSelectors = linksAdapter.getSelectors(getSpeeddialLinks);

export const getGroupTilesIds = (state: RootState, parentId = ROOT_SPEEDDIAL_ID) => groupAdapterSelectors.selectById(state, parentId)?.children ?? [];
export const getGroupTiles = createSelector(
    getGroupTilesIds,
    groupAdapterSelectors.selectEntities,
    linksAdapterSelectors.selectEntities,
    (ids, groups, links) => ids.map(id => (groups[id] ?? links[id] ?? {}) as SpeeddialLink | SpeeddialGroup)
);
