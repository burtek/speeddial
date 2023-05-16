import type { ServerResponse } from 'node:http';

import type { VercelRequest } from '@vercel/node';
import { load } from 'cheerio';

import { HttpStatusCodes } from './_shared/http-codes';
import { downloadAndEncode } from './image2data';


interface RequestData {
    url?: string;
}

export type TypedVercelResponse<T> = ServerResponse & {
    send: (body: unknown) => TypedVercelResponse<T>;
    json: (jsonBody: T) => TypedVercelResponse<T>;
    status: (statusCode: number) => TypedVercelResponse<T>;
    redirect: (statusOrUrl: string | number, url?: string) => TypedVercelResponse<T>;
};

export const enum ImageFetchError {
    BAD_URL = 'Malformed url',
    NO_IMAGE = 'Image not found'
}

export type ImageResponseData = { dataUrl: string } | { error: string };


export default async function handler(
    req: VercelRequest & { query?: RequestData },
    res: TypedVercelResponse<ImageResponseData>
) {
    if (req.method !== 'GET') {
        res.status(HttpStatusCodes.METHOD_NOT_ALLOWED).end();
        return;
    }

    let url: URL;
    try {
        url = new URL(req.query.url ?? '');
    } catch {
        res.status(HttpStatusCodes.BAD_REQUEST).json({ error: ImageFetchError.BAD_URL });
        return;
    }

    try {
        const page = await fetch(url);
        const $ = load(await page.text());

        const urls = [
            $('link[rel="apple-touch-icon"]').attr('href'), // Apple Touch Icon
            $('meta[name="msapplication-TileImage"]').attr('content'), // ms TileImage
            $('meta[property="og:image"]').attr('content'), // OpenGraph (facebook/twitter)
            $('link[rel="shortcut icon"]').attr('href') // favicon
        ];
        const found = urls.find(Boolean);

        if (!found) {
            res.status(HttpStatusCodes.NOT_FOUND).json({ error: ImageFetchError.NO_IMAGE });
            return;
        }

        res.status(HttpStatusCodes.OK).json({ dataUrl: await downloadAndEncode(new URL(found, req.query.url)) });
    } catch (error: unknown) {
        res.status(HttpStatusCodes.INTERNAL_SERVER_ISSUE).json({ error: (error as Error | undefined)?.message ?? error as string });
    }
}
