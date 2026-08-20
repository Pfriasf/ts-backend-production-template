import type { HttpResponse } from '../types/types';
import { applicationEnvironment } from '../constant/application';
import type { Request } from 'express';

export default (
    req: Request,
    responseStatusCode: number,
    responseMessage: string,
    environment: applicationEnvironment,
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
        data,
    };

    if (environment === applicationEnvironment.PRODUCTION) {
        delete responseObject.request.ip;
    }

    return responseObject;
};
