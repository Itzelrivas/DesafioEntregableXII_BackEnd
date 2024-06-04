import { cartsModel } from "../carts/carts.model.js";
import { userModel } from "./user.model.js"

//Obtenemos el carrito asociado a un usuario específico
export const getCartUser = async (email) => {
    try {
        return await userModel.findOne({ email: email }).populate('cart');
    } catch (error) {
        console.error("Ha surgido este error en models de user: " + error);
        return error;
    }
}

//Obtenemos el email del user según el id de su carrito asociado
export const emailByCartId = async (id) => {
    try {
        let cart = await cartsModel.findOne({id: id})
        let cart_Id = cart._id
        let userSearch = await userModel.findOne({cart: cart_Id})
        let userEmail = userSearch.email
        return userEmail
    } catch (error) {
        console.error("Ha surgido este error en models de users: " + error);
        return error;
    }
}

//Verificamos si un correo ya esta asociado a un usuario
export const verifyEmail = async (email) => {
    try {
        let user = await userModel.findOne({email: email})
        return user
    } catch (error) {
        console.error("Ha surgido este error en models de users: " + error);
        return error;
    }
}

//Devolvemos un usuario segun su _id
export const getUser_Id = async (_id) => {
    try {
        let user = await userModel.findOne({_id: _id})
        return user
    } catch (error) {
        console.error("Ha surgido este error en models de users: " + error);
        return error;
    }
}

//Cambiamos el rol del usurio mediante su _id
export const changeRol = async (_id) => {
    try {
        let user = await userModel.findOne({_id: _id})
        if(user.role === 'user'){
            return await userModel.findOneAndUpdate({ _id: _id }, { role: 'premium' })
        }else if(user.role === 'premium'){
            return await userModel.findOneAndUpdate({ _id: _id }, { role: 'user' })
        }
    } catch (error) {
        console.error("Ha surgido este error en models de users: " + error);
        return error;
    }
}