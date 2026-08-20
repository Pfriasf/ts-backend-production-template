import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Request, Response } from 'express';
import responseMessage from '../src/constant/responseMessage';
import type httpError from '../src/util/httpError';

const mocks = vi.hoisted(() => ({
    httpError: vi.fn<typeof httpError>(),
}));

vi.mock('../src/util/httpError', () => ({ default: mocks.httpError }));

import methodNotAllowedError from '../src/util/methodNotAllowedError';

describe('methodNotAllowedError', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('reports a disallowed method with status 405', () => {
        const req = {} as Request;
        const res = {} as Response;
        const next = vi.fn();

        methodNotAllowedError(req, res, next);

        const [error] = mocks.httpError.mock.calls[0] ?? [];
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toBe(responseMessage.METHOD_NOT_ALLOWED);
        expect(mocks.httpError).toHaveBeenCalledWith(error, req, res, next, 405);
    });
});
