import { Connection } from 'mongoose';
import { RateLimiterMongo } from 'rate-limiter-flexible';

let rateLimiterMongo: RateLimiterMongo | undefined;

const DURATION = 60;
const POINTS = 10;

export const initRateLimiter = (mongooseConnection: Connection) => {
    rateLimiterMongo = new RateLimiterMongo({
        storeClient: mongooseConnection,
        points: POINTS,
        duration: DURATION,
    });
};

export const getRateLimiter = (): RateLimiterMongo => {
    if (!rateLimiterMongo) {
        throw new Error('Rate limiter has not been initialized.');
    }

    return rateLimiterMongo;
};
