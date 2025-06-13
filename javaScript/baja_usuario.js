document.addEventListener('DOMContentLoaded', function() {
    const scrollContainer = document.querySelector('.scroll-container');
    
    // Función para cargar usuarios
     async function cargarUsuarios() {
    try {
        const sesionResp = await fetch('../../Php/sesiones/verificar_sesion.php');
        const data = await sesionResp.json();

        if (!data.autenticado) {
            // No autenticado
        } else {
            let usuariosResp;
            if (data.rol == 'Directora' || data.rol == 'Ingeniero') {
                console.log("Rol de Directora o Ingeniero, cargando todos los usuarios");
                usuariosResp = await fetch(`../../Php/ajustes/obtener_usuarios.php?rol=${data.rol}`);
            } else {
                usuariosResp = await fetch('../../Php/ajustes/obtener_usuarios.php');
            }
            const usuarios = await usuariosResp.json();
            mostrarUsuarios(usuarios);
        }
    } catch (error) {
        console.error('Error:', error);
        Swal.fire('Error', 'No se pudieron cargar los usuarios: ' + error.message, 'error');
    }
}
    
    // Función para mostrar usuarios en tarjetas
    function mostrarUsuarios(usuarios) {
        scrollContainer.innerHTML = '';
        
        usuarios.forEach((usuario, index) => {
            const card = document.createElement('div');
            card.className = 'tarjeta-usuario flex-shrink-0 mx-2 mb-3';
            card.style.width = '300px';
            card.style.scrollSnapAlign = 'start';
            card.dataset.userId = usuario.ID_Users;
            
            // Determinar clase del badge según el rol (usando la misma función de colores)
            let badgeClass = 'bg-secondary';
            if (usuario.Rol === 'Administrador') badgeClass = 'bg-primary';
            else if (usuario.Rol === 'Maestro') badgeClass = 'bg-info';
            else if (usuario.Rol === 'Auxiliar') badgeClass = 'bg-success';
            else if (usuario.Rol === 'Directora' || usuario.Rol === 'Ingeniero') badgeClass = 'bg-danger';
            
            card.innerHTML = `
                <div class="card h-100 shadow-sm">
                    <div class="card-body">
                        <div class="d-flex align-items-center mb-3">
                            <img src="${usuario.foto || '../../Assets/img/ajustes/ajustes.jpg'}" 
                                 alt="${usuario.Usuario}" 
                                 class="rounded-circle me-3" 
                                 width="60" height="60"
                                 style="object-fit: cover;">
                            <div>
                                <h5 class="mb-0">${usuario.Usuario}</h5>
                                <span class="badge ${badgeClass}">${usuario.Rol}</span>
                            </div>
                        </div>
                        
                        <div class="mb-3">
                            <label class="form-label">Contraseña de autorización</label>
                            <div class="input-group">
                                <span class="input-group-text"><i class="fas fa-key"></i></span>
                                <input type="password" 
                                       class="form-control admin-pass" 
                                       placeholder="Ingrese su contraseña">
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
                                       class="form-control confirm-admin-pass" 
                                       placeholder="Repita su contraseña">
                                <button class="btn btn-outline-secondary toggle-password" type="button">
                                    <i class="fas fa-eye"></i>
                                </button>
                            </div>
                        </div>
                        
                        <button type="button" class="btn btn-danger w-100 delete-btn" disabled>
                            <i class="fas fa-trash-alt me-2"></i> Eliminar Usuario
                        </button>
                    </div>
                </div>
            `;
            
            scrollContainer.appendChild(card);
        });
        
        // Configurar eventos después de crear las tarjetas
        configurarEventos();
    }
    
    // Función para configurar eventos
    function configurarEventos() {
        // Flechas de navegación
    document.getElementById('btnAnterior').addEventListener('click', () => {
        document.getElementById('carruselUsuarios').scrollBy({ left: -300, behavior: 'smooth' });
    });
    
    document.getElementById('btnSiguiente').addEventListener('click', () => {
        document.getElementById('carruselUsuarios').scrollBy({ left: 300, behavior: 'smooth' });
    });
    
        // Mostrar/ocultar contraseña
        document.querySelectorAll('.toggle-password').forEach(btn => {
            btn.addEventListener('click', function() {
                const input = this.parentNode.querySelector('input');
                const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
                input.setAttribute('type', type);
                this.querySelector('i').classList.toggle('fa-eye-slash');
            });
        });
        
        // Validar contraseñas al escribir
        document.querySelectorAll('.admin-pass, .confirm-admin-pass').forEach(input => {
            input.addEventListener('input', function() {
                // Cambiamos el selector para que coincida con la nueva estructura
                const cardBody = this.closest('.card-body');
                const deleteBtn = cardBody.querySelector('.delete-btn');
                const adminPass = cardBody.querySelector('.admin-pass').value;
                const confirmPass = cardBody.querySelector('.confirm-admin-pass').value;
                
                deleteBtn.disabled = !(adminPass && confirmPass && adminPass === confirmPass);
            });
        });
                
        // Evento para eliminar usuario
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', async function() {
                // Selección actualizada para la nueva estructura
                const card = this.closest('.tarjeta-usuario');
                const userId = card.dataset.userId;
                const password = card.querySelector('.admin-pass').value;
                
                //console.log('ID Usuario a eliminar:', userId); // Para depuración
                
                // Confirmación antes de eliminar
                const confirm = await Swal.fire({
                    title: '¿Estás seguro?',
                    text: "¡No podrás revertir esta acción!",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#d33',
                    cancelButtonColor: '#3085d6',
                    confirmButtonText: 'Sí, eliminar',
                    cancelButtonText: 'Cancelar'
                });
                
                if (confirm.isConfirmed) {
                    try {
                        const response = await fetch('../../Php/ajustes/eliminar_usuarios.php', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                id_usuario: userId,
                                password: password
                            })
                        });
                        
                        const data = await response.json();
                        
                        if (data.success) {
                            Swal.fire('¡Eliminado!', data.message, 'success');
                            cargarUsuarios(); // Recargar lista
                        } else {
                            throw new Error(data.error || 'Error al eliminar usuario');
                        }
                    } catch (error) {
                        Swal.fire('Error', error.message, 'error');
                    }
                }
            });
        });
    }
    
    // Iniciar carga de usuarios
    cargarUsuarios();
});