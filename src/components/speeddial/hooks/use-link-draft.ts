import { useCallback, useEffect, useState } from 'react';
import type { ChangeEvent } from 'react';

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-constraint -- needed in .tsx
export const useDraft = <T extends unknown>(object: T | undefined) => {
    const [draft, setDraft] = useState<T | undefined>(object);

    useEffect(() => {
        setDraft(object);
    }, [object]);

    const set = useCallback(<K extends keyof T>(key: K, value: string) => {
        setDraft(d => d && { ...d, [key]: value });
    }, []);

    return {
        inputProps: (key: keyof T) => ({
            id: key,
            value: draft?.[key] ?? '',
            onChange: (event: ChangeEvent<HTMLInputElement>) => {
                set(key, event.target.value);
            },
            type: 'text'
        }),
        value: draft,
        set
    };
};
