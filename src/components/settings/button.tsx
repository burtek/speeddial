import type { SxProps, Theme } from '@mui/material';
import { IconButton } from '@mui/material';
import { Cog } from 'mdi-material-ui';
import type { FC } from 'react';
import { useCallback } from 'react';

import { actions as configActions } from '@@data/config';
import { useAppDispatch } from '@@data/index';

export const SettingsButton: FC<{ sx?: SxProps<Theme> }> = ({ sx }) => {
    const dispatch = useAppDispatch();
    const onClick = useCallback(() => {
        dispatch(configActions.openModal());
    }, [dispatch]);

    return (
        <IconButton onClick={onClick} sx={sx}>
            <Cog />
        </IconButton>
    );
};
