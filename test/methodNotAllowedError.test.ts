import { describe, it, mock } from 'node:test';
import assert from 'node:assert/strict';
import type { NextFunction, Request, Response } from 'express';
import responseMessage from '../src/constant/responseMessage';
import { createMethodNotAllowedError } from '../src/util/methodNotAllowedErrorHandler';

void describe('createMethodNotAllowedError', () => {
    void it('creates a 405 error for a disallowed method', () => {
        const httpError = mock.fn(
            (
                _error: Error,
                _req: Request,
                _res: Response,
                _next: NextFunction,
                _statusCode: number,
            ) => undefined,
        );
        const methodNotAllowedError = createMethodNotAllowedError(httpError);
        const req = {} as Request;
        const res = {} as Response;
        const next = mock.fn<NextFunction>();

        methodNotAllowedError(req, res, next);

        const [error, receivedReq, receivedRes, receivedNext, statusCode] =
            httpError.mock.calls[0]?.arguments ?? [];
        assert.equal(error?.message, responseMessage.METHOD_NOT_ALLOWED);
        assert.equal(receivedReq, req);
        assert.equal(receivedRes, res);
        assert.equal(receivedNext, next);
        assert.equal(statusCode, 405);
    });
});
