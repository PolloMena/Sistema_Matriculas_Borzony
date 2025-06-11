document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const idAlumno = urlParams.get('id');
    
    if (!idAlumno) {
        mostrarError('No se especificó un ID de alumno');
        return;
    }
    console.log("Entro");
    //Imprimir encavezado
    cargarNombreAlumno(idAlumno);
    cargarDatosAlumno(idAlumno);
    
     
});

document.getElementById('tipoDatos').addEventListener('change', function () {
        const seccion = this.value;
        document.querySelectorAll('.formulario-seccion').forEach(form => form.classList.add('d-none'));

        if (seccion === 'estudiante') {
            document.getElementById('formulario-estudiante').classList.remove('d-none');
        } else if (seccion === 'contacto') {
            document.getElementById('formulario-contacto').classList.remove('d-none');
        } else if (seccion === 'facturacion') {
            document.getElementById('formulario-facturacion').classList.remove('d-none');
        }
    });

document.querySelectorAll('.btn-guardar').forEach(btn => {
    btn.addEventListener('click', function () {
        const seccion = this.dataset.seccion;
        const idAlumno = new URLSearchParams(window.location.search).get('id');

        const data = { id: idAlumno, seccion };

        if (seccion === 'estudiante') {
            data.Apellido_PAT = document.querySelector('[name="Apellido_PAT"]').value;
            data.Apellido_MAT = document.querySelector('[name="Apellido_MAT"]').value;
            data.Nombre = document.querySelector('[name="Nombre"]').value;
            data.Fecha_Nac = document.querySelector('[name="Fecha_Nac"]').value;
            data.CURP = document.querySelector('[name="CURP"]').value;

        } else if (seccion === 'contacto') {
            data.Apellido_PAT = document.querySelector('[name="Apellido_PAT_contacto"]').value;
            data.Apellido_MAT = document.querySelector('[name="Apellido_MAT_contacto"]').value;
            data.Nombre = document.querySelector('[name="Nombre_contacto"]').value;
            data.Correo = document.querySelector('[name="Correo_contacto"]').value;
            data.Telefono = document.querySelector('[name="Telefono_contacto"]').value;
            data.Parentesco = document.querySelector('[name="Parentesco"]').value;

        } else if (seccion === 'facturacion') {
            data.Nombre_SAT = document.querySelector('[name="Nombre_SAT"]').value;
            data.RFC = document.querySelector('[name="RFC"]').value;
            data.CFDI = document.querySelector('[name="CFDI"]').value;
            data.Correo = document.querySelector('[name="Correo_facturacion"]').value;
            data.Constancia = document.querySelector('[name="Constancia"]').value;
        }

        fetch('../../php/informacion/actualizar_datos.php', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'Content-Type': 'application/json' }
        })
        .then(res => res.json())
        .then(res => {
            if (res.success) {
                Swal.fire({
                    icon: 'success',
                    title: '¡Guardado!',
                    text: 'Los datos fueron actualizados correctamente.',
                    confirmButtonText: 'Aceptar'
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error al actualizar',
                    text: res.message || 'Ocurrió un problema al guardar los cambios.',
                    confirmButtonText: 'Intentar de nuevo'
                });
            }

        })
        .catch(error => {
            console.error('Error:', error);
        });
    });
});

document.querySelectorAll('.btn-cancelar').forEach(btn =>{
    btn.addEventListener('click', function () {
        const urlParams = new URLSearchParams(window.location.search);
        const idAlumno = urlParams.get('id');
        Swal.fire({
            title: '¿Cancelar edición?',
            text: "Los cambios no guardados se perderán.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, cancelar',
            cancelButtonText: 'No, continuar editando'
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.href = 'alumno.html?id=' + idAlumno;
            }
        });
        });
} );

async function cargarNombreAlumno(id) {
    try {
        console.log("Cargando datos de alumno", id);
        const response = await fetch(`../../php/informacion/cargar_perfil.php?id=${id}`);
        const text = await response.text();
        console.log("Respuesta raw:", text);

        const data = JSON.parse(text);
        if (!data.success) {
            throw new Error(data.error || 'Error al cargar datos');
        }

        mostrarNombreCompleto(data.alumno);
        Swal.close();
    } catch (error) {
        Swal.fire('Error', error.message, 'error');
        console.error('Error:', error);
    }
}


function mostrarNombreCompleto(alumno) {
    const nombreCompleto = `${alumno.Apellido_PAT} ${alumno.Apellido_MAT} ${alumno.Nombre}`;
    document.getElementById('nombre_Alumno').textContent = nombreCompleto;
}

function mostrarError(mensaje) {
    Swal.fire('Error', mensaje, 'error').then(() => {
        window.location.href = 'informacion.html';
    });
}

function cargarDatosAlumno(idAlumno) {
    fetch(`../../php/informacion/cargar_datos.php?id=${idAlumno}`)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert(data.error);
                return;
            }

            // Datos del estudiante
            if (data.alumno) {
                document.querySelector('[name="Apellido_PAT"]').value = data.alumno.Apellido_PAT || '';
                document.querySelector('[name="Apellido_MAT"]').value = data.alumno.Apellido_MAT || '';
                document.querySelector('[name="Nombre"]').value = data.alumno.Nombre || '';
                document.querySelector('[name="Fecha_Nac"]').value = data.alumno.Fecha_Nac || '';
                document.querySelector('[name="CURP"]').value = data.alumno.CURP || '';
            }

            // Datos de contacto
            if (data.contacto) {
                document.querySelector('[name="Apellido_PAT_contacto"]').value = data.contacto.Apellido_PAT || '';
                document.querySelector('[name="Apellido_MAT_contacto"]').value = data.contacto.Apellido_MAT || '';
                document.querySelector('[name="Nombre_contacto"]').value = data.contacto.Nombre || '';
                document.querySelector('[name="Correo_contacto"]').value = data.contacto.Correo || '';
                document.querySelector('[name="Telefono_contacto"]').value = data.contacto.Telefono || '';
                document.querySelector('[name="Parentesco"]').value = data.contacto.Parentesco || '';
            }

            // Datos de facturación
            if (data.facturacion) {
                document.querySelector('[name="Nombre_SAT"]').value = data.facturacion.Nombre_SAT || '';
                document.querySelector('[name="RFC"]').value = data.facturacion.RFC || '';
                document.querySelector('[name="CFDI"]').value = data.facturacion.CFDI || '';
                document.querySelector('[name="Correo_facturacion"]').value = data.facturacion.Correo || '';
                document.querySelector('[name="Constancia"]').value = data.facturacion.Constancia || '';
            }
        })
        .catch(error => {
            console.error('Error al obtener datos del alumno:', error);
        });
}
