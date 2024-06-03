//No se puede acceder a los carts de la base de datos
export const getCartsErrorESP = () => {
    return `No se pudo acceder a los carts de la base de datos`
}

export const getCartsErrorENG = () => {
    return `Failed to access carts from the database.`;
}

//No se proporciona un id o el valor que se proporciona no es del tipo adecuado para poder proporcionar un carrito
export const searchCartErrorInfoESP = (cartId) => {
    return `El campo de id no esta llenado, o tiene datos no válidos.
    Recuerda que tienes que completar el id para poder buscar el carrito:
        -> cartId: type Number, recibido: ${cartId}
    `;
}

export const searchCartErrorInfoENG = (cartId) => {
    return `The id field is either empty or has invalid data.
    Remember you need to provide the id to search for the cart:
        -> cartId: type Number, received: ${cartId}
    `;
}

//No se proporcionan valores para agregar un producto específico a un carrito específio
export const addProductCartErrorInfoESP = (cartId, productId) => {
    return `Al menos uno de los dos camppos no estan completados, o tienen datos no válidos.
    Recuerda que los parametros que tienens que completar correctamente son:
        -> cartId: type Number, recibido: ${cartId}
        -> productId: type Number, recibido ${productId}
    `;
}

export const addProductCartErrorInfoENG = (cartId, productId) => {
    return `At least one of the two fields is not filled out, or has invalid data.
    Remember that the parameters you need to fill in correctly are:
        -> cartId: type Number, received: ${cartId}
        -> productId: type Number, received: ${productId}
    `;
}

//No se proporcionan valores para eliminar un producto específico a un carrito específio
export const deleteProductCartErrorInfoESP = (cartId, productId) => {
    return `Al menos uno de los dos campos no estan completados, o tienen datos no válidos.
    Recuerda que los parametros que tienens que completar correctamente son:
        -> cartId: type Number, recibido: ${cartId}
        -> productId: type Number, recibido ${productId}
    `;
}

export const deleteProductCartErrorInfoENG = (cartId, productId) => {
    return `At least one of the two fields is not filled out, or has invalid data.
    Remember that the parameters you need to fill in correctly are:
        -> cartId: type Number, received: ${cartId}
        -> productId: type Number, received: ${productId}
    `;
}

//No se proporciona un id o el valor que se proporciona no es del tipo adecuado para poder eliminar todos los productos de un carrito
export const deleteProductsCartErrorInfoESP = (cartId) => {
    return `El campo de id no esta llenado, o tiene datos no válidos.
    Recuerda que tienes que completar el id para poder eliminar los productos del carrito:
        -> cartId: type Number, recibido: ${cartId}
    `;
}

export const deleteProductsCartErrorInfoENG = (cartId) => {
    return `The id field is either empty or has invalid data.
    Remember you need to provide the id to remove products from the cart:
        -> cartId: type Number, received: ${cartId}
    `;
}

//No se proporcionaron los valores necesarios para actualizar la cantidad de un producto en un carrito específico
export const updateQuantityProdCartErrorInfoESP = (cartId, productId, newQuantity) => {
    return`Al menos uno de los campos no estan completados, o tienen datos no válidos.
        Recuerda que los parametros que tienens que completar correctamente son:
            -> cartId: type Number, recibido: ${cartId}
            -> productId: type Number, recibido: ${productId}
            -> newQuantity: type Number, recibido: ${newQuantity}
    `;
}

export const updateQuantityProdCartErrorInfoENG = (cartId, productId, newQuantity) => {
    return `At least one of the fields is not filled out, or has invalid data.
    Remember that the parameters you need to fill in correctly are:
        -> cartId: type Number, received: ${cartId}
        -> productId: type Number, received: ${productId}
        -> newQuantity: type Number, received: ${newQuantity}
    `;
}