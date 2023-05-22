import type { VercelRequest } from '@vercel/node';
import type { CheerioAPI } from 'cheerio';
import { load } from 'cheerio';

import { getJson } from './_get.js';
import type { ImageResponseData, RequestData, TypedVercelResponse } from './_types.js';
import { ImageFetchError, HttpStatusCodes } from './_types.js';
import { parseSize, downloadAndEncode, sortSizesDecr, findBiggest } from './_utils.js';


// eslint-disable-next-line no-warning-comments
// TODO: cache in Vercel Blob
// eslint-disable-next-line no-warning-comments
// TODO: secure against misuse
export default async function handler(
    req: VercelRequest & { query?: RequestData },
    res: TypedVercelResponse<ImageResponseData>
) {
    if (req.method !== 'GET') {
        console.error('Bad method: %s', req.method);
        res.status(HttpStatusCodes.METHOD_NOT_ALLOWED).end();
        return;
    }

    let url: URL;
    try {
        url = new URL(req.query.url ?? '');
    } catch {
        console.error('Bad url: %s', req.query.url);
        res.status(HttpStatusCodes.BAD_REQUEST).json({ error: ImageFetchError.BAD_URL });
        return;
    }
    console.log('Processing url %s', url.href);

    let $: CheerioAPI;
    let loadedUrl: string;
    try {
        const page = await fetch(url, {
            headers: {
                'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
                'Sec-Fetch-Dest': 'document',
                'Sec-Fetch-Mode': 'navigate',
                'Sec-Fetch-Site': 'cross-site',
                'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/113.0'
            }
        });
        const text = await page.text();
        [loadedUrl, $] = [page.url, load(text)];
    } catch (error: unknown) {
        console.log('Error loading cheerio', error);
        res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ error: (error as Error | undefined)?.message ?? error as string });
        return;
    }

    const manifestHref = $('link[rel="manifest"]').attr('href');
    const manifestUrl = manifestHref ? new URL(manifestHref, loadedUrl) : null;
    if (manifestUrl) {
        try {
            const { background_color: backgroundColor, icons, theme_color: themeColor } = await getJson(manifestUrl);

            if (Array.isArray(icons) && icons.length > 0) {
                const iconUrl = icons.find(icon => icon.sizes === 'any' || !icon.sizes)?.src ?? [...icons].sort((a, b) => {
                    const [[largestASize], [largestBSize]] = [a.sizes as string, b.sizes as string].map(x => x.split(' ').map(parseSize));

                    return sortSizesDecr(largestASize, largestBSize);
                })[0].src;

                const iconFullUrl = new URL(iconUrl, manifestUrl);
                res.status(HttpStatusCodes.OK).json({
                    image: {
                        backgroundColor,
                        imageUrl: iconFullUrl.href,
                        imageDataUrl: await downloadAndEncode(iconFullUrl),
                        themeColor
                    },
                    resolvedURL: loadedUrl
                });
                return;
            }
            console.log('Manifest does not contain icons');
        } catch (error: unknown) {
            console.error('Error loading icons from manifest', error);
        }
    }

    try {
        const urls = [
            findBiggest($('link[rel="apple-touch-icon"]'), 'href'), // Apple Touch Icon
            $('meta[name="msapplication-TileImage"]').attr('content'), // ms TileImage
            $('meta[property="og:image"]').attr('content'), // OpenGraph (facebook/twitter)
            findBiggest($('link[rel="shortcut icon"], link[rel="icon"]'), 'href') // favicon
        ];
        const found = urls.find(Boolean);

        if (!found) {
            console.log('No image found');
            res.status(HttpStatusCodes.NOT_FOUND).json({ error: ImageFetchError.NO_IMAGE });
            return;
        }

        const imageUrl = new URL(found, loadedUrl);
        res.status(HttpStatusCodes.OK).json({
            image: {
                // backgroundColor: background_color,
                imageUrl: imageUrl.href,
                imageDataUrl: await downloadAndEncode(imageUrl)
                // themeColor: theme_color
            },
            resolvedURL: loadedUrl
        });
    } catch (error: unknown) {
        console.log('Error loading icons from website', error);
        res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ error: (error as Error | undefined)?.message ?? error as string });
    }
}
