import type { ServerResponse } from 'node:http';

import type { VercelRequest } from '@vercel/node';
import { fileTypeFromBuffer } from 'file-type'

interface RequestData {
    url?: string;
}

export type TypedVercelResponse<T> = ServerResponse & {
    send: (body: unknown) => TypedVercelResponse<T>;
    json: (jsonBody: T) => TypedVercelResponse<T>;
    status: (statusCode: number) => TypedVercelResponse<T>;
    redirect: (statusOrUrl: string | number, url?: string) => TypedVercelResponse<T>;
};

export const enum Image2DataError {
    BAD_URL = 'Malformed url',
    NOT_FOUND = 'Image not found'
}

export type ImageResponseData = { dataUrl: string } | { error: string };

export async function downloadAndEncode(url: URL) {
    const imageResp = await fetch(url, { headers: { 'accept': 'image/*' } });
    const imageBuffer = Buffer.from(await imageResp.arrayBuffer());
    const imageType = await fileTypeFromBuffer(imageBuffer)
    const image = imageBuffer.toString('base64');
    
    console.log(imageType, imageResp.type, imageResp.headers.get('content-type'));
    
    // TODO: get file type - https://via.placeholder.com/150 has no content-type header
    return `data:${imageResp.headers.get('content-type')};base64,${image}`;
}

export default async function handler(
    req: VercelRequest & { query?: RequestData },
    res: TypedVercelResponse<ImageResponseData>
) {
    if (req.method !== 'GET') {
        res.status(405).end();
        return;
    }

    let url: URL;
    try {
        url = new URL(req.query.url ?? '');
    } catch {
        res.status(400).json({ error: Image2DataError.BAD_URL });
        return;
    }

    try {
        res.status(200).json({ dataUrl: await downloadAndEncode(url) });
    } catch (error: unknown) {
        res.status(500).json({ error: (error as Error | undefined)?.message ?? error as string });
    }
}
