import type { SeverityLevel } from '@sentry/react';
import { captureException as sentryCaptureError } from '@sentry/react';
import type { CustomTypeOptions } from 'i18next';
import { useCallback, useEffect, useState } from 'react';

import { HttpStatusCodes } from '@@api/_shared/http-codes';
import type { ImageResponseData } from '@@api/image';


function capture(
    url: string,
    status: number | null,
    errorText: string,
    level: SeverityLevel,
    error: string | Error = new Error('Failed obtaining logoUrl')
) {
    sentryCaptureError(
        error instanceof Error ? error : new Error(error),
        {
            tags: {
                url,
                status,
                errorText
            },
            level
        }
    );
}

type ApiError<T extends keyof FetchError> =
// eslint-disable-next-line @typescript-eslint/no-type-alias
    keyof CustomTypeOptions['resources']['translation']['errors'][T];

export type FetchError = {
    [T in 'http' | 'logoUrl']?: ApiError<T>;
};

export const useFetchImageForUrl = (url: string, setImageUrl: (url: string) => void) => {
    const [isFetching, setIsFetching] = useState(false);
    const [error, setError] = useState<null | FetchError>(null);

    useEffect(() => {
        setIsFetching(false);
        setError(null);
    }, [url]);

    const fetchImage = useCallback(async () => {
        setIsFetching(true);
        setError(null);

        try {
            const response = await fetch(`/api/image?url=${url}`);
            const data = await response.json() as ImageResponseData;

            if (response.status === HttpStatusCodes.OK as number && 'dataUrl' in data) {
                setImageUrl(data.dataUrl);
                setError(null);
            } else if ('error' in data) {
                capture(url, response.status, data.error, 'warning');
                setError({ logoUrl: data.error as ApiError<'logoUrl'> });
            } else {
                capture(url, response.status, `${response.statusText} ${JSON.stringify(data)}`, 'error');
                setError({ http: response.status.toString() as ApiError<'http'> });
            }
        } catch (err: unknown) {
            capture(url, null, '', 'fatal', err as Error);
            setError({});
        } finally {
            setIsFetching(false);
        }
    }, [setImageUrl, url]);

    return {
        fetchImage: useCallback(() => {
            void fetchImage();
        }, [fetchImage]),
        isFetching,
        error
    };
};
