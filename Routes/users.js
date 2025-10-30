import express from 'express';
import { getUsers, assignRole } from '../controllers/user.js';
import { verifyToken } from '../middlewares/auth.js';
import { permit } from '../middlewares/permit.js';

const router = express.Router();

router.get('/', verifyToken, permit('Admin'), getUsers);
router.put('/assign-role', verifyToken, permit('Admin'), assignRole);

export default router;
