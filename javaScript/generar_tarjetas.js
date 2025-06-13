document.addEventListener('DOMContentLoaded', async () => {
    try {
        const sesionResp = await fetch('../Php/sesiones/verificar_sesion.php');
        const data = await sesionResp.json();

        let usuariosResp;
        if (data.rol == 'Directora' || data.rol == 'Ingeniero') {
            usuariosResp = await fetch(`../Php/ajustes/obtener_usuarios.php?rol=${data.rol}`);
        }else{
            usuariosResp = await fetch('../Php/ajustes/obtener_usuarios.php');
        }
        // 1. Obtener usuarios desde PHP
        const usuarios = await usuariosResp.json();
        
        // 2. Generar tarjetas
        const carrusel = document.getElementById('carruselUsuarios');
        
        // 3. Ingresar tarjetas de usuario actual
        fetch('../Php/sesiones/verificar_sesion.php') // Ajusta la ruta según tu estructura
        .then(response => response.json())
        .then(data => {
            // Verificar si el usuario es de rol Ingeniero o Directora no generar Tarjeta
            if (!data.autenticado ||data.rol == 'Ingeniero' || data.rol == 'Directora') {

            } else {
                const tarjeta = document.createElement('div');
                tarjeta.className = 'tarjeta-usuario flex-shrink-0 mx-2';
                tarjeta.style.width = '300px';
                tarjeta.style.scrollSnapAlign = 'start';
                
                tarjeta.innerHTML = `
                    <div class="card h-100 shadow-sm">
                        <div class="card-body">
                            <div class="d-flex align-items-center mb-3">
                                <img src="../Assets/img/ajustes/ajustes.jpg" 
                                        alt="${data.usuario}" 
                                        class="rounded-circle me-3" 
                                        width="60" height="60">
                                <div>
                                    <h5 class="mb-0">${data.usuario}</h5>
                                    <span class="badge ${getColorRol(data.rol)}">
                                        ${data.rol}
                                    </span>
                                </div>
                            </div>
                            
                            <div class="mb-3">
                                <label class="form-label">Nueva Contraseña</label>
                                <div class="input-group">
                                <span class="input-group-text"><i class="fas fa-key"></i></span>
                                    <input type="password" 
                                        class="form-control nueva-contrasena" 
                                        placeholder="Mínimo 5 caracteres"
                                        minlength="5">
                                    <button class="btn btn-outline-secondary toggle-password" type="button">
                                        <i class="fas fa-eye"></i>
                                    </button>
                                </div>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Repetir Contraseña</label>
                                <div class="input-group">
                                <span class="input-group-text"><i class="fas fa-key"></i></span>
                                    <input type="password" 
                                        class="form-control confirmar-contrasena" 
                                        placeholder="Repita la contraseña">
                                    <button class="btn btn-outline-secondary toggle-password" type="button">
                                        <i class="fas fa-eye"></i>
                                    </button>
                                </div>
                            </div>
                            
                            <button type="button" 
                                    class="btn btn-warning w-100 btn-guardar"
                                    data-id="${data.ID_Users}">
                                <i class="fas fa-save me-2"></i> Guardar
                            </button>
                        </div>
                    </div>
                `;
                
                carrusel.appendChild(tarjeta);
                
                // PONER AQUI CODIGO
                
            }
            // 4. Ingresar tarjetas de otros usuarios
        usuarios.forEach((usuario, index) => {
            const tarjeta = document.createElement('div');
            tarjeta.className = 'tarjeta-usuario flex-shrink-0 mx-2';
            tarjeta.style.width = '300px';
            tarjeta.style.scrollSnapAlign = 'start';
            
            tarjeta.innerHTML = `
                <div class="card h-100 shadow-sm">
                    <div class="card-body">
                        <div class="d-flex align-items-center mb-3">
                            <img src="../Assets/img/ajustes/ajustes.jpg" 
                                 alt="${usuario.Usuario}" 
                                 class="rounded-circle me-3" 
                                 width="60" height="60">
                            <div>
                                <h5 class="mb-0">${usuario.Usuario}</h5>
                                <span class="badge ${getColorRol(usuario.Rol)}">
                                    ${usuario.Rol}
                                </span>
                            </div>
                        </div>
                        
                        <div class="mb-3">
                            <label class="form-label">Nueva Contraseña</label>
                            <div class="input-group">
                            <span class="input-group-text"><i class="fas fa-key"></i></span>
                                <input type="password" 
                                    class="form-control nueva-contrasena" 
                                    placeholder="Mínimo 5 caracteres"
                                    minlength="5">
                                <button class="btn btn-outline-secondary toggle-password" type="button">
                                    <i class="fas fa-eye"></i>
                                </button>
                            </div>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Repetir Contraseña</label>
                            <div class="input-group">
                            <span class="input-group-text"><i class="fas fa-key"></i></span>
                                <input type="password" 
                                    class="form-control confirmar-contrasena" 
                                    placeholder="Repita la contraseña">
                                <button class="btn btn-outline-secondary toggle-password" type="button">
                                    <i class="fas fa-eye"></i>
                                </button>
                            </div>
                        </div>
                        
                        <button type="button" 
                                class="btn btn-warning w-100 btn-guardar"
                                data-id="${usuario.ID_Users}">
                            <i class="fas fa-save me-2"></i> Guardar
                        </button>
                    </div>
                </div>
            `;
            
            carrusel.appendChild(tarjeta);
        });
        
        // 3. Configurar eventos
        configurarEventos();
        })
        .catch(error => {
            console.error('Error al verificar sesión:', error);
        });

        

        
        
    } catch (error) {
        console.error('Error al cargar usuarios:', error);
        alert('Error al cargar los usuarios. Intente recargar la página.');
    }

    

});

