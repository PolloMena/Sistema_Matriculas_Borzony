<?php
header('Content-Type: application/json');

// Incluir la conexión
require_once 'conexion.php'; // Asegúrate de que la ruta sea correcta

// Obtener datos del POST
$matricula = isset($_POST['matricula']) ? intval($_POST['matricula']) : null;

if (!$matricula) {
    echo json_encode([
        'success' => false,
        'error' => 'Matrícula no proporcionada o inválida.'
    ]);
    exit;
}

try {
    // Query para actualizar los pagos de "Materiales"
    $sql = "UPDATE Otros_Pagos 
            SET Estatus = 0 
            WHERE FK_Matricula = ? 
            AND Concepto = 'Materiales' 
            AND Estatus = 1";

    // Preparar la consulta
    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        throw new Exception("Error en la preparación de la consulta: " . $conn->error);
    }

    // Vincular parámetro y ejecutar
    $stmt->bind_param("i", $matricula);
    $stmt->execute();

    // Verificar filas afectadas
    $rowsAffected = $stmt->affected_rows;

    if ($rowsAffected > 0) {
        echo json_encode([
            'success' => true,
            'message' => "Pagos de materiales reiniciados (ocultos)."
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'error' => "No se encontraron pagos activos de 'Materiales' para este alumno."
        ]);
    }

} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'error' => "Error en el servidor: " . $e->getMessage()
    ]);
} finally {
    // Cerrar conexión
    if (isset($stmt)) $stmt->close();
    $conn->close();
}
?>