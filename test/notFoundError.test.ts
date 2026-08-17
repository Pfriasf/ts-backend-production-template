import { describe, it, mock } from 'node:test';
import assert from 'node:assert/strict';
import type { NextFunction, Request, Response } from 'express';
import responseMessage from '../src/constant/responseMessage';
import { createNotFoundError } from '../src/util/notFoundErrorHandler';

void describe('createNotFoundError', () => {
    void it('creates a 404 error for a missing route', () => {
        const httpError = mock.fn(
            (
                _error: Error,
                _req: Request,
                _res: Response,
                _next: NextFunction,
                _statusCode: number,
            ) => undefined,
        );
        const notFoundError = createNotFoundError(httpError);
        const req = { originalUrl: '/api/missing' } as Request;
        const res = {} as Response;
        const next = mock.fn<NextFunction>();

        notFoundError.route(req, res, next);

        const [error, receivedReq, receivedRes, receivedNext, statusCode] =
            httpError.mock.calls[0]?.arguments ?? [];
        assert.equal(error?.message, responseMessage.NOT_FOUND_ROUTE('/api/missing'));
        assert.equal(receivedReq, req);
        assert.equal(receivedRes, res);
        assert.equal(receivedNext, next);
        assert.equal(statusCode, 404);
    });

    void it('creates a 404 error for a missing entity', () => {
        const httpError = mock.fn(
            (
                _error: Error,
                _req: Request,
                _res: Response,
                _next: NextFunction,
                _statusCode: number,
            ) => undefined,
        );
        const notFoundError = createNotFoundError(httpError);
        const req = { params: { id: '123' } } as unknown as Request<{ id: string }>;
        const res = {} as Response;
        const next = mock.fn<NextFunction>();

        notFoundError.entity(req, res, next);

        const [error, receivedReq, receivedRes, receivedNext, statusCode] =
            httpError.mock.calls[0]?.arguments ?? [];
        assert.equal(error?.message, responseMessage.NOT_FOUND_ENTITY('123'));
        assert.equal(receivedReq, req);
        assert.equal(receivedRes, res);
        assert.equal(receivedNext, next);
        assert.equal(statusCode, 404);
    });
});
