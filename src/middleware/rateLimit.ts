import config from '../config/config';
import { getRateLimiter } from '../config/rateLimiter';
import httpError from '../util/httpError';
import { createRateLimitMiddleware } from './rateLimitMiddleware';

export default createRateLimitMiddleware({
    getEnvironment: () => config.ENV,
    getRateLimiter,
    handleError: httpError,
});
