import config from '../config/config';
import logger from './logger';
import { createErrorObject } from './errorObject';
import { createHttpError } from './httpErrorHandler';

const errorObject = createErrorObject({
    getEnvironment: () => config.ENV,
    logError: (message, metadata) => logger.error(message, metadata),
});

export default createHttpError(errorObject);
