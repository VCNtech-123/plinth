import { Router } from 'express';
import { register, login, getCurrentUser } from './auth.controller';
import { validateRegister, validateLogin } from './auth.validation';
import { protect } from '../../middleware/auth.middleware';

const router = Router();
router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);
router.get('/me', protect, getCurrentUser);


export default router;

