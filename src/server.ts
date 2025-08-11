import app from './app';
import config from './config/config';
import databaseService from './service/databaseService';
import logger from './util/logger';

const port = config.PORT;
const host = config.SERVER_URL;
const environment = config.ENV;

async function startServer() {
    try {
        const connection = await databaseService.connect();

        logger.info('DATABASE_CONNECTION', {
            meta: {
                CONNECTION_NAME: connection.name,
            },
        });

        const server = app.listen(port, () => {
            logger.info('APPLICATION_STARTED', {
                meta: {
                    url: `${host}:${port}`,
                    environment,
                },
            });
        });

        server.on('error', (error) => {
            logger.error('SERVER_ERROR', { meta: error });
            process.exit(1);
        });

        process.on('SIGINT', () => {
            logger.info('SIGINT received, closing server...', {
                meta: {
                    signal: 'SIGINT',
                },
            });
            server.close(() => {
                logger.info('Server closed', { meta: { uptime: process.uptime() } });
                process.exit(0);
            });
        });
    } catch (error) {
        logger.error('APPLICATION_ERROR', { meta: error });

        process.exit(1);
    }
}

void startServer();
