import { Box, Link, Typography } from '@mui/material';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';


// TODO: env
const AUTHOR = 'burtek';
const AUTHOR_URL = 'https://github.com/burtek';
const REPO_URL = 'https://github.com/burtek/speeddial';

// add build time
function getBuildDescription() {
    switch (import.meta.env.VITE_VERCEL_ENV) {
        case 'production':
            return import.meta.env.VITE_VERCEL_GIT_COMMIT_SHA.substring(0, 7);
        default:
            return import.meta.env.VITE_VERCEL_ENV;
    }
}

export const AppFooter: FC<{ gridArea?: string }> = ({ gridArea }) => {
    const { t } = useTranslation();

    return (
        <Box sx={{ gridArea, textAlign: 'center' }}>
            <Typography>
                &copy;
                {' '}
                <Link
                    href={AUTHOR_URL}
                    target="_blank"
                    referrerPolicy="no-referrer"
                    rel="noopener noreferrer nofollow"
                >
                    {AUTHOR}
                </Link>
                {` ${new Date().getFullYear()} | `}
                <Link
                    href={REPO_URL}
                    target="_blank"
                    referrerPolicy="no-referrer"
                    rel="noopener noreferrer nofollow"
                >
                    {t('footer.openSource')}
                </Link>
                {` | ${t('footer.build')} ${getBuildDescription()}`}
            </Typography>
        </Box>
    );
};
