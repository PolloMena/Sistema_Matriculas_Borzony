// Variables globales para almacenar datos del alumno
let alumnoID = null;
let alumnoName = 'No encontrado';
let alumnoNombreCompleto = '';
let resultadosBusqueda = {
    alumnos: [],
    indiceActual: -1,
    total: 0
};

// Función de búsqueda modificada
async function buscarAlumnoParaAutocompletar() {
    const apellidoPaterno = document.getElementById('apellidoPaternoBusqueda').value.trim();
    const apellidoMaterno = document.getElementById('apellidoMaternoBusqueda').value.trim();
    const nombre = document.getElementById('nombreBusqueda').value.trim();

    if (!apellidoPaterno && !apellidoMaterno && !nombre) {
        mostrarMensaje('Ingrese al menos un criterio', 'warning');
        return;
    }

    try {
        // Primera búsqueda o nueva búsqueda
        if (resultadosBusqueda.total === 0 || 
            JSON.stringify(resultadosBusqueda.criterios) !== JSON.stringify({apellidoPaterno, apellidoMaterno, nombre})) {
            
            mostrarMensaje('Buscando alumnos...', 'info');
            
            const response = await fetch('../Php/consultar_alumnos.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    apellido_paterno: apellidoPaterno,
                    apellido_materno: apellidoMaterno,
                    nombre: nombre,
                    offset: 0
                })
            });

            const data = await response.json();
            
            resultadosBusqueda = {
                alumnos: data,
                indiceActual: 0,
                total: data.length,
                criterios: {apellidoPaterno, apellidoMaterno, nombre}
            };
            

        } 
        // Navegar entre resultados existentes
        else {
            resultadosBusqueda.indiceActual = 
                (resultadosBusqueda.indiceActual + 1) % resultadosBusqueda.total;
        }

        mostrarAlumnoActual();

    } catch (error) {
        console.error('Error:', error);
        mostrarMensaje('Error en la búsqueda', 'danger');
    }
}

function mostrarAlumnoActual() {
    if (resultadosBusqueda.total === 0) {
        mostrarMensaje('No se encontraron alumnos', 'warning');
        return;
    }

     //pago = null;
    

    const alumno = resultadosBusqueda.alumnos[resultadosBusqueda.indiceActual];
    
    const pago = alumno.Ultimo_Pago;
    alumnoID=alumno.ID_Matricula;
    alumnoName=alumno.Apellido_PAT + ' '+alumno.Apellido_MAT + ' ' + alumno.Nombre;
    console.log('El pago es ', pago);
    // Actualizar UI
    document.getElementById('año').value = alumno.Ano || '';
    document.getElementById('grupo').value = alumno.Grupo || '';
    document.getElementById('btnConfirmarPago').disabled = false;
    document.getElementById('ultimoPago').value = pago || 'Sin registro';

    
    // Mostrar información de paginación
    mostrarMensaje(`
        Alumno ${resultadosBusqueda.indiceActual + 1} de ${resultadosBusqueda.total}<br>
        <strong>${alumno.Apellido_PAT} ${alumno.Apellido_MAT} ${alumno.Nombre}</strong>
        
        ${resultadosBusqueda.total > 1 ? 
            '<div class="mt-2"><small>Presione Buscar nuevamente para ver el siguiente</small></div>' : ''}
    `, 'info');
}


//----------------------------------------SUBIR PAGO AL SERVER----------------------

// Función para resetear los datos del alumno

