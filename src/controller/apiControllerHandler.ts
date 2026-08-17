import type { NextFunction, Request, Response } from 'express';
import responseMessage from '../constant/responseMessage';
import type { HandleError, SendResponse } from '../types/types';

type ApiControllerDependencies = {
    sendResponse: SendResponse;
    handleError: HandleError;
};

export const createApiController = (dependencies: ApiControllerDependencies) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        try {
            dependencies.sendResponse(req, res, 200, responseMessage.SUCCESS);
        } catch (error) {
            dependencies.handleError(error, req, res, next, 500);
        }
    };
};
