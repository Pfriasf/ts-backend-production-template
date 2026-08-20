import { describe, expect, it } from 'vitest';
import { NodeEnvironment } from '../src/constant/environment';
import { shouldBypassRateLimit, shouldUseExternalLogTransports } from '../src/util/envUtil';

describe('shouldUseExternalLogTransports', () => {
    it('does not use external log transports in development', () => {
        expect(shouldUseExternalLogTransports(NodeEnvironment.DEVELOPMENT)).toBe(false);
    });

    it('does not use external log transports in tests', () => {
        expect(shouldUseExternalLogTransports(NodeEnvironment.TEST)).toBe(false);
    });

    it('uses external log transports in production', () => {
        expect(shouldUseExternalLogTransports(NodeEnvironment.PRODUCTION)).toBe(true);
    });
});

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
