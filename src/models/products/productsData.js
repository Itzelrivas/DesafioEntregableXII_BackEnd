import { productsModel } from "./products.model.js";

//Obtenemos los productos de la bd
export const getProducts = async () => {
    try {
        return await productsModel.find()
    } catch (error) {
        console.error("Ha surgido este error: " + error);
        return error;
    }
}

//Obtenemos un producto según su Id
export const getProductById = async (id) => {
    try {
        return await productsModel.findOne({id: id})
    } catch (error) {
        console.error("Ha surgido este error: " + error);
        return error;
    }
}

//Obtenemos un producto según su _id
export const getProductBy_Id = async (_id) => {
    try {
        return await productsModel.findOne({_id: _id})
    } catch (error) {
        console.error("Ha surgido este error: " + error);
        return error;
    }
}

//Obtenemos los productos con paginación
export const getProductsPaginated = async (page) => {
    try {
        return await productsModel.paginate({}, { page, limit: 5, lean: true });
    } catch (error) {
        console.error("Ha surgido este error: " + error);
        return error;
    }
}

//Obtenemos productos con límite 
export const getLimitedProducts = async (limit) => { 
    try {
        return await productsModel.find().limit(limit).lean()
    } catch (error) {
        console.error("Ha surgido este error: " + error);
        return error;
    }
}

//Obtenemos los productos ordenados de menor a mayor precio
export const getProductsSort = async (page) => {
    try {
        return await productsModel.paginate({}, { page, limit: 5, sort: { price: 1 }, lean: true });
    } catch (error) {
        console.error("Ha surgido este error: " + error);
        return error;
    }
}

//Obtenemos productos por categoría
export const getProductsCategory = async (page, category) => {
    try {
        let query = category ? { category: category } : {};
        return await productsModel.paginate(query, { page, limit: 5, lean: true });
    } catch (error) {
        console.error("Ha surgido este error: " + error);
        return error;
    }
}

//Obtenemos los productos con cualquier cambio en tiempo real 
export const getProductsRT = async () => {
    try {
        return await productsModel.find().lean();
    } catch (error) {
        console.error("Ha surgido este error: " + error);
        return error;
    }
}

//Creamos un nuevo producto y lo agregamos a la bd
export const newProduct = async (body, role) => {
    try {
        return await productsModel.create(body)
    } catch (error) {
        console.error("Ha surgido este error: " + error);
        return error;
    }
}

//Actualizamos un producto específico
export const updateProduct = async (productId, productUpdate) => {
    try {
        return await productsModel.updateOne({ id: productId }, productUpdate)
    } catch (error) {
        console.error("Ha surgido este error: " + error);
        return error;
    }
}

//Eliminamos un producto específico
export const deleteProduct = async (productId) => {
    try {
        return await productsModel.deleteOne({ id: productId })
    } catch (error) {
        console.error("Ha surgido este error: " + error);
        return error;
    }
}