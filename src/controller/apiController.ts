import type { NextFunction, Request, Response } from 'express';
import httpResponse from '../util/httpResponse';
import httpError from '../util/httpError';
import responseMessage from '../constant/responseMessage';

export default (req: Request, res: Response, next: NextFunction): void => {
    try {
        httpResponse(req, res, 200, responseMessage.SUCCESS);
    } catch (error) {
        httpError(error, req, res, next, 500);
    }
};
