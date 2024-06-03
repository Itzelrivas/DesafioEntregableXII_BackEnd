//Importamos librerias 
import passport from 'passport';
import passportLocal from 'passport-local';
import GitHubStrategy from 'passport-github2';
import { userModel }from '../models/users/user.model.js';
import { cartsModel } from '../models/carts/carts.model.js'; 
import { createHash, isValidPassword } from '../../utils.js'; //Funciones de encriptacion que creamos con bcrypt
//Variables de entorno
import config from '../config/config.js'
import { createCartService } from './carts.Service.js';
import { sendEmailPasswordService } from './users.Service.js';

//Declaramos nuestra estrategia:
const localStrategy = passportLocal.Strategy;

let rolCurrentUser;
//let currentEmail;

export const initializePassport = () => {
    //Estrategia para registrar/crear un nuevo usuario 
	passport.use('register', new localStrategy(
		{ passReqToCallback: true, usernameField: 'email' }, 
		async (request, username, password, done) => { 
			const { first_name, last_name, email, age, cart, role } = request.body

			try {
				//Validamos si ya hay un usuario registrado con el mismo correo:
				const exists = await userModel.findOne({ email })
				if(exists){
					console.log ("El usuario ya existe!!");
					return done(null, false)
				} else{
                    //Verificamos que exista el carrito asociado segun su id, en caso de tenerlo y si no se crea un nuevo carrito
                    const cartId = request.body.cart;
                    let idCart
                    if(cartId.trim() !== ""){
                        const cart = await cartsModel.findOne({ id: cartId });
                        if (!cart) {
                            console.log("El carrito no existe!");
                            return done("El carrito no existe!");
                        }else{
                            idCart = cart._id
                        }
                    }
                    else{
                        const newCart = {
                            products: []
                        };
                        const createdCart = await createCartService(newCart);
                        const cart = await cartsModel.findOne({ id: newCart.id });
                        console.log(createdCart)
                        idCart = cart._id
                    }

                    //Asignamos roles
                    let roleFin 
                    if(email === 'adminCoder@coder.com' && password === 'adminCod3r123'){
                        roleFin = 'admin'
                    }else if(!role){
                        roleFin='user'
                    }else{
                        roleFin=role
                    }

					//Si el usuario no existe en la bd, lo damos de alta
					const user = {
						first_name,
						last_name, 
						email, 
						age,
						password: createHash(password), //Guardamos la password hasheada
                        //cart: cart._id, 
                        cart: idCart,
                        role: roleFin
					}
					const result = await userModel.create(user); //Cargamos el usuario en la base de datos
					return done(null, result)
				}
			} catch(error){
				return done("Error registrando el usuario: " + error)
			}
        }
    ))


    //let rolCurrentUser
    //Estrategia para iniciar sesión normal ✅
    passport.use('login', new localStrategy(
		{passReqToCallback: true, usernameField: 'email'},
		async (request, username, password, done) => {
			try {
				const user = await userModel.findOne({ email: username })
				console.log("Usuario encontrado para login:");
				console.log(user);
				
				if (!user){
					console.warn("Invalid credentials for user: " + username)
					return done (null, false)
				}
				
                //Validamos usando Bvcrypt credenciales del usuario
                if (!isValidPassword (user, password)){
                    console.warn ("Invalid credentials for user: " + username)
                    //Mandamos el correo
                    sendEmailPasswordService(username)
                    return done(null, false)
                }

                //Asignamos roles
                if(username === 'adminCoder@coder.com' && password === 'adminCod3r123'){
                    user.role = 'admin'
                } else if(!user.role){
                    user.role = 'user'
                }

                //Capturamos el rol
                rolCurrentUser=user.role

                //chicle y pega
                 // Guardamos los datos del usuario en la sesión
                request.session.user = {
                    name: `${user.first_name} ${user.last_name}`,
                    email: user.email,
                    age: user.age,
                    role: user.role,
                    cart: user.cart
                };

                return done(null, user)
			
            }catch (error) {
                return done(error)
            }
	    }
    ))


    //Estrategia para la serealización 
    passport.serializeUser((user, done) => {
		done (null, user._id)
	})
	
    //Estrategia para la deserealización 
	passport.deserializeUser(async (id,done) => {
		try {
			let user = await userModel.findById(id);
			done (null,user)
		} catch (error) {
			console.error("Error deserializando el usuario: " + error)
		}
	})

	//Estrategia para iniciar sesión con GitHub:
    passport.use('github', new GitHubStrategy(
        { 
            clientID: config.clientId, 
            clientSecret: config.clientSecret,
            callbackUrl: 'http://localhost:9090/api/sessions/githubcallback'
        }, async (accessToken, refreshToken, profile, done) => {
            console.log("Profile obtenido del usuario:");
            console.log(profile);
            try {
                const user = await userModel.findOne({ email: profile._json.email });
                console.log("Usuario encontrado para login:");
                console.log(user);

                if (!user) {
                    console.warn("User doesn't exists with username: " + profile._json.email);

                    //Capturamos el rol
                    rolCurrentUser=user.role

                    let newUser = {
                        first_name: profile._json.login, //Lo puse asi porque estoy registrada bien raramente en GitHub y tengo el name (y el correo) en nulo jajaja
                        last_name: '',
                        age: 18,
                        email: profile._json.email,
                        password: '',
                        role,
                        cart: idCart,
                        loggedBy: 'GitHub'
                    }

                    const result = await userModel.create(newUser)
                    return done(null, result)
                } else {
                    //El usuario ya existe, entonces ya solo entramos:
                    return done(null, user)
                }
            } catch (error) {
                return done(error)
            }
        }
    ))
}

export { rolCurrentUser }