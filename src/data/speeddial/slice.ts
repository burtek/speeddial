import type { EntityState, PayloadAction } from '@reduxjs/toolkit';
import { createEntityAdapter, createSlice, nanoid } from '@reduxjs/toolkit';
import { t } from 'i18next';

export const linksAdapter = createEntityAdapter<SpeeddialLink>();
export const groupsAdapter = createEntityAdapter<SpeeddialGroup>();

export const ROOT_SPEEDDIAL_ID = '::root::';

function createSpeeddialLink(id = nanoid()): SpeeddialLink {
    return { id: `link-${id}`, type: 'link', name: '', url: '', logoUrl: '' };
}
function createSpeeddialGroup(id = nanoid()): SpeeddialGroup {
    return { id: `group-${id}`, type: 'group', name: t('defaultValues.groupName'), children: [] };
}

export const initialState = () => ({
    links: linksAdapter.getInitialState(),
    groups: groupsAdapter.addOne(groupsAdapter.getInitialState(), { id: ROOT_SPEEDDIAL_ID, type: 'group', name: ROOT_SPEEDDIAL_ID, children: [] }),
    linkEditId: null as string | null
});

function addChildren<T extends { children: string[] }>(state: EntityState<T>, id: string, ...children: string[]) {
    // wish this was doable with entity adapter
    state.entities[id]?.children.push(...children);
}

function reorderChildren<T extends { children: string[] }>(state: EntityState<T>, id: string, from: number, to: number) {
    // wish this was doable with entity adapter
    const group = state.entities[id];
    group?.children.splice(to, 0, ...group.children.splice(from, 1));
}

function removeChild<T extends { children: string[] }>(state: EntityState<T>, id: string, child: string) {
    // wish this was doable with entity adapter
    const entity = state.entities[id];
    if (entity?.children.includes(child)) {
        const index = entity.children.indexOf(child);
        entity.children.splice(index, 1);
    }
}

export const { actions, name: sliceName, reducer } = createSlice({
    name: 'speeddial',
    initialState,
    reducers: {
        createGroup(state) {
            const group = createSpeeddialGroup();
            groupsAdapter.addOne(state.groups, group);
            addChildren(state.groups, ROOT_SPEEDDIAL_ID, group.id);
        },
        createLink(state, { payload }: PayloadAction<{ parentId: string }>) {
            const link = createSpeeddialLink();
            linksAdapter.addOne(state.links, link);
            addChildren(state.groups, payload.parentId, link.id);
            state.linkEditId = link.id;
        },
        reorderTiles(state, { payload }: PayloadAction<{ groupId: string; from: number; to: number }>) {
            reorderChildren(state.groups, payload.groupId, payload.from, payload.to);
        },
        moveLinkToGroup(state, { payload }: PayloadAction<{ source: string; linkId: string; target: string }>) {
            const target = state.groups.entities[payload.target];
            if (!target) {
                // shouldn't happen
                return;
            }
            removeChild(state.groups, payload.source, payload.linkId);
            target.children.push(payload.linkId);
        },

        editLink(state, { payload }: PayloadAction<{ id: string }>) {
            if (state.links.ids.includes(payload.id)) {
                state.linkEditId = payload.id;
            }
        },
        cancelEditLink(state) {
            state.linkEditId = null;
        },
        saveEditLink(state, { payload: { id, ...changes } }: PayloadAction<SpeeddialLink>) {
            state.linkEditId = null;
            linksAdapter.updateOne(state.links, { id, changes });
        },
        deleteLink(state, { payload }: PayloadAction<{ id: string; parentId: string }>) {
            linksAdapter.removeOne(state.links, payload.id);
            removeChild(state.groups, payload.parentId, payload.id);
        },

        deleteGroup(state, { payload }: PayloadAction<{ id: string }>) {
            linksAdapter.removeMany(state.links, state.groups.entities[payload.id]?.children ?? []);
            groupsAdapter.removeOne(state.groups, payload.id);
            removeChild(state.groups, ROOT_SPEEDDIAL_ID, payload.id);
        },
        renameGroup(state, { payload: { id, ...changes } }: PayloadAction<{ id: string; name: string }>) {
            groupsAdapter.updateOne(state.groups, { id, changes });
        }
    }
});

export interface SpeeddialLink {
    id: string;
    type: 'link';

    name: string;
    url: string;
    logoUrl: string;
}

export interface SpeeddialGroup {
    id: string;
    type: 'group';

    name: string;
    children: string[];
}
