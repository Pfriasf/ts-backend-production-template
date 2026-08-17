import { describe, it, mock } from 'node:test';
import assert from 'node:assert/strict';
import type { NextFunction, Request, Response } from 'express';
import { createApiController } from '../src/controller/apiControllerHandler';
import responseMessage from '../src/constant/responseMessage';

void describe('createApiController', () => {
    void it('sends a successful API root response', () => {
        const sendResponse = mock.fn();
        const handleError = mock.fn();
        const apiController = createApiController({
            sendResponse,
            handleError,
        });
        const req = {} as Request;
        const res = {} as Response;
        const next = mock.fn<NextFunction>();

        apiController(req, res, next);

        assert.deepEqual(sendResponse.mock.calls[0]?.arguments, [
            req,
            res,
            200,
            responseMessage.SUCCESS,
        ]);
        assert.equal(handleError.mock.callCount(), 0);
    });
});
