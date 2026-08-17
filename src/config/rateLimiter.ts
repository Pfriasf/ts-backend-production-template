import { Connection } from 'mongoose';
import { RateLimiterMongo } from 'rate-limiter-flexible';
import { createRateLimiterStore } from './rateLimiterStore';

const DURATION = 60;
const POINTS = 10;

const rateLimiterStore = createRateLimiterStore(
    (mongooseConnection: Connection) =>
        new RateLimiterMongo({
            storeClient: mongooseConnection,
            points: POINTS,
            duration: DURATION,
        }),
);

export const initRateLimiter = rateLimiterStore.init;
export const getRateLimiter = rateLimiterStore.get;
