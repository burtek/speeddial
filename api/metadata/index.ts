import https from 'node:https';

import type { VercelRequest } from '@vercel/node';
import type { CheerioAPI } from 'cheerio';
import { load } from 'cheerio';
import type { WebAppManifest } from 'web-app-manifest';

import type { ImageResponseData, RequestData, TypedVercelResponse } from './_utils.js';
import { ImageFetchError, parseSizes, downloadAndEncode, HttpStatusCodes } from './_utils.js';


// eslint-disable-next-line no-warning-comments
// TODO: cache in Vercel KV
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

    let $: CheerioAPI,
        loadedUrl: string;
    try {
        const page = await fetch(url);
        loadedUrl = page.url;
        $ = load(await page.text());
    } catch (error: unknown) {
        console.log('Error loading cheerio', error);
        res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ error: (error as Error | undefined)?.message ?? error as string });
        return;
    }

    const manifestHref = $('link[rel="manifest"]').attr('href');
    const manifestUrl = manifestHref && new URL(manifestHref, loadedUrl);
    if (manifestUrl) {
        try {
            console.log('Trying manifest from url', manifestUrl.href);

            // eslint-disable-next-line @typescript-eslint/naming-convention
            const { background_color, icons, theme_color } = await new Promise<WebAppManifest>((resolve, reject) => {
                const headers = {
                    'accept': 'application/json',
                    'sec-fetch-mode': 'navigate',
                    'user-agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/113.0'
                };
                https.get(manifestUrl, { headers }, response => {
                    response.setEncoding('utf8');
                    console.log('headers:', response.headers);

                    let data = '';
                    response.on('data', chunk => {
                        data += chunk;
                    });
                    response.on('end', () => {
                        try {
                            const parsedData = JSON.parse(data) as WebAppManifest;
                            resolve(parsedData);
                        } catch (error: unknown) {
                            reject(error);
                        }
                    });
                }).on('error', error => {
                    reject(error);
                });
            });

            if (Array.isArray(icons) && icons.length > 0) {
                const tempUrl = icons.find(icon => icon.sizes === 'any' || !icon.sizes)?.src ?? [...icons].sort((a, b) => {
                    const [[largestASize], [largestBSize]] = [parseSizes(a.sizes), parseSizes(b.sizes)];

                    return largestBSize.h * largestBSize.w - largestASize.h * largestASize.w;
                })[0].src;
                const iconUrl = new URL(tempUrl, manifestUrl);

                const imageUrl = new URL(iconUrl, loadedUrl);
                res.status(HttpStatusCodes.OK).json({
                    image: {
                        backgroundColor: background_color,
                        imageURl: imageUrl.href,
                        imageDataUrl: await downloadAndEncode(imageUrl),
                        themeColor: theme_color
                    },
                    resolvedURL: loadedUrl
                });
                return;
            }
        } catch (error: unknown) {
            console.error('Error loading icons from manifest', error);
        }
    }

    try {
        const urls = [
            $('link[rel="apple-touch-icon"]').attr('href'), // Apple Touch Icon
            $('meta[name="msapplication-TileImage"]').attr('content'), // ms TileImage
            $('meta[property="og:image"]').attr('content'), // OpenGraph (facebook/twitter)
            $('link[rel="shortcut icon"]').attr('href') // favicon
        ];
        const found = urls.find(Boolean);

        if (!found) {
            console.log('No image found');
            res.status(HttpStatusCodes.NOT_FOUND).json({ error: ImageFetchError.NO_IMAGE });
            return;
        }

        console.log('ok', found);
        const imageUrl = new URL(found, loadedUrl);
        res.status(HttpStatusCodes.OK).json({
            image: {
                // backgroundColor: background_color,
                imageURl: imageUrl.href,
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
