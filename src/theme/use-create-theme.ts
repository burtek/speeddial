import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import { useMediaQuery } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';

import { getThemeMode } from '@@data/config/selectors';


export const useCreateTheme = () => {
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

    const mode = useSelector(getThemeMode) ?? (prefersDarkMode ? 'dark' : 'light');

    return useMemo(() => createTheme({ palette: { mode } }), [mode]);
};
