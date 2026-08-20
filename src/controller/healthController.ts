import type { NextFunction, Request, Response } from 'express';
import httpError from '../util/httpError';
import healthUtil from '../util/healthUtil';
import httpResponse from '../util/httpResponse';
import responseMessage from '../constant/responseMessage';

export default (req: Request, res: Response, next: NextFunction): void => {
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
};
