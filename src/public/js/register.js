const form = document.getElementById('registerForm');
console.log(form)

form.addEventListener('submit', e => {
    e.preventDefault();
    //console.log("holaaa")
    const data = new FormData(form)
    const obj = {}
    data.forEach((value, key) => obj[key] = value);
   
    fetch('/api/sessions/register', {
        method: 'POST',
        body: JSON.stringify(obj),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(result => {
        return result.json(); // Parsea la respuesta JSON
    }).then(result => {
        if (result.status === 'success') {
            Swal.fire({
                title: `¡Hola, ${data.get('first_name')}!`, 
                text: `Se ha creado un nuevo usuario con el correo: ${data.get('email')} y la contraseña que definiste.`,
                icon: 'success',
                confirmButtonText: 'Aceptar',
                backdrop: 'rgba(82, 69, 168, 0.584)'
            }).then(() => {
                window.location.replace('/users/login');
            });
        } else if(result.status === 'noSuccess'){
            // Si la respuesta no es exitosa, muestra un alert de error
            Swal.fire({
                title: 'Error',
                text: 'El correo ya esta registrado con otro usuario :(',
                icon: 'error',
                confirmButtonText: 'Aceptar',
                backdrop: 'rgba(168, 69, 69, 0.666)'
            });
        }
    }).catch(error => {
        console.error('Ha surgido un error: ', error);
    });
});