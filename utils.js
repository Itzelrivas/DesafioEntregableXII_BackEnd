import { fileURLToPath } from 'url'
import { dirname } from 'path' //Devuelve el nombre del directorio, es decir, la ruta absoluta
import multer from 'multer'
import bcrypt from 'bcrypt'
import { rolCurrentUser } from './src/services/passport.Service.js'
import { faker } from '@faker-js/faker'

const __filename = fileURLToPath(import.meta.url) //Esto es para trabajaro con rutas absolutas
const __dirname = dirname(__filename)

export default __dirname;

//Configuración de Multer:
const storage = multer.diskStorage({
	//ubicacion del directorio donde voy a guardar los archivos
	destination: function(request, file, cb){
		cb(null, `${__dirname}/src/public/img`) //Vamos a guardar en una carpata llamada "img" dentro de public
	},
	//El nombre que quiero que tengan los archivos que se suban:
	filename: function(req, file, cb) {
		cb(null, `${Date.now()}-${file.originalname}`) //Llamaremos al archivo con esta estructura: fechaActual-NombredelArchivo
	}
})


//Lo exportamos:
export const uploader = multer({
	storage, 
	//si se genera algun error, lo capturamos
	onError: function (err, next){
		console.log(err)
		next()
	}
})

//Bcrypt
export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10)) //Generamos el hash, que es con lo que se va encriptar mi contraseña

export const isValidPassword = (user, password) => { //Va a validar que mi hash guardado en la base de datos sea igual a la contraseña ingresada en el log in
	console.log(`Datos a validar: user-password: ${user.password}, password: ${password}`);
	return bcrypt.compareSync(password, user.password)
}


//Para manejo de Auth.
export const auth = (request, response, next) => {
	const userRol = rolCurrentUser
	console.log(userRol)
	if(!userRol){
		response.status(403).send('Para poder acceder a esta función es necesario que primero inicies sesión.');
	}
    else if (userRol === 'admin' || userRol === 'premium') {
        next(); // Si el usuario es administrador o premium, permite que continúe con la solicitud
    } else {
        response.status(403).send('Acceso denegado. Debes ser un administrador para realizar esta acción.');
    }
};

//Identificador de users
export const userAuth = (request, response, next) => {
	const userRol = request.session.user.role
	console.log(userRol)
	if(!userRol){
		response.status(403).send('Para poder acceder a esta función es necesario que primero inicies sesión.');
	}
    else if (userRol === 'user') {
        next(); // Si el usuario es user, permite que continúe con la solicitud
    } else {
		console.log("Debes tener un rol de user para poder agregar productos a tu carrito.")
        response.status(403).send('Acceso denegado. Debes tener rol de user para realizar esta acción.');
    }
};

//Mocking de products
faker.locale = 'es'; //Idioma de los datos. 

export const generateProduct = () => {
    const categories = ['pantalon', 'playera', 'vestido', 'bolsas', 'conjuntos', 'perfume']
    const status = ['true', 'false']
    return {
        _id: faker.database.mongodbObjectId(),
        id: faker.datatype.number({ min: 1, max: 10000 }),
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        code: faker.datatype.string({ length: 6, alpha: true }),
        price: faker.commerce.price(),
        stock: faker.random.numeric(1),
        category: categories[Math.floor(Math.random() * categories.length)],
        image: faker.image.image(),
        status: status[Math.floor(Math.random() * status.length)],
    }
};