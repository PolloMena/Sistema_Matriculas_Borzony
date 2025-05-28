document.addEventListener('DOMContentLoaded', function() {
    // Verificar si la sesión está activa
    fetch('../Php/sesiones/verificar_sesion.php') // Ajusta la ruta según tu estructura
        .then(response => response.json())
        .then(data => {
            if (!data.autenticado) {
                window.location.href = '../inicio.html'; // Redirige si no hay sesión
            } else {
                console.log("Sesión activa como:", data.usuario);
                console.log("Como rol de :", data.rol);
                // Aquí puedes mostrar el nombre o rol si quieres
            }
        })
        .catch(error => {
            console.error('Error al verificar sesión:', error);
            window.location.href = '../inicio.html'; // Redirige si hay fallo
        });
});

function cerrarSesion() {
    fetch('../Php/sesiones/cerrar_sesion.php')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                window.location.href = '../inicio.html';
            } else {
                alert('Error al cerrar sesión.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Ocurrió un problema al cerrar sesión.');
        });
}
