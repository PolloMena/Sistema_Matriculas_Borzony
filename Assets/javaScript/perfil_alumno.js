// Función principal para cargar y mostrar los datos
function cargarDatosAlumno(idAlumno) {
    fetch(`../../assets/php/perfil_alumno.php?id=${idAlumno}`)
        .then(response => {
            if (!response.ok) throw new Error('Error en la red');
            return response.json();
        })
        .then(data => {
            if (!data.success) throw new Error(data.error || 'Error en los datos');
            //console.log(data);
            // Actualizar los datos en la página
            actualizarDatosAlumno(data.alumno);
            actualizarContacto(data.contacto);
            actualizarFacturacion(data.facturacion);
        })
        .catch(error => {
            console.error('Error:', error);
            alert('No se pudieron cargar los datos. Intenta más tarde.');
        });
}

// Función para actualizar los datos del alumno
function actualizarDatosAlumno(alumno) {
    const contenedor = document.querySelector('#datos-alumno');
    const campos = contenedor.querySelectorAll('.form-control.bg-light');

    if (campos.length >= 5) {  // Asegurar que existan los campos
        campos[0].textContent = alumno.Apellido_PAT || 'N/A';
        campos[1].textContent = alumno.Apellido_MAT || 'N/A';
        campos[2].textContent = alumno.Nombre || 'N/A';
        campos[3].textContent = alumno.Fecha_Nac_Formateada || '00/00/00';
        campos[4].textContent = alumno.CURP || 'N/A';
    }

    // Campos editables (selects)
    const selectAnio = document.getElementById('anioEscolar');
    const selectGrupo = document.getElementById('grupo');

    if (selectAnio) selectAnio.value = alumno.Ano || 0;
    if (selectGrupo) selectGrupo.value = alumno.Grupo || 'Null';
}


function actualizarContacto(contacto) {
    if (!contacto) return;

    const contenedor = document.getElementById('contacto');
    const campos = contenedor.querySelectorAll('.form-control.bg-light');

    if (campos.length >= 6) {
        campos[0].textContent = contacto.Apellido_PAT || 'N/A';
        campos[1].textContent = contacto.Apellido_MAT || 'N/A';
        campos[2].textContent = contacto.Nombre || 'N/A';
        campos[3].textContent = contacto.Correo || 'N/A';
        campos[4].textContent = contacto.Telefono || 'N/A';
        campos[5].textContent = contacto.Parentesco || 'N/A';
    }
}


function actualizarFacturacion(facturacion) {
    if (!facturacion) return;

    const contenedor = document.getElementById('facturacion');
    const campos = contenedor.querySelectorAll('.form-control.bg-light');

    if (campos.length >= 6) {
        campos[0].textContent = facturacion.Monto_Inscripcion || '00.00';
        campos[1].textContent = facturacion.Nombre_SAT || 'N/A';
        campos[2].textContent = facturacion.RFC || 'N/A';
        campos[3].textContent = facturacion.CFDI || 'N/A';
        campos[4].textContent = facturacion.Correo || 'N/A';
        campos[5].textContent = facturacion.Constancia || 'N/A';
    }
}

// Función para cargar y mostrar los pagos del alumno
function cargarPagosAlumno(idAlumno) {
    //console.log('Actualizado');
    fetch(`../../assets/php/perfil_pago.php?id=${idAlumno}`)
        .then(response => {
            if (!response.ok) throw new Error('Error en la red');
            return response.json();
        })
        .then(data => {
            //console.log(data);
            if (!data.success) throw new Error(data.error || 'Error en los datos');
            
            // Crear contenedor para las tablas si no existe
            crearContenedorTablas();
            
            // Generar tablas con los datos
            generarTablaColegiaturas(data.colegiaturas);
            generarTablaOtrosPagos(data.otrosPagos);
        })
        .catch(error => {
            console.error('Error al cargar pagos:', error);
            alert('No se pudieron cargar los pagos. Intenta más tarde.');
        });
}

