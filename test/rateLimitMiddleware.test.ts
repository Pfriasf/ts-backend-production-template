import { describe, expect, it, vi } from 'vitest';
import type { NextFunction, Request, Response } from 'express';
import { NodeEnvironment } from '../src/constant/environment';
import { createRateLimitMiddleware } from '../src/middleware/rateLimitMiddleware';

describe('createRateLimitMiddleware', () => {
    it('calls next without using the rate limiter in tests', async () => {
        const getRateLimiter = vi.fn(() => {
            throw new Error('getRateLimiter should not be called');
        });
        const handleError = vi.fn();
        const next = vi.fn<NextFunction>();
        const middleware = createRateLimitMiddleware({
            getEnvironment: () => NodeEnvironment.TEST,
            getRateLimiter,
            handleError,
        });

        await middleware({} as Request, {} as Response, next as unknown as NextFunction);

        expect(next).toHaveBeenCalledOnce();
        expect(getRateLimiter).not.toHaveBeenCalled();
        expect(handleError).not.toHaveBeenCalled();
    });

    it.each([NodeEnvironment.DEVELOPMENT, NodeEnvironment.PRODUCTION])(
        'consumes one point and calls next in %s',
        async (environment) => {
            const consume = vi.fn(() => Promise.resolve());
            const getRateLimiter = vi.fn(() => ({ consume }));
            const handleError = vi.fn();
            const next = vi.fn<NextFunction>();
            const middleware = createRateLimitMiddleware({
                getEnvironment: () => environment,
                getRateLimiter,
                handleError,
            });
            const req = { ip: '127.0.0.1' } as Request;

            await middleware(req, {} as Response, next as unknown as NextFunction);

            expect(getRateLimiter).toHaveBeenCalledOnce();
            expect(consume).toHaveBeenCalledWith('127.0.0.1', 1);
            expect(next).toHaveBeenCalledOnce();
            expect(handleError).not.toHaveBeenCalled();
        },
    );

    it('handles the error when the rate limit is exceeded', async () => {
        const consume = vi.fn(() => Promise.reject(new Error('Rate limit exceeded')));
        const getRateLimiter = vi.fn(() => ({ consume }));
        const handleError = vi.fn(
            (
                _error: Error,
                _req: Request,
                _res: Response,
                _next: NextFunction,
                _statusCode: number,
            ) => undefined,
        );
        const next = vi.fn<NextFunction>();
        const middleware = createRateLimitMiddleware({
            getEnvironment: () => NodeEnvironment.PRODUCTION,
            getRateLimiter,
            handleError,
        });
        const req = { ip: '127.0.0.1' } as Request;
        const res = {} as Response;

        await middleware(req, res, next as unknown as NextFunction);

        expect(next).not.toHaveBeenCalled();
        expect(handleError).toHaveBeenCalledWith(expect.any(Error), req, res, next, 429);
    });
});
