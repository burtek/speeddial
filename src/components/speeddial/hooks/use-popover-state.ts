import { useReducer, useCallback } from 'react';


export const usePopoverState = () => {
    interface State {
        anchor: HTMLElement | null;
        mode: 'backgroundColor' | 'themeColor';
    }

    interface OpenAction {
        type: 'open';
        anchor: HTMLElement;
        mode: State['mode'];
    }
    interface CloseAction {
        type: 'close';
    }

    const [popoverState, dispatch] = useReducer((state: State, action: OpenAction | CloseAction) => {
        switch (action.type) {
            case 'close':
                return { ...state, anchor: null };
            case 'open':
                return { ...state, anchor: action.anchor, mode: action.mode };
            default:
                return state;
        }
    }, { anchor: null, mode: 'backgroundColor' });

    return [
        popoverState,
        {
            open: useCallback((anchor: HTMLElement, mode: State['mode']) => {
                dispatch({ type: 'open', anchor, mode });
            }, []),
            close: useCallback(() => {
                dispatch({ type: 'close' });
            }, [])
        }
    ] as const;
};
