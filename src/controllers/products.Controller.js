import { deleteProductService, getProductIdService, getProduct_IdService, getProductsCategorySer, getProductsLimitedS, getProductsPaginatedS, getProductsRTService, getProductsService, getProductsSortService, newProductService, updateProductService } from "../services/products.Service.js";
import fs from 'fs';
import { socketServer } from '../app.js';
import __dirname from '../../utils.js';
import CustomError from "../services/errors/CustomError.js";
import NErrors from "../services/errors/errors-enum.js";
import { createNewProductErrorInfoEsp, getProductsErrorESP, searchProductErrorInfoESP } from "../services/errors/messages/productsErrors.js";

//Obtenemos los productos
export const getProductsController = async (request, response) => {
    try {
		let products = await getProductsService()
		if (!products) {
			products = [];
            //Manejamos el error
            CustomError.createError({
                name: "Get products Error",
                cause: getProductsErrorESP(),
                message: "Error al obtener los productos de la base de datos.",
                code: NErrors.DATABASE_ERROR
            });

			response.send("Ooooh, parece que no hay productos disponibles.")
		} else {
			response.send(products)
		}
	} catch (error) {
		//console.error("Error al intentar acceder a los productos: " + error);
        request.logger.error(`Ha surgido este error: ${error}`)
		return response.status(500).send('<h2 style="color: red">¡Oh oh! Ha surgido un error.</h2>')
	}
}

//Obtenemos un producto mediante su id
export const getProductIdController = async (request, response) => {
    let productId = request.params.pid
    productId = parseInt(productId)
    try {
		//Manejamos el error
        if (!productId || isNaN(productId)) {
            CustomError.createError({
                name: 'Product Search Error',
                cause: searchProductErrorInfoESP(productId),
                message: 'Error tratando de obtener un producto mediante su id.',
                code: NErrors.INVALID_TYPES_ERROR
            })
        }

		const idSearch = await getProductIdService(productId)
		if (idSearch) {
			return response.send(idSearch)
		}
		return response.send({ msg: `El producto con el id=${productId} no existe.` })
	} catch (error) {
		//console.error(error)
        request.logger.error(`Ha surgido este error: ${error}`)
		return response.status(500).send('<h2 style="color: red">¡Oh oh! Ha surgido un error, por lo tanto, no se pudo mostrar lo solicitado.</h2>')
	}
}

//Obtenemos un producto específico mediante su _id
export const getProduct_IdController = async (request, response) => {
    try {
        let product_id = request.params.p_id
        const productSearch =  await getProduct_IdService(product_id)
        if(productSearch){
            return response.send(productSearch)
        }
        return response.send({ msg: `El producto con el _id=${product_id} no existe.` })
    } catch (error) {
        //console.error("Ha surgido este error: " + error)
        request.logger.error(`Ha surgido este error: ${error}`)
		response.status(500).send('<h2 style="color: red">¡Oh oh! Ha surgido un error, por lo tanto, no se pudo mostrar lo solicitado.</h2>')
	}
}

