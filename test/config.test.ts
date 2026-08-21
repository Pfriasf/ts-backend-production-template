import { describe, expect, it } from 'vitest';
import { NodeEnvironment } from '../src/constant/environment';
import { parseEnvironment } from '../src/config/environmentSchema';

const validEnvironment: NodeJS.ProcessEnv = {
    PORT: '3001',
    NODE_ENV: NodeEnvironment.DEVELOPMENT,
    SERVER_URL: 'http://localhost',
    DB_URL: 'mongodb://localhost:27017/database',
    CORS_ORIGINS: 'http://localhost:3000',
};

describe('parseEnvironment', () => {
    it('parses required values and applies optional defaults', () => {
        const config = parseEnvironment(validEnvironment);

        expect(config).toEqual({
            PORT: 3001,
            NODE_ENV: NodeEnvironment.DEVELOPMENT,
            SERVER_URL: 'http://localhost',
            LOG_LEVEL: 'info',
            LOG_TRANSPORTS: ['console'],
            DB_URL: 'mongodb://localhost:27017/database',
            RATE_LIMIT_POINTS: 10,
            RATE_LIMIT_DURATION: 60,
            CORS_ORIGINS: ['http://localhost:3000'],
        });
    });

    it('parses and deduplicates log transports', () => {
        const config = parseEnvironment({
            ...validEnvironment,
            LOG_TRANSPORTS: 'console, file, mongodb, console',
        });

        expect(config.LOG_TRANSPORTS).toEqual(['console', 'file', 'mongodb']);
    });

    it('rejects an unsupported log transport', () => {
        expect(() =>
            parseEnvironment({ ...validEnvironment, LOG_TRANSPORTS: 'console,cloudwatch' }),
        ).toThrow();
    });

    it('parses numeric values and multiple CORS origins', () => {
        const config = parseEnvironment({
            ...validEnvironment,
            PORT: '4000',
            RATE_LIMIT_POINTS: '20',
            RATE_LIMIT_DURATION: '120',
            CORS_ORIGINS: 'https://example.com, https://admin.example.com',
        });

        expect(config.PORT).toBe(4000);
        expect(config.RATE_LIMIT_POINTS).toBe(20);
        expect(config.RATE_LIMIT_DURATION).toBe(120);
        expect(config.CORS_ORIGINS).toEqual(['https://example.com', 'https://admin.example.com']);
    });

    it.each([
        ['PORT', 'abc'],
        ['PORT', '0'],
        ['PORT', '65536'],
        ['RATE_LIMIT_POINTS', '-10'],
        ['RATE_LIMIT_DURATION', '0'],
    ])('rejects an invalid %s value', (name, value) => {
        expect(() => parseEnvironment({ ...validEnvironment, [name]: value })).toThrow();
    });

    it('rejects an unsupported environment', () => {
        expect(() => parseEnvironment({ ...validEnvironment, NODE_ENV: 'preview' })).toThrow();
    });

    it('rejects invalid application URLs', () => {
        expect(() => parseEnvironment({ ...validEnvironment, SERVER_URL: 'localhost' })).toThrow();
        expect(() =>
            parseEnvironment({ ...validEnvironment, DB_URL: 'https://example.com' }),
        ).toThrow();
        expect(() => parseEnvironment({ ...validEnvironment, DB_URL: '' })).toThrow();
        expect(() =>
            parseEnvironment({ ...validEnvironment, CORS_ORIGINS: 'not-a-url' }),
        ).toThrow();
    });

    it.each(['PORT', 'NODE_ENV', 'SERVER_URL', 'DB_URL', 'CORS_ORIGINS'])('requires %s', (name) => {
        const incompleteEnvironment = { ...validEnvironment };
        delete incompleteEnvironment[name];

        expect(() => parseEnvironment(incompleteEnvironment)).toThrow();
    });

    it('accepts a production configuration', () => {
        const config = parseEnvironment({
            ...validEnvironment,
            NODE_ENV: NodeEnvironment.PRODUCTION,
            SERVER_URL: 'https://api.example.com',
            DB_URL: 'mongodb+srv://cluster.example.com/database',
            CORS_ORIGINS: 'https://example.com',
        });

        expect(config.NODE_ENV).toBe(NodeEnvironment.PRODUCTION);
    });
});
