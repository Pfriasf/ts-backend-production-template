import { after, before, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { request, type Server } from 'node:http';
import { once } from 'node:events';
import type { HttpResponse } from '../src/types/types';
import app from '../src/app';

let server: Server | undefined;
let baseUrl: string;
const host = '127.0.0.1';

const sendRequest = (path: string, method = 'GET') => {
    return new Promise<{ statusCode: number; body: string }>((resolve, reject) => {
        const req = request(new URL(path, baseUrl), { method, agent: false }, (response) => {
            const chunks: Buffer[] = [];

            response.on('data', (chunk: Buffer) => chunks.push(chunk));
            response.on('end', () => {
                resolve({
                    statusCode: response.statusCode ?? 0,
                    body: Buffer.concat(chunks).toString('utf8'),
                });
            });
        });

        req.on('error', reject);
        req.end();
    });
};

void before(async () => {
    server = app.listen(0, host);
    await once(server, 'listening');

    const address = server.address();
    assert.ok(address && typeof address !== 'string');
    baseUrl = `http://${host}:${address.port}`;
});

void after(async () => {
    if (!server?.listening) {
        return;
    }

    await new Promise<void>((resolve, reject) => {
        server?.close((error) => {
            if (error) {
                reject(error);
                return;
            }

            resolve();
        });
    });
});

void describe('app integration', () => {
    void it('responds to the API root', async () => {
        const response = await sendRequest('/api');

        assert.equal(response.statusCode, 200);
    });

    void it('responds with health data', async () => {
        const response = await sendRequest('/api/health');
        const body = JSON.parse(response.body) as HttpResponse;

        assert.equal(response.statusCode, 200);
        assert.ok(body.data);
    });

    void it('responds with 404 for an unknown route', async () => {
        const response = await sendRequest('/unknown');

        assert.equal(response.statusCode, 404);
    });

    void it('responds with 405 for a disallowed method', async () => {
        const response = await sendRequest('/api', 'POST');

        assert.equal(response.statusCode, 405);
    });

    void it('uses the standard API response format', async () => {
        const response = await sendRequest('/api');
        const body = JSON.parse(response.body) as HttpResponse;

        assert.equal(body.success, true);
        assert.equal(body.statusCode, 200);
        assert.equal(body.request.method, 'GET');
        assert.equal(body.request.url, '/api');
        assert.equal(typeof body.message, 'string');
        assert.equal(body.data, null);
    });
});
