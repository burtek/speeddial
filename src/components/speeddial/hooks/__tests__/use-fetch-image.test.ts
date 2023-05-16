/* eslint-disable no-warning-comments */
import { captureException } from '@sentry/react';
import type { SpyInstance } from 'vitest';

import { act, renderHook, waitFor } from '@@config/test-utils';

import { useFetchImageForUrl } from '../use-fetch-image';


vitest.mock('@sentry/react');

describe('speeddial/hooks/use-fetch-image', () => {
    let mockFetch: SpyInstance<Parameters<typeof fetch>, ReturnType<typeof fetch>>;

    const sentryMock = vitest.mocked(captureException);

    function mockFetchResponse(status: number, statusText: string, data: Record<string, unknown>) {
        mockFetch.mockImplementation(() => new Promise<Response>(resolve => {
            setTimeout(
                resolve,
                300,
                new Response(
                    JSON.stringify(data),
                    {
                        status,
                        statusText
                    }
                )
            );
        }));
    }

    beforeAll(() => {
        mockFetch = vitest.spyOn(global, 'fetch');
    });

    beforeEach(() => {
        vitest.clearAllMocks();
        mockFetch.mockReset();
    });

    afterAll(() => {
        mockFetch.mockRestore();
    });

    it('should make request with correct url and react to status 200 response with dataUrl', async () => {
        const expectedUrl = 'https://tvn24.pl/image.png';
        mockFetchResponse(200, 'ok', { dataUrl: expectedUrl });

        const targetUrl = 'https://tvn24.pl';
        const setImageUrl = vitest.fn();
        const hookRenderer = ({ url }: { url: string }) => useFetchImageForUrl(url, setImageUrl);
        const { result } = renderHook(hookRenderer, { initialProps: { url: targetUrl } });

        expect(result.current).toMatchObject({
            fetchImage: expect.any(Function),
            isFetching: false,
            error: null
        });

        act(() => {
            result.current.fetchImage();
        });

        expect(mockFetch).toHaveBeenCalledWith(`/api/image?url=${targetUrl}`);
        expect(result.current).toMatchObject({
            fetchImage: expect.any(Function),
            isFetching: true,
            error: null
        });
        expect(setImageUrl).not.toHaveBeenCalled();

        await waitFor(() => {
            expect(result.current).toMatchObject({
                fetchImage: expect.any(Function),
                isFetching: false,
                error: null
            });
        });

        expect(setImageUrl).toHaveBeenCalledTimes(1);
        expect(setImageUrl).toHaveBeenCalledWith(expectedUrl);
        expect(mockFetch).toHaveBeenCalledTimes(1);
        expect(sentryMock).toHaveBeenCalledTimes(0);
    });

    it('should correctly react to response with error', async () => {
        mockFetchResponse(400, 'bad request', { error: 'some error' });

        const targetUrl = 'https://tvn24.pl';
        const setImageUrl = vitest.fn();
        const hookRenderer = ({ url }: { url: string }) => useFetchImageForUrl(url, setImageUrl);
        const { result } = renderHook(hookRenderer, { initialProps: { url: targetUrl } });

        expect(result.current).toMatchObject({
            fetchImage: expect.any(Function),
            isFetching: false,
            error: null
        });

        act(() => {
            result.current.fetchImage();
        });

        expect(mockFetch).toHaveBeenCalledWith(`/api/image?url=${targetUrl}`);
        expect(result.current).toMatchObject({
            fetchImage: expect.any(Function),
            isFetching: true,
            error: null
        });
        expect(setImageUrl).not.toHaveBeenCalled();

        await waitFor(() => {
            expect(result.current).toMatchObject({
                fetchImage: expect.any(Function),
                isFetching: false,
                error: 'errors.unknown' // TODO: test correctly
            });
        });

        expect(setImageUrl).toHaveBeenCalledTimes(0);
        expect(mockFetch).toHaveBeenCalledTimes(1);
        expect(sentryMock).toHaveBeenCalledTimes(1);
        expect(sentryMock).toHaveBeenCalledWith(
            // eslint-disable-next-line promise/prefer-await-to-callbacks, jest/no-conditional-in-test --  FIXME:wtf? x2
            expect.toSatisfy(error => error instanceof Error && error.message === 'Failed obtaining logoUrl'),
            {
                tags: {
                    url: targetUrl,
                    status: 400,
                    errorText: 'some error'
                },
                level: 'warning'
            }
        );
    });

    it.each([
        { status: 200, statusText: 'ok', errorText: 'ok {}' },
        { status: 501, statusText: 'not ok', errorText: 'not ok {}' }
    ])('should correctly react to status $status response without data or error', async ({ status, statusText, errorText }) => {
        mockFetchResponse(status, statusText, {});

        const targetUrl = 'https://tvn24.pl';
        const setImageUrl = vitest.fn();
        const hookRenderer = ({ url }: { url: string }) => useFetchImageForUrl(url, setImageUrl);
        const { result } = renderHook(hookRenderer, { initialProps: { url: targetUrl } });

        expect(result.current).toMatchObject({
            fetchImage: expect.any(Function),
            isFetching: false,
            error: null
        });

        act(() => {
            result.current.fetchImage();
        });

        expect(mockFetch).toHaveBeenCalledWith(`/api/image?url=${targetUrl}`);
        expect(result.current).toMatchObject({
            fetchImage: expect.any(Function),
            isFetching: true,
            error: null
        });
        expect(setImageUrl).not.toHaveBeenCalled();

        await waitFor(() => {
            expect(result.current).toMatchObject({
                fetchImage: expect.any(Function),
                isFetching: false,
                error: 'errors.unknown' // TODO: test correctly
            });
        });

        expect(setImageUrl).toHaveBeenCalledTimes(0);
        expect(mockFetch).toHaveBeenCalledTimes(1);
        expect(sentryMock).toHaveBeenCalledTimes(1);
        expect(sentryMock).toHaveBeenCalledWith(
            // eslint-disable-next-line promise/prefer-await-to-callbacks, jest/no-conditional-in-test --  FIXME:wtf? x2
            expect.toSatisfy(error => error instanceof Error && error.message === 'Failed obtaining logoUrl'),
            {
                tags: {
                    url: targetUrl,
                    status,
                    errorText
                },
                level: 'error'
            }
        );
    });

    it('should correctly react to rejected request', async () => {
        mockFetch.mockImplementation(() => new Promise<Response>((resolve, reject) => {
            setTimeout(
                reject,
                300,
                new Error('No internet')
            );
        }));

        const targetUrl = 'https://tvn24.pl';
        const setImageUrl = vitest.fn();
        const hookRenderer = ({ url }: { url: string }) => useFetchImageForUrl(url, setImageUrl);
        const { result } = renderHook(hookRenderer, { initialProps: { url: targetUrl } });

        expect(result.current).toMatchObject({
            fetchImage: expect.any(Function),
            isFetching: false,
            error: null
        });

        act(() => {
            result.current.fetchImage();
        });

        expect(mockFetch).toHaveBeenCalledWith(`/api/image?url=${targetUrl}`);
        expect(result.current).toMatchObject({
            fetchImage: expect.any(Function),
            isFetching: true,
            error: null
        });
        expect(setImageUrl).not.toHaveBeenCalled();

        await waitFor(() => {
            expect(result.current).toMatchObject({
                fetchImage: expect.any(Function),
                isFetching: false,
                error: 'errors.unknown'
            });
        });

        expect(setImageUrl).toHaveBeenCalledTimes(0);
        expect(mockFetch).toHaveBeenCalledTimes(1);
        expect(sentryMock).toHaveBeenCalledTimes(1);
        expect(sentryMock).toHaveBeenCalledWith(
            // eslint-disable-next-line promise/prefer-await-to-callbacks, jest/no-conditional-in-test -- FIXME:wtf? x2
            expect.toSatisfy(error => error instanceof Error && error.message === 'No internet'),
            {
                tags: {
                    url: targetUrl,
                    status: 0,
                    errorText: ''
                },
                level: 'fatal'
            }
        );
    });
});
