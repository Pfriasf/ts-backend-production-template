import { HttpError } from '../types/types';
import { Request, Response } from 'express';

export default (error: HttpError, _req: Request, res: Response) => {
    res.status(error.statusCode).json(error);
};
