import { describe, expect, it, vi } from 'vitest';
import type { Connection } from 'mongoose';
import { createRateLimiterStore } from '../src/config/rateLimiterStore';

describe('createRateLimiterStore', () => {
    it('throws an error when the rate limiter has not been initialized', () => {
        const store = createRateLimiterStore((_connection: Connection) => ({}));

        expect(() => store.get()).toThrow('Rate limiter has not been initialized.');
    });

    it('returns the initialized rate limiter', () => {
        const rateLimiter = { consume: vi.fn() };
        const createRateLimiter = vi.fn((_connection: Connection) => rateLimiter);
        const store = createRateLimiterStore(createRateLimiter);
        const connection = {} as Connection;

        store.init(connection);

        expect(createRateLimiter).toHaveBeenCalledWith(connection);
        expect(store.get()).toBe(rateLimiter);
    });
});
