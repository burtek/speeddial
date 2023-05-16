import type { SeverityLevel } from '@sentry/react';
import { captureException as sentryCaptureError } from '@sentry/react';
import type { CustomTypeOptions } from 'i18next';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

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

const HTTP_RESPONSE_OK = 200;

export const useFetchImageForUrl = (url: string, setImageUrl: (url: string) => void) => {
    // eslint-disable-next-line no-warning-comments
    // TODO: do we want to have i18n in this hook?
    const { t } = useTranslation();
    const [isFetching, setIsFetching] = useState(false);
    const [error, setError] = useState<null | string>(null);

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

            if (response.status === HTTP_RESPONSE_OK && 'dataUrl' in data) {
                setImageUrl(data.dataUrl);
            } else if ('error' in data) {
                capture(url, response.status, data.error, 'warning');

                // eslint-disable-next-line @typescript-eslint/no-type-alias
                type Key = keyof CustomTypeOptions['resources']['translation']['errors']['logoUrl'];

                setError(t([
                    `errors.logoUrl.${data.error as Key}`,
                    'errors.unknown'
                ]));
            } else {
                capture(url, response.status, `${response.statusText} ${JSON.stringify(data)}`, 'error');

                // eslint-disable-next-line @typescript-eslint/no-type-alias
                type Key = keyof CustomTypeOptions['resources']['translation']['errors']['http'];

                setError(t([
                    `errors.http.${response.status.toString() as Key}`,
                    'errors.unknown'
                ]));
            }
        } catch (err: unknown) {
            capture(url, null, '', 'fatal', err as Error);
            setError(t('errors.unknown'));
        } finally {
            setIsFetching(false);
        }
    }, [setImageUrl, t, url]);

    return {
        fetchImage: useCallback(() => {
            void fetchImage();
        }, [fetchImage]),
        isFetching,
        error
    };
};
