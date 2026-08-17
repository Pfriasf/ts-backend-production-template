import type { Connection } from 'mongoose';

export const createRateLimiterStore = <TRateLimiter>(
    createRateLimiter: (mongooseConnection: Connection) => TRateLimiter,
) => {
    let rateLimiter: TRateLimiter | undefined;

    return {
        init: (mongooseConnection: Connection): void => {
            rateLimiter = createRateLimiter(mongooseConnection);
        },
        get: (): TRateLimiter => {
            if (!rateLimiter) {
                throw new Error('Rate limiter has not been initialized.');
            }

            return rateLimiter;
        },
    };
};
