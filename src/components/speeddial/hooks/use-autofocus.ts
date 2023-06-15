import { useEffect, useRef } from 'react';


export const useAutofocus = (visible: boolean) => {
    const ref = useRef<HTMLInputElement>();
    useEffect(() => {
        if (visible) {
            const to = setTimeout(() => {
                if (ref.current) {
                    ref.current.focus();
                    ref.current.select();
                }
            }, 50);
            return () => {
                clearTimeout(to);
            };
        }
        return undefined;
    }, [visible]);

    return ref;
};
