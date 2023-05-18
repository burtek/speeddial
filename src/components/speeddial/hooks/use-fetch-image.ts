import type { SeverityLevel } from '@sentry/react';
import { captureException as sentryCaptureError } from '@sentry/react';
import type { CustomTypeOptions } from 'i18next';
import { useCallback, useEffect, useState } from 'react';

import type { ImageResponseData } from '@@api/metadata/_utils';
import { HttpStatusCodes } from '@@shared-utils/http-codes';


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

    const fetchImage = useCallback(async (translateToDataUrl: boolean) => {
        setIsFetching(true);
        setError(null);

        try {
            const response = await fetch(`/api/metadata?url=${url}`);
            const data = await response.json() as ImageResponseData;

            if (response.status === HttpStatusCodes.OK as number && 'image' in data) {
                setImageUrl(translateToDataUrl ? data.image.imageDataUrl : data.image.imageURl);
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
        fetchImage: useCallback((translateToDataUrl: boolean) => {
            void fetchImage(translateToDataUrl);
        }, [fetchImage]),
        isFetching,
        error
    };
};
