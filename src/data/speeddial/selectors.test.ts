import { PersistPartial } from "redux-persist/es/persistReducer"
import { RootState } from ".."
import { getLinkEditId, getSpeeddialGroups, getSpeeddialLinks } from "./selectors"

const mockState: Pick<RootState, 'speeddial'> = {
    speeddial: {
        groups: {
            entities: {},
            ids: []
        },
        links: {
            entities: {},
            ids: []
        },
        linkEditId: 'linkEditId',
        _persist: {} as PersistPartial['_persist']
    }
}

describe('speeddial selectors', () => {
    describe('getSpeeddialGroups', () => {
        it('should return state', () => {
            expect(getSpeeddialGroups(mockState)).toBe(mockState.speeddial.groups)
        })
    })
    describe('getSpeeddialLinks', () => {
        it('should return state', () => {
            expect(getSpeeddialLinks(mockState)).toBe(mockState.speeddial.links)
        })
    })
    describe('getLinkEditId', () => {
        it('should return state', () => {
            expect(getLinkEditId(mockState)).toBe(mockState.speeddial.linkEditId)
        })
    })
})
