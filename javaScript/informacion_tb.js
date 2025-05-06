document.addEventListener('DOMContentLoaded', function() {
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

            // Obtener fecha actual
            const fechaActual = new Date();
            const mesActual = fechaActual.getMonth() + 1; // Enero = 0 -> 1
            const anoActual = fechaActual.getFullYear();

            //console.log(mesActual);

            // Mapeo de meses textuales a numéricos (ej: "Marzo" -> 3)
           // Versión robusta del mapeo de meses (ajusta según tus datos reales)
            const meses = {
                'enero': 1, 'febrero': 2, 'marzo': 3, 'abril': 4,
                'mayo': 5, 'junio': 6, 'julio': 7, 'agosto': 8,
                'septiembre': 9, 'octubre': 10, 'noviembre': 11, 'diciembre': 12,
                // Agrega variantes si es necesario (ej: "Enero" con mayúscula)
                'Enero': 1, 'Febrero': 2, 'Marzo': 3, 'Abril': 4,
                'Mayo': 5, 'Junio': 6, 'Julio': 7, 'Agosto': 8,
                'Septiembre': 9, 'Octubre': 10, 'Noviembre': 11, 'Diciembre': 12
            };

            data.data.forEach(alumno => {
                // Determinar estatus
                let estatus, claseEstatus;
                if (!alumno.UltimoMesPagado || !alumno.UltimoAnoPagado) {
                    estatus = 'Pendiente';
                    claseEstatus = 'bg-warning';
                } else {
                    const mesPagado = meses[alumno.UltimoMesPagado];
                    const anoPagado = parseInt(alumno.UltimoAnoPagado);

                    //console.log('Ano pago',anoPagado);

                    // Lógica: Si el último pago es >= mes/año actual -> "Pagado"
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
        })
        .catch(error => {
            console.error('Error:', error);
        });
});