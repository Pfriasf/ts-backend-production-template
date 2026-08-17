import { describe, it, mock } from 'node:test';
import assert from 'node:assert/strict';
import type { Request } from 'express';
import { applicationEnvironment } from '../src/constant/application';
import type { HttpResponse } from '../src/types/types';
import { createResponseObject } from '../src/util/responseObject';

void describe('createResponseObject', () => {
    void it('builds a successful response with null data by default', () => {
        const logInfo = mock.fn();
        const responseObject = createResponseObject({
            getEnvironment: () => applicationEnvironment.DEVELOPMENT,
            logInfo,
        });
        const req = {
            ip: '127.0.0.1',
            method: 'GET',
            originalUrl: '/api/health',
        } as Request;

        const result = responseObject(req, 200, 'Success');

        assert.deepEqual(result, {
            success: true,
            statusCode: 200,
            request: {
                ip: '127.0.0.1',
                method: 'GET',
                url: '/api/health',
            },
            message: 'Success',
            data: null,
        });
        assert.equal(logInfo.mock.callCount(), 1);
        assert.equal(logInfo.mock.calls[0]?.arguments[0], 'CONTROLLER_RESPONSE');
    });

    void it('includes the provided data', () => {
        const responseObject = createResponseObject({
            getEnvironment: () => applicationEnvironment.STAGING,
            logInfo: mock.fn(),
        });
        const data = { status: 'healthy' };
        const req = {
            method: 'GET',
            originalUrl: '/api/health',
        } as Request;

        const result = responseObject(req, 200, 'Success', data);

        assert.equal(result.data, data);
        assert.equal(result.request.ip, null);
    });

    void it('removes the request IP from the production response', () => {
        const responseObject = createResponseObject({
            getEnvironment: () => applicationEnvironment.PRODUCTION,
            logInfo: mock.fn(),
        });
        const req = {
            ip: '127.0.0.1',
            method: 'POST',
            originalUrl: '/api',
        } as Request;

        const result = responseObject(req, 201, 'Created');

        assert.equal('ip' in result.request, false);
    });

    void it('does not log the request IP in production', () => {
        let loggedResponse: HttpResponse | undefined;
        const logInfo = mock.fn((_message: string, metadata: { meta: HttpResponse }) => {
            loggedResponse = structuredClone(metadata.meta);
        });
        const responseObject = createResponseObject({
            getEnvironment: () => applicationEnvironment.PRODUCTION,
            logInfo,
        });
        const req = {
            ip: '127.0.0.1',
            method: 'POST',
            originalUrl: '/api',
        } as Request;

        responseObject(req, 201, 'Created');

        assert.equal(logInfo.mock.callCount(), 1);
        assert.ok(loggedResponse);
        assert.equal('ip' in loggedResponse.request, false);
    });
});
