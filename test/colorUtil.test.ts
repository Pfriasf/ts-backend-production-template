import { describe, expect, it } from 'vitest';
import { colorizeLevel } from '../src/util/colorUtil';

describe('colorizeLevel', () => {
    it.each(['error', 'warn', 'info', 'http', 'verbose', 'debug', 'silly'])(
        'formats the %s log level in uppercase',
        (level) => {
            expect(colorizeLevel(level)).toContain(level.toUpperCase());
        },
    );

    it('returns the original value when the log level has no configured color', () => {
        expect(colorizeLevel('custom')).toBe('custom');
    });
});
