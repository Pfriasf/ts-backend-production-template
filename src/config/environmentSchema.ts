import { z } from 'zod';
import { NodeEnvironment } from '../constant/environment';

const httpUrl = z.url({ protocol: /^https?$/ });
const logTransport = z.enum(['console', 'file', 'mongodb']);

const environmentSchema = z.object({
    PORT: z.coerce.number().int().min(1).max(65535),
    NODE_ENV: z.enum(NodeEnvironment),
    SERVER_URL: httpUrl,
    LOG_LEVEL: z
        .enum(['error', 'warn', 'info', 'http', 'verbose', 'debug', 'silly'])
        .default('info'),
    LOG_TRANSPORTS: z
        .string()
        .default('console')
        .transform((value) => value.split(',').map((transport) => transport.trim()))
        .pipe(z.array(logTransport).min(1))
        .transform((values) => [...new Set(values)]),
    DB_URL: z.url({ protocol: /^mongodb(?:\+srv)?$/ }),
    RATE_LIMIT_POINTS: z.coerce.number().int().positive().default(10),
    RATE_LIMIT_DURATION: z.coerce.number().int().positive().default(60),
    CORS_ORIGINS: z
        .string()
        .transform((value) => value.split(',').map((origin) => origin.trim()))
        .pipe(z.array(httpUrl).min(1)),
});

export type Config = z.infer<typeof environmentSchema>;

export const parseEnvironment = (variables: NodeJS.ProcessEnv): Config =>
    environmentSchema.parse(variables);
