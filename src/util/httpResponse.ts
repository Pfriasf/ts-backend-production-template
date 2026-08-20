import type { Request, Response } from 'express';
import config from '../config/config';
import logger from './logger';
import responseObject from './responseObject';

export default (
    req: Request,
    res: Response,
    responseStatusCode: number,
    responseMessage: string,
    data: unknown = null,
): void => {
    const response = responseObject(req, responseStatusCode, responseMessage, config.ENV, data);
    logger.info('CONTROLLER_RESPONSE', { meta: response });
    res.status(response.statusCode).json(response);
};
