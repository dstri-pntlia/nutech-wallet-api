import express from 'express';
import { getBalance, topUp, createTransaction, getTransactionHistory} from '../controllers/transaction.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = express.Router();

router.use(authMiddleware);

router.get('/balance', getBalance);
router.post('/topup', topUp);
router.post('/transaction', createTransaction);
router.get('/transaction/history', getTransactionHistory);

export default router;