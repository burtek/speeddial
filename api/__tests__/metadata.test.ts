import type { VercelRequest, VercelResponse } from '@vercel/node';
import express from 'express';
import request from 'supertest';

import type { ImageResponseData } from '@@api/metadata/_types';

import metadata from '../metadata';


describe('api/metadata', () => {
    const app = express();
    app.use('/test', (req, res) => metadata(req as VercelRequest, res as unknown as VercelResponse));

    it.each([
        // { url: 'http://127.0.0.1/' },
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
        { url: 'https://www.wtp.waw.pl/' }
    ])('snapshots for $url', async ({ url }) => {
        const response = await request(app).get(`/test?url=${url}`);

        const body = response.body as ImageResponseData;
        assert('imageUrl' in body);

        expect(response.status).toBe(200);
        expect(body).toStrictEqual({
            imageUrl: expect.any(String),
            resolvedURL: url
        });

        // not testing URL as it changes between data centers(?)
        expect(body.backgroundColor).toMatchSnapshot('backgroundColor');
        expect(body.themeColor).toMatchSnapshot('themeColor');
    }, 10_000);
});
