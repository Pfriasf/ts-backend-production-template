import { describe, expect, it } from 'vitest';
import request from 'supertest';
import type { HttpResponse } from '../src/types/types';
import app from '../src/app';

describe('app integration', () => {
    it('responds to the API root', async () => {
        const response = await request(app).get('/api');

        expect(response.status).toBe(200);
    });

    it('responds with health data', async () => {
        const response = await request(app).get('/api/health');
        const body = response.body as HttpResponse;

        expect(response.status).toBe(200);
        expect(body.data).toBeTruthy();
    });

    it('reports when the application is not ready', async () => {
        const response = await request(app).get('/api/readiness');

        expect(response.status).toBe(503);
    });

    it('responds with 404 for an unknown route', async () => {
        const response = await request(app).get('/unknown');

        expect(response.status).toBe(404);
    });

    it('responds with 405 for a disallowed method', async () => {
        const response = await request(app).post('/api');

        expect(response.status).toBe(405);
    });

    it('uses the standard API response format', async () => {
        const response = await request(app).get('/api');
        const body = response.body as HttpResponse;

        expect(body.success).toBe(true);
        expect(body.statusCode).toBe(200);
        expect(body.request.method).toBe('GET');
        expect(body.request.url).toBe('/api');
        expect(body.message).toEqual(expect.any(String));
        expect(body.data).toBeNull();
    });

    it('sets security headers', async () => {
        const response = await request(app).get('/api');

        expect(response.headers['x-content-type-options']).toBe('nosniff');
    });

    it('allows the configured CORS origin', async () => {
        const response = await request(app).get('/api').set('Origin', 'http://localhost:3000');

        expect(response.headers['access-control-allow-origin']).toBe('http://localhost:3000');
        expect(response.headers['access-control-allow-credentials']).toBe('true');
    });
});
