import { NodeEnvironment } from '../constant/environment';

export function shouldBypassExternalServices(environment: NodeEnvironment): boolean {
    return environment !== NodeEnvironment.PRODUCTION;
}
