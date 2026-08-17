import { applicationEnvironment } from '../constant/application';

export const shouldBypassRateLimit = (environment: applicationEnvironment): boolean => {
    return environment === applicationEnvironment.DEVELOPMENT;
};
