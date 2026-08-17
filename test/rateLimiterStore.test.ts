import { describe, it, mock } from 'node:test';
import assert from 'node:assert/strict';
import type { Connection } from 'mongoose';
import { createRateLimiterStore } from '../src/config/rateLimiterStore';

void describe('createRateLimiterStore', () => {
    void it('throws an error when the rate limiter has not been initialized', () => {
        const store = createRateLimiterStore((_connection: Connection) => ({}));

        assert.throws(() => store.get(), {
            message: 'Rate limiter has not been initialized.',
        });
    });

    void it('returns the initialized rate limiter', () => {
        const rateLimiter = { consume: mock.fn() };
        const createRateLimiter = mock.fn((_connection: Connection) => rateLimiter);
        const store = createRateLimiterStore(createRateLimiter);
        const connection = {} as Connection;

        store.init(connection);

        assert.deepEqual(createRateLimiter.mock.calls[0]?.arguments, [connection]);
        assert.equal(store.get(), rateLimiter);
    });
});
