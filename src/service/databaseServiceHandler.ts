import type { Connection } from 'mongoose';

type DatabaseServiceDependencies = {
    connect: (url: string) => Promise<unknown>;
    getConnection: () => Connection;
    databaseUrl: string;
    logInfo: (message: string) => void;
    logError: (message: string, metadata: object) => void;
};

export const createDatabaseService = (dependencies: DatabaseServiceDependencies) => ({
    connect: async (): Promise<Connection> => {
        try {
            await dependencies.connect(dependencies.databaseUrl);
            dependencies.logInfo('Database connected successfully.');
            return dependencies.getConnection();
        } catch (error) {
            dependencies.logError('DATABASE_ERROR', { meta: error });
            throw error;
        }
    },
});
