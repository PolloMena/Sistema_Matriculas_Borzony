<?php
header('Content-Type: application/json');
require_once('conexion.php');

// Validar y sanitizar el ID
$idAlumno = isset($_GET['id']) ? intval($_GET['id']) : 0;
if ($idAlumno <= 0) {
    echo json_encode(['success' => false, 'error' => 'ID de alumno inválido']);
    exit;
}

try {
    // Iniciar transacción (opcional, para consistencia en múltiples consultas)
    $conn->begin_transaction();

    /* ===== 1. Datos del Alumno ===== */
    $stmtAlumno = $conn->prepare("
        SELECT 
            ID_Matricula,
            Apellido_PAT,
            Apellido_MAT,
            Nombre,
            DATE_FORMAT(Fecha_Nac, '%d/%m/%Y') AS Fecha_Nac_Formateada,
            CURP,
            Ano,
            Grupo
        FROM Alumnos 
        WHERE ID_Matricula = ?
    ");
    $stmtAlumno->bind_param("i", $idAlumno);
    $stmtAlumno->execute();
    $alumno = $stmtAlumno->get_result()->fetch_assoc();

    if (!$alumno) {
        throw new Exception("Alumno no encontrado");
    }

    /* ===== 2. Datos de Contacto ===== */
    $stmtContacto = $conn->prepare("
        SELECT 
            Apellido_PAT,
            Apellido_MAT,
            Nombre,
            Correo,
            Telefono,
            Parentesco
        FROM Contacto
        WHERE FK_Matricula = ?
        LIMIT 1
    ");
    $stmtContacto->bind_param("i", $idAlumno);
    $stmtContacto->execute();
    $contacto = $stmtContacto->get_result()->fetch_assoc();

    /* ===== 3. Datos de Facturación ===== */
    $stmtFacturacion = $conn->prepare("
        SELECT 
            Monto_Inscripcion,
            Nombre_SAT,
            RFC,
            CFDI,
            Correo,
            Constancia,
            DATE_FORMAT(Fecha_Factura, '%d/%m/%Y') AS Fecha_Factura_Formateada
        FROM Facturacion
        WHERE FK_Matricula = ?
        LIMIT 1
    ");
    $stmtFacturacion->bind_param("i", $idAlumno);
    $stmtFacturacion->execute();
    $facturacion = $stmtFacturacion->get_result()->fetch_assoc();

    // Confirmar transacción
    $conn->commit();

    // Preparar respuesta
    $response = [
        'success' => true,
        'alumno' => $alumno,
        'contacto' => $contacto ?: null,
        'facturacion' => $facturacion ?: null
    ];

    echo json_encode($response);

} catch (Exception $e) {
    // Revertir transacción en caso de error
    $conn->rollback();
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?>