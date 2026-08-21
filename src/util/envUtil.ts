import { NodeEnvironment } from '../constant/environment';

export function shouldBypassRateLimit(environment: NodeEnvironment): boolean {
    return environment === NodeEnvironment.TEST;
}
