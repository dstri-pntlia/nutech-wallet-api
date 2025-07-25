import express from 'express';
import { getProfile, updateProfile, updateProfileImage } from '../controllers/profile.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = express.Router();

router.use(authMiddleware);

router.get('/', getProfile);
router.put('/update', updateProfile);
router.put('/image', updateProfileImage);

export default router;