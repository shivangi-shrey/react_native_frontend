import express from 'express';
import { createRole, getRoles } from '../controllers/role.js';
import { verifyToken } from '../middlewares/auth.js';
import { permit } from '../middlewares/permit.js';

const router = express.Router();

router.post('/', verifyToken, permit('Admin'), createRole);
router.get('/', verifyToken, permit('Admin'), getRoles);

export default router;
