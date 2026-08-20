import { NodeEnvironment } from '../constant/environment';

export function shouldUseExternalLogTransports(environment: NodeEnvironment): boolean {
    return environment === NodeEnvironment.PRODUCTION;
}

export function shouldBypassRateLimit(environment: NodeEnvironment): boolean {
    return environment === NodeEnvironment.TEST;
}
