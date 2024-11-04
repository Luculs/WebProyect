import { Router } from 'express';
import { getHistory } from '../controllers/controller.history.js';
import { requestLoan } from '../controllers/controller.loan.js';
import { loginUser } from '../controllers/controller.login.js';
import { registerUser } from '../controllers/controller.register.js';
import { getTransaction, postTransaction } from '../controllers/controller.transaction.js';
import { getInfo } from '../controllers/controller.user.js';
const router = Router();

router.get('/usuario', getInfo);
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/transaction', postTransaction);
router.post('/loan', requestLoan);
router.get('/history', getHistory);
router.get('/trasactionh', getTransaction);
export default router;
