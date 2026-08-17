import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import responseMessage from '../src/constant/responseMessage';

void describe('responseMessage', () => {
    void it('generates a not-found entity message', () => {
        const result = responseMessage.NOT_FOUND_ENTITY('User');

        assert.equal(result, 'User not found.');
    });

    void it('generates a not-found route message', () => {
        const result = responseMessage.NOT_FOUND_ROUTE('/missing');

        assert.equal(result, 'Route /missing not found.');
    });
});