//Obtenemos los productos con la opción de limit y de paginación
export const getProductsLimitPaginated = async (request, response) => {
	try {
        let page = parseInt(request.query.page) || 1;
        let limit = parseInt(request.query.limit);

        // Si limit no es un número válido o está vacío, asignarle el valor predeterminado de 10
        if (!limit || isNaN(limit)) {
            limit = 10;
        }

        if (!request.query.hasOwnProperty('limit')) {
            // Si limit no está presente en la consulta, utilizar la paginación
            let result = await getProductsPaginatedS(page);
			//console.log(result)
            request.logger.debug(result)
            // Actualizar los enlaces de paginación
            result.prevLink = result.hasPrevPage ? `http://localhost:9090/handlebars/home?page=${result.prevPage}` : '';
            result.nextLink = result.hasNextPage ? `http://localhost:9090/handlebars/home?page=${result.nextPage}` : '';
            result.isValid = !(page <= 1 || page > result.totalPages);
            result.shouldShowPagination = result.page <= result.totalPages;

            //Mensaje que se manda para saber detalles de la page
            let responseObject = {
                status: "success",
                payload: result.docs,
                totalPages: result.totalPages,
                prevPage: result.prevPage,
                nextPage: result.nextPage,
                page: result.page,
                hasPrevPage: result.hasPrevPage,
                hasNextPage: result.hasNextPage,
                prevLink: result.hasPrevPage ? `http://localhost:9090/handlebars/home?page=${result.prevPage}` : null,
                nextLink: result.hasNextPage ? `http://localhost:9090/handlebars/home?page=${result.nextPage}` : null
            };
            console.log(responseObject)
            
            return response.render('home', {
                style: "viewsHandlebars.css",
                result,
                user: request.session.user
            });
        } else {
            // Si se proporciona un límite en la consulta, no se utiliza la paginación
            let products = await getProductsLimitedS(limit);
            return response.render('home', {
                style: "viewsHandlebars.css",
                result: {
                    docs: products,
                    isValid: true // Se establece como válido ya que no hay paginación
                }
            });
        }

    } catch (error) {
        //console.error("Ha surgido este error: " + error);
        request.logger.error(`Ha surgido este error: ${error}`)
        response.status(500).send('<h2 style="color: red">¡Oh oh! Ha surgido un error al obtener los productos.</h2>');
    }
}

//Obtenemos los productos en orden de acuerdo a su precio
export const getProductsSortController = async (request, response) => {
    try {
        let page = parseInt(request.query.page) || 1;
        let result = await getProductsSortService(page)

        result.prevLink = result.hasPrevPage ? `http://localhost:9090/handlebars/home/sort?page=${result.prevPage}` : '';
        result.nextLink = result.hasNextPage ? `http://localhost:9090/handlebars/home/sort?page=${result.nextPage}` : '';
        result.shouldShowPagination = result.page <= result.totalPages;
        result.order = "Ordenamos los productos de menor a mayor precio ... "

        //Mensaje que se manda para saber detalles de la page
        let responseObject = {
            status: "success",
            payload: result.docs,
            totalPages: result.totalPages,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            page: result.page,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevLink: result.hasPrevPage ? `http://localhost:9090/handlebars/home/sort?page=${result.prevPage}` : null,
            nextLink: result.hasNextPage ? `http://localhost:9090/handlebars/home/sort?page=${result.nextPage}` : null
        };
        console.log(responseObject)

        response.render('home', {
            style: "viewsHandlebars.css",
            result
        });
    } catch (error) {
        //console.error("Ha surgido este error: " + error);
        request.logger.error(`Ha surgido este error: ${error}`)
        response.status(500).send('<h2 style="color: red">¡Oh oh! Ha surgido un error al ordenar los productos.</h2>');
    }
}

//Obtenemos los productos según la categoría
export const getProductsCategoryCont = async (request, response) => {
    try {
        let page = parseInt(request.query.page) || 1;
        let category = (request.query.category).toLowerCase(); 
        let result = await getProductsCategorySer(page, category)

        // Actualizar los enlaces de paginación
        result.prevLink = result.hasPrevPage ? `http://localhost:9090/handlebars/home/search?category=${category}&page=${result.prevPage}` : '';
        result.nextLink = result.hasNextPage ? `http://localhost:9090/handlebars/home/search?category=${category}&page=${result.nextPage}` : '';
        result.shouldShowPagination = result.page <= result.totalPages;
        result.order = `Filtramos por la categoria: ${category.toUpperCase()}`

        //Mensaje que se manda para saber detalles de la page
        let responseObject = {
            status: "success",
            payload: result.docs,
            totalPages: result.totalPages,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            page: result.page,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevLink: result.hasPrevPage ? `http://localhost:9090/handlebars/home/search?category=${category}&page=${result.prevPage}` : null,
            nextLink: result.hasNextPage ? `http://localhost:9090/handlebars/home/search?category=${category}&page=${result.nextPage}` : null
        };
        console.log(responseObject)

        response.render('home', {
            style: "viewsHandlebars.css",
            result
        });
    } catch (error) {
        //console.error("Ha surgido este error: " + error);
        request.logger.error(`Ha surgido este error: ${error}`)
        response.status(500).send('<h2 style="color: red">¡Oh oh! Ha surgido un error al ordenar los productos.</h2>');
    }
}
     

