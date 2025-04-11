
// Variables globales para almacenar datos del alumno y pagos
let alumnoID = null;

let alumnoNombreCompleto = '';
let resultadosBusqueda = {
    alumnos: [],
    pagos: [],
    indiceActual: -1,
    total: 0,
    criterios: {}
};

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('btnBuscarAlumno').addEventListener('click', buscarAlumnoParaAutocompletar);
    
    // Event listeners para calcular el total cuando se modifiquen los montos
    for (let i = 1; i <= 4; i++) {
        document.getElementById(`monto${i}`).addEventListener('input', calcularTotal);
    }
});

// Función principal de búsqueda
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
            
            const response = await fetch('../../Assets/Php/otros_pagos.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    apellido_paterno: apellidoPaterno,
                    apellido_materno: apellidoMaterno,
                    nombre: nombre,
                    offset: 0,
                    accion: 'buscar_alumno_y_pagos'
                })
            });

            const data = await response.json();
            
            if (!data.alumnos || data.alumnos.length === 0) {
                mostrarMensaje('No se encontraron alumnos', 'warning');
                return;
            }
            
            resultadosBusqueda = {
                alumnos: data.alumnos,
                pagos: data.pagos || [],
                indiceActual: 0,
                total: data.alumnos.length,
                criterios: {apellidoPaterno, apellidoMaterno, nombre}
            };
            //console.log('alumno1');
            mostrarAlumnoActual();
            llenarTablaPagos(resultadosBusqueda.pagos);
        } 
        // Navegar entre resultados existentes
        else {
            resultadosBusqueda.indiceActual = 
                (resultadosBusqueda.indiceActual + 1) % resultadosBusqueda.total;
            mostrarAlumnoActual();
            //console.log('alumno2');
            // Obtener pagos del siguiente alumno
            const alumnoActual = resultadosBusqueda.alumnos[resultadosBusqueda.indiceActual];
            const response = await fetch('../../Assets/Php/otros_pagos.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    matricula: alumnoActual.ID_Matricula,
                    accion: 'obtener_pagos_alumno'
                })
            });
            
            const data = await response.json();
            resultadosBusqueda.pagos = data.pagos || [];
            llenarTablaPagos(resultadosBusqueda.pagos);
        }

    } catch (error) {
        console.error('Error:', error);
        mostrarMensaje('Error en la búsqueda', 'danger');
    }
}

// Función para llenar la tabla de pagos
function llenarTablaPagos(pagos) {
    // Limpiar la tabla primero
    for (let i = 1; i <= 4; i++) {
        document.getElementById(`fecha${i}`).value = '';
        document.getElementById(`monto${i}`).value = '00.00';
        document.getElementById(`fecha${i}`).readOnly = false;
        document.getElementById(`monto${i}`).readOnly = false;
    }

    // Llenar con los pagos existentes
    pagos.forEach((pago, index) => {
        if (index < 4) {
            const fila = index + 1;
            const fechaInput = document.getElementById(`fecha${fila}`);
            const montoInput = document.getElementById(`monto${fila}`);
            
            fechaInput.value = pago.Fecha.split(' ')[0];
            montoInput.value = parseFloat(pago.Monto).toFixed(2);
            
            // Bloquear edición de pagos ya registrados
            if (pago.ID_Otros) {
                fechaInput.readOnly = true;
                montoInput.readOnly = true;
            }
        }
    });

    calcularTotal();
}

// Función para mostrar el alumno actual
function mostrarAlumnoActual() {
    if (resultadosBusqueda.total === 0) {
        mostrarMensaje('No se encontraron alumnos', 'warning');
        return;
    }

    const alumno = resultadosBusqueda.alumnos[resultadosBusqueda.indiceActual];
    const pago = alumno.Ultimo_Pago;
    //console.log('pago es ',alumno)

    document.getElementById('ultimoPago').value = pago || 'Sin registro';
    alumnoID = alumno.ID_Matricula;
    alumnoNombreCompleto = `${alumno.Apellido_PAT} ${alumno.Apellido_MAT} ${alumno.Nombre}`;
    
    // Actualizar UI
    document.getElementById('año').value = alumno.Ano || '';
    document.getElementById('grupo').value = alumno.Grupo || '';
    
    // Mostrar información
    mostrarMensaje(`
        Alumno ${resultadosBusqueda.indiceActual + 1} de ${resultadosBusqueda.total}<br>
        <strong>${alumnoNombreCompleto}</strong>
        ${resultadosBusqueda.total > 1 ? 
            '<div class="mt-2"><small>Presione Buscar nuevamente para ver el siguiente</small></div>' : ''}
    `, 'info');
}

// Función para calcular el total de pagos
function calcularTotal() {
    let total = 0;
    
    for (let i = 1; i <= 4; i++) {
        const monto = parseFloat(document.getElementById(`monto${i}`).value) || 0;
        total += monto;
    }
    
    document.getElementById('totalPagos').value = total.toFixed(2);
}

