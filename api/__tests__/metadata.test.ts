import type { VercelRequest, VercelResponse } from '@vercel/node';
import express from 'express';
import request from 'supertest';

import type { ImageResponseData } from '@@api/metadata/_types';

import metadata from '../metadata';


describe('api/metadata', () => {
    const app = express();
    app.use('/test', (req, res) => metadata(req as VercelRequest, res as unknown as VercelResponse));

    // eslint-disable-next-line jest/no-disabled-tests
    it.skip.each([
        { url: 'https://www.reddit.com/', expectedUrl: expect.stringMatching(/^https:\/\/www\.reddit\.com\/(\?.*)?$/i) },
        { url: 'https://www.facebook.com/' },
        // { url: 'https://www.wp.pl/' }, // broken
        { url: 'https://www.onet.pl/' },
        { url: 'https://tvn24.pl/' },
        { url: 'https://tvn24.pl/tvnwarszawa' },
        // { url: 'https://twitter.com/' }, // broken
        // { url: 'https://www.google.com/' }, // no data?
        { url: 'https://www.yahoo.com/' }, // broken
        { url: 'https://www.amazon.com/' },
        { url: 'https://allegro.pl/' },
        { url: 'https://www.wtp.waw.pl/' },
        { url: 'https://www.x-kom.pl/' },
        { url: 'https://online.mbank.pl/pl/Login' }
    ])('snapshots for $url', async ({ url, expectedUrl = url }) => {
        const response = await request(app).get(`/test?url=${url}`);

        const body = response.body as ImageResponseData;
        assert('imageUrl' in body);

        expect(response.status).toBe(200);
        expect(body.imageUrl).toBeString(); // changes between datacenters
        expect(body.resolvedURL).toStrictEqual(expectedUrl);
        expect(body.backgroundColor).toMatchSnapshot('backgroundColor');
        expect(body.themeColor).toMatchSnapshot('themeColor');

        // changes between datacenters

        // const imageResp = await fetch(body.imageUrl);
        // const image = Buffer.from(await imageResp.arrayBuffer()).toString('base64');

        // expect(image).toMatchSnapshot();
    }, 10_000);
});
