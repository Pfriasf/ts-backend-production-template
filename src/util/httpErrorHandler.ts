import type { NextFunction, Request, Response } from 'express';
import type { HttpError } from '../types/types';

type ErrorObjectBuilder = (err: unknown, req: Request, errorStatusCode?: number) => HttpError;

export const createHttpError = (errorObject: ErrorObjectBuilder) => {
    return (
        err: unknown,
        req: Request,
        _res: Response,
        next: NextFunction,
        errorStatusCode?: number,
    ): void => {
        const errorObj = errorObject(err, req, errorStatusCode);
        next(errorObj);
    };
};
