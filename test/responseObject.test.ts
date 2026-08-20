import { describe, expect, it } from 'vitest';
import type { Request } from 'express';
import { NodeEnvironment } from '../src/constant/environment';
import responseObject from '../src/util/responseObject';

describe('responseObject', () => {
    it('builds a successful response with null data by default', () => {
        const req = {
            ip: '127.0.0.1',
            method: 'GET',
            originalUrl: '/api/health',
        } as Request;

        const result = responseObject(req, 200, 'Success', NodeEnvironment.DEVELOPMENT);

        expect(result).toEqual({
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
    });

    it('includes the provided data', () => {
        const data = { status: 'healthy' };
        const req = {
            method: 'GET',
            originalUrl: '/api/health',
        } as Request;

        const result = responseObject(req, 200, 'Success', NodeEnvironment.DEVELOPMENT, data);

        expect(result.data).toBe(data);
    });

    it('uses null when the request IP is unavailable', () => {
        const req = {
            method: 'GET',
            originalUrl: '/api/health',
        } as Request;

        const result = responseObject(req, 200, 'Success', NodeEnvironment.DEVELOPMENT);

        expect(result.request.ip).toBeNull();
    });

    it('removes the request IP from production responses', () => {
        const req = {
            ip: '127.0.0.1',
            method: 'POST',
            originalUrl: '/api',
        } as Request;

        const result = responseObject(req, 201, 'Created', NodeEnvironment.PRODUCTION);

        expect(result.request).not.toHaveProperty('ip');
    });
});
