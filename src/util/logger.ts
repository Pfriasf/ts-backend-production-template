import { createLogger, format, transports } from 'winston';
import utils from 'util';
import config from '../config/config';
import { applicationEnvironment } from '../constant/application';
import path from 'path';
import fs from 'fs';

const logsDir = path.join(__dirname, '../', '../', 'logs');
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
}

const consoleLogFormat = format.printf((info) => {
    const { level, message, timestamp, meta = {} } = info;

    const customLevel = level.toUpperCase();
    const customTimestamp = timestamp;
    const customMessage = message;
    const customMeta = utils.inspect(meta, {
        showHidden: false,
        depth: null,
    });

    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    const customLog = `${customLevel} [${customTimestamp}] : ${customMessage}\n${'META'} ${customMeta}\n`;

    return customLog;
});

const consoleTransport = (): Array<transports.ConsoleTransportInstance> => {
    if (config.ENV === applicationEnvironment.PRODUCTION) {
        return [
            new transports.Console({
                level: config.LOG_LEVEL,
                format: format.combine(format.timestamp(), consoleLogFormat),
            }),
        ];
    }

    return [];
};

const fileLogFormat = format.printf((info) => {
    const { level, message, timestamp, meta = {} } = info;
    const logMeta: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(meta as Record<string, unknown>)) {
        if (value instanceof Error) {
            logMeta[key] = {
                name: value.name,
                message: value.message,
                stack: value.stack || '',
            };
        } else {
            logMeta[key] = value;
        }
    }

    const logData = {
        level: level.toUpperCase(),
        message,
        timestamp,
        meta: logMeta,
    };

    return JSON.stringify(logData, null, 4);
});

const fileTransport = (): Array<transports.FileTransportInstance> => {
    return [
        new transports.File({
            filename: path.join(__dirname, '../', '../', 'logs', `${config.ENV}.log`),
            level: config.LOG_LEVEL,
            format: format.combine(format.timestamp(), fileLogFormat),
        }),
    ];
};

export default createLogger({
    defaultMeta: {
        meta: {},
    },
    transports: [...consoleTransport(), ...fileTransport()],
});
