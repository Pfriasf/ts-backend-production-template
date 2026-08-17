import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { applicationEnvironment } from '../src/constant/application';
import { isApplicationEnvironment } from '../src/util/envUtil';

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
