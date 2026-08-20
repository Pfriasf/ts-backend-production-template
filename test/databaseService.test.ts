import { beforeEach, describe, expect, it, vi } from 'vitest';
import type mongoose from 'mongoose';

type MongooseInstance = Awaited<ReturnType<typeof mongoose.connect>>;

const mocks = vi.hoisted(() => ({
    connect: vi.fn<typeof mongoose.connect>(),
    connection: {},
    logInfo: vi.fn(),
    logError: vi.fn(),
}));

vi.mock('mongoose', () => ({
    default: {
        connect: mocks.connect,
        connection: mocks.connection,
    },
}));
vi.mock('../src/config/config', () => ({
    default: { DB_URL: 'mongodb://localhost/test' },
}));
vi.mock('../src/util/logger', () => ({
    default: {
        info: mocks.logInfo,
        error: mocks.logError,
    },
}));

import databaseService from '../src/service/databaseService';

describe('databaseService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mocks.connect.mockResolvedValue({} as MongooseInstance);
    });

    it('connects to the database and returns its connection', async () => {
        const result = await databaseService.connect();

        expect(result).toBe(mocks.connection);
        expect(mocks.connect).toHaveBeenCalledWith('mongodb://localhost/test');
        expect(mocks.logInfo).toHaveBeenCalledWith('Database connected successfully.');
        expect(mocks.logError).not.toHaveBeenCalled();
    });

    it('logs and rethrows a database connection error', async () => {
        const error = new Error('Connection failed');
        mocks.connect.mockRejectedValueOnce(error);

        await expect(databaseService.connect()).rejects.toBe(error);

        expect(mocks.logInfo).not.toHaveBeenCalled();
        expect(mocks.logError).toHaveBeenCalledWith('DATABASE_ERROR', { meta: error });
    });
});
