import { Router } from 'express';
import { register, login, getCurrentUser, logout } from './auth.controller';
import { validateRegister, validateLogin } from './auth.validation';
import { protect } from '../../middleware/auth.middleware';

const router = Router();
router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);
router.get('/me', protect, getCurrentUser);
router.post('/logout', logout)


export default router;

