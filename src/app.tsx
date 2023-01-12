import Box from '@mui/material/Box';

import { AppFooter } from '@@components/app-footer';
import { SearchBar } from '@@components/search';
import { SpeedDial } from '@@components/speeddial';

export function AppLayout() {
    // eslint-disable-next-line no-warning-comments
    // TODO: flex layout, not grid layout
    return (
        <Box
            sx={{
                display: 'grid',
                gridTemplateAreas: `
                    "left-sidebar   search   right-sidebar"
                    "left-sidebar   main     right-sidebar"
                    "spacer         spacer   spacer"
                    "footer         footer   footer"`,
                gridTemplateColumns: '1fr 1150px 1fr',
                gridTemplateRows: 'min-content min-content 1fr min-content',
                gap: '2vw',
                minHeight: 'calc(100vh - 20px)'
            }}
        >
            <SearchBar gridArea="search" />
            <SpeedDial gridArea="main" />
            <div style={{ gridArea: 'spacer' }} />
            <AppFooter gridArea="footer" />
        </Box>
    );
}
