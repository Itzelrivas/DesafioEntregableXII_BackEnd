import { cartsModel } from "./carts.model.js";
import { productsModel } from "../products/products.model.js";
import { getTicket } from "../ticket/ticketsData.js";
import { sendEmail } from "../email/emailData.js";
//import { currentCart } from "../../services/passport.Service.js";

const carts = cartsModel.find()

export const getCarts = async () => {
    try {
        return await carts;
    } catch (error) {
        console.error("Ha surgido este error: " + error);
        return error;
    }
}

//Obtenemos todos los carritos con population
export const getCartsPopulated = async () => {
    try {
        return await cartsModel.find().populate('products.product');
    } catch (error) {
        console.error("Ha surgido este error: " + error);
        return error;
    }
}

//Creamos un nuevo carrito
export const newCart = async (cart) => {
    try {
        return await cartsModel.create(cart)
    } catch (error) {
        console.error("Ha surgido este error: " + error);
        return error;
    }
}

//Buscamos un carrito con su id
export const getCartById = async (id) => {
    try{
        return await cartsModel.findOne({ id: id })
    } catch (error) {
        console.error("Ha surgido este error: " + error);
        return error;
    }
}

//Obtenemos un carrito específico con population
export const getCartByIdPopulation = async (id) => {
    try {
        return await cartsModel.findOne({ id: id }).populate('products.product');
    } catch (error) {
        console.error("Ha surgido este error en models de cart: " + error);
        return error;
    }
}

//Obtenemos un carrito mediante su _id
export const getCartBy_IdPopulation = async (_id) => {
    try {
        return await cartsModel.findOne({ _id: _id }).populate('products.product');
    } catch (error) {
        console.error("Ha surgido este error en models de cart: " + error);
        return error;
    }
}

//Agregamos un producto específico a un cart específico
export const addProductToCart = async (cartId, productId) => {
    try {
        const cart = await cartsModel.findOne({ id: cartId });
        const product = await productsModel.findOne({ id: productId });
        const existingProductIndex = cart.products.findIndex(item => item.product.toString() === product._id.toString());
        if (existingProductIndex !== -1) {
            // Si el producto ya está en el carrito, incrementar la cantidad
            cart.products[existingProductIndex].quantity++;
        } else {
            // Si el producto no está en el carrito, agregarlo al carrito con cantidad 1
            cart.products.push({ product: product._id, quantity: 1 });
        }

        // Actualizar el carrito en la base de datos
        return await cartsModel.findOneAndUpdate({ id: cartId }, { products: cart.products });
    } catch (error) {
        console.error("Ha surgido este error en models de cart: " + error);
        return error;
    }
}

//Agregamos un producto específico según su _id al cart de la persona logueada
export const addProductToCartBy_Id = async (cartId, product_Id) => {
    try {
        const cart = await cartsModel.findOne({ _id: cartId });
        const product = await productsModel.findOne({ _id: product_Id });
        const existingProductIndex = cart.products.findIndex(item => item.product.toString() === product._id.toString());
        if (existingProductIndex !== -1) {
            // Si el producto ya está en el carrito, incrementar la cantidad
            cart.products[existingProductIndex].quantity++;
        } else {
            // Si el producto no está en el carrito, agregarlo al carrito con cantidad 1
            cart.products.push({ product: product._id, quantity: 1 });
        }

        // Actualizar el carrito en la base de datos
        return await cartsModel.findOneAndUpdate({ _id: cartId }, { products: cart.products });
    } catch (error) {
        console.error("Ha surgido este error en models de cart: " + error);
        return error;
    }
}

