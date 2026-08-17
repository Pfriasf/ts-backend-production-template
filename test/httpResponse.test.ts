import { describe, it, mock } from 'node:test';
import assert from 'node:assert/strict';
import type { Request, Response } from 'express';
import type { HttpResponse } from '../src/types/types';
import { createHttpResponse } from '../src/util/httpResponseHandler';

void describe('createHttpResponse', () => {
    void it('sends the built response with its status code', () => {
        const responseObject: HttpResponse = {
            success: true,
            statusCode: 201,
            request: {
                method: 'POST',
                url: '/api/resource',
            },
            message: 'Created',
            data: { id: '123' },
        };
        const buildResponse = mock.fn(() => responseObject);
        const json = mock.fn();
        const status = mock.fn(() => ({ json }) as unknown as Response);
        const httpResponse = createHttpResponse(buildResponse);
        const req = {} as Request;
        const res = { status } as unknown as Response;
        const data = { id: '123' };

        httpResponse(req, res, 201, 'Created', data);

        assert.deepEqual(buildResponse.mock.calls[0]?.arguments, [req, 201, 'Created', data]);
        assert.deepEqual(status.mock.calls[0]?.arguments, [201]);
        assert.deepEqual(json.mock.calls[0]?.arguments, [responseObject]);
    });
});
