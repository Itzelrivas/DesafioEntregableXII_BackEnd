import { Router } from 'express';
import { addProductToCartBy_IdController, addProductToCartController, createCartsController, deleteProductToCartController, deleteProductsCartController, getCarPopController, getCartsController, purchaseCartController, updateCantProductsController, updateProductsCartController } from '../controllers/carts.Controller.js';
import { userAuth } from '../../utils.js';
//Manejo de errores
import errorHandler from '../services/errors/middlewares/index.js'

const router = Router();

//Ruta que muestra todos mis carritos con population
router.get('/', getCartsController)

//Ruta para crear un nuevo carrito
router.post('/', createCartsController)

//Params que me muestra un carrito específico con population
router.get('/:cid', getCarPopController)

//Ruta que agrega un producto especifico a un carrito específico
router.post('/:cid/product/:pid', addProductToCartController)

//Ruta que agrega un producto específico al carrito del user logueado solamente si tiene rol de user
router.post('/addProduct/:p_id', userAuth, addProductToCartBy_IdController)

//Ruta que elimina un producto especifico de un carrito específico
router.delete('/:cid/product/:pid', deleteProductToCartController)

//Params para eliminar de un carrito específico, todos sus productos. Funciona con moongose :)
router.delete('/:cid', deleteProductsCartController)

//Ruta que modifica la cantidad de productos de un tipo específico en un carrito
router.put('/:cid/product/:pid', updateCantProductsController)

//Ruta que modifica el array completo de products de un carrito específico
router.put('/:cid', updateProductsCartController)

//Ruta para crear el ticket y finalizar compra
router.post('/:cid/purchase', purchaseCartController)

//Middleware para el manejo de errores
router.use(errorHandler);

export default router; 