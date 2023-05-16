import { Box, styled } from '@mui/material';

import { AppFooter } from '@@components/app-footer';
import { SearchBar } from '@@components/search';
import { SettingsButton, SettingsModal } from '@@components/settings';
import { SpeedDial } from '@@components/speeddial';


const ActionBar = styled(Box)<{ gridArea?: string }>(({ gridArea }) => ({
    gridArea,
    display: 'flex',
    justifyContent: 'end',
    alignItems: 'start'
}));

const enum GridTemplateAreas {
    LEFT_TOP = 'left-top',
    LEFT_SIDEBAR = 'left-sidebar',
    SEARCH = 'search',
    SPEEDDIAL = 'speeddial',
    SPACER = 'spacer',
    FOOTER = 'footer',
    ACTION_BAR = 'action-bar',
    RIGHT_SIDEBAR = 'right-sidebar'
}

const Layout = styled(Box)({
    display: 'grid',
    gridTemplateAreas: `
        "${GridTemplateAreas.LEFT_TOP}       ${GridTemplateAreas.SEARCH}      ${GridTemplateAreas.ACTION_BAR}"
        "${GridTemplateAreas.LEFT_SIDEBAR}   ${GridTemplateAreas.SPEEDDIAL}   ${GridTemplateAreas.RIGHT_SIDEBAR}"
        "${GridTemplateAreas.LEFT_SIDEBAR}   ${GridTemplateAreas.SPACER}      ${GridTemplateAreas.RIGHT_SIDEBAR}"
        "${GridTemplateAreas.FOOTER}         ${GridTemplateAreas.FOOTER}      ${GridTemplateAreas.FOOTER}"`,
    gridTemplateColumns: '1fr 1150px 1fr',
    gridTemplateRows: 'min-content min-content 1fr min-content',
    gap: '2vw',
    minHeight: 'calc(100vh - 20px)'
});

export function AppLayout() {
    return (
        <Layout>
            <ActionBar gridArea={GridTemplateAreas.ACTION_BAR}>
                <SettingsButton />
            </ActionBar>
            <SearchBar gridArea={GridTemplateAreas.SEARCH} />
            <SpeedDial gridArea={GridTemplateAreas.SPEEDDIAL} />
            <div style={{ gridArea: GridTemplateAreas.SPACER }} />
            <AppFooter gridArea={GridTemplateAreas.FOOTER} />
            <SettingsModal />
        </Layout>
    );
}
