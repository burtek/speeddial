import type { RootState } from '..';

import { getGroupEditId, getLinkEditId, getSpeeddialGroups, getSpeeddialLinks } from './selectors';
import type { EditDialog } from './slice';


const mockState = {
    speeddial: {
        editDialog: null,
        groups: {
            entities: {},
            ids: []
        },
        links: {
            entities: {},
            ids: []
        }
    }
};

describe('speeddial selectors', () => {
    describe('getSpeeddialGroups', () => {
        it('should return state', () => {
            expect(getSpeeddialGroups(mockState)).toBe(mockState.speeddial.groups);
        });
    });

    describe('getSpeeddialLinks', () => {
        it('should return state', () => {
            expect(getSpeeddialLinks(mockState)).toBe(mockState.speeddial.links);
        });
    });

    // eslint-disable-next-line @typescript-eslint/no-extra-parens -- https://github.com/typescript-eslint/typescript-eslint/issues/7030
    it.each<[title: string, editDialog: EditDialog, selector: (state: Pick<RootState, 'speeddial'>) => unknown, expected: null | string]>([
        ['getLinkEditId > should return null if state is null', null, getLinkEditId, null],
        ['getLinkEditId > should return null if state is group', { id: 'id', type: 'group' }, getLinkEditId, null],
        ['getLinkEditId > should return id if state is link', { id: 'id', type: 'link' }, getLinkEditId, 'id'],
        ['getGroupEditId > should return null if state is null', null, getGroupEditId, null],
        ['getGroupEditId > should return null if state is link', { id: 'id', type: 'link' }, getGroupEditId, null],
        ['getGroupEditId > should return id if state is group', { id: 'id', type: 'group' }, getGroupEditId, 'id']
    ])('%s', (_, editDialog, selector, expected) => {
        expect(selector({ ...mockState, speeddial: { ...mockState.speeddial, editDialog } })).toBe(expected);
    });
});
