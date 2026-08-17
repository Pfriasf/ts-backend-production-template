import { describe, it, mock } from 'node:test';
import assert from 'node:assert/strict';
import type { NextFunction, Request, Response } from 'express';
import { createHealthController } from '../src/controller/healthControllerHandler';
import { applicationEnvironment } from '../src/constant/application';
import responseMessage from '../src/constant/responseMessage';
import type { ApplicationHealth, HandleError, SystemHealth } from '../src/types/types';

const applicationHealth: ApplicationHealth = {
    environment: applicationEnvironment.PRODUCTION,
    uptime: '120.00 Seconds',
    memoryUsage: {
        rss: '100.00 MB',
        heapTotal: '50.00 MB',
        heapUsed: '25.00 MB',
    },
};

const systemHealth: SystemHealth = {
    cpuLoad: {
        last1Minute: '25.00%',
        last5Minutes: '50.00%',
        last15Minutes: '75.00%',
    },
    totalMemory: '1024.00 MB',
    freeMemory: '256.00 MB',
};

void describe('createHealthController', () => {
    void it('sends the application and system health', () => {
        const sendResponse = mock.fn();
        const handleError = mock.fn();
        const healthController = createHealthController({
            sendResponse,
            handleError,
            getApplicationHealth: () => applicationHealth,
            getSystemHealth: () => systemHealth,
            getTimestamp: () => '2026-08-17T10:00:00.000Z',
        });
        const req = {} as Request;
        const res = {} as Response;
        const next = mock.fn<NextFunction>();

        healthController.status(req, res, next);

        assert.deepEqual(sendResponse.mock.calls[0]?.arguments, [
            req,
            res,
            200,
            responseMessage.SUCCESS,
            {
                application: applicationHealth,
                system: systemHealth,
                timestamp: '2026-08-17T10:00:00.000Z',
            },
        ]);
        assert.equal(handleError.mock.callCount(), 0);
    });

    void it('handles errors while collecting health data', () => {
        const error = new Error('Health check failed');
        const sendResponse = mock.fn();
        const handleError = mock.fn<HandleError>();
        const healthController = createHealthController({
            sendResponse,
            handleError,
            getApplicationHealth: () => {
                throw error;
            },
            getSystemHealth: () => systemHealth,
            getTimestamp: () => '2026-08-17T10:00:00.000Z',
        });
        const req = {} as Request;
        const res = {} as Response;
        const next = mock.fn<NextFunction>();

        healthController.status(req, res, next);

        assert.equal(sendResponse.mock.callCount(), 0);
        assert.deepEqual(handleError.mock.calls[0]?.arguments, [error, req, res, next, 500]);
    });
});
