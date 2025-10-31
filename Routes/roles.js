import express from 'express';
import { createRole, getRoles,editRole} from '../controllers/role.js';
import { verifyToken } from '../middlewares/auth.js';
import { permit } from '../middlewares/permit.js';

const router = express.Router();

router.post('/', verifyToken, permit('Admin'), createRole);
router.get('/', verifyToken, permit('Admin'), getRoles);
router.put('/:id', verifyToken, permit('Admin'), editRole);
// router.delete('/:id', verifyToken, permit('Admin'), deleteRole);


export default router;
