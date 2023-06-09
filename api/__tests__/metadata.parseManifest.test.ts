/* eslint-disable object-curly-newline */
import type { WebAppManifest } from 'web-app-manifest';

import { parseManifest } from '@@api/metadata/_parseManifest';


describe('api/manifest/parseManifest', () => {
    it.each<Pick<WebAppManifest, 'icons'>>([
        {
            icons: undefined
        },
        {
            icons: []
        }
    ])('should return null', ({ icons }) => {
        expect(parseManifest({ icons }, 'https://example.com/path/file')).toBeNull();
    });

    it.each<Pick<WebAppManifest, 'icons'> & { expected: string }>([
        {
            icons: [{ src: 'icon.png' }],
            expected: 'https://example.com/path/icon.png'
        },
        {
            icons: [{ src: '/icon.png' }],
            expected: 'https://example.com/icon.png'
        },
        {
            icons: [{ src: 'https://cdn.example.com/icon.png' }],
            expected: 'https://cdn.example.com/icon.png'
        },
        {
            icons: [{
                src: '/icon1.png'
            }, {
                src: '/icon2.png',
                sizes: '75x75 150x150'
            }, {
                src: '/icon3.png',
                sizes: 'any'
            }],
            expected: 'https://example.com/icon3.png'
        },
        {
            icons: [{
                src: '/icon1.png'
            }, {
                src: '/icon2.png',
                sizes: '75x75 150x150'
            }, {
                src: '/icon3.png',
                sizes: '50x50 200x200'
            }],
            expected: 'https://example.com/icon3.png'
        },
        {
            icons: [{
                src: '/icon1.png'
            }, {
                src: '/icon3.png',
                sizes: 'any'
            }],
            expected: 'https://example.com/icon3.png'
        },
        {
            icons: [{
                src: '/icon1.png'
            }, {
                src: '/icon2.png',
                sizes: '75x75 150x150'
            }],
            expected: 'https://example.com/icon2.png'
        }
    ])('should return correct url', ({ icons, expected }) => {
        expect(parseManifest({ icons }, 'https://example.com/path/file')).toStrictEqual(expect.objectContaining({ icon: expected }));
    });
});
