import { captureException as sentryCaptureError, captureMessage as sentryCaptureMessage } from '@sentry/react';
import type { CustomTypeOptions } from 'i18next';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import type { ImageResponseData } from '@@api/image';

export const useFetchImageForUrl = (url: string, setUrl: (url: string) => void) => {
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

            if ('dataUrl' in data) {
                setUrl(data.dataUrl);
            } else {
                sentryCaptureMessage(`Failed obtaining logoUrl for url ${url}: ${data.error}`, 'warning');
                setError(t([
                    `errors.logoUrl.${data.error as keyof CustomTypeOptions['resources']['translation']['errors']['logoUrl']}`,
                    'errors.unknown'
                ]));
            }
        } catch (err: unknown) {
            sentryCaptureError(err);
            setError(t('errors.unknown'));
        } finally {
            setIsFetching(false);
        }
    }, [setUrl, t, url]);

    return [fetchImage, isFetching, error] as const;
};
