const rolesPermitidos = ['Administrador', 'Directora', 'Ingeniero'];
// Este script verifica si el usuario tiene un rol permitido para acceder a la vista actual
document.addEventListener('DOMContentLoaded', function() {
    // Verificar si la sesión está activa
    fetch('../Php/sesiones/verificar_sesion.php') // Ajusta la ruta según tu estructura
        .then(response => response.json())
        .then(data => {
            if (!data.autenticado) {
                window.location.href = '../../inicio.html'; // Redirige si no hay rol
            } else {
                if (!rolesPermitidos.includes(data.rol)) {
                    Swal.fire({
                    icon: 'error',
                    title: 'Acceso denegado',
                    text: 'Tu rol no tiene permisos para entrar aquí.',
                    confirmButtonText: 'Entendido'
                }).then(() => {
                    window.location.href = 'index.html'; // Redirige después de cerrar el modal
                });
                }
            }
        })
        .catch(error => {
            console.error('Error al verificar sesión:', error);
            window.location.href = 'index.html'; // Redirige si no hay rol
        });
});