//Obtenemos productos en tiempo real
export const getProductsRTController = async (request, response) => {
    try {
        let products = await getProductsRTService()
        console.log(products)
        // Renderizar la plantilla con los datos actualizados
        response.render('realTimeProducts', {
            style: "viewsHandlebars.css",
            products
        });
    } catch (error) {
        //console.error("Ha surgido este error: " + error);
        request.logger.error(`Ha surgido este error: ${error}`)
        response.status(500).send('<h2 style="color: red">¡Oh oh! Ha surgido un error al obtener los productos.</h2>');
    }
}

//Obtenemos los productos con paginación y botón
export const getProductsPaginatedButton = async (request, response) => {
    try {
        let page = parseInt(request.query.page) || 1;

        let result = await getProductsPaginatedS(page)

        // Actualizar los enlaces de paginación
        result.prevLink = result.hasPrevPage ? `http://localhost:9090/handlebars/products?page=${result.prevPage}` : '';
        result.nextLink = result.hasNextPage ? `http://localhost:9090/handlebars/products?page=${result.nextPage}` : '';
        result.isValid = !(page <= 1 || page > result.totalPages);

        //Mensaje que se manda para saber detalles de la page
        let responseObject = {
            status: "success",
            payload: result.docs,
            totalPages: result.totalPages,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            page: result.page,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevLink: result.hasPrevPage ? `http://localhost:9090/handlebars/products?page=${result.prevPage}` : null,
            nextLink: result.hasNextPage ? `http://localhost:9090/handlebars/products?page=${result.nextPage}` : null
        };
        console.log(responseObject)

        return response.render('productsWithButton', {
            style: "viewsHandlebars.css",
            result
        });

    } catch (error) {
        //console.error("Ha surgido este error: " + error);
        request.logger.error(`Ha surgido este error: ${error}`)
        response.status(500).send('<h2 style="color: red">¡Oh oh! Ha surgido un error al mostrar los productos.</h2>');
    }
}

//Creamos un nuevo producto
export const newProductController = async (request, response) => {
    try {
        //prueba- No funciona
        const currentRol=request.session.user.role
        console.log(currentRol)

        let products = await getProductsService()
        const { title, description, code, price, stock, category, owner } = request.body;
        if (!title || !description || !code || !price || !stock || !category) {
            if (request.files && request.files.length > 0) {
                //Esto es para evitar que se guarden archivos si los parametros no estan completos
                request.files.forEach(file => {
                    fs.unlinkSync(file.path);
                });
            }
            
            //Manejamos errores
            if (!title || !description || !code || !price || !stock || !category || typeof title !== "string" || typeof description !== "string" || typeof code !== "string" || typeof price !== "number" || typeof stock !== "number" || typeof category !== "string") {
                CustomError.createError({
                    name: "Create New Product Error",
                    cause: createNewProductErrorInfoEsp(title, description, code, price, stock, category),
                    message: "Error al tratar de crear un nuevo producto.",
                    code: NErrors.INVALID_TYPES_ERROR
                });
            }

            return response.status(400).send({ status: "error", msg: "¡Oh oh! No se han completado todos los campos requeridos." });
        }

        const idGenerator = Math.floor(Math.random() * 10000)
        let idNewProduct = idGenerator
        //Esto es para garatizar que ningun id se repite
        if (products.length > 0) {
            const productsId = products.map(product => product.id)
            if (productsId.includes(idNewProduct)) {
                while (productsId.includes(idGenerator)) {
                    idNewProduct = idGenerator
                }
            }
        }
        let categoryLC = category.toLowerCase()

        const status = true;
        let thumbnailImages = request.files ? request.files.map(file => `/${file.filename}`) : [] // Formatear la ruta de la thumbnail

        //Asignamos valor a owner 🔴
        let ownerFinal
        if(owner.trim() === ""){
            ownerFinal = 'admin'
        }else{
            ownerFinal = owner
        }

        let body =  { id: idNewProduct, title, description, code, price, stock, category: categoryLC, thumbnail: thumbnailImages, status, owner: ownerFinal }
        //mongo
        await newProductService(body)
        products = await getProductsService()
        socketServer.emit('updateProducts', products);//Esto es para el websocket

        return response.send({ status: "Success", msg: `Se ha creado un nuevo producto exitosamente con id=${idNewProduct} :)` });
	} catch (error) {
		//console.error(error);
        request.logger.error(`Ha surgido este error: ${error}`)
		return response.status(500).send('<h2 style="color: red">¡Oh oh! Ha surgido un error, por lo tanto, no se pudo crear un nuevo producto.</h2>');
	}
}

