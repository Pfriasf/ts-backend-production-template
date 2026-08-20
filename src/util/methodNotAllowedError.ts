import type { NextFunction, Request, Response } from 'express';
import responseMessage from '../constant/responseMessage';
import httpError from './httpError';

export default (req: Request, res: Response, next: NextFunction): void => {
    const error = new Error(responseMessage.METHOD_NOT_ALLOWED);
    httpError(error, req, res, next, 405);
};
