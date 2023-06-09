import type { KeyboardEventHandler } from 'react';
import { useCallback } from 'react';


export const useFormHandlers = ({ cancel, submit }: Record<'cancel' | 'submit', () => void>) => {
    const onKeyDown = useCallback<KeyboardEventHandler>(
        event => {
            if (!(event.target instanceof HTMLInputElement)) {
                return;
            }
            switch (event.key) {
                case 'Enter':
                    submit();
                    break;
                case 'Escape':
                    cancel();
                    break;
                default:
            }
        },
        [cancel, submit]
    );

    return { onKeyDown };
};
