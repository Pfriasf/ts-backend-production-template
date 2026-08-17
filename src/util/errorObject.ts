import { HttpError } from '../types/types';
import { Request } from 'express';
import responseMessage from '../constant/responseMessage';
import { applicationEnvironment } from '../constant/application';

type ErrorObjectDependencies = {
    getEnvironment: () => applicationEnvironment;
    logError: (message: string, metadata: { meta: HttpError }) => void;
};

export const createErrorObject = (dependencies: ErrorObjectDependencies) => {
    return (err: unknown, req: Request, errorStatusCode: number = 500): HttpError => {
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

        if (dependencies.getEnvironment() === applicationEnvironment.PRODUCTION) {
            // Remove IP and trace in production for privacy
            delete errorObject.request.ip;
            delete errorObject.trace;
        }

        dependencies.logError(`CONTROLLER_ERROR`, {
            meta: errorObject,
        });

        return errorObject;
    };
};
