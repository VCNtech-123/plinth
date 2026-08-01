import { Router } from 'express';
import { register, login, getCurrentUser, logout } from './auth.controller';
import { registerSchema, loginSchema } from './auth.validation';
import { protect } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';

const router = Router();
router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.get('/me', protect, getCurrentUser);
router.post('/logout', logout)


export default router;

