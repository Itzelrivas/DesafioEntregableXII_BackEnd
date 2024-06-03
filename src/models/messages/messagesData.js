import { messagesModel } from './messages.model.js'

//Buscamos si el usuario ya ha mandado mensajes antes y esta en la bd
export const findUserMessages = async (user) => {
    try {
        return await messagesModel.findOne({ user: user });
    } catch (error) {
        console.error("Ha surgido este error: " + error);
        return error;
    }
}

//Actualizamos el array de messages de un user específico
export const updateMessage = async (user, message) => {
    try {
        return await messagesModel.updateOne({ user: user }, { $push: { message: message } });
    } catch (error) {
        console.error("Ha surgido este error: " + error);
        return error;
    }
}

//Creamos el array donde se van a guardar los mensajes
export const createMessage = async (data) => {
    try {
        return await messagesModel.create(data);
    } catch (error) {
        console.error("Ha surgido este error: " + error);
        return error;
    }
}