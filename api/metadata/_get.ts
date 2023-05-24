import { get as getHttps } from 'node:https';
import { get as getHttp } from 'node:http';

export const getWithoutSecHeaders = (url: string | URL, headers?: Record<string, string>, count = 1) => new Promise<{ text: string, url: string }>((resolve, reject) => {
    (new URL(url).protocol === 'https:' ? getHttps : getHttp)(
        url.toString(),
        { headers: { ...headers, Connection: 'close' } },
        response => {
            response.setEncoding('utf8');

            if (response.headers.location) {
                if (count === 5) {
                    reject(new Error('Exceeded redirect count'))
                }
                try {
                    resolve(getWithoutSecHeaders(new URL(response.headers.location, url), headers, count+1))
                } catch (error: unknown) {
                    reject(error)
                }
                return
            }

            let data = '';
            response.on('data', chunk => {
                data += chunk;
            });
            response.on('end', () => {
                response.destroy()
                console.log(data.length, response.headers)
                resolve({
                    text: data,
                    url: url.toString()
                })
            });
        }
    ).on('error', reject);
})
