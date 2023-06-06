import type { RootState } from '..';

import { getGroupEditTile, getLinkEditTile, getSpeeddialGroups, getSpeeddialLinks } from './selectors';
import type { EditDialogState } from './slice';


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

    type TestCase = [
        title: string,
        editDialog: EditDialogState | null,
        selector: (state: Pick<RootState, 'speeddial'>) => unknown,
        expected?: EditDialogState | null
    ];

    it.each<TestCase>([
        ['getLinkEditTile > should return null if state is null', null, getLinkEditTile, null],
        ['getLinkEditTile > should return null if state is group', { id: 'id', type: 'group', createMode: false }, getLinkEditTile, null],
        ['getLinkEditTile > should return id if state is link', { id: 'id', type: 'link', createMode: false }, getLinkEditTile],
        ['getGroupEditTile > should return null if state is null', null, getGroupEditTile, null],
        ['getGroupEditTile > should return null if state is link', { id: 'id', type: 'link', createMode: false }, getGroupEditTile, null],
        ['getGroupEditTile > should return id if state is group', { id: 'id', type: 'group', createMode: false }, getGroupEditTile]
    ])('%s', (_, editDialog, selector, expected = editDialog) => {
        expect(selector({ ...mockState, speeddial: { ...mockState.speeddial, editDialog } })).toBe(expected);
    });
});
