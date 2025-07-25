import express from 'express';
import { getBanners, createBanner } from '../controllers/banner.controller';

const router = express.Router();

router.get('/', getBanners);
router.post('/', createBanner);

export default router;