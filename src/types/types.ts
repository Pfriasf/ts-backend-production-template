import { NodeEnvironment } from '../constant/environment';

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
    environment: NodeEnvironment;
    uptime: string;
    memoryUsage: {
        rss: string;
        heapTotal: string;
        heapUsed: string;
    };
}
