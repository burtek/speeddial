import type { SxProps, Theme } from '@mui/material';
import { IconButton } from '@mui/material';
import { Cog } from 'mdi-material-ui';
import type { FC } from 'react';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { actions as configActions } from '@@data/config';
import { useAppDispatch } from '@@data/redux-toolkit';


export const SettingsButton: FC<{ sx?: SxProps<Theme> }> = ({ sx }) => {
    const { t } = useTranslation();

    const dispatch = useAppDispatch();
    const onClick = useCallback(() => {
        dispatch(configActions.openModal());
    }, [dispatch]);

    return (
        <IconButton
            onClick={onClick}
            sx={sx}
            title={t('tooltips.settings')}
            aria-label={t('tooltips.settings')}
        >
            <Cog />
        </IconButton>
    );
};
