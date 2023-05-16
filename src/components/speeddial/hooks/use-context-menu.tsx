import { Menu, MenuItem } from '@mui/material';
import { bindContextMenu, bindMenu, usePopupState } from 'material-ui-popup-state/hooks';
import type { ReactNode } from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';


const DEFAULT_MENU_TRANSITION_DURATION = 232;

export function useContextMenu(options: ContextMenuOption[], id: string, transitionDuration = DEFAULT_MENU_TRANSITION_DURATION) {
    const { t } = useTranslation();
    const popupState = usePopupState({ variant: 'popover', popupId: `context-menu-${id}` });

    const [confirmationState, setConfirmationState] = useState<string | null>(null);

    useEffect(() => {
        if (!popupState.isOpen) {
            window.setTimeout(setConfirmationState, transitionDuration, null);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps -- we only want effect to run on isOpen change
    }, [popupState.isOpen]);

    const onCancel = useCallback(() => {
        setConfirmationState(null);
    }, []);

    const cancelText = t('actions.cancel');
    const menuOptions = useMemo<MenuOption[]>(
        () => {
            function doAction(action: () => void): () => void;
            function doAction(action: (arg: string) => void, arg: string): () => void;
            function doAction(action: (arg: string) => void, arg?: string) {
                return () => {
                    action(arg ?? '');
                    popupState.close();
                };
            }
            return [
                ...options.flatMap<MenuOption>(option => {
                    if ('options' in option) {
                        const { key, label, action, options: suboptions } = option;
                        return [
                            // eslint-disable-next-line @typescript-eslint/brace-style
                            { props: { key, children: label, onClick() { setConfirmationState(key); } }, show: null },
                            ...suboptions.map(({ value, label: suboptionLabel }) => ({
                                props: {
                                    key: `${key}_${value}`,
                                    children: suboptionLabel,
                                    onClick: doAction(action, value)
                                },
                                show: key
                            }))
                        ];
                    }

                    const { key, label, action, requireConfirm = false } = option;
                    if (!requireConfirm) {
                        return { props: { key, children: label, onClick: doAction(action) }, show: null };
                    }
                    return [
                        // eslint-disable-next-line @typescript-eslint/brace-style
                        { props: { key, children: label, onClick() { setConfirmationState(key); } }, show: null },
                        { props: { sx: { color: 'red' }, key: `${key}_confirm`, children: requireConfirm, onClick: doAction(action) }, show: key }
                    ];
                }),
                { props: { key: 'cancel', children: cancelText, onClick: onCancel }, show: true }
            ];
        },
        [options, cancelText, onCancel, popupState]
    );

    const renderedMenuOptions = useMemo(
        () => menuOptions
            .filter(({ show }) => {
                if (confirmationState === null) {
                    return show === null;
                }
                return show === true || show === confirmationState;
            })
            .map(({ props: { key, ...rest } }) => <MenuItem key={key} {...rest} />),
        [confirmationState, menuOptions]
    );

    return {
        menu: (
            <Menu {...bindMenu(popupState)} transitionDuration={transitionDuration}>
                {renderedMenuOptions}
            </Menu>
        ),
        triggerProps: bindContextMenu(popupState)
    };
}

export type ContextMenuOption = ContextMenuOptionWithAction | ContextMenuOptionWithArgAction;
export interface ContextMenuOptionWithAction {
    key: string;
    label: string;
    action: () => void;
    requireConfirm?: false | string;
}
export interface ContextMenuOptionWithArgAction {
    key: string;
    label: string;
    action: (value: string) => void;
    options: Array<{ value: string; label: string }>;
}

/** @private */
interface MenuOption {
    props: {
        sx?: { color: string };
        key: string;
        children: ReactNode;
        onClick: () => void;
    };
    /**
     * `null` - show in root menu
     *
     * `true` - show in any submenu
     *
     * `string` - show if submenu id equals this string
     */
    show: null | true | string;
}
