import type { ChangeEvent } from 'react';

import { act, renderHook } from '@@config/test-utils';

import { useDraft } from '../use-draft';


describe('speeddial/hooks/use-draft', () => {
    const object = {
        a: 'stringA',
        b: 'stringB',
        c: 'stringC'
    };

    it('should return expected props', () => {
        const { result } = renderHook(useDraft, { initialProps: object });

        expect(result.current).toMatchObject({
            inputProps: expect.any(Function),
            value: expect.objectContaining(object),
            set: expect.any(Function)
        });
    });

    it('should update value when input is updated', () => {
        const { rerender, result } = renderHook(useDraft, { initialProps: object });

        expect(result.current.value).toBe(object);

        const newObject = {
            a: 'stringA',
            b: 'newB',
            c: 'stringC'
        };

        rerender(newObject);

        expect(result.current.value).toBe(newObject);

        (['a', 'b', 'c'] as const).forEach(key => {
            expect(result.current.inputProps(key).value).toBe(newObject[key]);
        });
    });

    describe('inputProps', () => {
        it('should return correct object', () => {
            const { result } = renderHook(useDraft, { initialProps: object });

            (['a', 'b', 'c'] as const).forEach(key => {
                expect(result.current.inputProps(key)).toMatchObject({
                    id: key,
                    value: object[key],
                    onChange: expect.any(Function),
                    type: 'text'
                });
            });
        });

        it('onChange should set new value', () => {
            const { result } = renderHook(useDraft, { initialProps: object });

            expect(result.current.inputProps('b').value).toBe(object.b);

            act(() => {
                result.current.inputProps('b').onChange({ target: { value: 'newB' } } as unknown as ChangeEvent<HTMLInputElement>);
            });

            const expectedNewObject = {
                a: 'stringA',
                b: 'newB',
                c: 'stringC'
            };

            expect(result.current.value).toStrictEqual(expectedNewObject);

            (['a', 'b', 'c'] as const).forEach(key => {
                expect(result.current.inputProps(key).value).toBe(expectedNewObject[key]);
            });
        });
    });

    describe('set', () => {
        it('should set new value', () => {
            const { result } = renderHook(useDraft, { initialProps: object });

            expect(result.current.value).toBe(object);

            act(() => {
                result.current.set('b', 'newB');
            });

            const expectedNewObject = {
                a: 'stringA',
                b: 'newB',
                c: 'stringC'
            };

            expect(result.current.value).toStrictEqual(expectedNewObject);

            (['a', 'b', 'c'] as const).forEach(key => {
                expect(result.current.inputProps(key).value).toBe(expectedNewObject[key]);
            });
        });
    });
});
