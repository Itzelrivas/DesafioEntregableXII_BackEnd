import passport from 'passport';
import { initializePassport } from '../services/passport.Service.js';
//Errors
import CustomError from '../services/errors/CustomError.js';
import { loginUserErrorInfoESP, registerUserErrorInfoESP } from '../services/errors/messages/usersErrors.js';
import NErrors from '../services/errors/errors-enum.js';
import { verifyEmailService } from '../services/users.Service.js';

initializePassport()

//Registro de usuario con passport
export const registerUser = (req, res, next) => {
    const { first_name, last_name, email, age, password, role } = req.body; //agregue role
    // Verificar si los campos no están completos para manejar el error
    if (!first_name || !last_name || !email || !age || !password) {
        CustomError.createError({
            name: "User Register Error",
            cause: registerUserErrorInfoESP({ first_name, last_name, email, age, password }),
            message: "error tratando de registrar un nuevo usuario",
            code: NErrors.INVALID_TYPES_ERROR
        });
    }

    passport.authenticate('register', { 
        failureRedirect: '/api/sessions/fail-register' 
    })(req, res, next); 

    let verifyEmail = verifyEmailService(email)
    console.log(verifyEmail)
    //request.logger.debug(verifyEmail)
    if(verifyEmail === null){
        request.logger.error("Error al registrar nuevo usuario.");
        res.status(200).send({ status: 'noSuccess', message: "Usuario no creado porque el correo ya ha sido utilizado anteriormente :(" });
    }
    
    console.log("Registrando nuevo usuario.");
    //request.logger.info("Registrando nuevo usuario.")
    res.status(200).send({ status: 'success', message: "Usuario creado de forma exitosa!!" });
};

//Login del usuario con passport
export const loginUser = (request, response, next) => { 
    const { email, password } = request.body
    // Verificar si los campos no están completos para manejar el error
    if (!email || !password) {
        CustomError.createError({
            name: "User LogIn Error",
            cause: loginUserErrorInfoESP({ email, password }),
            message: "Error al intentar iniciar sesion.",
            code: NErrors.INVALID_TYPES_ERROR
        });
    }

    passport.authenticate('login', (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return response.status(401).send({ status: "error", error: "El usuario y la contraseña no coinciden!" });
        }
        request.login(user, (err) => {
            if (err) {
                return next(err);
            }
            console.log("Usuario encontrado:");
            console.log(user);
            request.session.user = {
                name: `${user.first_name} ${user.last_name}`,
                email: user.email, 
                age: user.age,
                role: user.role,
                cart: user.cart
            };
            response.send({ status: "success", payload: request.session.user, message: "Primer logueo realizado! :)" });
        });
    })(request, response, next);
};

//Login del usuario mediante GitHub
export const loginGitHub = (req, res, next) => {
    passport.authenticate('github', {
        scope: ['user:email'], 
    })(req, res, next); 
};

//Callback de gitHub
export const githubCallbackController = (request, response, next) => {
    passport.authenticate('github', { failureRedirect: '/api/sessions/fail-login' })(request, response, async () => {
        const user = request.user;
        if(user){
            // Asignamos roles si es necesario
            if (user.email === 'adminCoder@coder.com') {
                user.role = 'administrador';
            }

            // Creamos la sesión del usuario
            request.session.user = {
                name: `${user.first_name} ${user.last_name}`,
                email: user.email,
                age: user.age,
                role: user.role
            };

            // Redirigimos al usuario a la página de inicio
            response.redirect("/handlebars/home");
        }
        
    });
};