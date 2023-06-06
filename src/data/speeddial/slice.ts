import type { EntityState, PayloadAction, Update } from '@reduxjs/toolkit';
import { createEntityAdapter, createSlice, nanoid } from '@reduxjs/toolkit';
import { t } from 'i18next';


export const linksAdapter = createEntityAdapter<SpeeddialLink>();
export const groupsAdapter = createEntityAdapter<SpeeddialGroup>();

export const ROOT_SPEEDDIAL_ID = '::root::';

function createSpeeddialLink(id = nanoid()): SpeeddialLink {
    return { id: `link-${id}`, type: 'link', name: '', url: '', logoUrl: '' };
}
function createSpeeddialGroup(id = nanoid()): SpeeddialGroup {
    return { id: `group-${id}`, type: 'group', name: t('forms.defaultValues.groupName'), children: [] };
}

export type EditDialogState = {
    type: SpeeddialTile['type'];
    id: string;
    createMode: false;
    parentId?: never;
} | {
    type: SpeeddialTile['type'];
    id: string;
    createMode: true;
    parentId: string;
};

export const initialState = () => ({
    links: linksAdapter.getInitialState(),
    groups: groupsAdapter.addOne(groupsAdapter.getInitialState(), { id: ROOT_SPEEDDIAL_ID, type: 'group', name: ROOT_SPEEDDIAL_ID, children: [] }),
    editDialog: null as null | EditDialogState
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
            state.editDialog = {
                type: 'link',
                id: link.id,
                createMode: true,
                parentId: payload.parentId
            };
        },
        reorderTiles(state, { payload }: PayloadAction<{ groupId: string; from: number; to: number }>) {
            reorderChildren(state.groups, payload.groupId, payload.from, payload.to);
        },
        moveLinkToGroup(state, { payload }: PayloadAction<{ source: string; linkId: string; target: string }>) {
            const target = state.groups.entities[payload.target];
            if (target) {
                removeChild(state.groups, payload.source, payload.linkId);
                target.children.push(payload.linkId);
            }
        },

        editTile(state, { payload }: PayloadAction<Pick<SpeeddialTile, 'id' | 'type'>>) {
            state.editDialog = { ...payload, createMode: false };
        },
        cancelEditTile(state) {
            if (state.editDialog?.type === 'link' && state.editDialog.createMode) {
                linksAdapter.removeOne(state.links, state.editDialog.id);
            }
            state.editDialog = null;
        },
        saveEditGroup(state, { payload: { id, ...changes } }: PayloadAction<SpeeddialGroup>) {
            state.editDialog = null;
            groupsAdapter.updateOne(state.groups, { id, changes });
        },
        saveEditLink(state, { payload }: PayloadAction<SpeeddialLink>) {
            linksAdapter.upsertOne(state.links, payload);
            if (state.editDialog?.type === 'link' && state.editDialog.createMode) {
                addChildren(state.groups, state.editDialog.parentId, payload.id);
            }
            state.editDialog = null;
        },

        renameGroup: {
            prepare(groupId: string, name: string) {
                return { payload: { id: groupId, changes: { name } } };
            },
            reducer(state, { payload }: PayloadAction<Update<SpeeddialGroup>>) {
                groupsAdapter.updateOne(state.groups, payload);
            }
        },

        deleteLink(state, { payload }: PayloadAction<{ id: string; parentId: string }>) {
            removeChild(state.groups, payload.parentId, payload.id);
            linksAdapter.removeOne(state.links, payload.id);
        },
        deleteGroup(state, { payload }: PayloadAction<{ id: string }>) {
            removeChild(state.groups, ROOT_SPEEDDIAL_ID, payload.id);
            linksAdapter.removeMany(state.links, state.groups.entities[payload.id]?.children ?? []);
            groupsAdapter.removeOne(state.groups, payload.id);
        }
    }
});

export interface SpeeddialLink {
    id: string;
    type: 'link';

    name: string;
    url: string;
    logoUrl: string;
    backgroundColor?: string;
    themeColor?: string;
}

export interface SpeeddialGroup {
    id: string;
    type: 'group';

    name: string;
    children: string[];
}

export type SpeeddialTile = SpeeddialLink | SpeeddialGroup;
