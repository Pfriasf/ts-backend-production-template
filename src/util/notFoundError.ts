import type { NextFunction, Request, Response } from 'express';
import responseMessage from '../constant/responseMessage';
import httpError from './httpError';

export default {
    route: (req: Request, res: Response, next: NextFunction): void => {
        const error = new Error(responseMessage.NOT_FOUND_ROUTE(req.originalUrl));
        httpError(error, req, res, next, 404);
    },
    entity: (req: Request<{ id: string }>, res: Response, next: NextFunction): void => {
        const error = new Error(responseMessage.NOT_FOUND_ENTITY(req.params.id));
        httpError(error, req, res, next, 404);
    },
};
