import { Typography } from '@mui/material';
import Box from '@mui/material/Box';

import { SearchBar } from './components/search';

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
            <div style={{ gridArea: 'main' }} />
            <div style={{ gridArea: 'spacer' }} />
            <Box sx={{ /* position: 'absolute', bottom: 0, left: 0, right: 0 */ gridArea: 'footer', textAlign: 'center' }}>
                <Typography>
                    &copy;
                    {' '}
                    <a
                        href="https://github.com/burtek"
                        target="_blank"
                        referrerPolicy="no-referrer"
                        rel="noopener noreferrer nofollow"
                    >
                        burtek
                    </a>
                    {` ${new Date().getFullYear()} | `}
                    <a
                        href="https://github.com/burtek/speeddial"
                        target="_blank"
                        referrerPolicy="no-referrer"
                        rel="noopener noreferrer nofollow"
                    >
                        This project is open-source!
                    </a>
                    {` | Build ${import.meta.env.VITE_VERCEL_GIT_COMMIT_SHA}`}
                </Typography>
            </Box>
        </Box>
    );
}
