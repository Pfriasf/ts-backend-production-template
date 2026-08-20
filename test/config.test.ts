import { afterEach, describe, expect, it, vi } from 'vitest';
import { applicationEnvironment } from '../src/constant/application';
import type { Config } from '../src/types/types';

describe('config', () => {
    afterEach(() => {
        vi.unstubAllEnvs();
        vi.resetModules();
    });

    it('falls back to development when ENV is unsupported', async () => {
        vi.stubEnv('ENV', 'preview');

        const configModule = await import('../src/config/config.js');
        const config = configModule.default as unknown as Config;

        expect(config.ENV).toBe(applicationEnvironment.DEVELOPMENT);
    });
});
