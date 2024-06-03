import NErrors from "../errors-enum.js";

//Aqui son los mensajes que se muestran en la consola de PostMan
export default (error, req, res, next) => {
    console.error("Error detectado entrando al Error Handler");
    console.log(error.cause);
    switch (error.code) {
        case NErrors.INVALID_TYPES_ERROR:
            res.status(400).send({ error: error.code, message: error.message });
            break;
        default:
            res.status(500).send({ status: "error", error: "Unhandled error!" });
    }
};