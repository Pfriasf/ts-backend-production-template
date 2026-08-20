import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Connection } from 'mongoose';

const mocks = vi.hoisted(() => {
    const consumeMock = vi.fn();

    class FakeRateLimiterMongo {
        consume = consumeMock;
    }

    return {
        consumeMock,
        RateLimiterMongoMock: vi.fn(FakeRateLimiterMongo),
    };
});

vi.mock('rate-limiter-flexible', () => ({
    RateLimiterMongo: mocks.RateLimiterMongoMock,
}));
vi.mock('../src/config/config', () => ({
    default: {
        RATE_LIMIT_POINTS: 20,
        RATE_LIMIT_DURATION: 120,
    },
}));

import { getRateLimiter, initRateLimiter } from '../src/config/rateLimiter';

describe('rateLimiter', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('creates the Mongo rate limiter with the configured limits', () => {
        const connection = {} as Connection;

        initRateLimiter(connection);

        expect(mocks.RateLimiterMongoMock).toHaveBeenCalledWith({
            storeClient: connection,
            points: 20,
            duration: 120,
        });
        expect(getRateLimiter()).toMatchObject({ consume: mocks.consumeMock });
    });
});
