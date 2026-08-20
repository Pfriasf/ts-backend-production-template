import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Request, Response } from 'express';
import responseMessage from '../src/constant/responseMessage';
import type httpError from '../src/util/httpError';
import type httpResponse from '../src/util/httpResponse';

const mocks = vi.hoisted(() => ({
    httpResponse: vi.fn<typeof httpResponse>(),
    httpError: vi.fn<typeof httpError>(),
}));

vi.mock('../src/util/httpResponse', () => ({ default: mocks.httpResponse }));
vi.mock('../src/util/httpError', () => ({ default: mocks.httpError }));

import apiController from '../src/controller/apiController';

describe('apiController', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('sends a successful API root response', () => {
        const req = {} as Request;
        const res = {} as Response;
        const next = vi.fn();

        apiController(req, res, next);

        expect(mocks.httpResponse).toHaveBeenCalledWith(req, res, 200, responseMessage.SUCCESS);
        expect(mocks.httpError).not.toHaveBeenCalled();
    });

    it('handles errors from the API root response', () => {
        const error = new Error('Response failed');
        mocks.httpResponse.mockImplementationOnce(() => {
            throw error;
        });
        const req = {} as Request;
        const res = {} as Response;
        const next = vi.fn();

        apiController(req, res, next);

        expect(mocks.httpError).toHaveBeenCalledWith(error, req, res, next, 500);
    });
});