/*
function resetearAlumno() {
    alumnoID = null;
    alumnoNombreCompleto = '';
    document.getElementById('año').value = '';
    document.getElementById('grupo').value = '';
    document.getElementById('btnConfirmarPago').disabled = true;
}
*/
// Validación y preparación de pago
function validarYPrepararPago() {
    // 1. Verificar que hay un alumno identificado
    if (!alumnoID) {
        mostrarMensajePago('Error: No se ha identificado un alumno', 'danger');
        return;
    }

    // 2. Validar campos del pago
    const cantidad = parseFloat(document.getElementById('cantidadPago').value);
    const mes = document.getElementById('mesPago').value;
    const año = document.getElementById('añoPago').value;

    if (isNaN(cantidad) || cantidad <= 0) {
        mostrarMensajePago('Ingrese una cantidad válida mayor a 0', 'danger');
        Swal.fire('Error', 'Cantidad no valida', 'warning');
        return;
    }

    if (!mes) {
        mostrarMensajePago('Seleccione un mes', 'danger');
        Swal.fire('Error', 'Mes no valido', 'warning');
        return;
    }

    if (!año) {
        mostrarMensajePago('Seleccione un año', 'danger');
        Swal.fire('Error', 'Año no valido', 'warning');
        return;
    }

   // 3. Preparar datos para el pago
    const pagoData = {
    matricula_id: alumnoID, // Cambiado a matricula_id para coincidir con PHP
    monto: cantidad.toFixed(2),
    mes: mes,
    ano: año, // Cambiado a "ano" para coincidir con PHP
    fecha: new Date().toISOString().split('T')[0] // Usamos "fecha" como clave
};

    // 4. Mostrar confirmación (luego se enviará al PHP)
    console.log('Datos listos para enviar al PHP:', pagoData);
    mostrarMensajePago(`
        <strong>Resumen de Pago</strong><br>
        Alumno: ${alumnoNombreCompleto}<br>
        Cantidad: $${pagoData.cantidad}<br>
        Periodo: ${mes} ${año}
    `, 'success');
    
    enviarPagoAlServidor(pagoData);
}

// Función para enviar el pago al servidor
async function enviarPagoAlServidor(pagoData) {
    // Mostrar carga
    mostrarMensajePago('Procesando pago...', 'info');

    const result = await Swal.fire({
        title: 'Confirmar Registro',
        html: `<p>¿Registrar un pago?</p>
               <p><strong>Alumno:</strong> ${alumnoName}</p>`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, registrar',
        cancelButtonText: 'Cancelar'
    });
    
    if (!result.isConfirmed) {
        mostrarMensaje('Registro cancelado', 'info');
        return;
    }

    try {
        // Adaptar datos al formato que espera el PHP
        const datosParaEnviar = {
            matricula_id: pagoData.alumno_id,
            monto: pagoData.cantidad,
            mes: pagoData.mes,
            ano: pagoData.año,
            fecha: pagoData.fecha_registro
        };

        const response = await fetch('../Php/pago_colegiatura.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(pagoData)
        });

        const resultado = await response.json();

        if (!resultado.success) {
            throw new Error(resultado.message || 'Error al registrar pago');
        }

        // Éxito - mostrar confirmación
        mostrarMensajePago(`
            <strong>Pago registrado exitosamente</strong><br>
            
        `, 'success');
        Swal.fire('¡Éxito!', 'Pago registrado correctamente', 'success');
        // Opcional: Limpiar formulario después de éxito
        document.getElementById('cantidadPago').value = '';
        document.getElementById('mesPago').selectedIndex = 0;
        document.getElementById('añoPago').selectedIndex = 0;

    } catch (error) {
        console.error('Error al registrar pago:', error);
        mostrarMensajePago(`Error en el pago`, 'danger');
        Swal.fire('Error', 'Error al registrar el pago, intente nuevamente', 'error');
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('btnBuscarAlumno').addEventListener('click', buscarAlumnoParaAutocompletar);
    document.getElementById('btnConfirmarPago').addEventListener('click', validarYPrepararPago);
    
    // Deshabilitar botón de pago inicialmente
    document.getElementById('btnConfirmarPago').disabled = true;
});

// Funciones auxiliares (sin cambios)
function mostrarMensaje(mensaje, tipo) {
    const contenedor = document.getElementById('resultadosBusqueda');
    contenedor.innerHTML = `<div class="alert alert-${tipo}">${mensaje}</div>`;
}

function mostrarMensajePago(mensaje, tipo) {
    const contenedor = document.getElementById('resultadosBusqueda');
    contenedor.innerHTML = `<div class="alert alert-${tipo}">${mensaje}</div>`;
}