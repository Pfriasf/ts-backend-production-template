import { Router } from 'express';
import apiController from '../controller/apiController';
import methodNotAllowed from '../util/methodNotAllowedError';

const router = Router();

router.route('/self').get(apiController.self).all(methodNotAllowed);

router.route('/health').get(apiController.health).all(methodNotAllowed);

export default router;
