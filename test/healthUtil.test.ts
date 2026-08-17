import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import config from '../src/config/config';
import healthUtil from '../src/util/healthUtil';

const MEGABYTE = 1024 * 1024;

void describe('healthUtil', () => {
    void it('returns the application health', (context) => {
        context.mock.method(process, 'uptime', () => 120.5);
        context.mock.method(process, 'memoryUsage', () => ({
            rss: 100 * MEGABYTE,
            heapTotal: 50 * MEGABYTE,
            heapUsed: 25 * MEGABYTE,
            external: 0,
            arrayBuffers: 0,
        }));

        const result = healthUtil.getApplicationHealth();

        assert.deepEqual(result, {
            environment: config.ENV,
            uptime: '120.50 Seconds',
            memoryUsage: {
                rss: '100.00 MB',
                heapTotal: '50.00 MB',
                heapUsed: '25.00 MB',
            },
        });
    });
});
