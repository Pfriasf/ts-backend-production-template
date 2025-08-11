import { createLogger, format, transports } from 'winston';
import config from '../config/config';
import path from 'path';
import fs from 'fs';

const logsDir = path.join(__dirname, '../', '../', 'logs');
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
}

const consoleLogFormat = format.printf(({ level, message, timestamp, metadata }) => {
    const metaObj =
        (metadata as Record<string, unknown>)?.meta ?? (metadata as Record<string, unknown>);
    const metaString =
        metaObj && Object.keys(metaObj).length ? `\nMETA: ${JSON.stringify(metaObj, null, 4)}` : '';
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    return `${level.toUpperCase()} [${timestamp}] : ${message}${metaString}`;
});

const consoleTransport = (): Array<transports.ConsoleTransportInstance> => {
    return [
        new transports.Console({
            level: config.LOG_LEVEL,
            format: format.combine(
                format.colorize({ all: true }),
                format.timestamp(),
                format.errors({ stack: true }),
                format.metadata({ fillExcept: ['message', 'level', 'timestamp'] }),
                consoleLogFormat,
            ),
        }),
    ];
};

const fileLogFormat = format.printf(({ level, message, timestamp, metadata }) => {
    const metaObj = metadata as Record<string, unknown>;
    const logEntry = {
        level: level.toUpperCase(),
        message,
        timestamp,
        ...(metaObj && Object.keys(metaObj).length ? metaObj : {}),
    };
    return JSON.stringify(logEntry, null, 4);
});

const fileTransport = (): Array<transports.FileTransportInstance> => {
    return [
        new transports.File({
            filename: path.join(__dirname, '../', '../', 'logs', `${config.ENV}.log`),
            level: config.LOG_LEVEL,
            format: format.combine(
                format.timestamp(),
                format.colorize({ level: true }),
                format.errors({ stack: true }),
                format.metadata({ fillExcept: ['message', 'level', 'timestamp'] }),
                fileLogFormat,
            ),
        }),
    ];
};

export default createLogger({
    defaultMeta: {},
    transports: [...consoleTransport(), ...fileTransport()],
});
