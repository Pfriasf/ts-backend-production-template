import express, { Application } from 'express';
import router from './router/apiRouter';
import globalErrorHandler from './middleware/globalErrorHandler';
import notFoundError from './util/notFoundError';

const app: Application = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Routing
app.use('/api', router);

// Not found route handler (404)
app.use(notFoundError.route);

// Global error handler
app.use(globalErrorHandler);

export default app;
