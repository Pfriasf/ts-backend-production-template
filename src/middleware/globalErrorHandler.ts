import { HttpError } from '../types/types';
import { Request, Response, NextFunction } from 'express';

export default (error: HttpError, _req: Request, res: Response, _next: NextFunction) => {
    res.status(error.statusCode).json(error);
};
