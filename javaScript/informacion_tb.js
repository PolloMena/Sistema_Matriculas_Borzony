document.addEventListener('DOMContentLoaded', function() {
    // Variables globales para almacenar las filas originales
    let filasOriginales = [];
    let datosOriginales = [];
    
    // Función para aplicar filtros
    function aplicarFiltros() {
        // Obtener valores de los filtros
        const apellidoPAT = document.getElementById('apellidoPATBusqueda').value.toLowerCase();
        const apellidoMAT = document.getElementById('apellidoMATBusqueda').value.toLowerCase();
        const nombres = document.getElementById('nombresBusqueda').value.toLowerCase();
        const año = document.getElementById('añoBusqueda').value;
        const grupo = document.getElementById('grupoBusqueda').value;
        const mesPago = document.getElementById('mesPagoBusqueda').value;
        const añoPago = document.getElementById('añoPagoBusqueda').value;
        //const estatusFiltro = document.getElementById('estatusPago').value;
        
        
        // Mostrar todas las filas primero
        filasOriginales.forEach(fila => fila.style.display = '');
        
        // Si todos los campos están vacíos, no filtrar
        if (!apellidoPAT && !apellidoMAT && !nombres && !año && !grupo && !mesPago && !añoPago) {
            return;
        }
        
        // Filtrar filas
        filasOriginales.forEach((fila, index) => {
            const alumno = datosOriginales[index];
            
            const nombreCompleto = alumno.NombreCompleto.toLowerCase();
            
            // Verificar coincidencias con cada filtro
            const coincideApellidoPAT = !apellidoPAT || nombreCompleto.includes(apellidoPAT);
            const coincideApellidoMAT = !apellidoMAT || nombreCompleto.includes(apellidoMAT);
            const coincideNombres = !nombres || nombreCompleto.includes(nombres);
            const coincideAño = !año || (alumno.GradoEscolar && alumno.GradoEscolar.toString() === año);
            const coincideGrupo = !grupo || (alumno.Grupo && alumno.Grupo.toUpperCase() === grupo.toUpperCase());
            
            
            // Lógica para filtrado de fechas de pago
            let coincideMesPago = !mesPago;
            let coincideAñoPago = !añoPago;
            
            if (mesPago || añoPago) {
                const fechaActual = new Date();
                const mesActual = fechaActual.getMonth() + 1;
                const anoActual = fechaActual.getFullYear();
                
                const meses = {
                    'enero': 1, 'febrero': 2, 'marzo': 3, 'abril': 4,
                    'mayo': 5, 'junio': 6, 'julio': 7, 'agosto': 8,
                    'septiembre': 9, 'octubre': 10, 'noviembre': 11, 'diciembre': 12,
                    'Enero': 1, 'Febrero': 2, 'Marzo': 3, 'Abril': 4,
                    'Mayo': 5, 'Junio': 6, 'Julio': 7, 'Agosto': 8,
                    'Septiembre': 9, 'Octubre': 10, 'Noviembre': 11, 'Diciembre': 12
                };
                
                if (alumno.UltimoMesPagado && alumno.UltimoAnoPagado) {
                    const mesPagadoNum = meses[alumno.UltimoMesPagado.toLowerCase()] || 0;
                    const anoPagadoNum = parseInt(alumno.UltimoAnoPagado);
                    
                    coincideMesPago = !mesPago || mesPagadoNum === parseInt(mesPago);
                    coincideAñoPago = !añoPago || anoPagadoNum === parseInt(añoPago);
                } else {
                    // Si no tiene pagos registrados, solo coincide si no se filtró por pago
                    coincideMesPago = !mesPago;
                    coincideAñoPago = !añoPago;
                }
            }
            
            // Mostrar u ocultar fila según coincidan todos los filtros
            if (coincideApellidoPAT && coincideApellidoMAT && coincideNombres && 
                coincideAño && coincideGrupo && coincideMesPago && coincideAñoPago) {
                fila.style.display = '';
            } else {
                fila.style.display = 'none';
            }
        });
    }
    
    // Configurar eventos de filtrado
    function configurarFiltros() {
        
        const inputsBusqueda = document.querySelectorAll('#formularioBusqueda input, #formularioBusqueda select');
        
        
        //console.log("click");
        // Opcional: Filtrado mientras se escribe (con debounce)
        let timeoutBusqueda;
        inputsBusqueda.forEach(input => {
            input.addEventListener('input', function() {
                clearTimeout(timeoutBusqueda);
                timeoutBusqueda = setTimeout(aplicarFiltros, 300);
            });
        });
    }
    
    // Cargar datos iniciales (tu código original modificado)
    fetch('../Php/informacion_tb.php')
        .then(response => {
            if (!response.ok) throw new Error('Error en la red');
            return response.json();
        })
        .then(data => {
            if (!data.success) {
                console.error('Error del servidor:', data.error);
                alert('Error al cargar datos: ' + data.error);
                return;
            }

            const tbody = document.querySelector('tbody');
            tbody.innerHTML = '';
            datosOriginales = data.data; // Almacenar datos originales
            
            // Obtener fecha actual
            const fechaActual = new Date();
            const mesActual = fechaActual.getMonth() + 1;
            const anoActual = fechaActual.getFullYear();

            const meses = {
                'enero': 1, 'febrero': 2, 'marzo': 3, 'abril': 4,
                'mayo': 5, 'junio': 6, 'julio': 7, 'agosto': 8,
                'septiembre': 9, 'octubre': 10, 'noviembre': 11, 'diciembre': 12,
                'Enero': 1, 'Febrero': 2, 'Marzo': 3, 'Abril': 4,
                'Mayo': 5, 'Junio': 6, 'Julio': 7, 'Agosto': 8,
                'Septiembre': 9, 'Octubre': 10, 'Noviembre': 11, 'Diciembre': 12
            };

            data.data.forEach(alumno => {
                // Determinar estatus (tu lógica original)
                let estatus, claseEstatus;
                if (!alumno.UltimoMesPagado || !alumno.UltimoAnoPagado) {
                    estatus = 'Pendiente';
                    claseEstatus = 'bg-warning';
                } else {
                    const mesPagado = meses[alumno.UltimoMesPagado.toLowerCase()] || 0;
                    const anoPagado = parseInt(alumno.UltimoAnoPagado);

                    const pagado = (anoPagado > anoActual) || 
                                  (anoPagado === anoActual && mesPagado >= mesActual);

                    estatus = pagado ? 'Pagado' : 'Pendiente';
                    claseEstatus = pagado ? 'bg-success' : 'bg-warning';
                }

                // Crear fila
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>
                        <a href="informacion/alumno.html?id=${alumno.ID_Matricula}" class="text_link text-reset">
                            ${alumno.NombreCompleto}
                        </a>
                    </td>
                    <td>${alumno.GradoEscolar || 'N/A'}</td>
                    <td>${alumno.Grupo || 'N/A'}</td>
                    <td>${alumno.UltimoMesPagado || 'N/A'}</td>
                    <td>${alumno.UltimoAnoPagado || 'N/A'}</td>
                    <td class="${claseEstatus}">${estatus}</td>
                `;
                tbody.appendChild(row);
            });
            
            // Almacenar referencia a las filas
            filasOriginales = Array.from(tbody.querySelectorAll('tr'));
            
            // Configurar los filtros después de cargar los datos
            configurarFiltros();
        })
        .catch(error => {
            console.error('Error:', error);
        });
});