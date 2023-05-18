import type { ServerResponse } from 'node:http';


export { HttpStatusCodes } from '../../shared-utils/http-codes.js';

export interface RequestData {
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

export type ImageResponseData = {
    image: {
        backgroundColor?: string;
        imageDataUrl: string;
        imageURl: string;
        themeColor?: string;
    };
    resolvedURL: string;
} | { error: string };

export function parseSizes(sizes: string | undefined = '') {
    return sizes.split(' ').map(x => x.split(/x/i).map(Number))
        .map(([w, h]) => ({ w, h }))
        .sort((a, b) => b.h*b.w-a.h*a.w);
}

export async function downloadAndEncode(url: URL) {
    const imageResp = await fetch(url);
    const image = Buffer.from(await imageResp.arrayBuffer()).toString('base64');
    return `data:${imageResp.headers.get('content-type')};base64,${image}`;
}
