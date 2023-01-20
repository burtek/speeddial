import { ThemeProvider } from '@emotion/react';
import { CssBaseline } from '@mui/material';
import type { FC, PropsWithChildren } from 'react';

import { useCreateTheme } from './use-create-theme';

export const ThemedApp: FC<PropsWithChildren> = ({ children }) => (
    <ThemeProvider theme={useCreateTheme()}>
        <CssBaseline />
        {children}
    </ThemeProvider>
);
