import type { NextFunction, Request, Response } from 'express';
import responseMessage from '../constant/responseMessage';
import type { ApplicationHealth, HandleError, SendResponse, SystemHealth } from '../types/types';

type HealthControllerDependencies = {
    sendResponse: SendResponse;
    handleError: HandleError;
    getApplicationHealth: () => ApplicationHealth;
    getSystemHealth: () => SystemHealth;
    getTimestamp: () => string;
};

export const createHealthController = (dependencies: HealthControllerDependencies) => ({
    status: (req: Request, res: Response, next: NextFunction): void => {
        try {
            const healthData = {
                application: dependencies.getApplicationHealth(),
                system: dependencies.getSystemHealth(),
                timestamp: dependencies.getTimestamp(),
            };
            dependencies.sendResponse(req, res, 200, responseMessage.SUCCESS, healthData);
        } catch (error) {
            dependencies.handleError(error, req, res, next, 500);
        }
    },
});
