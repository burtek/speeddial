import type { WebAppManifest } from 'web-app-manifest';

import { parseSize, sortSizesDecr } from './_utils.js';


export function parseManifest({ background_color: backgroundColor, icons, theme_color: themeColor }: WebAppManifest, baseUrl: string | URL) {
    if (Array.isArray(icons) && icons.length > 0) {
        const sortedIcons = [...icons].filter(i => i.purpose !== 'monochrome').sort((iconA, iconB) => {
            switch (iconA.sizes) {
                case 'any': {
                    switch (iconB.sizes) {
                        case 'any':
                            return 0;
                        default:
                            return -1;
                    }
                }
                case '':
                case undefined: {
                    switch (iconB.sizes) {
                        case 'any':
                            return 1;
                        case '':
                        case undefined:
                            return 0;
                        default:
                            return 1;
                    }
                }
                default: {
                    switch (iconB.sizes) {
                        case 'any':
                            return 1;
                        case '':
                        case undefined:
                            return -1;
                        default: {
                            return sortSizesDecr(
                                iconA.sizes.split(' ')
                                    .map(parseSize)
                                    .sort(sortSizesDecr)[0],
                                iconB.sizes.split(' ')
                                    .map(parseSize)
                                    .sort(sortSizesDecr)[0]
                            );
                        }
                    }
                }
            }
        });

        return {
            backgroundColor,
            icon: new URL(sortedIcons[0].src, baseUrl).href,
            themeColor
        };
    }

    console.log('Manifest does not contain icons');
    return null;
}
