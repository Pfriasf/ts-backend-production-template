interface Config {
    PORT: number;
    ENV: string;
    SERVER_URL: string;
}

const config: Config = {
    PORT: Number(process.env.PORT) || 3001,
    ENV: process.env.ENV || 'development',
    SERVER_URL: process.env.SERVER_URL || 'http://localhost',
};

export default config;
