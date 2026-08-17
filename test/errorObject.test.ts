import { describe, it, mock } from 'node:test';
import assert from 'node:assert/strict';
import type { Request } from 'express';
import { applicationEnvironment } from '../src/constant/application';
import responseMessage from '../src/constant/responseMessage';
import type { HttpError } from '../src/types/types';
import { createErrorObject } from '../src/util/errorObject';

const request = {
    ip: '127.0.0.1',
    method: 'GET',
    originalUrl: '/api/resource',
} as Request;

void describe('createErrorObject', () => {
    void it('converts an Error to the expected HTTP error', () => {
        const logError = mock.fn();
        const errorObject = createErrorObject({
            getEnvironment: () => applicationEnvironment.DEVELOPMENT,
            logError,
        });
        const error = new Error('Resource unavailable');

        const result = errorObject(error, request, 503);

        assert.deepEqual(result, {
            success: false,
            statusCode: 503,
            request: {
                ip: '127.0.0.1',
                method: 'GET',
                url: '/api/resource',
            },
            message: 'Resource unavailable',
            data: null,
            trace: { error: error.stack },
        });
        assert.equal(logError.mock.callCount(), 1);
        assert.equal(logError.mock.calls[0]?.arguments[0], 'CONTROLLER_ERROR');
    });

    void it('uses a generic message and trace for an unknown value', () => {
        const errorObject = createErrorObject({
            getEnvironment: () => applicationEnvironment.LOCAL,
            logError: mock.fn(),
        });

        const result = errorObject('unexpected', request);

        assert.equal(result.statusCode, 500);
        assert.equal(result.message, responseMessage.SOMETHING_WENT_WRONG);
        assert.equal(result.trace, null);
    });

    void it('uses a generic message for an Error without a message', () => {
        const errorObject = createErrorObject({
            getEnvironment: () => applicationEnvironment.STAGING,
            logError: mock.fn(),
        });

        const result = errorObject(new Error(), request, 400);

        assert.equal(result.statusCode, 400);
        assert.equal(result.message, responseMessage.SOMETHING_WENT_WRONG);
    });

    void it('removes the request IP and trace from production errors', () => {
        const errorObject = createErrorObject({
            getEnvironment: () => applicationEnvironment.PRODUCTION,
            logError: mock.fn(),
        });

        const result = errorObject(new Error('Failure'), request);

        assert.equal('ip' in result.request, false);
        assert.equal('trace' in result, false);
    });

    void it('does not log the request IP and trace in production', () => {
        let loggedError: HttpError | undefined;
        const logError = mock.fn((_message: string, metadata: { meta: HttpError }) => {
            loggedError = structuredClone(metadata.meta);
        });
        const errorObject = createErrorObject({
            getEnvironment: () => applicationEnvironment.PRODUCTION,
            logError,
        });

        errorObject(new Error('Failure'), request);

        assert.equal(logError.mock.callCount(), 1);
        assert.ok(loggedError);
        assert.equal('ip' in loggedError.request, false);
        assert.equal('trace' in loggedError, false);
    });
});
