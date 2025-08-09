import { applicationEnvironment } from '../constant/application';
import { isApplicationEnvironment } from '../util/envUtil';

interface Config {
    PORT: number;
    ENV: applicationEnvironment;
    SERVER_URL: string;
}

const envValue = process.env.ENV || 'development';

const env = isApplicationEnvironment(envValue) ? envValue : applicationEnvironment.DEVELOPMENT;

const config: Config = {
    PORT: Number(process.env.PORT) || 3001,
    ENV: env,
    SERVER_URL: process.env.SERVER_URL || 'http://localhost',
};

export default config;
