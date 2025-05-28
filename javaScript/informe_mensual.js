document.addEventListener('DOMContentLoaded', function() {
    const btnGenerarInforme = document.getElementById('btnGenerarInforme');
    const selectMes = document.getElementById('selectMes');
    const selectAno = document.getElementById('selectAno');
    const resultadoInforme = document.getElementById('resultadoInforme');
    const tablaPagos = document.getElementById('tablaPagos');
    const tituloMesAno = document.getElementById('tituloMesAno');
    const totalMes = document.getElementById('totalMes');

    // Habilitar/deshabilitar botón según selección
    function validarSeleccion() {
        btnGenerarInforme.disabled = !(selectMes.value && selectAno.value);
    }

    selectMes.addEventListener('change', validarSeleccion);
    selectAno.addEventListener('change', validarSeleccion);

    // Generar informe
    btnGenerarInforme.addEventListener('click', async function() {
        const mes = selectMes.value;
        const ano = selectAno.value;
        const nombreMes = selectMes.options[selectMes.selectedIndex].text;
        
        try {
            const response = await fetch(`../../Php/informacion/informe_mensual.php?mes=${mes}&ano=${ano}`);
            const data = await response.json();
            
            if (data.success) {
                mostrarResultados(data.pagos, nombreMes, ano);
            } else {
                throw new Error(data.error || 'Error al obtener datos');
            }
        } catch (error) {
            Swal.fire('Error', error.message, 'error');
            console.error('Error:', error);
        }
    });

    // Mostrar resultados en la tabla
    function mostrarResultados(pagos, nombreMes, ano) {
        // Actualizar título
        tituloMesAno.textContent = `${nombreMes} ${ano}`;
        
        // Limpiar tabla
        tablaPagos.innerHTML = '';
        
        let total = 0;
        
        // Agregar filas
        pagos.forEach(pago => {
            
            const fechaFormateada = new Date(pago.fecha).toLocaleDateString('es-MX');
            const montoFormateado = formatCurrency(pago.monto);
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${pago.fecha}</td>
                <td>${montoFormateado}</td>
                <td>${pago.concepto || 'Colegiatura'}</td>
            `;
            tablaPagos.appendChild(row);
            
            total += parseFloat(pago.monto);
        });
        
        // Actualizar total
        totalMes.textContent = formatCurrency(total);
        
        // Mostrar sección de resultados
        resultadoInforme.style.display = 'block';
    }
    
    // Formatear moneda
    function formatCurrency(amount) {
        return '$' + parseFloat(amount).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    }

    // Configuración de jsPDF (si usas módulos)
const { jsPDF } = window.jspdf;

// Función para imprimir
document.getElementById('btnImprimir').addEventListener('click', function() {
    const tabla = document.querySelector('.card');
    const ventana = window.open('', '_blank');
    ventana.document.write(`
        <html>
            <head>
                <title>Informe Mensual - ${tituloMesAno.textContent}</title>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
                <style>
                    @media print {
                        body { padding: 20px; }
                        .no-print { display: none !important; }
                    }
                </style>
            </head>
            <body>
                ${tabla.outerHTML}
                <script>
                    setTimeout(() => {
                        window.print();
                        window.close();
                    }, 500);
                </script>
            </body>
        </html>
    `);
    ventana.document.close();
});

// Función para exportar PDF
document.getElementById('btnExportarPDF').addEventListener('click', function() {
    generarPDF();
});

function generarPDF() {
    // Cambiamos a orientación vertical (portrait)
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
    });

    // Configuración inicial
    const marginLeft = 15;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    
    // 1. Logo institucional (ajusta la ruta y dimensiones)
    try {
        const logoData = '../../Assets/img/logo2.png';
        // (imagen, formato, X, Y, ancho, alto)
        doc.addImage(logoData, 'PNG', marginLeft, 10, 25, 25);
    } catch (e) {
        console.error("Error al cargar el logo:", e);
    }

    // 2. Encabezado institucional
    doc.setFontSize(12);
    doc.setTextColor(40);
    doc.setFont('helvetica', 'bold');
    doc.text("INSTITUTO BORZONY", marginLeft + 35, 15);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text("CLAVE: 16PPR0289U CICLO 2024-2025", marginLeft + 35, 20);
    
    // Línea divisoria
    doc.setDrawColor(200);
    doc.setLineWidth(0.3);
    doc.line(marginLeft, 40, pageWidth - marginLeft, 40);

    // 3. Título del informe
    doc.setFontSize(14);
    doc.setTextColor(40);
    doc.text(`INFORME MENSUAL - ${tituloMesAno.textContent.toUpperCase()}`, pageWidth / 2, 35, { align: 'center' });

    // 4. Tabla de datos
    const headers = [["FECHA", "CONCEPTO", "MONTO"]];
    const rows = [];
    let total = 0;

    document.querySelectorAll('#tablaPagos tr').forEach(row => {
        const cells = row.querySelectorAll('td');
        if (cells.length === 3) {
            const fecha = cells[0].textContent;
            const concepto = cells[2].textContent;
            const monto = cells[1].textContent.replace('$', '');
            rows.push([fecha, concepto, monto]);
            total += parseFloat(monto.replace(/,/g, ''));
        }
    });

    // Configuración de la tabla
    doc.autoTable({
        head: headers,
        body: rows,
        startY: 45,
        margin: { left: marginLeft },
        styles: {
            fontSize: 9,
            cellPadding: 3,
            valign: 'middle',
            halign: 'left'
        },
        headStyles: {
            fillColor: [13, 110, 253],
            textColor: 255,
            fontStyle: 'bold'
        },
        columnStyles: {
            0: { cellWidth: 25 }, // Fecha
            1: { cellWidth: 'auto' }, // Concepto
            2: { cellWidth: 25, halign: 'right' } // Monto alineado a la derecha
        },
        didDrawPage: function(data) {
            // Pie de página en cada hoja
            doc.setFontSize(8);
            doc.setTextColor(150);
            const str = `Página ${doc.internal.getNumberOfPages()}`;
            doc.text(str, pageWidth - marginLeft, pageHeight - 10, { align: 'right' });
        }
    });

    // 5. Total y firma
    const finalY = doc.lastAutoTable.finalY || 45;
    
    // Total
    doc.setFontSize(12);
    doc.setTextColor(40);
    doc.text(`TOTAL DEL MES:`, marginLeft + 120, finalY + 15, { align: 'right' });
    doc.text(`$${total.toFixed(2)}`, marginLeft + 170, finalY + 15, { align: 'right' });
    
    // Línea de firma
    doc.setFontSize(10);
    doc.text("__________________________________", marginLeft + 100, finalY + 30);
    doc.text("DIRECTORA GENERAL.", marginLeft + 110, finalY + 35);

    // Texto del nombre (5mm más abajo)
    doc.setFont('helvetica', 'bold'); // Opcional: poner en negrita el nombre
    doc.text("ADRIANA BARBOSA MUÑOZ.", marginLeft + 110, finalY + 40);
    doc.setFont('helvetica', 'normal'); // Volver a normal

    // 6. Fecha de generación
    const fechaGeneracion = new Date().toLocaleDateString('es-MX', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    });
    doc.setFontSize(8);
    doc.setTextColor(100);
    doc.text(`Documento generado el: ${fechaGeneracion}`, marginLeft, pageHeight - 10);

    // Guardar PDF
    doc.save(`Informe_Mensual_${tituloMesAno.textContent.replace(' ', '_')}.pdf`);
}
});