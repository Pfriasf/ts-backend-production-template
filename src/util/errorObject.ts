import type { HttpError } from '../types/types';
import type { Request } from 'express';
import responseMessage from '../constant/responseMessage';
import { applicationEnvironment } from '../constant/application';

export default (
    err: unknown,
    req: Request,
    environment: applicationEnvironment,
    errorStatusCode: number = 500,
): HttpError => {
    const isError = err instanceof Error;
    const errorObject: HttpError = {
        success: false,
        statusCode: errorStatusCode,
        request: {
            ip: req.ip || null,
            method: req.method,
            url: req.originalUrl,
        },
        message: isError && err.message ? err.message : responseMessage.SOMETHING_WENT_WRONG,
        data: null,
        trace: isError ? { error: err.stack } : null,
    };

    if (environment === applicationEnvironment.PRODUCTION) {
        delete errorObject.request.ip;
        delete errorObject.trace;
    }

    return errorObject;
};
