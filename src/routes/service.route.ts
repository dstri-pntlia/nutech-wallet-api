import express from 'express';
import { getServices, createService } from '../controllers/service.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = express.Router();

router.use(authMiddleware);

router.get('/', getServices);
router.post('/', createService);

export default router;
