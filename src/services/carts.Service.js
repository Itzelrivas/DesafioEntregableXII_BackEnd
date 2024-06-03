import { getCarts, newCart, getCartById, getCartByIdPopulation, addProductToCart, deleteProductToCart, deleteProductsCart, updateCantProducts, updateProductsCart, addProductToCartBy_Id, getCartBy_IdPopulation, purchaseCart} from "../models/carts/cartsData.js";

//Obtenemos los carritos
export const getCartsService = async () => {
    return await getCarts();
}

//Creamos un nuevo carrito
export const createCartService = async (cart) => {
    try {
        let idCart
        do {
            idCart = Math.floor(Math.random() * 10000);
            const existingCart = await getCartById(idCart);
            if (!existingCart) {
                    break;
            }
        } while (true);
        cart.id = idCart
        await newCart(cart)
        return cart
    } catch (error) {
        console.error("Ha surgido este error en services de cart: " + error);
        return error;
    }
}

//Obtenemos un carrito específico con populación
export const getCartPopService = async (id) => {
    return await getCartByIdPopulation(id)
}

//Obtenemos un carrito específico mediante su _id
export const getCartPopBy_IdService = async (_id) => {
    return await getCartBy_IdPopulation(_id)
}

//Agregamos un producto específico a un carrito
export const addProductToCartService = async (cartId, productId) => {
    return await addProductToCart(cartId, productId)
}

//Agregamos un producto específico al carrito de la persona logueada
export const addProductToCartBy_IdService = async (cartId, product_Id) => {
    return await addProductToCartBy_Id(cartId, product_Id)
}

//Eliminamos un producto específico a un carrito
export const deleteProductToCartService = async (cartId, productId) => {
    return await deleteProductToCart(cartId, productId)
}

//Eliminamos todos los productos de un carrito específico
export const deleteProductsCartService = async (cartId) => {
    return await deleteProductsCart(cartId)
}

//Actualizamos la cantidad que hay de un producto específico en un carrito
export const updateCantProductsService = async (cartId, productId, newQuantity) => {
    return await updateCantProducts(cartId, productId, newQuantity)
}

//Actualizamos el array de productos de un carrito
export const updateProductsCartService = async (cartId, newProducts) => {
    return await updateProductsCart(cartId, newProducts)
}

//Finalizamos la compra y generamos el ticket
export const purchaseCartService = async (cid, email) => {
    return await purchaseCart(cid, email)
}