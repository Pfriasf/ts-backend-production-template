import { describe, expect, it } from 'vitest';
import responseMessage from '../src/constant/responseMessage';

describe('responseMessage', () => {
    it('generates a not-found entity message', () => {
        const result = responseMessage.NOT_FOUND_ENTITY('User');

        expect(result).toBe('User not found.');
    });

    it('generates a not-found route message', () => {
        const result = responseMessage.NOT_FOUND_ROUTE('/missing');

        expect(result).toBe('Route /missing not found.');
    });
});
