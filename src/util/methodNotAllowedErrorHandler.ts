import type { NextFunction, Request, Response } from 'express';
import responseMessage from '../constant/responseMessage';

type HttpErrorHandler = (
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction,
    statusCode: number,
) => void;

export const createMethodNotAllowedError = (httpError: HttpErrorHandler) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        const error = new Error(responseMessage.METHOD_NOT_ALLOWED);
        httpError(error, req, res, next, 405);
    };
};
