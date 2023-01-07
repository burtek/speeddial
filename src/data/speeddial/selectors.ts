import { createSelector } from '@reduxjs/toolkit';

import type { RootState } from '..';
import type { SpeeddialGroup, SpeeddialLink } from './slice';
import { groupsAdapter, linksAdapter, ROOT_SPEEDDIAL_ID, sliceName } from './slice';


export const getSpeeddial = (state: RootState) => state[sliceName];

export const getSpeeddialGroups = createSelector(getSpeeddial, s => s.groups);
export const getSpeeddialLinks = createSelector(getSpeeddial, s => s.links);
export const getLinkEditId = createSelector(getSpeeddial, s => s.linkEditId);

export const groupAdapterSelectors = groupsAdapter.getSelectors(getSpeeddialGroups);
export const linksAdapterSelectors = linksAdapter.getSelectors(getSpeeddialLinks);

export const getRootTilesIds = (state: RootState) => groupAdapterSelectors.selectById(state, ROOT_SPEEDDIAL_ID)?.children ?? [];
export const getRootTiles = createSelector(
    getRootTilesIds,
    groupAdapterSelectors.selectEntities,
    linksAdapterSelectors.selectEntities,
    (ids, groups, links) => ids.map(id => (groups[id] ?? links[id] ?? {}) as SpeeddialLink | SpeeddialGroup)
);
