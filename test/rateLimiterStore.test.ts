import { describe, it } from 'node:test';
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
});
