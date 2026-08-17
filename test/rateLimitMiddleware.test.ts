import { describe, it, mock } from 'node:test';
import assert from 'node:assert/strict';
import type { NextFunction, Request, Response } from 'express';
import { applicationEnvironment } from '../src/constant/application';
import { createRateLimitMiddleware } from '../src/middleware/rateLimitMiddleware';

void describe('createRateLimitMiddleware', () => {
    void it('calls next once in development', async () => {
        const getRateLimiter = mock.fn(() => {
            throw new Error('getRateLimiter should not be called');
        });
        const handleError = mock.fn();
        const next = mock.fn<NextFunction>();
        const middleware = createRateLimitMiddleware({
            getEnvironment: () => applicationEnvironment.DEVELOPMENT,
            getRateLimiter,
            handleError,
        });

        await middleware({} as Request, {} as Response, next);

        assert.equal(next.mock.callCount(), 1);
        assert.equal(getRateLimiter.mock.callCount(), 0);
        assert.equal(handleError.mock.callCount(), 0);
    });

    void it('consumes one point and calls next in production', async () => {
        const consume = mock.fn(() => Promise.resolve());
        const getRateLimiter = mock.fn(() => ({ consume }));
        const handleError = mock.fn();
        const next = mock.fn<NextFunction>();
        const middleware = createRateLimitMiddleware({
            getEnvironment: () => applicationEnvironment.PRODUCTION,
            getRateLimiter,
            handleError,
        });
        const req = { ip: '127.0.0.1' } as Request;

        await middleware(req, {} as Response, next);

        assert.equal(getRateLimiter.mock.callCount(), 1);
        assert.deepEqual(consume.mock.calls[0]?.arguments, ['127.0.0.1', 1]);
        assert.equal(next.mock.callCount(), 1);
        assert.equal(handleError.mock.callCount(), 0);
    });

    void it('handles the error when the rate limit is exceeded', async () => {
        const consume = mock.fn(() => Promise.reject(new Error('Rate limit exceeded')));
        const getRateLimiter = mock.fn(() => ({ consume }));
        const handleError = mock.fn(
            (
                _error: Error,
                _req: Request,
                _res: Response,
                _next: NextFunction,
                _statusCode: number,
            ) => undefined,
        );
        const next = mock.fn<NextFunction>();
        const middleware = createRateLimitMiddleware({
            getEnvironment: () => applicationEnvironment.PRODUCTION,
            getRateLimiter,
            handleError,
        });
        const req = { ip: '127.0.0.1' } as Request;
        const res = {} as Response;

        await middleware(req, res, next);

        assert.equal(next.mock.callCount(), 0);
        assert.equal(handleError.mock.callCount(), 1);
        assert.equal(handleError.mock.calls[0]?.arguments[1], req);
        assert.equal(handleError.mock.calls[0]?.arguments[2], res);
        assert.equal(handleError.mock.calls[0]?.arguments[3], next);
        assert.equal(handleError.mock.calls[0]?.arguments[4], 429);
    });
});
