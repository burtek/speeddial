import type { CheerioAPI } from 'cheerio';

import { findBiggest } from './_utils.js';


function getManifestUrl($: CheerioAPI, baseUrl: string | URL) {
    try {
        const manifestHref = $('link[rel="manifest"]').attr('href');
        return manifestHref ? new URL(manifestHref, baseUrl) : null;
    } catch (error: unknown) {
        console.error(error);
        return null;
    }
}

function getImageUrl($: CheerioAPI, baseUrl: string | URL) {
    try {
        const urls = [
            findBiggest($('link[rel="apple-touch-icon"]'), 'href'), // Apple Touch Icon
            $([
                'meta[name="msapplication-TileImage"]',
                'meta[name^="msapplication-square"][name$="logo"]',
                'meta[name^="msapplication-wide"][name$="logo"]'
            ].join(',')).attr('content'), // ms TileImage
            $('meta[property="og:image"], meta[property="twitter:image"]').attr('content'), // OpenGraph (facebook/twitter)
            $('meta[name="image"]').attr('content'),
            // findBiggest($('link[rel="apple-touch-icon-precomposed"]'), 'href'), // Apple Touch Icon Precomposed
            findBiggest($('link[rel="icon"]'), 'href'),
            $('link[rel="shortcut icon"]').attr('href')
        ];

        const found = urls.find(Boolean);

        return found ? new URL(found, baseUrl) : null;
    } catch (error: unknown) {
        // eslint-disable-next-line no-warning-comments
        // TODO: retry with next URL
        console.error(error);
        return null;
    }
}

function getThemeColor($: CheerioAPI) {
    const colors = [
        $('meta[name="theme-color"]').attr('content'),
        $('meta[name="msapplication-TileColor"]').attr('content')
    ];

    return colors.find(Boolean);
}

export function parseWebsite($: CheerioAPI, baseUrl: string | URL) {
    return {
        manifestURL: getManifestUrl($, baseUrl),
        imageUrl: getImageUrl($, baseUrl),
        themeColor: getThemeColor($)
    };
}
