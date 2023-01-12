import { Box, Dialog, DialogContent, DialogTitle, Link, Typography } from '@mui/material';
import type { FC } from 'react';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

const AUTHOR = 'burtek';
const AUTHOR_URL = 'https://github.com/burtek';
const REPO_URL = 'https://github.com/burtek/speeddial';

type InfoType = 'cookies' | 'privacy';

export const AppFooter: FC<{ gridArea?: string }> = ({ gridArea }) => {
    const { t } = useTranslation();

    let build = import.meta.env.VITE_VERCEL_GIT_COMMIT_SHA;
    if (build && build !== 'development') {
        build = build.substring(0, 7);
    }

    const [shown, setShown] = useState<InfoType | null>(null);

    const content = useMemo<Record<InfoType, { title: string; content: string }>>(() => ({
        cookies: t('legal.cookies', { returnObjects: true }),
        privacy: t('legal.privacy', { returnObjects: true })
    }), []);

    const showCookiesInfo = useCallback(() => {
        setShown('cookies');
    }, []);
    const showPrivacyPolicy = useCallback(() => {
        setShown('privacy');
    }, []);
    const hideDialog = useCallback(() => {
        setShown(null);
    }, []);

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
                {` | ${t('footer.build')} ${build} | `}
                <Link href="#" onClick={showCookiesInfo}>{t('footer.cookies')}</Link>
                {' | '}
                <Link href="#" onClick={showPrivacyPolicy}>{t('footer.privacy')}</Link>
            </Typography>
            <Dialog open={shown !== null} onClose={hideDialog}>
                <DialogTitle>{shown !== null && content[shown].title}</DialogTitle>
                <DialogContent>
                    <pre style={{ whiteSpace: 'pre-wrap' }}>
                        {shown !== null && content[shown].content}
                    </pre>
                </DialogContent>
            </Dialog>
        </Box>
    );
};
