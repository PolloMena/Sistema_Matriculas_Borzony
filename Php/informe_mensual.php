<?php
header('Content-Type: application/json');
require_once 'conexion.php'; // Ajusta la ruta según tu estructura

try {
    // Validar parámetros
    if (!isset($_GET['mes']) || !isset($_GET['ano'])) {
        throw new Exception('Parámetros incompletos');
    }

    $mes = $_GET['mes'];
    $ano = $_GET['ano'];

    // Consulta para obtener pagos de colegiaturas
    $queryColegiaturas = "SELECT 
                            Fecha_Colegiatura AS fecha,
                            Monto AS monto,
                            'Colegiatura' AS concepto
                          FROM Colegiatura
                          WHERE MONTH(Fecha_Colegiatura) = ? 
                          AND YEAR(Fecha_Colegiatura) = ?";

    // Consulta para otros pagos
    $queryOtrosPagos = "SELECT 
                            Fecha AS fecha,
                            Monto AS monto,
                            Concepto AS concepto
                         FROM Otros_Pagos
                         WHERE MONTH(Fecha) = ? 
                         AND YEAR(Fecha) = ?";

    // Preparar consultas
    $stmtColegiaturas = $conn->prepare($queryColegiaturas);
    $stmtColegiaturas->bind_param("ss", $mes, $ano);
    $stmtColegiaturas->execute();
    $resultColegiaturas = $stmtColegiaturas->get_result();

    $stmtOtrosPagos = $conn->prepare($queryOtrosPagos);
    $stmtOtrosPagos->bind_param("ss", $mes, $ano);
    $stmtOtrosPagos->execute();
    $resultOtrosPagos = $stmtOtrosPagos->get_result();

    // Combinar resultados
    $pagos = [];
    while ($row = $resultColegiaturas->fetch_assoc()) {
        $pagos[] = $row;
    }
    while ($row = $resultOtrosPagos->fetch_assoc()) {
        $pagos[] = $row;
    }

    // Ordenar por fecha
    usort($pagos, function($a, $b) {
        return strtotime($a['fecha']) - strtotime($b['fecha']);
    });

    echo json_encode([
        'success' => true,
        'pagos' => $pagos
    ]);

} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?>