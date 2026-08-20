import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { NextFunction, Request, Response } from 'express';
import { NodeEnvironment } from '../src/constant/environment';
import type { HttpError } from '../src/types/types';
import type errorObject from '../src/util/errorObject';

const mocks = vi.hoisted(() => ({
    errorObject: vi.fn<typeof errorObject>(),
    logError: vi.fn(),
}));

vi.mock('../src/config/config', () => ({
    default: { NODE_ENV: NodeEnvironment.DEVELOPMENT },
}));
vi.mock('../src/util/errorObject', () => ({ default: mocks.errorObject }));
vi.mock('../src/util/logger', () => ({
    default: { error: mocks.logError },
}));

import httpError from '../src/util/httpError';

describe('httpError', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('builds, logs and forwards the error', () => {
        const response: HttpError = {
            success: false,
            statusCode: 404,
            request: { method: 'GET', url: '/missing' },
            message: 'Not found',
            data: null,
        };
        mocks.errorObject.mockReturnValue(response);
        const error = new Error('Not found');
        const req = {} as Request;
        const res = {} as Response;
        const next = vi.fn() as NextFunction;

        httpError(error, req, res, next, 404);

        expect(mocks.errorObject).toHaveBeenCalledWith(
            error,
            req,
            NodeEnvironment.DEVELOPMENT,
            404,
        );
        expect(mocks.logError).toHaveBeenCalledWith('CONTROLLER_ERROR', { meta: response });
        expect(next).toHaveBeenCalledWith(response);
    });
});
