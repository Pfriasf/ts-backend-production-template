import config from '../config/config';
import logger from './logger';
import { createHttpResponse } from './httpResponseHandler';
import { createResponseObject } from './responseObject';

const responseObject = createResponseObject({
    getEnvironment: () => config.ENV,
    logInfo: (message, metadata) => logger.info(message, metadata),
});

export default createHttpResponse(responseObject);
