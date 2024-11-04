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
//rutas
// router.get('/pokemon-saludo', cors({
//     origin:'http://localhost:5173'
// }),metodosPokemon.getSaludo)
// router.get('/pokemon-despido', metodosPokemon.getdDespido)

// router.get(
//   '/usuario',
//   cors({
//     origin: 'http://localhost:3000',
//   }),
//   metodosUsuario.getInfo
// );
// router.post(
//   '/register',
//   cors({
//     origin: 'http://localhost:3000',
//   }),
//   registerUser
// );

// // Ruta para iniciar sesión
// router.post(
//   '/login',
//   cors({
//     origin: 'http://localhost:3000',
//   }),
//   loginUser
// );
// Rutas
