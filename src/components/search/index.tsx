import Paper from '@mui/material/Paper';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';


export const SearchBar: FC<{ gridArea?: string }> = ({ gridArea }) => {
    const { t } = useTranslation();

    // MAYBE TODO: MUI
    return (
        <Paper elevation={3} sx={{ gridArea, padding: '2vw' }}>
            <form
                action="https://www.google.com/search"
                method="get"
                style={{ display: 'flex' }}
            >
                <input
                    style={{ flex: 1, padding: '0.3vw 0.5vw', borderRadius: 5 }}
                    type="text"
                    name="q"
                    placeholder={t('search.placeholder')}
                />
            </form>
        </Paper>
    );
};
