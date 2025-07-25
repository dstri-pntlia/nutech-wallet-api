import express from 'express';
import { register, login } from '../controllers/auth.controller';

const router = express.Router();

router.post('/registration', register);
router.post('/login', login);

export default router;