import type { WebAppManifest } from 'web-app-manifest';


export interface Strategy {
    getPageSource?: (url: string | URL, { headers }: { headers: Record<string, string> }) => Promise<{ page: string; url: string }>;
    getPageSourceHeaders?: Record<string, string>;
    getPageManifest?: (url: string | URL, { headers }: { headers: Record<string, string> }) => Promise<WebAppManifest>;
    getPageManifestHeaders?: Record<string, string>;
}

const defaultStrategy: Required<Strategy> = {
    getPageSource: async (url, { headers }) => {
        const resp = await fetch(url, { headers });
        return {
            page: await resp.text(),
            url: resp.url
        };
    },
    getPageSourceHeaders: {
        'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'sec-fetch-dest': 'document',
        'sec-fetch-mode': 'navigate',
        'sec-fetch-site': 'cross-site',
        'user-agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/113.0'
    },
    getPageManifest: async (url, { headers }) => {
        const resp = await fetch(url, { headers });
        return resp.json();
    },
    getPageManifestHeaders: {
        'accept': 'application/json',
        'sec-fetch-mode': 'navigate',
        'user-agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/113.0'
    }
};

export class StrategiesManager {
    constructor(private readonly strategies: Array<Strategy & { predicate: (url: URL) => boolean }>) {}

    getStrategy(strategyUrl: string | URL) {
        const strategy = this.strategies.find(s => s.predicate(new URL(strategyUrl)));

        return {
            getPageSource(url: string | URL) {
                const headers = {
                    ...defaultStrategy.getPageSourceHeaders,
                    ...strategy?.getPageSourceHeaders
                };
                return (strategy?.getPageSource ?? defaultStrategy.getPageSource)(url, { headers });
            },
            getPageManifest(url: string | URL) {
                const headers = {
                    ...defaultStrategy.getPageManifestHeaders,
                    ...strategy?.getPageManifestHeaders
                };
                return (strategy?.getPageManifest ?? defaultStrategy.getPageManifest)(url, { headers });
            }
        };
    }
}
