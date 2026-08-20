import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Request, Response } from 'express';
import { NodeEnvironment } from '../src/constant/environment';
import responseMessage from '../src/constant/responseMessage';
import type { ApplicationHealth, SystemHealth } from '../src/types/types';
import type healthUtil from '../src/util/healthUtil';
import type httpError from '../src/util/httpError';
import type httpResponse from '../src/util/httpResponse';

const applicationHealth: ApplicationHealth = {
    environment: NodeEnvironment.DEVELOPMENT,
    uptime: '10.00 Seconds',
    memoryUsage: {
        rss: '10.00 MB',
        heapTotal: '8.00 MB',
        heapUsed: '4.00 MB',
    },
};

const systemHealth: SystemHealth = {
    cpuLoad: {
        last1Minute: '10.00%',
        last5Minutes: '20.00%',
        last15Minutes: '30.00%',
    },
    totalMemory: '1024.00 MB',
    freeMemory: '512.00 MB',
};

type HealthResponseData = {
    application: ApplicationHealth;
    system: SystemHealth;
    timestamp: string;
};

const mocks = vi.hoisted(() => ({
    connection: { readyState: 1 },
    getRateLimiter: vi.fn(),
    httpResponse: vi.fn<typeof httpResponse>(),
    httpError: vi.fn<typeof httpError>(),
    getApplicationHealth: vi.fn<typeof healthUtil.getApplicationHealth>(),
    getSystemHealth: vi.fn<typeof healthUtil.getSystemHealth>(),
}));

vi.mock('mongoose', () => ({
    default: {
        connection: mocks.connection,
        ConnectionStates: { connected: 1 },
    },
}));
vi.mock('../src/config/rateLimiter', () => ({
    getRateLimiter: mocks.getRateLimiter,
}));
vi.mock('../src/util/httpResponse', () => ({ default: mocks.httpResponse }));
vi.mock('../src/util/httpError', () => ({ default: mocks.httpError }));
vi.mock('../src/util/healthUtil', () => ({
    default: {
        getApplicationHealth: mocks.getApplicationHealth,
        getSystemHealth: mocks.getSystemHealth,
    },
}));

import healthController from '../src/controller/healthController';

describe('healthController', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mocks.getApplicationHealth.mockReturnValue(applicationHealth);
        mocks.getSystemHealth.mockReturnValue(systemHealth);
        mocks.connection.readyState = 1;
        mocks.getRateLimiter.mockReturnValue({});
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('sends the application and system health', () => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date('2026-08-17T10:00:00.000Z'));
        const req = {} as Request;
        const res = {} as Response;
        const next = vi.fn();

        healthController.health(req, res, next);

        const [receivedReq, receivedRes, statusCode, message, responseData] =
            mocks.httpResponse.mock.calls[0] ?? [];
        const data = responseData as HealthResponseData;
        expect(receivedReq).toBe(req);
        expect(receivedRes).toBe(res);
        expect(statusCode).toBe(200);
        expect(message).toBe(responseMessage.SUCCESS);
        expect(data.application).toEqual(applicationHealth);
        expect(data.system).toEqual(systemHealth);
        expect(data.timestamp).toBe('2026-08-17T10:00:00.000Z');
        expect(mocks.httpError).not.toHaveBeenCalled();
    });

    it('handles errors while collecting health data', () => {
        const error = new Error('Health unavailable');
        mocks.getApplicationHealth.mockImplementationOnce(() => {
            throw error;
        });
        const req = {} as Request;
        const res = {} as Response;
        const next = vi.fn();

        healthController.health(req, res, next);

        expect(mocks.httpResponse).not.toHaveBeenCalled();
        expect(mocks.httpError).toHaveBeenCalledWith(error, req, res, next, 500);
    });

    it('reports that dependencies are ready', () => {
        const req = {} as Request;
        const res = {} as Response;
        const next = vi.fn();

        healthController.readiness(req, res, next);

        expect(mocks.httpResponse).toHaveBeenCalledWith(req, res, 200, responseMessage.SUCCESS, {
            database: 'connected',
            rateLimiter: 'initialized',
        });
        expect(mocks.httpError).not.toHaveBeenCalled();
    });

    it('reports that the database is unavailable', () => {
        mocks.connection.readyState = 0;
        const req = {} as Request;
        const res = {} as Response;
        const next = vi.fn();

        healthController.readiness(req, res, next);

        const [error] = mocks.httpError.mock.calls[0] ?? [];
        expect((error as Error).message).toBe(responseMessage.SERVICE_UNAVAILABLE);
        expect(mocks.httpError).toHaveBeenCalledWith(error, req, res, next, 503);
        expect(mocks.getRateLimiter).not.toHaveBeenCalled();
    });

    it('reports that the rate limiter is unavailable', () => {
        const error = new Error('Rate limiter unavailable');
        mocks.getRateLimiter.mockImplementationOnce(() => {
            throw error;
        });
        const req = {} as Request;
        const res = {} as Response;
        const next = vi.fn();

        healthController.readiness(req, res, next);

        expect(mocks.httpResponse).not.toHaveBeenCalled();
        expect(mocks.httpError).toHaveBeenCalledWith(error, req, res, next, 503);
    });
});
