import app from './app';
import config from './config/config';
import logger from './util/logger';

const port = config.PORT;
const host = config.SERVER_URL;
const environment = config.ENV;

const server = app.listen(port, () => {
    logger.info('APPLICATION_STARTED', {
        meta: {
            url: `${host}:${port}`,
            environment,
        },
    });
});

// Justo después de crear el servidor
// wait dela respuesta del servidor antes de emitir el error

server.emit('error', new Error('Simulated server error'));

server.on('error', (err) => {
    logger.error('APPLICATION_ERROR', { meta: err });
    server.close((error) => {
        logger.error('Server closed due to error:', error);
        if (error) {
            logger.error('APPLICATION_ERROR', { meta: error });
        }
        process.exit(1);
    });
});
