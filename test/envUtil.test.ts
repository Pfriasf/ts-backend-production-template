import { describe, expect, it } from 'vitest';
import { NodeEnvironment } from '../src/constant/environment';
import { shouldBypassRateLimit } from '../src/util/envUtil';

describe('shouldBypassRateLimit', () => {
    it('uses the rate limiter in development', () => {
        expect(shouldBypassRateLimit(NodeEnvironment.DEVELOPMENT)).toBe(false);
    });

    it('bypasses the rate limiter in tests', () => {
        expect(shouldBypassRateLimit(NodeEnvironment.TEST)).toBe(true);
    });

    it('uses the rate limiter in production', () => {
        expect(shouldBypassRateLimit(NodeEnvironment.PRODUCTION)).toBe(false);
    });
});
