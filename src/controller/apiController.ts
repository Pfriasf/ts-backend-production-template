import httpResponse from '../util/httpResponse';
import httpError from '../util/httpError';
import { createApiController } from './apiControllerHandler';

export default createApiController({
    sendResponse: httpResponse,
    handleError: httpError,
});
