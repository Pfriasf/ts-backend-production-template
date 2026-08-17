import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import os from 'node:os';
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

    void it('returns the system health', (context) => {
        const cpu = {
            model: 'Test CPU',
            speed: 1000,
            times: {
                user: 0,
                nice: 0,
                sys: 0,
                idle: 0,
                irq: 0,
            },
        };
        context.mock.method(os, 'loadavg', () => [1, 2, 3]);
        context.mock.method(os, 'cpus', () => [cpu, cpu, cpu, cpu]);
        context.mock.method(os, 'totalmem', () => 1024 * MEGABYTE);
        context.mock.method(os, 'freemem', () => 256 * MEGABYTE);

        const result = healthUtil.getSystemHealth();

        assert.deepEqual(result, {
            cpuLoad: {
                last1Minute: '25.00%',
                last5Minutes: '50.00%',
                last15Minutes: '75.00%',
            },
            totalMemory: '1024.00 MB',
            freeMemory: '256.00 MB',
        });
    });
});
