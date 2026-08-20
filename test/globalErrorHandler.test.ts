import { describe, expect, it, vi } from 'vitest';
import type { NextFunction, Request, Response } from 'express';
import globalErrorHandler from '../src/middleware/globalErrorHandler';
import type { HttpError } from '../src/types/types';

describe('globalErrorHandler', () => {
    it('sends the error with its status code', () => {
        const error: HttpError = {
            success: false,
            statusCode: 404,
            request: {
                method: 'GET',
                url: '/api/missing',
            },
            message: 'Not found',
            data: null,
        };
        const json = vi.fn();
        const status = vi.fn(() => ({ json }) as unknown as Response);
        const res = { status } as unknown as Response;

        globalErrorHandler(error, {} as Request, res, vi.fn() as NextFunction);

        expect(status).toHaveBeenCalledWith(404);
        expect(json).toHaveBeenCalledWith(error);
    });
});
