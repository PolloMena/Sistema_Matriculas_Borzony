document.addEventListener('DOMContentLoaded', function() {
    cargarAlumnosSinAsignar();
});

// Seleccionar/deseleccionar todos
document.getElementById('selectAllUnassigned').addEventListener('change', function() {
    const checkboxes = document.querySelectorAll('.table-responsive .select-student');
    checkboxes.forEach(checkbox => {
        checkbox.checked = this.checked;
        
    });
    console.log('Todos');
});

// Verificar si todos están seleccionados cuando se marca uno individual
document.querySelector('.table-responsive').addEventListener('change', function(e) {
    if (e.target.classList.contains('select-student')) {
        // 1. Verificar selección múltiple (como ya tenías)
        const allCheckboxes = document.querySelectorAll('.table-responsive .select-student');
        const selectAll = document.getElementById('selectAllUnassigned');
        selectAll.checked = [...allCheckboxes].every(checkbox => checkbox.checked);
        
        // 2. Obtener matrículas seleccionadas
        const matriculasSeleccionadas = [];
        const alumnosSeleccionados = [];
        document.querySelectorAll('.select-student:checked').forEach(checkbox => {
            
            const fila = checkbox.closest('tr');
            
            const matricula = fila.querySelector('td:nth-child(2)').textContent;
            const nombre = fila.querySelector('td:nth-child(3)').textContent;
            matriculasSeleccionadas.push(matricula);
            alumnosSeleccionados.push(nombre);
        });
        
        //console.log('ALumnos seleccionadas:', alumnosSeleccionados);
    }
});

document.getElementById('btnAsignarGrupo').addEventListener('click', async function() {
    // Obtener alumnos seleccionados
    fetch('../../Php/sesiones/verificar_sesion.php') // Ajusta la ruta según tu estructura
        .then(response => response.json())
        .then(data => {
            if (!data.autenticado) {
                
            } else {
                console.log("Rol para grupos:", data.rol);
                // Aquí puedes mostrar el nombre o rol si quieres
                if (data.rol !== 'Administrador' && data.rol !== 'Directora') {
                    Swal.fire('Acceso denegado', 'No tienes permiso para asignar grupos', 'error');
                    return;
                }
            }
        })
        .catch(error => {
            console.error('Error al verificar sesión:', error);
        });
    
    const matriculasSeleccionadas = obtenerMatriculasSeleccionadas();

    const matriculasSinAsignar = obtenerMatriculasSeleccionadas();
    const matriculasGrupo = obtenerMatriculasSeleccionadasGrupo();
    const todasMatriculas = [...matriculasSinAsignar, ...matriculasGrupo];
    
    if (todasMatriculas.length === 0) {
        Swal.fire('Error', 'Por favor selecciona al menos un alumno', 'warning');
        return;
    }
    
    // Obtener valores del formulario
    const grado = document.getElementById('gradoAsignar').value;
    const grupo = document.getElementById('grupoAsignar').value;
    
    if (!grado || !grupo) {
        Swal.fire('Error', 'Por favor selecciona grado y grupo', 'warning');
        return;
    }
    
    // Confirmación antes de proceder
    const confirmacion = await Swal.fire({
        title: '¿Confirmar asignación?',
        html: `Vas a asignar <b>${grado}°${grupo}</b> a <b>${todasMatriculas.length}</b> alumno(s)`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, asignar',
        cancelButtonText: 'Cancelar'
    });
    
    if (!confirmacion.isConfirmed) return;
    
    // Mostrar carga
    Swal.fire({
        title: 'Asignando grupo...',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading()
    });
    
    try {
        // Enviar datos al servidor
        const response = await fetch('../../Php/informacion/alumnos_asignar_grupo.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                matriculas: todasMatriculas,
                grado: grado,
                grupo: grupo
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            Swal.fire('¡Éxito!', data.message, 'success');
            // Recargar la tabla de alumnos sin asignar
            cargarAlumnosSinAsignar();
        } else {
            throw new Error(data.error || 'Error al asignar grupo');
        }
    } catch (error) {
        Swal.fire('Error', error.message, 'error');
        console.error('Error:', error);
    }
});
// --------------------------- TABLA ALUMNOS SIN ASIGNAR--------------------------------
function cargarAlumnosSinAsignar() {
    fetch('../../Php/informacion/alumnos_sin_asignar.php')
        .then(response => {
            if (!response.ok) throw new Error('Error en la red');
            return response.json();
        })
        .then(data => {
            if (!data.success) throw new Error(data.error || 'Error al cargar alumnos');
            actualizarTablaAlumnos(data.alumnos);
        })
        .catch(error => {
            console.error('Error:', error);
            mostrarErrorTabla();
        });
}

