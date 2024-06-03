import { generateProduct } from "../../utils.js";

//Nos genera y entrega 100 productos con Mocking
export const getUsersController = async (request, response) => {
    try {
        let products = [];
        for (let i = 0; i < 100; i++) {
            products.push(generateProduct());
        }
        response.send({ status: "success", payload: products });
    } catch (error) {
        //console.error("Ha surgido este error: " + error)
        request.logger.error(`Ha surgido este error: ${error}`)
		response.status(500).send('<h2 style="color: red">¡Oh oh! Ha surgido un error, por lo tanto, no se pudo obtener los productos.</h2>')
    }
}