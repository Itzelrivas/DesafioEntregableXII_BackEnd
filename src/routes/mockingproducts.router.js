import { Router } from 'express';
import { getUsersController } from '../controllers/mockingProducts.Controller.js';
const router = Router();

export default router;

//Ruta que genera y entrega 100 productos con Mocking
router.get('/', getUsersController)