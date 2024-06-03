import { deleteProduct, getLimitedProducts, getProductById, getProductBy_Id, getProducts, getProductsCategory, getProductsPaginated, getProductsRT, getProductsSort, newProduct, updateProduct } from "../models/products/productsData.js";

//Obtenemos los productos
export const getProductsService = async () => {
    return await getProducts()
}

//Obtenemos un producto específico según su id
export const getProductIdService = async (id) => {
    return await getProductById(id)
}

//Obtenemos un producto según su _id
export const getProduct_IdService = async (_id) => {
    return await getProductBy_Id(_id)
}

//Obtenemos los productos con paginación
export const getProductsPaginatedS = async (page) => {
    return await getProductsPaginated(page)
}

//Obtenemos los productos con la opción de tener un limite
export const getProductsLimitedS = async (limit) => {
    return await getLimitedProducts(limit)
}

//Obtenemos los productos ordenados según su precio
export const getProductsSortService = async (page) => {
    return await getProductsSort(page)
}

//Obtenemos los productos por categoría
export const getProductsCategorySer = async (page, category) => {
    return await getProductsCategory(page, category)
}

//Obtenemos los productos en tiempo real
export const getProductsRTService = async () => {
    return await getProductsRT()
}

//Creamos un nuevo producto
export const newProductService = async (body) => {
    return await newProduct(body)
}

//Actualizamos un producto específico
export const updateProductService = async (productId, productUpdate) => {
    return await updateProduct(productId, productUpdate)
}

//Eliminamos un producto específico
export const deleteProductService = async (productId) => {
    return await deleteProduct(productId)
}

