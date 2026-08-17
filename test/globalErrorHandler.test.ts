import { describe, it, mock } from 'node:test';
import assert from 'node:assert/strict';
import type { NextFunction, Request, Response } from 'express';
import globalErrorHandler from '../src/middleware/globalErrorHandler';
import type { HttpError } from '../src/types/types';

void describe('globalErrorHandler', () => {
    void it('sends the error with its status code', () => {
        const error: HttpError = {
            success: false,
            statusCode: 404,
            request: {
                method: 'GET',
                url: '/api/missing',
            },
            message: 'Not found',
            data: null,
        };
        const json = mock.fn();
        const status = mock.fn(() => ({ json }) as unknown as Response);
        const res = { status } as unknown as Response;

        globalErrorHandler(error, {} as Request, res, mock.fn<NextFunction>());

        assert.deepEqual(status.mock.calls[0]?.arguments, [404]);
        assert.deepEqual(json.mock.calls[0]?.arguments, [error]);
    });
});
