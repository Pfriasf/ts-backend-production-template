import app from './app';
import config from './config/config';
import { initRateLimiter } from './config/rateLimiter';
import databaseService from './service/databaseService';
import logger from './util/logger';

const port = config.PORT;
const serverUrl = config.SERVER_URL;
const environment = config.NODE_ENV;

async function startServer() {
    try {
        const connection = await databaseService.connect();

        logger.info('DATABASE_CONNECTION', {
            meta: {
                CONNECTION_NAME: connection.name,
            },
        });

        initRateLimiter(connection);

        logger.info('RATE_LIMITER_INITIALIZED');

        const server = app.listen(port, () => {
            logger.info('APPLICATION_STARTED', {
                meta: {
                    url: `${serverUrl}:${port}`,
                    environment,
                },
            });
        });

        server.on('error', (error) => {
            logger.error('SERVER_ERROR', { meta: error });
            process.exit(1);
        });

        let isShuttingDown = false;

        const shutdown = (signal: NodeJS.Signals): void => {
            if (isShuttingDown) {
                return;
            }

            isShuttingDown = true;
            logger.info('SHUTDOWN_STARTED', { meta: { signal } });

            server.close(() => {
                void connection
                    .close()
                    .then(() => {
                        logger.info('APPLICATION_STOPPED', {
                            meta: { uptime: process.uptime() },
                        });
                        process.exit(0);
                    })
                    .catch((error: unknown) => {
                        logger.error('SHUTDOWN_ERROR', { meta: error });
                        process.exit(1);
                    });
            });
        };

        process.once('SIGINT', () => shutdown('SIGINT'));
        process.once('SIGTERM', () => shutdown('SIGTERM'));
    } catch (error) {
        logger.error('APPLICATION_ERROR', { meta: error });
        process.exit(1);
    }
}

void startServer();
