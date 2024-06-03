import express from 'express';
import { sendEmailPasswordController, updatePasswordController } from '../controllers/users.Controller.js';

const router = express.Router();

router.get('/:token', updatePasswordController); 
router.post('/:token', updatePasswordController);

router.post('/newLink/:email', sendEmailPasswordController);

export default router;