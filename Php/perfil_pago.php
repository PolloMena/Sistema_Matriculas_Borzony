<?php
header('Content-Type: application/json');
require_once('conexion.php');

$idAlumno = isset($_GET['id']) ? intval($_GET['id']) : 0;

if ($idAlumno <= 0) {
    echo json_encode(['success' => false, 'error' => 'ID inválido']);
    exit;
}

try {
    // Consulta para pagos de colegiatura
    $stmtColegiatura = $conn->prepare("
        SELECT 
            ID_Colegiatura,
            CONCAT(Mes, ' ', Ano) AS Periodo,
            Monto,
            DATE_FORMAT(Fecha_Colegiatura, '%d/%m/%Y') AS Fecha_Pago
        FROM Colegiatura
        WHERE FK_Matricula = ?
        ORDER BY Ano DESC, 
        CASE Mes
            WHEN 'Enero' THEN 1 WHEN 'Febrero' THEN 2 WHEN 'Marzo' THEN 3
            WHEN 'Abril' THEN 4 WHEN 'Mayo' THEN 5 WHEN 'Junio' THEN 6
            WHEN 'Julio' THEN 7 WHEN 'Agosto' THEN 8 WHEN 'Septiembre' THEN 9
            WHEN 'Octubre' THEN 10 WHEN 'Noviembre' THEN 11 WHEN 'Diciembre' THEN 12
        END DESC
    ");
    $stmtColegiatura->bind_param("i", $idAlumno);
    $stmtColegiatura->execute();
    $colegiaturas = $stmtColegiatura->get_result()->fetch_all(MYSQLI_ASSOC);

    // Consulta para otros pagos
    $stmtOtrosPagos = $conn->prepare("
        SELECT 
            ID_Otros,
            Concepto,
            Monto,
            DATE_FORMAT(Fecha, '%d/%m/%Y') AS Fecha_Pago
        FROM Otros_Pagos
        WHERE FK_Matricula = ?
        ORDER BY Fecha DESC
    ");
    $stmtOtrosPagos->bind_param("i", $idAlumno);
    $stmtOtrosPagos->execute();
    $otrosPagos = $stmtOtrosPagos->get_result()->fetch_all(MYSQLI_ASSOC);

    echo json_encode([
        'success' => true,
        'colegiaturas' => $colegiaturas,
        'otrosPagos' => $otrosPagos
    ]);

} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>