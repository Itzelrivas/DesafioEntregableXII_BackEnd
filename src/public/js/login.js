const form = document.getElementById('loginForm');

form.addEventListener('submit', e => {
    e.preventDefault();
    const data = new FormData(form);
    const obj = {};
    data.forEach((value, key) => obj[key] = value);
    fetch('/api/sessions/login', {
        method: 'POST',
        body: JSON.stringify(obj),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => {
        if (response.status === 200) {
            return response.json(); 
        } else if (response.status === 401) {
            return response.json().then(data => {
                Swal.fire({
                    title: 'Error',
                    text: 'Al menos uno de los datos que estas proporcionado no está correcto :(',
                    icon: 'error',
                    confirmButtonText: 'Aceptar',
                    backdrop: 'rgba(168, 69, 69, 0.666)'
                });
                throw new Error(data.error); 
            });
        } else {
            throw new Error('Error en la solicitud');
        }
    }).then(data => {
        Swal.fire({
            title: `¡Holaa, ${data.payload.name}!`, 
            text: `Has ingresado con el correo: ${data.payload.email} y con el rol de ${data.payload.role}.`,
            icon: 'success',
            confirmButtonText: 'Aceptar',
            backdrop: 'rgba(95, 158, 160, 0.348)'
        }).then(() => {
            window.location.replace('/handlebars/home');
        });
    }).catch(error => {
        console.error('Ha surgido un error:', error);
    });
});