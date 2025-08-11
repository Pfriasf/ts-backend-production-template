import { applicationEnvironment } from '../constant/application';

export type HttpResponse = {
    success: boolean;
    statusCode: number;
    request: {
        ip?: string | null;
        method: string;
        url: string;
    };
    message: string;
    data: unknown;
};

export type HttpError = {
    success: boolean;
    statusCode: number;
    request: {
        ip?: string | null;
        method: string;
        url: string;
    };
    message: string;
    data: unknown;
    trace?: object | null;
};

export interface Config {
    PORT: number;
    ENV: applicationEnvironment;
    SERVER_URL: string;
    LOG_LEVEL: string;
    DB_URL: string;
}
