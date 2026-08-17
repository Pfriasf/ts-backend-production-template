import type { Request, Response } from 'express';
import type { HttpResponse } from '../types/types';

type ResponseObjectBuilder = (
    req: Request,
    responseStatusCode: number,
    responseMessage: string,
    data?: unknown,
) => HttpResponse;

export const createHttpResponse = (responseObject: ResponseObjectBuilder) => {
    return (
        req: Request,
        res: Response,
        responseStatusCode: number,
        responseMessage: string,
        data: unknown = null,
    ): void => {
        const responseObj = responseObject(req, responseStatusCode, responseMessage, data);
        res.status(responseObj.statusCode).json(responseObj);
    };
};
