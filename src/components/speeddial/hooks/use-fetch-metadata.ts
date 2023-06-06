import type { SeverityLevel } from '@sentry/react';
import { captureException as sentryCaptureError } from '@sentry/react';
import type { CustomTypeOptions } from 'i18next';
import { useCallback, useEffect, useState } from 'react';

import type { ImageResponseData } from '@@api/metadata/_types';


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

export interface WebsiteData {
    backgroundColor?: string;
    imageUrl: string;
    themeColor?: string;
    canonicalURL?: string;
    resolvedURL: string;
    title: string;
}

const HTTP_OK = 200;

export const useFetchMetadataForUrl = <Meta>(url: string, setMetadata: (data: WebsiteData | null, url: string, meta: Meta) => void) => {
    const [isFetching, setIsFetching] = useState(false);
    const [error, setError] = useState<null | FetchError>(null);

    useEffect(() => {
        setIsFetching(false);
        setError(null);
    }, [url]);

    const fetchData = useCallback(async (meta: Meta) => {
        setIsFetching(true);
        setError(null);

        try {
            const response = await fetch(`/api/metadata?url=${url}`);
            const data = await response.json() as ImageResponseData;

            if (response.status === HTTP_OK && 'imageUrl' in data) {
                setMetadata(data, url, meta);
                setError(null);
            } else if ('error' in data) {
                capture(url, response.status, data.error, 'warning');
                setMetadata(null, url, meta);
                setError({ logoUrl: data.error as ApiError<'logoUrl'> });
            } else {
                capture(url, response.status, `${response.statusText} ${JSON.stringify(data)}`, 'error');
                setMetadata(null, url, meta);
                setError({ http: response.status.toString() as ApiError<'http'> });
            }
        } catch (err: unknown) {
            capture(url, null, '', 'fatal', err as Error);
            setError({});
        } finally {
            setIsFetching(false);
        }
    }, [setMetadata, url]);

    return {
        fetchData,
        isFetching,
        error
    };
};
