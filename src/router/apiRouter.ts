import { Router } from 'express';
import apiController from '../controller/apiController';
import healthController from '../controller/healthController';
import methodNotAllowed from '../util/methodNotAllowedError';
import rateLimit from '../middleware/rateLimit';

const router = Router();

router.route('/health').get(healthController.health).all(methodNotAllowed);

router.route('/readiness').get(healthController.readiness).all(methodNotAllowed);

router.use(rateLimit);

router.route('/').get(apiController).all(methodNotAllowed);

export default router;
