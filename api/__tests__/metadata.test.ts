import type { VercelRequest, VercelResponse } from '@vercel/node';
import express from 'express';
import request from 'supertest';

import type { ImageResponseData } from '@@api/metadata/_types';

import metadata from '../metadata';


describe('api/metadata', () => {
    const app = express();
    app.use('/test', (req, res) => metadata(req as VercelRequest, res as unknown as VercelResponse));

    it.each([
        { url: 'https://www.facebook.com/' },
        // { url: 'https://www.wp.pl/' }, // broken
        { url: 'https://www.onet.pl/' },
        { url: 'https://tvn24.pl/' },
        { url: 'https://tvn24.pl/tvnwarszawa' },
        // { url: 'https://www.google.com/' }, // no data?
        // { url: 'https://www.yahoo.com/' }, // broken
        { url: 'https://www.amazon.com/' },
        { url: 'https://allegro.pl/' },
        { url: 'https://www.wtp.waw.pl/' }
    ])('snapshots for $url', async ({ url }) => {
        const response = await request(app).get(`/test?url=${url}`);

        const body = response.body as ImageResponseData;
        assert('image' in body);

        expect(response.status).toBe(200);
        expect(body).toStrictEqual({
            image: expect.toBeObject(),
            resolvedURL: url
        });
        expect(body.image).toMatchObject({
            imageDataUrl: expect.any(String),
            imageUrl: expect.any(String)
        });

        // not testing URL as it changes between data centers(?)
        expect(body.image.backgroundColor).toMatchSnapshot('backgroundColor');
        expect(body.image.imageDataUrl).toMatchSnapshot('imageDataUrl');
        expect(body.image.themeColor).toMatchSnapshot('themeColor');
    });
});
