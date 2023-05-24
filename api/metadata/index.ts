import type { VercelRequest } from '@vercel/node';
import type { CheerioAPI } from 'cheerio';
import { load } from 'cheerio';
import type { WebAppManifest } from 'web-app-manifest';

import { getWithoutSecHeaders } from './_get.js';
import { parseManifest } from './_parseManifest.js';
import { parseWebsite } from './_parseWebsite.js';
import { StrategiesManager } from './_stategies.js';
import type { ImageResponseData, RequestData, TypedVercelResponse } from './_types.js';
import { ImageFetchError, HttpStatusCodes } from './_types.js';


const strategiesManager = new StrategiesManager([
    {
        predicate: url => url.hostname.endsWith('facebook.com'),
        getPageManifest: async (url, { headers }) => JSON.parse((await getWithoutSecHeaders(url, headers)).text) as WebAppManifest
    },
    {
        predicate: url => url.hostname.endsWith('yahoo.com'),
        // eslint-disable-next-line no-warning-comments
        // TODO: fix yahoo to not need the cookie consent cookies
        // eslint-disable-next-line max-len
        getPageSourceHeaders: { cookie: 'A1=d=AQABBDCjamQCEMT_Qe8XmrOhzKB4bJWcpYAFEgABCAHna2SYZO-bb2UB9qMAAAcIKqNqZJ5JGZU&S=AQAAAirNyeQvSM_OvISzbgn4Ork' }
    }
]);

// eslint-disable-next-line no-warning-comments
// TODO: cache in Vercel Blob, secure against misuse
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

    const strategy = strategiesManager.getStrategy(url);

    let $: CheerioAPI;
    let loadedUrl: string;
    try {
        let page: string;
        ({ page, url: loadedUrl } = await strategy.getPageSource(url));
        $ = load(page);
    } catch (error: unknown) {
        console.log('Error loading data to cheerio', error);
        res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ error: (error as Error | undefined)?.message ?? error as string });
        return;
    }

    const parsed = parseWebsite($, loadedUrl);

    if (parsed.manifestURL) {
        try {
            const manifest = parseManifest(await strategy.getPageManifest(parsed.manifestURL), parsed.manifestURL);

            if (manifest) {
                res.status(HttpStatusCodes.OK).json({
                    image: {
                        backgroundColor: manifest.backgroundColor,
                        imageUrl: manifest.icon,
                        themeColor: manifest.themeColor
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
        if (!parsed.imageUrl) {
            console.log('No image found');
            res.status(HttpStatusCodes.NOT_FOUND).json({ error: ImageFetchError.NO_IMAGE });
            return;
        }

        const imageUrl = new URL(parsed.imageUrl, loadedUrl);
        res.status(HttpStatusCodes.OK).json({
            image: {
                imageUrl: imageUrl.href,
                themeColor: parsed.themeColor
            },
            resolvedURL: loadedUrl
        });
    } catch (error: unknown) {
        console.log('Error loading icons from website', error);
        res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ error: (error as Error | undefined)?.message ?? error as string });
    }
}
