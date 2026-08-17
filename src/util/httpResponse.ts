import { Request, Response } from 'express';
import config from '../config/config';
import logger from './logger';
import { createResponseObject } from './responseObject';

const responseObject = createResponseObject({
    getEnvironment: () => config.ENV,
    logInfo: (message, metadata) => logger.info(message, metadata),
});

export default (
    req: Request,
    res: Response,
    responseStatusCode: number,
    responseMessage: string,
    data: unknown = null,
): void => {
    const responseObj = responseObject(req, responseStatusCode, responseMessage, data);
    res.status(responseObj.statusCode).json(responseObj);
};
