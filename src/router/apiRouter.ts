import { Router } from 'express';
import apiController from '../controller/apiController';
import healthController from '../controller/healthController';
import methodNotAllowed from '../util/methodNotAllowedError';
import rateLimit from '../middleware/rateLimit';

const router = Router();

router.use(rateLimit);

router.route('/').get(apiController).all(methodNotAllowed);

router.route('/health').get(healthController).all(methodNotAllowed);

export default router;
