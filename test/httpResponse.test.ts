import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Request, Response } from 'express';
import { applicationEnvironment } from '../src/constant/application';
import type { HttpResponse } from '../src/types/types';
import type responseObject from '../src/util/responseObject';

const mocks = vi.hoisted(() => ({
    responseObject: vi.fn<typeof responseObject>(),
    logInfo: vi.fn(),
}));

vi.mock('../src/config/config', () => ({
    default: { ENV: applicationEnvironment.DEVELOPMENT },
}));
vi.mock('../src/util/responseObject', () => ({ default: mocks.responseObject }));
vi.mock('../src/util/logger', () => ({
    default: { info: mocks.logInfo },
}));

import httpResponse from '../src/util/httpResponse';

describe('httpResponse', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('builds, logs and sends the response', () => {
        const response: HttpResponse = {
            success: true,
            statusCode: 201,
            request: { method: 'POST', url: '/resource' },
            message: 'Created',
            data: { id: '123' },
        };
        mocks.responseObject.mockReturnValue(response);
        const json = vi.fn();
        const status = vi.fn(() => ({ json }) as unknown as Response);
        const req = {} as Request;
        const res = { status } as unknown as Response;
        const data = { id: '123' };

        httpResponse(req, res, 201, 'Created', data);

        expect(mocks.responseObject).toHaveBeenCalledWith(
            req,
            201,
            'Created',
            applicationEnvironment.DEVELOPMENT,
            data,
        );
        expect(mocks.logInfo).toHaveBeenCalledWith('CONTROLLER_RESPONSE', { meta: response });
        expect(status).toHaveBeenCalledWith(201);
        expect(json).toHaveBeenCalledWith(response);
    });
});
