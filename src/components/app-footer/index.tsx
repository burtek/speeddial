import { Box, Link, Typography } from '@mui/material';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';

const AUTHOR = 'burtek';
const AUTHOR_URL = 'https://github.com/burtek';
const REPO_URL = 'https://github.com/burtek/speeddial';

export const AppFooter: FC<{ gridArea?: string }> = ({ gridArea }) => {
    const { t } = useTranslation();

    let build = import.meta.env.VITE_VERCEL_GIT_COMMIT_SHA;
    if (build && build !== 'development') {
        build = build.substring(0, 7);
    }

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
                {` | ${t('footer.build')} ${build}`}
            </Typography>
        </Box>
    );
};
