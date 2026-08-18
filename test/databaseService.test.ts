import { describe, it, mock } from 'node:test';
import assert from 'node:assert/strict';
import type { Connection } from 'mongoose';
import { createDatabaseService } from '../src/service/databaseServiceHandler';

void describe('createDatabaseService', () => {
    void it('connects to the database and returns its connection', async () => {
        const connection = {} as Connection;
        const connect = mock.fn(() => Promise.resolve(undefined));
        const getConnection = mock.fn(() => connection);
        const logInfo = mock.fn();
        const logError = mock.fn();
        const service = createDatabaseService({
            connect,
            getConnection,
            databaseUrl: 'mongodb://localhost/test',
            logInfo,
            logError,
        });

        const result = await service.connect();

        assert.equal(result, connection);
        assert.deepEqual(connect.mock.calls[0]?.arguments, ['mongodb://localhost/test']);
        assert.equal(getConnection.mock.callCount(), 1);
        assert.deepEqual(logInfo.mock.calls[0]?.arguments, ['Database connected successfully.']);
        assert.equal(logError.mock.callCount(), 0);
    });

    void it('logs and rethrows a database connection error', async () => {
        const error = new Error('Connection failed');
        const connect = mock.fn(() => Promise.reject(error));
        const getConnection = mock.fn(() => {
            throw new Error('getConnection should not be called');
        });
        const logInfo = mock.fn();
        const logError = mock.fn();
        const service = createDatabaseService({
            connect,
            getConnection,
            databaseUrl: 'mongodb://localhost/test',
            logInfo,
            logError,
        });

        await assert.rejects(service.connect(), error);

        assert.equal(getConnection.mock.callCount(), 0);
        assert.equal(logInfo.mock.callCount(), 0);
        assert.deepEqual(logError.mock.calls[0]?.arguments, ['DATABASE_ERROR', { meta: error }]);
    });
});
