import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { applicationEnvironment } from '../src/constant/application';
import { shouldBypassRateLimit } from '../src/middleware/rateLimitPolicy';

void describe('shouldBypassRateLimit', () => {
    void it('bypasses rate limiting in development', () => {
        const result = shouldBypassRateLimit(applicationEnvironment.DEVELOPMENT);

        assert.equal(result, true);
    });

    void it('enforces rate limiting in production', () => {
        const result = shouldBypassRateLimit(applicationEnvironment.PRODUCTION);

        assert.equal(result, false);
    });
});
