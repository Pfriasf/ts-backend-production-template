import express, { Application } from 'express';
import router from './router/apiRouter';
import globalErrorHandler from './middleware/globalErrorHandler';
import notFoundError from './util/notFoundError';
import helmet from 'helmet';
import cors from 'cors';

const app: Application = express();

// Security middleware
app.use(helmet());

// CORS middleware
app.use(
    cors({
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        origin: ['http://localhost:3000'],
        credentials: true,
    }),
);

// Middleware to parse JSON bodies
app.use(express.json());

// Routing
app.use('/api', router);

// Not found route handler (404)
app.use(notFoundError.route);

// Global error handler
app.use(globalErrorHandler);

export default app;