function actualizarTablaAlumnos(alumnos) {
    const tbody = document.querySelector('.table-responsive tbody');
    tbody.innerHTML = ''; // Limpiar tabla
    
    if (alumnos.length === 0) {
        // Mostrar mensaje si no hay alumnos
        tbody.innerHTML = `
            <tr>
                <td colspan="5" class="text-center py-4 text-muted">
                    <i class="fas fa-check-circle me-2"></i> Todos los alumnos están asignados a grupos
                </td>
            </tr>
        `;
        return;
    }
    
    // Llenar tabla con datos
    alumnos.forEach(alumno => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><input type="checkbox" class="form-check-input select-student"></td>
            <td data-matricula="${alumno.matricula}">${alumno.matricula}</td>
            <td data-nombre="${alumno.nombre}">${alumno.nombre}</td>
            <td>${alumno.ano ? alumno.ano + '°' : 'N/A'}</td>
            <td><span class="badge bg-warning">Sin asignar</span></td>
        `;
        tbody.appendChild(row);
    });
}

function mostrarErrorTabla() {
    const tbody = document.querySelector('.table-responsive tbody');
    tbody.innerHTML = `
        <tr>
            <td colspan="5" class="text-center py-4 text-danger">
                <i class="fas fa-exclamation-triangle me-2"></i> Error al cargar los datos
            </td>
        </tr>
    `;
}


// Función para obtener matrículas seleccionadas (optimizada)
function obtenerMatriculasSeleccionadas() {
    const matriculas = [];
    
    document.querySelectorAll('#alumnosSinAsignar .select-student:checked').forEach(checkbox => {
        matriculas.push(checkbox.closest('tr').querySelector('[data-matricula]').dataset.matricula);
        
    });
    return matriculas;
}

function obtenerNombresSeleccionadas() {
    const nombre = [];
    document.querySelectorAll('#alumnosSinAsignar .select-student:checked').forEach(checkbox => {
        nombre.push(checkbox.closest('tr').querySelector('[data-nombre]').dataset.nombre);
        
    });
    return nombre;
}

// ----------------------------- TABLA BUSQUEDA POR GRUPOS -----------------------------------------

document.getElementById('btnBuscarGrupo').addEventListener('click', buscarAlumnosPorGrupo);

async function buscarAlumnosPorGrupo() {
    const año = document.getElementById('AñoBusqueda').value;
    const grupo = document.getElementById('grupoBusqueda').value;
    
    if (!año || !grupo) {
        Swal.fire('Error', 'Por favor selecciona año y grupo', 'warning');
        return;
    }
    
    try {
        // Mostrar carga
        Swal.fire({
            title: 'Buscando alumnos...',
            allowOutsideClick: false,
            didOpen: () => Swal.showLoading()
        });
        
        // Realizar búsqueda
        const response = await fetch(`../../Php/informacion/alumnos_con_grupos.php?año=${año}&grupo=${grupo}`);
        const data = await response.json();
        
        if (!data.success) throw new Error(data.error || 'Error en la búsqueda');
        
        // Actualizar tabla
        actualizarTablaResultados(data.alumnos);
        
        Swal.close();
        
    } catch (error) {
        Swal.fire('Error al hacer la busqueda', 'error');
        console.error('Error:', error);
    }
}

function actualizarTablaResultados(alumnos) {
    const tbody = document.getElementById('resultadosGrupo');
    tbody.innerHTML = '';
    
    if (alumnos.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" class="text-center py-4 text-muted">
                    <i class="fas fa-info-circle me-2"></i> No se encontraron alumnos en este grupo
                </td>
            </tr>
        `;
        return;
    }
    
    alumnos.forEach(alumno => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><input type="checkbox" class="form-check-input select-student"></td>
            <td data-matricula="${alumno.ID_Matricula}">${alumno.ID_Matricula}</td>
            <td>${alumno.Apellido_PAT} ${alumno.Apellido_MAT} ${alumno.Nombre}</td>
            <td><span class="badge bg-warning">${alumno.Ano}°</td>
            <td><span class="badge bg-success">${alumno.Grupo}</span></td>
        `;
        tbody.appendChild(row);
    });
    
    // Configurar selección múltiple
    configurarSeleccionMultiple();
}

function configurarSeleccionMultiple() {
    // Seleccionar/deseleccionar todos
    document.getElementById('selectAllAssigned').addEventListener('change', function() {
        const checkboxes = document.querySelectorAll('#resultadosGrupo .select-student');
        checkboxes.forEach(checkbox => {
            checkbox.checked = this.checked;
        });
    });
    
    // Verificar selección individual
    document.getElementById('resultadosGrupo').addEventListener('change', function(e) {
        if (e.target.classList.contains('select-student')) {
            const allCheckboxes = document.querySelectorAll('#resultadosGrupo .select-student');
            const selectAll = document.getElementById('selectAllAssigned');
            selectAll.checked = [...allCheckboxes].every(checkbox => checkbox.checked);
        }
    });
}

function obtenerMatriculasSeleccionadasGrupo() {
    const matriculas = [];
    document.querySelectorAll('#resultadosGrupo .select-student:checked').forEach(checkbox => {
        matriculas.push(checkbox.closest('tr').querySelector('[data-matricula]').dataset.matricula);
    });
    return matriculas;
}