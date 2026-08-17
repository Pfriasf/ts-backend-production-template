import { describe, it, mock } from 'node:test';
import assert from 'node:assert/strict';
import type { NextFunction, Request, Response } from 'express';
import type { HttpError } from '../src/types/types';
import { createHttpError } from '../src/util/httpErrorHandler';

void describe('createHttpError', () => {
    void it('builds the error and passes it to next', () => {
        const errorObject: HttpError = {
            success: false,
            statusCode: 404,
            request: {
                method: 'GET',
                url: '/api/missing',
            },
            message: 'Not found',
            data: null,
        };
        const buildError = mock.fn(() => errorObject);
        const next = mock.fn<NextFunction>();
        const httpError = createHttpError(buildError);
        const error = new Error('Not found');
        const req = {} as Request;

        httpError(error, req, {} as Response, next, 404);

        assert.deepEqual(buildError.mock.calls[0]?.arguments, [error, req, 404]);
        assert.deepEqual(next.mock.calls[0]?.arguments, [errorObject]);
    });
});