// Función para crear el contenedor de tablas
function crearContenedorTablas() {
    // Verificar si el contenedor ya existe
    if (document.getElementById('contenedor-pagos')) return;
    
    // Crear el contenedor principal
    const contenedor = document.createElement('div');
    contenedor.id = 'contenedor-pagos';
    contenedor.className = 'container mt-4';
    
    // Crear título de sección
    const titulo = document.createElement('h3');
    titulo.className = 'mb-4';
    titulo.textContent = 'Historial de Pagos';
    contenedor.appendChild(titulo);
    
    // Insertar después de la última columna existente
    const mainContainer = document.querySelector('.container.mt-4');
    if (mainContainer) {
        mainContainer.appendChild(contenedor);
    } else {
        document.body.appendChild(contenedor);
    }
}

// Función para generar la tabla de colegiaturas
function generarTablaColegiaturas(pagos) {
    const contenedor = document.getElementById('contenedor-pagos');
    if (!contenedor) return;
    
    // Crear título de tabla
    const titulo = document.createElement('h4');
    titulo.className = 'titulo-tabla';
    titulo.textContent = 'Pagos de Colegiatura';
    contenedor.appendChild(titulo);
    
    // Crear tabla
    const tabla = document.createElement('table');
    tabla.className = 'table table-bordered table-striped tabla-pagos';
    
    // Crear encabezados
    const thead = document.createElement('thead');
    thead.innerHTML = `
        <tr class="table-primary">
            <th>Periodo</th>
            <th>Monto</th>
            <th>Fecha de Pago</th>
        </tr>
    `;
    tabla.appendChild(thead);
    
    // Crear cuerpo de la tabla
    const tbody = document.createElement('tbody');
    
    if (pagos.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="3" class="text-center">No se encontraron pagos de colegiatura</td>
            </tr>
        `;
    } else {
        pagos.forEach(pago => {
            const fila = document.createElement('tr');
            
            // Convertir Monto a número y formatear
            const monto = parseFloat(pago.Monto) || 0;
            const montoFormateado = !isNaN(monto) ? `$${monto.toFixed(2)}` : '$0.00';
            
            fila.innerHTML = `
                <td>${pago.Periodo || 'N/A'}</td>
                <td>${montoFormateado}</td>
                <td>${pago.Fecha_Pago || 'N/A'}</td>
            `;
            tbody.appendChild(fila);
        });
    }
    
    tabla.appendChild(tbody);
    contenedor.appendChild(tabla);
}

// Función para generar la tabla de otros pagos
function generarTablaOtrosPagos(pagos) {
    const contenedor = document.getElementById('contenedor-pagos');
    if (!contenedor) return;
    
    // Crear título de tabla
    const titulo = document.createElement('h4');
    titulo.className = 'titulo-tabla';
    titulo.textContent = 'Otros Pagos';
    contenedor.appendChild(titulo);
    
    // Crear tabla
    const tabla = document.createElement('table');
    tabla.className = 'table table-bordered table-striped tabla-pagos';

    
    // Crear encabezados
    const thead = document.createElement('thead');
    thead.innerHTML = `
        <tr class="table-success">
            <th>Concepto</th>
            <th>Monto</th>
            <th>Fecha</th>
        </tr>
    `;
    tabla.appendChild(thead);
    
    // Crear cuerpo de la tabla
    const tbody = document.createElement('tbody');
    
    if (pagos.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="3" class="text-center">No se encontraron otros pagos</td>
            </tr>
        `;
    } else {
        pagos.forEach(pago => {
            const fila = document.createElement('tr');
            
            // Convertir Monto a número y formatear
            const monto = parseFloat(pago.Monto) || 0;
            const montoFormateado = !isNaN(monto) ? `$${monto.toFixed(2)}` : '$0.00';
            
            fila.innerHTML = `
                <td>${pago.Concepto || 'N/A'}</td>
                <td>${montoFormateado}</td>
                <td>${pago.Fecha_Pago || 'N/A'}</td>
            `;
            tbody.appendChild(fila);
        });
    }
    
    tabla.appendChild(tbody);
    contenedor.appendChild(tabla);
}



// Esperar a que el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    // Obtener el ID del alumno de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const idAlumno = urlParams.get('id');
    
    if (idAlumno) {
        cargarDatosAlumno(idAlumno);
        cargarPagosAlumno(idAlumno);
    } else {
        console.error('No se encontró ID de alumno en la URL');
        alert('Error: No se puede identificar al alumno');
    }
});