// Función auxiliar para colores de roles
function getColorRol(rol) {
    const colores = {
        'Administrador': 'bg-primary',
        'Auxiliar': 'bg-success',
        'Maestro': 'bg-info',
        'Ingeniero': 'bg-warning text-dark',
        'Directora': 'bg-danger'
    };
    return colores[rol] || 'bg-secondary';
}

// Configura eventos del carrusel
function configurarEventos() {
    // Flechas de navegación
    document.getElementById('btnAnterior').addEventListener('click', () => {
        document.getElementById('carruselUsuarios').scrollBy({ left: -300, behavior: 'smooth' });
    });
    
    document.getElementById('btnSiguiente').addEventListener('click', () => {
        document.getElementById('carruselUsuarios').scrollBy({ left: 300, behavior: 'smooth' });
    });
    
    // Botones de guardar
    document.querySelectorAll('.btn-guardar').forEach(btn => {
        btn.addEventListener('click', function() {
            const tarjeta = this.closest('.tarjeta-usuario');
            const nuevaContrasena = tarjeta.querySelector('.nueva-contrasena').value;
            const confirmacion = tarjeta.querySelector('.confirmar-contrasena').value;
            
            if (validarContrasena(nuevaContrasena, confirmacion)) {
                actualizarContrasena(this.dataset.id, nuevaContrasena);
            }
        });
    });

    document.querySelectorAll('.toggle-password').forEach(button => {
        button.addEventListener('click', function() {
            const input = this.parentElement.querySelector('input');
            const icon = this.querySelector('i');
            
            // Cambiar tipo de input
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.replace('fa-eye', 'fa-eye-slash');
                this.setAttribute('aria-label', 'Ocultar contraseña');
            } else {
                input.type = 'password';
                icon.classList.replace('fa-eye-slash', 'fa-eye');
                this.setAttribute('aria-label', 'Mostrar contraseña');
            }
            
            // Enfocar el input después de cambiar
            input.focus();
        });
    });
}

function validarContrasena(nueva, confirmacion) {
    if (nueva.length < 5) {
        Swal.fire({
            title: 'Contraseña muy corta',
            text: 'La contraseña debe tener al menos 5 caracteres',
            icon: 'warning',
            confirmButtonText: 'Entendido'
        });
        return false;
    }
    
    if (nueva !== confirmacion) {
        Swal.fire({
            title: 'Contraseñas no coinciden',
            text: 'Las contraseñas ingresadas no son iguales',
            icon: 'error',
            confirmButtonText: 'Entendido'
        });
        return false;
    }
    
    return true;
}

// Función para actualizar (la implementaremos después)
async function actualizarContrasena(userId, nuevaContrasena) {
    // 1. Mostrar confirmación con SweetAlert2
    const { isConfirmed } = await Swal.fire({
        title: '¿Actualizar contraseña?',
        html: `Se cambiará la contraseña del usuario seleccionado. <br><b>Esta acción no se puede deshacer.</b>`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Confirmar',
        cancelButtonText: 'Cancelar',
        backdrop: true
    });

    if (!isConfirmed) return;

    try {
        // 2. Mostrar carga mientras se procesa
        Swal.fire({
            title: 'Actualizando...',
            allowOutsideClick: false,
            didOpen: () => Swal.showLoading()
        });

        // 3. Enviar datos al servidor
        const response = await fetch('../Php/ajustes/actualizar_contrasena.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: userId,
                nuevaContrasena: nuevaContrasena
            })
        });

        const resultado = await response.json();

        // 4. Mostrar resultado
        if (resultado.success) {
            Swal.fire({
                title: '¡Éxito!',
                text: 'Contraseña actualizada correctamente',
                icon: 'success',
                confirmButtonText: 'Aceptar'
            });
            // Limpiar campos
            document.querySelectorAll(`[data-id="${userId}"] .nueva-contrasena, 
                                     [data-id="${userId}"] .confirmar-contrasena`).forEach(input => {
                input.value = '';
            });
        } else {
            throw new Error(resultado.error || 'Error desconocido');
        }
    } catch (error) {
        Swal.fire('Error', error.message, 'error');
        console.error('Error al actualizar:', error);
    }
}