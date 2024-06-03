import { Router } from 'express';
import { deleteProductController, getProductIdController, getProduct_IdController, getProductsController, newProductController, updateProductController } from '../controllers/products.Controller.js';
import { auth, uploader } from '../../utils.js';
import errorHandler from '../services/errors/middlewares/index.js'

const router = Router();

//Ruta que nos muestra todos los productos
router.get('/', getProductsController)

//Ruta que nos muestra un producto especifico dado su id(params)
router.get('/id/:pid', getProductIdController)

//Ruta que nos muestra un producto específico según su _id
router.get('/_id/:p_id', getProduct_IdController)

//Ruta para agregar un producto. Funciona con Moongose :)
router.post('/', auth, uploader.array('files'), newProductController)

//Ruta para actualizar un producto. Funciona con Moongose :)
router.put('/:pid', auth, updateProductController)

//Ruta para eliminar un producto. Funciona con Moongose :)
router.delete('/:pid', auth, deleteProductController)

//Middleware para el manejo de errores
router.use(errorHandler);

export default router;