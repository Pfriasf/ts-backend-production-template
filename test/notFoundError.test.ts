import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Request, Response } from 'express';
import responseMessage from '../src/constant/responseMessage';
import type httpError from '../src/util/httpError';

const mocks = vi.hoisted(() => ({
    httpError: vi.fn<typeof httpError>(),
}));

vi.mock('../src/util/httpError', () => ({ default: mocks.httpError }));

import notFoundError from '../src/util/notFoundError';

describe('notFoundError', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('reports a missing route', () => {
        const req = { originalUrl: '/missing' } as Request;
        const res = {} as Response;
        const next = vi.fn();

        notFoundError.route(req, res, next);

        const [error] = mocks.httpError.mock.calls[0] ?? [];
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toBe(responseMessage.NOT_FOUND_ROUTE('/missing'));
        expect(mocks.httpError).toHaveBeenCalledWith(error, req, res, next, 404);
    });

    it('reports a missing entity', () => {
        const req = { params: { id: 'entity-id' } } as Request<{ id: string }>;
        const res = {} as Response;
        const next = vi.fn();

        notFoundError.entity(req, res, next);

        const [error] = mocks.httpError.mock.calls[0] ?? [];
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toBe(responseMessage.NOT_FOUND_ENTITY('entity-id'));
        expect(mocks.httpError).toHaveBeenCalledWith(error, req, res, next, 404);
    });
});
