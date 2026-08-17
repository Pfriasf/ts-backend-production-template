import { describe, it, mock } from 'node:test';
import assert from 'node:assert/strict';
import type { NextFunction, Request, Response } from 'express';
import { createApiController } from '../src/controller/apiControllerHandler';
import responseMessage from '../src/constant/responseMessage';
import type { HandleError } from '../src/types/types';

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

    void it('handles errors from the API root response', () => {
        const error = new Error('Response failed');
        const sendResponse = mock.fn(() => {
            throw error;
        });
        const handleError = mock.fn<HandleError>();
        const apiController = createApiController({
            sendResponse,
            handleError,
        });
        const req = {} as Request;
        const res = {} as Response;
        const next = mock.fn<NextFunction>();

        apiController(req, res, next);

        assert.deepEqual(handleError.mock.calls[0]?.arguments, [error, req, res, next, 500]);
    });
});
