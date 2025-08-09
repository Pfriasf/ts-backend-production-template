import { HttpResponse } from '../types/types';
import config from '../config/config';
import { applicationEnvironment } from '../constant/application';
import { Request } from 'express';

export default (
    req: Request,
    responseStatusCode: number,
    responseMessage: string,
    data: unknown = null,
): HttpResponse => {
    const responseObject: HttpResponse = {
        success: true,
        statusCode: responseStatusCode,
        request: {
            ip: req.ip || null,
            method: req.method,
            url: req.originalUrl,
        },
        message: responseMessage,
        data: data,
    };

    // log the response for debugging purposes
    console.info(`CONTROLLER_RESPONSE`, {
        meta: responseObject,
    });

    if (config.ENV === applicationEnvironment.PRODUCTION) {
        // Remove IP in production for privacy
        delete responseObject.request.ip;
    }

    return responseObject;
};