//Eliminamos un producto específico de un cart específico
export const deleteProductToCart = async (cartId, productId) => {
    try {
        let carts = await cartsModel.find()
        let idSearch = carts.find(cart => cart.id === cartId) //carrito que busco
        let productsCart = idSearch.products //Productos del carrito
        let productSearch = await productsModel.findOne({ id: productId });
    
            
        const productPosition = productsCart.findIndex(prod => prod.product.toString() === productSearch._id.toString())
        if (productsCart[productPosition].quantity > 1) {
            return await cartsModel.updateOne(
                { id: cartId, "products.product": productSearch._id },
                { $inc: { "products.$.quantity": -1 } }
            );
        }
        else if (productsCart[productPosition].quantity === 1) {
            return await cartsModel.updateOne(
                { id: cartId },
                { $pull: { products: { product: productSearch._id } } }
            );
        }
    } catch (error) {
        console.error("Ha surgido este error en models de cart: " + error);
        return error;
    }
}

//Eliminamos todos los productos de un cart específico
export const deleteProductsCart = async (cartId) => {
    try {
        return await cartsModel.updateOne({ id: cartId }, { $set: { products: [] } });
    } catch (error) {
        console.error("Ha surgido este error en models de cart: " + error);
        return error;
    }
}

//Modifica la cantidad de productos de un tipo específico en un carrito específico
export const updateCantProducts = async (cartId, productId, newQuantity) => {
    try {
        const cart = await cartsModel.findOne({id: cartId})
        const product = await productsModel.findOne({ id: productId });
        const existingProductIndex = cart.products.findIndex(item => item.product.toString() === product._id.toString());
        cart.products[existingProductIndex].quantity = parseInt(newQuantity);
        return await cartsModel.findOneAndUpdate({ id: cartId }, { products: cart.products });
    } catch (error) {
        console.error("Ha surgido este error en models de cart: " + error);
        return error;
    }
}

//Modifica el array completo de productos de un cart específico
export const updateProductsCart = async (cartId, newProducts) => {
    try {
        const cart = await cartsModel.findOne({ id: cartId });
        cart.products = newProducts
        return await cartsModel.findOneAndUpdate({ id: cartId }, { products: cart.products });
    } catch (error) {
        console.error("Ha surgido este error en models de cart: " + error);
        return error;
    }
}

//Finalizamos la compra products
export const purchaseCart = async (id, email) =>{
    try {
        console.log(id)
        const cart = await cartsModel.findOne({ id: id }).populate('products.product');
        console.log("hola")
        console.log(cart.products)
        console.log("adios")
        if (!cart) {
            console.log("El carrito con el ID proporcionado no fue encontrado.");
            return;
        }
        //Inicializamos el total
        let amount=0
        //Declaramos el array de los id's de los productos de los que no hay suficiente stock
        let productsLeft = []
        
        // Iteramos sobre cada producto del carrito
        for (const product of cart.products) {
            let product_Id = product.product._id
            console.log(product_Id) 
            let quantityProduct = parseInt(product.quantity)
            console.log(quantityProduct)
            let productInDB = await productsModel.findOne({_id: product_Id})
            console.log(productInDB)
            let idProduct = parseInt(productInDB.id)
            console.log(idProduct)
            let realQuantity = parseInt(productInDB.stock)
            console.log(realQuantity)
            let priceProduct = parseInt(productInDB.price)
            console.log(priceProduct)
            if(quantityProduct<=realQuantity){
                amount += quantityProduct*priceProduct
                let newQuantity = realQuantity-quantityProduct
                //Modificamos el stock
                await productsModel.findOneAndUpdate({_id: product_Id}, {stock: newQuantity})
                //Eliminamos el producto del carrito
                await deleteProductToCart(id, idProduct)
            } else{
                amount += realQuantity*priceProduct
                //Modificamos el stock
                await productsModel.findOneAndUpdate({_id: product_Id}, {stock: 0})
                //Solo se guardan los products de los que no hay suficiente stock
                let newQuantity = quantityProduct-realQuantity
                console.log(newQuantity)
                await updateCantProducts(id, idProduct, newQuantity)
                //Pusheamos el id del product a mi array
                productsLeft.push(idProduct)
            }
        }
        console.log(amount)
 
        const ticket = await getTicket(amount, email)
        //Mandamos el ticket al email del usuario
        await sendEmail(email, ticket)
        return productsLeft;

    } catch (error) {
        console.error("Ha surgido este error en models de cart: " + error);
        return error;
    }
}