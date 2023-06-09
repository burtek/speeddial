import type { ChangeEvent } from 'react';
import { useCallback, useEffect, useState } from 'react';

// eslint-disable-next-line @typescript-eslint/no-type-alias
type StringKeys<T> = {
    [K in keyof T]: T[K] extends string | undefined ? K : never
}[keyof T];

export const useDraft = <T>(object: T | undefined) => {
    const [draft, setDraft] = useState<T | undefined>(object);

    useEffect(() => {
        setDraft(object);
    }, [object]);

    const set = useCallback(<K extends StringKeys<T>>(key: K, value: (string | undefined | null) & T[K]) => {
        setDraft(d => d && { ...d, [key]: value });
    }, []);

    return {
        inputProps: <K extends StringKeys<T>>(key: K) => ({
            id: key,
            value: draft?.[key] ?? '',
            onChange: (event: ChangeEvent<HTMLInputElement>) => {
                set(key, event.target.value as string & T[K]);
            },
            type: 'text'
        }),
        value: draft,
        set
    };
};
