import { HttpResponse } from '../types/types';
import { applicationEnvironment } from '../constant/application';
import { Request } from 'express';

type ResponseObjectDependencies = {
    getEnvironment: () => applicationEnvironment;
    logInfo: (message: string, metadata: { meta: HttpResponse }) => void;
};

export const createResponseObject = (dependencies: ResponseObjectDependencies) => {
    return (
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
            data,
        };

        if (dependencies.getEnvironment() === applicationEnvironment.PRODUCTION) {
            // Remove IP in production for privacy
            delete responseObject.request.ip;
        }

        // log the response for debugging purposes
        dependencies.logInfo(`CONTROLLER_RESPONSE`, {
            meta: responseObject,
        });

        return responseObject;
    };
};
