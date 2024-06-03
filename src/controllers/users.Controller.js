import config from "../config/config.js"
import { updatePassword } from "../models/password/getNewPassword.js";
import { comparePasswordService, getCartUserService, sendEmailPasswordService, verifyEmailService } from "../services/users.Service.js"
import jwt from 'jsonwebtoken';

//Obtenemos el carrito asociado a un user mediante el email
export const getCartUserController = async (request, response) => {
    try {
        let user_email = request.params.email
        const user = await getCartUserService(user_email)
        if (!user) {
            return response.status(404).send(`El usuario con correo ${user_email} no se ha encontrado.`);
        }
        //console.log("Se pudo acceder con exito al usuario.")
        request.logger.info("Se pudo acceder con exito al usuario.")
        response.send(user)
    } catch (error) {
        //console.error("Ha surgido este error: " + error);
        request.logger.error(`Ha surgido este error: ${error}`)
        response.status(500).send('<h2 style="color: red">¡Oh oh! Ha surgido un error y no se pueden mostrar el usuario.</h2>');
    }
}

//Registro de usuario
export const registerUserController = async (request, response) => {
    response.render('register', {
        style: "viewsSessions.css"
    })
}

//Login de usuario
export const loginUserController = async (request, response) => {
    response.render('login', {
        style: "viewsSessions.css"
    })
}


//Obtenemos la info del usuario
export const getInfoUser = async (request, response) => {
    const user = request.session.user
    request.logger.info(`Session: ${JSON.stringify(request.session, null, 2)}`)
    response.render('current', { user })
}

//Registro no exitoso
export const failRegister = async (request, response) => {
    response.status(401).send({ error: "Failed to process register!" }) ;
}

//Login no exitoso
export const failLogin = async (request, response) => {
    response.status(401).send({ error: "Failed to process login!" });
}

//Logout
export const logout = async (request, response) => {
    request.session.destroy(error => {
        if (error){
            response.json({error: "error logout", mensaje: "Error al cerrar la sesion"});
        }
        response.redirect('/users/login');
    });   
}

//Actualizamos la contraseña
export const updatePasswordController = async (req, res) => {
    const { token } = req.params;

    // Verificar el token
    try {
        const decoded = jwt.verify(token, config.secret);
        const userId = decoded.userId;

        if (req.method === 'GET') {
            // Renderizar la vista
            res.render('resetPassword', { token });
        } else if (req.method === 'POST') {
            const { newPassword } = req.body;

            try {
                // Lógica para actualizar la contraseña
                const result = await comparePasswordService(newPassword, userId)
                console.log(result)
                if(result === false){
                await updatePassword(userId, newPassword);
                res.send('Contraseña actualizada exitosamente.');
                }else{
                    res.send('La contraseña no puede ser igual a la que tenias anteriormente.')
                }
            } catch (error) {
                console.error('Error al actualizar la contraseña:', error);
                res.status(500).send('Ha ocurrido un error al actualizar la contraseña.');
            }
        }
    } catch (error) {
        console.error('Token inválido o expirado:', error);
        //res.status(400).send('El enlace para restablecer la contraseña ha expirado o es inválido.');
        res.render('expiredLink')
    }
    /*const { token } = req.params;
    if (req.method === 'GET') {
        // Renderizar la vista
        res.render('resetPassword', { token });
    } else if (req.method === 'POST') {
        // Lógica para actualizar la contraseña aquí
        const { email, newPassword } = req.body;
        const user = await verifyEmailService(email)
        //Verificamos que el user este en la base de datos 
        if(!user){
            res.send('El correo proporcionado no esta registrado.');
        }
        try {
            // Lógica para actualizar la contraseña
            await updatePassword(user._id, newPassword);
            res.send('Contraseña actualizada exitosamente.');
        } catch (error) {
            console.error('Error al actualizar la contraseña:', error);
            res.status(500).send('Ha ocurrido un error al actualizar la contraseña.');
        }
    }*/
};

//Mandamos el correo para actualizar la contraseña
export const sendEmailPasswordController = async (request, response) => {
    try {
        //const { email } = request.body
        const email = request.params.email
        await sendEmailPasswordService(email)
        response.send("Se ha mandado un nuevo link al correo proporcionado :)")
    } catch (error) {
        request.logger.error(`Ha surgido este error: ${error}`)
        response.status(500).send('<h2 style="color: red">¡Oh oh! Ha surgido un error y no se pudo generar un nuevo link.</h2>');
    }
}