//Actualizamos un producto
export const updateProductController = async (request, response) => {
    try {
		let products = await getProductsService()

		//Esto es para ver si esta vacío el archivo
		if (products.length < 0) {
			return response.send('<h2 style="color: red">No hay productos disponibles, por lo tanto, no podemos ejecutar esto.</h2>');
		}

		let productId = parseInt(request.params.pid)
		let productUpdate = request.body
		const productPosition = products.findIndex(prod => prod.id === parseInt(productId))

		if (productPosition < 0) { //Verificamos que el producto exista
			return response.status(202).send({ status: "info", error: `No se ha encontrado ningún producto con id=${productId}.` });
		}

        await updateProductService(productId, productUpdate)
		products = await getProductsService() // Mando los productos actualizados al socket
		socketServer.emit('updateProducts', products);//esto lo agregue para que me actualice los productos en tiempo real

		return response.send({ status: "Success", message: "Se ha actualizado el producto con éxito :)", data: products[productPosition] })
	} catch (error) {
		//console.error("Ha surgido este error: " + error)
        request.logger.error(`Ha surgido este error: ${error}`)
		response.status(500).send('<h2 style="color: red">¡Oh oh! Ha surgido un error, por lo tanto, no se pudo actualizar el producto.</h2>')
	}
}

//Eliminamos un producto
export const deleteProductController = async (request, response) => {
    try {
        //prueba- No funciona
        const currentRol=request.session.user.role
        console.log("Este es el role: ")
        console.log(currentRol)

		let products = await getProductsService()
		let productId = parseInt(request.params.pid)
		let productsSize = products.length
		const productPosition = products.findIndex(prod => prod.id === parseInt(productId))

		if (productPosition < 0) { //Checamos que el producto exista
			return response.status(202).send({ status: "info", error: `No se ha encontrado ningún producto con id=${productId}.` });
		}

		const productToDelete = products[productPosition];
		if (productToDelete.thumbnail && productToDelete.thumbnail.length > 0) {
			productToDelete.thumbnail.forEach(image => {
				// Construimos la ruta absoluta, porque no me funcionaba de otra manera
				const imagePath = (__dirname + '/src/public/img' + image);
				if (fs.existsSync(imagePath)) {
					try {
						fs.unlinkSync(imagePath);
					} catch (error) {
						console.error(`Error al eliminar ${imagePath}: ${error}`);
					}
				} else {
					console.log(`${imagePath} no existe`);
				}
			});
		}

		await deleteProductService(productId)
		products = await getProductsService() // Mando los productos actualizados al socket

		if (products.length === productsSize) { //Si no se elimino el user, mostramos el siguiente error:
			return response.status(500).send({ status: "error", error: `¡oh oh! El producto con id=${productId} no se pudo borrar.` });
		}

		socketServer.emit('updateProducts', products);//Esto es para el websocket

		response.send({ status: "Success", message: `El producto con id=${productId} ha sido eliminado.` });
	} catch (error) {
		//console.error("Ha surgido este error: " + error)
        request.logger.error(`Ha surgido este error: ${error}`)
		response.status(500).send('<h2 style="color: red">¡Oh oh! Ha surgido un error, por lo tanto, no se pudo eliminar el producto.</h2>')
	}
}