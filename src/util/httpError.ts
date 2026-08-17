import { NextFunction, Request, Response } from 'express';
import config from '../config/config';
import logger from './logger';
import { createErrorObject } from './errorObject';

const errorObject = createErrorObject({
    getEnvironment: () => config.ENV,
    logError: (message, metadata) => logger.error(message, metadata),
});

export default (
    err: unknown,
    req: Request,
    _res: Response,
    next: NextFunction,
    errorStatusCode?: number,
): void => {
    const errorObj = errorObject(err, req, errorStatusCode);
    next(errorObj);
};
