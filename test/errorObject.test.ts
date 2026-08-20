import { describe, expect, it } from 'vitest';
import type { Request } from 'express';
import { NodeEnvironment } from '../src/constant/environment';
import responseMessage from '../src/constant/responseMessage';
import errorObject from '../src/util/errorObject';

const request = {
    ip: '127.0.0.1',
    method: 'GET',
    originalUrl: '/api/resource',
} as Request;

describe('errorObject', () => {
    it('converts an Error to the expected HTTP error', () => {
        const error = new Error('Resource unavailable');

        const result = errorObject(error, request, NodeEnvironment.DEVELOPMENT, 503);

        expect(result).toEqual({
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
    });

    it('uses a generic message and trace for an unknown value', () => {
        const result = errorObject('unexpected', request, NodeEnvironment.DEVELOPMENT);

        expect(result.statusCode).toBe(500);
        expect(result.message).toBe(responseMessage.SOMETHING_WENT_WRONG);
        expect(result.trace).toBeNull();
    });

    it('uses a generic message for an Error without a message', () => {
        const result = errorObject(new Error(), request, NodeEnvironment.DEVELOPMENT, 400);

        expect(result.statusCode).toBe(400);
        expect(result.message).toBe(responseMessage.SOMETHING_WENT_WRONG);
    });

    it('uses null when the request IP is unavailable', () => {
        const requestWithoutIp = {
            method: 'GET',
            originalUrl: '/api/resource',
        } as Request;

        const result = errorObject(
            new Error('Failure'),
            requestWithoutIp,
            NodeEnvironment.DEVELOPMENT,
        );

        expect(result.request.ip).toBeNull();
    });

    it('removes the request IP and trace from production errors', () => {
        const result = errorObject(new Error('Failure'), request, NodeEnvironment.PRODUCTION);

        expect(result.request).not.toHaveProperty('ip');
        expect(result).not.toHaveProperty('trace');
    });
});
