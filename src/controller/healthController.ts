import httpError from '../util/httpError';
import healthUtil from '../util/healthUtil';
import httpResponse from '../util/httpResponse';
import { createHealthController } from './healthControllerHandler';

export default createHealthController({
    sendResponse: httpResponse,
    handleError: httpError,
    getApplicationHealth: healthUtil.getApplicationHealth,
    getSystemHealth: healthUtil.getSystemHealth,
    getTimestamp: () => new Date().toISOString(),
});
