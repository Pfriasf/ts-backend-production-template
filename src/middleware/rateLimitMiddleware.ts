import type { NextFunction, Request, Response } from 'express';
import type { applicationEnvironment } from '../constant/application';
import responseMessage from '../constant/responseMessage';
import { shouldBypassRateLimit } from './rateLimitPolicy';

type RateLimiter = {
    consume: (key: string, points: number) => Promise<unknown>;
};

type RateLimitErrorHandler = (
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction,
    statusCode: number,
) => void;

type RateLimitDependencies = {
    getEnvironment: () => applicationEnvironment;
    getRateLimiter: () => RateLimiter;
    handleError: RateLimitErrorHandler;
};

export const createRateLimitMiddleware = (dependencies: RateLimitDependencies) => {
    return (req: Request, res: Response, next: NextFunction): void | Promise<void> => {
        if (shouldBypassRateLimit(dependencies.getEnvironment())) {
            next();
            return;
        }

        const rateLimiter = dependencies.getRateLimiter();
        return rateLimiter
            .consume(req.ip as string, 1)
            .then(() => {
                next();
            })
            .catch(() => {
                const error = new Error(responseMessage.TOO_MANY_REQUESTS);
                dependencies.handleError(error, req, res, next, 429);
            });
    };
};
