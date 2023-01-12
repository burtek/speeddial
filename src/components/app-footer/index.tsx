import { Box, Typography } from '@mui/material';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';

const AUTHOR = 'burtek';
const AUTHOR_URL = 'https://github.com/burtek';
const REPO_URL = 'https://github.com/burtek/speeddial';

export const AppFooter: FC<{ gridArea?: string }> = ({ gridArea }) => {
    const { t } = useTranslation();

    return (
        <Box sx={{ gridArea, textAlign: 'center' }}>
            <Typography>
                &copy;
                {' '}
                <a
                    href={AUTHOR_URL}
                    target="_blank"
                    referrerPolicy="no-referrer"
                    rel="noopener noreferrer nofollow"
                >
                    {AUTHOR}
                </a>
                {` ${new Date().getFullYear()} | `}
                <a
                    href={REPO_URL}
                    target="_blank"
                    referrerPolicy="no-referrer"
                    rel="noopener noreferrer nofollow"
                >
                    {t('footer.openSource')}
                </a>
                {` | Build ${import.meta.env.VITE_VERCEL_GIT_COMMIT_SHA}`}
            </Typography>
        </Box>
    );
};
