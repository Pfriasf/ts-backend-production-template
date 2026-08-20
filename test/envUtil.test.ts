import { describe, expect, it } from 'vitest';
import { applicationEnvironment } from '../src/constant/application';
import { isApplicationEnvironment, shouldBypassExternalServices } from '../src/util/envUtil';

describe('isApplicationEnvironment', () => {
    for (const environment of Object.values(applicationEnvironment)) {
        it(`accepts the ${environment} environment`, () => {
            const result = isApplicationEnvironment(environment);

            expect(result).toBe(true);
        });
    }

    it('rejects an unsupported environment', () => {
        const result = isApplicationEnvironment('preview');

        expect(result).toBe(false);
    });
});

describe('shouldBypassExternalServices', () => {
    it('bypasses external services in development', () => {
        expect(shouldBypassExternalServices(applicationEnvironment.DEVELOPMENT)).toBe(true);
    });

    it('uses external services in production', () => {
        expect(shouldBypassExternalServices(applicationEnvironment.PRODUCTION)).toBe(false);
    });
});