// Función auxiliar para mostrar mensajes
function mostrarMensaje(mensaje, tipo) {
    const contenedor = document.getElementById('resultadosBusqueda');
    contenedor.innerHTML = `<div class="alert alert-${tipo}">${mensaje}</div>`;
}

//-----------------------------------REGISTRAR UN PAGO DE LA TABLA DE 4 FILAS------------------------------------------------

// Añadir este código a tu archivo JS existente

document.getElementById('btnRegistrarPago').addEventListener('click', registrarPagos);

async function registrarPagos() {
    
    // Validar que hay un alumno seleccionado
    if (!alumnoID) {
        mostrarMensaje('Primero busque y seleccione un alumno', 'warning');
        return;
    }

    // Obtener pagos a registrar (solo los editables con datos)
    const pagosAregistrar = [];
    for (let i = 1; i <= 4; i++) {
        const fecha = document.getElementById(`fecha${i}`).value;
        const monto = parseFloat(document.getElementById(`monto${i}`).value);
        
        // Solo considerar filas editables con datos válidos
        if (!document.getElementById(`fecha${i}`).readOnly && fecha && !isNaN(monto) && monto > 0) {
            pagosAregistrar.push({
                fecha: fecha,
                monto: monto.toFixed(2)
            });
        }
    }

    if (pagosAregistrar.length === 0) {
        mostrarMensaje('No hay pagos válidos para registrar', 'warning');
        return;
    }

    const result = await Swal.fire({
        title: 'Confirmar Registro',
        html: `<p>¿Registrar ${pagosAregistrar.length} pago(s)</p>
               <p><strong>Alumno:</strong> ${alumnoNombreCompleto}</p>`,
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
        mostrarMensaje('Registrando pagos...', 'info');
        
        const response = await fetch('../../Assets/Php/otros_pagos.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                accion: 'registrar_pagos',
                matricula: alumnoID,
                pagos: JSON.stringify(pagosAregistrar)
            })
        });

        const resultado = await response.json();
        
        if (resultado.success) {
            mostrarMensaje(`Pagos registrados exitosamente: ${resultado.registrados} de ${pagosAregistrar.length}`, 'success');
            // Actualizar la tabla con los nuevos pagos
            buscarAlumnoParaAutocompletar();
        } else {
            mostrarMensaje(resultado.error || 'Error al registrar pagos', 'danger');
        }
    } catch (error) {
        console.error('Error:', error);
        mostrarMensaje('Error en la conexión', 'danger');
    }
}

//------------------------REGISTRAR UN PAGO EXTRA----------------------------------------
// Añade esto al final de tu DOMContentLoaded o en la inicialización
document.getElementById('montoExt').addEventListener('input', function() {
    actualizarTotalExtra();
});

// Función para actualizar el total
function actualizarTotalExtra() {
    const monto = parseFloat(document.getElementById('montoExt').value) || 0;
    document.getElementById('totalExtra').value = monto.toFixed(2);
}

// Modificar el evento del botón de registro para ambos formularios
document.getElementById('btnRegistrarPagoExtra').addEventListener('click', registrarPagoExtra);

async function registrarPagoExtra() {
    // Validar alumno seleccionado
    if (!alumnoID) {
        mostrarMensaje('Primero busque y seleccione un alumno', 'warning');
        return;
    }

    
    // Obtener datos del formulario
    const fecha = document.getElementById('fechaUni').value;
    const concepto = document.getElementById('concepto').value;
    const monto = parseFloat(document.getElementById('montoExt').value);

    // Validaciones
    if (!fecha || !concepto || isNaN(monto) || monto <= 0) {
        mostrarMensaje('Complete todos los campos correctamente', 'warning');
        return;
    }

    // Confirmación
    const confirmacion = await Swal.fire({
        title: 'Confirmar Pago',
        html: `<p>¿Registrar pago de <b>${concepto}</b> por $${monto.toFixed(2)}?</p>
               <p><b>Alumno:</b> ${alumnoNombreCompleto}</p>`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Confirmar',
        cancelButtonText: 'Cancelar'
    });

    if (!confirmacion.isConfirmed) {
        mostrarMensaje('Registro cancelado', 'info');
        return;
    }

    try {
        mostrarMensaje('Registrando pago...', 'info');
        
        const response = await fetch('../../Assets/Php/otros_pagos.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                accion: 'registrar_pago_extra',
                matricula: alumnoID,
                fecha: fecha,
                concepto: concepto,
                monto: monto.toFixed(2)
            })
        });

        const resultado = await response.json();
        
        if (resultado.success) {
            mostrarMensaje('Pago registrado exitosamente', 'success');
            // Limpiar formulario
            document.getElementById('fechaUni').value = '';
            document.getElementById('concepto').value = '';
            document.getElementById('montoExt').value = '00.00';
        } else {
            mostrarMensaje(resultado.error || 'Error al registrar pago', 'danger');
        }
    } catch (error) {
        console.error('Error:', error);
        mostrarMensaje('Error en la conexión', 'danger');
    }
}