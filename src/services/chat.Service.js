import { createMessage, findUserMessages, updateMessage } from "../models/messages/messagesData.js"

//Encontramos si un user ya ha mandado mensajes antes y esta en la bd
export const findUserMessagesService = async (user) => {
    return await findUserMessages(user)
}

//Actualizamos el array de mensajes de un usuario
export const updateMessageService = async (user, message) => {
    return await updateMessage(user, message)
}

//Creamos el array de mensajes
export const createMessageService = async (data) => {
    return await createMessage(data)
}