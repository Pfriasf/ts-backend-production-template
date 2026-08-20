import { describe, expect, it, vi } from 'vitest';
import os from 'node:os';
import config from '../src/config/config';
import healthUtil from '../src/util/healthUtil';

const MEGABYTE = 1024 * 1024;

describe('healthUtil', () => {
    it('returns the application health', () => {
        vi.spyOn(process, 'uptime').mockReturnValue(120.5);
        vi.spyOn(process, 'memoryUsage').mockReturnValue({
            rss: 100 * MEGABYTE,
            heapTotal: 50 * MEGABYTE,
            heapUsed: 25 * MEGABYTE,
            external: 0,
            arrayBuffers: 0,
        });

        const result = healthUtil.getApplicationHealth();

        expect(result).toEqual({
            environment: config.NODE_ENV,
            uptime: '120.50 Seconds',
            memoryUsage: {
                rss: '100.00 MB',
                heapTotal: '50.00 MB',
                heapUsed: '25.00 MB',
            },
        });
    });

    it('returns the system health', () => {
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
        vi.spyOn(os, 'loadavg').mockReturnValue([1, 2, 3]);
        vi.spyOn(os, 'cpus').mockReturnValue([cpu, cpu, cpu, cpu]);
        vi.spyOn(os, 'totalmem').mockReturnValue(1024 * MEGABYTE);
        vi.spyOn(os, 'freemem').mockReturnValue(256 * MEGABYTE);

        const result = healthUtil.getSystemHealth();

        expect(result).toEqual({
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
