import httpError from './httpError';
import { createNotFoundError } from './notFoundErrorHandler';

export default createNotFoundError(httpError);
