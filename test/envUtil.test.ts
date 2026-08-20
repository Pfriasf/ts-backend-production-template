import { describe, expect, it } from 'vitest';
import { NodeEnvironment } from '../src/constant/environment';
import { shouldBypassExternalServices } from '../src/util/envUtil';

describe('shouldBypassExternalServices', () => {
    it('bypasses external services in development', () => {
        expect(shouldBypassExternalServices(NodeEnvironment.DEVELOPMENT)).toBe(true);
    });

    it('bypasses external services in tests', () => {
        expect(shouldBypassExternalServices(NodeEnvironment.TEST)).toBe(true);
    });

    it('uses external services in production', () => {
        expect(shouldBypassExternalServices(NodeEnvironment.PRODUCTION)).toBe(false);
    });
});
