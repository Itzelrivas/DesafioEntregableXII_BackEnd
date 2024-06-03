import { ticketModel } from "./ticket.model.js";
import { v4 as uuidv4 } from 'uuid';

//Creamos un ticket con los productos de un carrito
export const getTicket = async (amount, email) => {
    try {
        //Generamos el código
        let code = uuidv4()

        //Generamos la fecha
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); 
        const day = currentDate.getDate().toString().padStart(2, '0');
        const hours = currentDate.getHours().toString().padStart(2, '0');
        const minutes = currentDate.getMinutes().toString().padStart(2, '0');
        const seconds = currentDate.getSeconds().toString().padStart(2, '0');
        const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

        return ticketModel.create({
            code: code,
            purchase_datetime: formattedDateTime,
            amount: amount,
            purchaser: email
        });
    } catch (error) {
        console.error("Ha surgido este error en models de cart: " + error);
        return error;
    }
}