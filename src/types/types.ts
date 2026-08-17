import { applicationEnvironment } from '../constant/application';
import type { NextFunction, Request, Response } from 'express';

export type SendResponse = (
    req: Request,
    res: Response,
    statusCode: number,
    message: string,
    data?: unknown,
) => void;

export type HandleError = (
    error: unknown,
    req: Request,
    res: Response,
    next: NextFunction,
    statusCode?: number,
) => void;

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
    RATE_LIMIT_POINTS: number;
    RATE_LIMIT_DURATION: number;
}

export interface CpuLoad {
    last1Minute: string;
    last5Minutes: string;
    last15Minutes: string;
}

export interface SystemHealth {
    cpuLoad: CpuLoad;
    totalMemory: string;
    freeMemory: string;
}

export interface ApplicationHealth {
    environment: applicationEnvironment;
    uptime: string;
    memoryUsage: {
        rss: string;
        heapTotal: string;
        heapUsed: string;
    };
}
