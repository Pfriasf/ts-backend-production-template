import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { applicationEnvironment } from '../src/constant/application';
import { isApplicationEnvironment, shouldBypassExternalServices } from '../src/util/envUtil';

void describe('isApplicationEnvironment', () => {
    for (const environment of Object.values(applicationEnvironment)) {
        void it(`accepts the ${environment} environment`, () => {
            const result = isApplicationEnvironment(environment);

            assert.equal(result, true);
        });
    }

    void it('rejects an unsupported environment', () => {
        const result = isApplicationEnvironment('preview');

        assert.equal(result, false);
    });
});

void describe('shouldBypassExternalServices', () => {
    void it('bypasses external services in development', () => {
        assert.equal(shouldBypassExternalServices(applicationEnvironment.DEVELOPMENT), true);
    });

    void it('uses external services in production', () => {
        assert.equal(shouldBypassExternalServices(applicationEnvironment.PRODUCTION), false);
    });
});
