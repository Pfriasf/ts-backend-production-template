import type { Connection } from 'mongoose';
import { RateLimiterMongo } from 'rate-limiter-flexible';
import { createRateLimiterStore } from './rateLimiterStore';
import config from './config';

const rateLimiterStore = createRateLimiterStore(
    (mongooseConnection: Connection) =>
        new RateLimiterMongo({
            storeClient: mongooseConnection,
            points: config.RATE_LIMIT_POINTS,
            duration: config.RATE_LIMIT_DURATION,
        }),
);

export const initRateLimiter = rateLimiterStore.init;
export const getRateLimiter = rateLimiterStore.get;
