import type { SelectChangeEvent } from '@mui/material';
import { Divider, Dialog, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import type { FC } from 'react';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import type { ThemeMode } from '@@data/config';
import { actions as configActions } from '@@data/config';
import { getIsDialogOpen, getThemeMode } from '@@data/config/selectors';
import { useAppDispatch } from '@@data/redux-toolkit';


export const SettingsModal: FC = () => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();

    const dialogOpen = useSelector(getIsDialogOpen);
    const themeMode = useSelector(getThemeMode) ?? 'auto';

    const onChangeThemeMode = useCallback((event: SelectChangeEvent<ThemeMode | 'auto'>) => {
        const value = event.target.value as ThemeMode | 'auto';
        dispatch(configActions.setThemeMode({ mode: value === 'auto' ? null : value }));
    }, [dispatch]);

    const onClose = useCallback(() => {
        dispatch(configActions.closeModal());
    }, [dispatch]);

    return (
        <Dialog
            open={dialogOpen}
            fullWidth
            maxWidth="md"
            onClose={onClose}
        >
            <DialogTitle>{t('configDialog.title')}</DialogTitle>
            <Divider />
            <DialogContent>
                <FormControl fullWidth>
                    <InputLabel id="theme-mode-select-label">{t('configDialog.themeMode.label')}</InputLabel>
                    <Select
                        labelId="theme-mode-select-label"
                        id="theme-mode-select"
                        value={themeMode}
                        label={t('configDialog.themeMode.label')}
                        onChange={onChangeThemeMode}
                    >
                        <MenuItem value="auto">{t('configDialog.themeMode.option.auto')}</MenuItem>
                        <MenuItem value="light">{t('configDialog.themeMode.option.light')}</MenuItem>
                        <MenuItem value="dark">{t('configDialog.themeMode.option.dark')}</MenuItem>
                    </Select>
                </FormControl>
            </DialogContent>
        </Dialog>
    );
};
