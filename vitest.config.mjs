import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        include: ['test/**/*.test.ts'],
        exclude: ['dist/**'],
        restoreMocks: true,
        coverage: {
            provider: 'v8',
            include: ['src/**/*.ts'],
            exclude: ['src/types/**', 'src/server.ts', 'src/util/logger.ts'],
            thresholds: {
                lines: 80,
                branches: 75,
                functions: 80,
            },
        },
    },
});
