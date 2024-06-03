function addToCart(productId) {
    // Realiza una solicitud POST para agregar el producto al carrito
    fetch(`/api/carts/addProduct/${productId}`, {
        method: 'POST',
    })
    .then(response => {
        if (response.ok) {
            return response.text();
        }
        throw new Error('Error al agregar el producto al carrito');
    })
    .then(message => {
        // Si la respuesta es "Producto agregado", muestra el mensaje
        if (message === 'Producto agregado') {
            console.log('Producto agregado al carrito');
        } else {
            // Si la respuesta es diferente, muestra el mensaje de error
            console.error('No se pudo agregar el producto al carrito:', message);
        }
    })
    .catch(error => {
        console.error('Error al agregar el producto al carrito:', error);
    });
}