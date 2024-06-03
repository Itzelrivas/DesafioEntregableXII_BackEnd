//No se puede acceder a los products de la base de datos
export const getProductsErrorESP = () => {
    return `No se pudo acceder a los productos de la base de datos`
}

export const getProductsErrorENG = () => {
    return `Failed to access products from the database.`;
}

//No se proporciona un id o el valor que se proporciona no es del tipo adecuado para poder proporcionar un producto
export const searchProductErrorInfoESP = (productId) => {
    return `El campo de id no esta llenado, o tiene datos no válidos.
    Recuerda que tienes que completar el id para poder buscar el producto:
        -> productId: type Number, recibido: ${productId}
    `;
}

export const searchProductErrorInfoENG = (productId) => {
    return `The id field is either empty or has invalid data.
    Remember you need to provide the id to search for the product:
        -> productId: type Number, received: ${productId}
    `;
}

//No se proporcionan los datos adecuados para crear un nuevo producto
export const createNewProductErrorInfoEsp = (title, description, code, price, stock, category) => {
    return `Uno o más campos no estan llenados, o tienen datos no válidos.
    Recuerda que tienes que llenar los siguientes datos:
        -> title: type String, recibido: ${title}
        -> descrption: type String, recibido: ${description}
        -> code: type String, recibido: ${code}
        -> price: type Number, recibido: ${price}
        -> stock: type Number, recibido: ${stock}
        -> category: type String, recibido: ${category}
    `;
}

export const createNewProductErrorInfoENG = (title, description, code, price, stock, category) => {
    return `One or more fields are empty or have invalid data.
    Remember you need to fill in the following data:
        -> title: type String, received: ${title}
        -> description: type String, received: ${description}
        -> code: type String, received: ${code}
        -> price: type Number, received: ${price}
        -> stock: type Number, received: ${stock}
        -> category: type String, received: ${category}
    `;
}