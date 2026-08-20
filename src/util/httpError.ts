import type { NextFunction, Request, Response } from 'express';
import config from '../config/config';
import logger from './logger';
import errorObject from './errorObject';

export default (
    error: unknown,
    req: Request,
    _res: Response,
    next: NextFunction,
    errorStatusCode?: number,
): void => {
    const response = errorObject(error, req, config.ENV, errorStatusCode);
    logger.error('CONTROLLER_ERROR', { meta: response });
    next(response);
};
