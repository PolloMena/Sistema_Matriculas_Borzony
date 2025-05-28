<?php
header('Content-Type: application/json');
require_once '../conexion.php';

try {
    $data = json_decode(file_get_contents('php://input'), true);
    
    // Validar datos recibidos
    if (!isset($data['matriculas']) || !isset($data['grado']) || !isset($data['grupo'])) {
        throw new Exception('Datos incompletos');
    }
    
    $matriculas = $data['matriculas'];
    $grado = $data['grado'];
    $grupo = $data['grupo'];
    
    // Validar que sean arrays
    if (!is_array($matriculas) || empty($matriculas)) {
        throw new Exception('No se recibieron matrículas válidas');
    }
    
    // Preparar consulta
    $sql = "UPDATE Alumnos SET Ano = ?, Grupo = ? WHERE ID_Matricula = ?";
    $stmt = $conn->prepare($sql);
    
    // Ejecutar para cada matrícula
    $conn->begin_transaction();
    foreach ($matriculas as $matricula) {
        $stmt->bind_param("isi", $grado, $grupo, $matricula);
        $stmt->execute();
        
        if ($stmt->affected_rows === 0) {
            throw new Exception("No se pudo actualizar la matrícula $matricula");
        }
    }
    $conn->commit();
    
    echo json_encode([
        'success' => true,
        'message' => 'Grupo asignado correctamente a ' . count($matriculas) . ' alumno(s)',
        'updated' => count($matriculas)
    ]);
    
} catch (Exception $e) {
    if (isset($conn)) {  // Se agregó el paréntesis de cierre y llaves para mejor práctica
        $conn->rollback();
    }
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?>