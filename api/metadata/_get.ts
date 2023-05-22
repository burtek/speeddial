import { get } from 'node:https';

import type { WebAppManifest } from 'web-app-manifest';


// Facebook doesn't cooperate with nodeJs fetch's hard-set 'sec-fetch-mode' header
export function getJson(url: string | URL) {
    const headers = {
        'accept': 'application/json',
        'sec-fetch-mode': 'navigate',
        'user-agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/113.0'
    };
    return new Promise<WebAppManifest>((resolve, reject) => {
        get(url.toString(), { headers }, response => {
            response.setEncoding('utf8');

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
        }).on('error', reject);
    });
}
