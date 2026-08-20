import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        include: ['test/**/*.test.ts'],
        exclude: ['dist/**'],
        restoreMocks: true,
        env: {
            PORT: '3001',
            ENV: 'development',
            SERVER_URL: 'http://localhost',
            DB_URL: 'mongodb://localhost:27017/database',
            CORS_ORIGINS: 'http://localhost:3000',
        },
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
