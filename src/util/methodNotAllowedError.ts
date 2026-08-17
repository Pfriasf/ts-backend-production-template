import httpError from './httpError';
import { createMethodNotAllowedError } from './methodNotAllowedErrorHandler';

export default createMethodNotAllowedError(httpError);
