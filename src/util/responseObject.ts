import type { HttpResponse } from '../types/types';
import { NodeEnvironment } from '../constant/environment';
import type { Request } from 'express';

export default (
    req: Request,
    responseStatusCode: number,
    responseMessage: string,
    environment: NodeEnvironment,
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

    if (environment === NodeEnvironment.PRODUCTION) {
        delete responseObject.request.ip;
    }

    return responseObject;
};
