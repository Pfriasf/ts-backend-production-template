import type { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import { getRateLimiter } from '../config/rateLimiter';
import responseMessage from '../constant/responseMessage';
import httpError from '../util/httpError';
import healthUtil from '../util/healthUtil';
import httpResponse from '../util/httpResponse';

export default {
    health: (req: Request, res: Response, next: NextFunction): void => {
        try {
            const healthData = {
                application: healthUtil.getApplicationHealth(),
                system: healthUtil.getSystemHealth(),
                timestamp: new Date().toISOString(),
            };
            httpResponse(req, res, 200, responseMessage.SUCCESS, healthData);
        } catch (error) {
            httpError(error, req, res, next, 500);
        }
    },
    readiness: (req: Request, res: Response, next: NextFunction): void => {
        try {
            if (mongoose.connection.readyState !== mongoose.ConnectionStates.connected) {
                throw new Error(responseMessage.SERVICE_UNAVAILABLE);
            }

            getRateLimiter();

            httpResponse(req, res, 200, responseMessage.SUCCESS, {
                database: 'connected',
                rateLimiter: 'initialized',
            });
        } catch (error) {
            httpError(error, req, res, next, 503);
        }
    },
};
