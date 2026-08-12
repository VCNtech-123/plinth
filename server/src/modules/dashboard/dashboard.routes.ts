import { Router } from 'express';
import { protect } from '../../middleware/auth.middleware';
import { getDashboard } from './dashboard.controller';
import { attachWorkspace } from '../../middleware/workspace.middleware';

const router = Router();

router.get("/", protect, attachWorkspace, getDashboard);

export default router;