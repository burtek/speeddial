import type { Cheerio } from 'cheerio';


interface Size {
    w: number; h: number;
}

export function parseSize(size: string): Size {
    const [w, h] = size.split(/x/i).map(Number);
    return { w, h };
}

export function sortSizesDecr(size1: string | Size, size2: string | Size) {
    const [s1, s2] = [
        typeof size1 === 'string' ? parseSize(size1) : size1,
        typeof size2 === 'string' ? parseSize(size2) : size2
    ];

    return s2.w * s2.h - s1.w * s1.h;
}

export async function downloadAndEncode(url: URL) {
    const imageResp = await fetch(url);
    const image = Buffer.from(await imageResp.arrayBuffer()).toString('base64');
    return `data:${imageResp.headers.get('content-type')};base64,${image}`;
}

export function findBiggest($: Cheerio<import('domhandler').Element>, attribute: string) {
    if ($.length === 0) {
        return null;
    }
    if ($.length === 1) {
        return $.attr(attribute);
    }

    return $.toArray().sort((a, b) => sortSizesDecr(a.attribs.sizes, b.attribs.sizes))[0].attribs.href;
}
