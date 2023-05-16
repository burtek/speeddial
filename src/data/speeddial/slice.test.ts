import { actions, initialState, reducer } from './slice';


describe('speeddial slice', () => {
    describe(actions.createGroup.type, () => {
        it('should create a group', () => {
            const state = initialState();
            const newState = reducer(state, actions.createGroup());

            expect(newState).toStrictEqual({
                ...state,
                groups: {
                    entities: expect.toContainAllKeys(newState.groups.ids as string[]),
                    ids: expect.toBeArrayOfSize(2)
                }
            });
        });
    });
});
