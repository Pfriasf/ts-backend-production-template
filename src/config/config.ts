import { parseEnvironment } from './environmentSchema';

const config = parseEnvironment(process.env);

export default config;
