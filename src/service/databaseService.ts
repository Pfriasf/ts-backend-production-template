import mongoose from 'mongoose';
import config from '../config/config';
import logger from '../util/logger';
import { createDatabaseService } from './databaseServiceHandler';

export default createDatabaseService({
    connect: (url) => mongoose.connect(url),
    getConnection: () => mongoose.connection,
    databaseUrl: config.DB_URL,
    logInfo: (message) => logger.info(message),
    logError: (message, metadata) => logger.error(message, metadata),
});
