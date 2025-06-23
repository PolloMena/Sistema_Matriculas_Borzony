<?php
header('Content-Type: application/json');
require_once '../conexion.php';

try {
    $data = json_decode(file_get_contents('php://input'), true);
    
    // Validar ID recibido
    if (!isset($data['id']) || !is_numeric($data['id'])) {
        throw new Exception('ID de alumno inválido');
    }
    
    $idAlumno = $data['id'];
    
    // Actualizar estatus a 0 (baja)
    $sql = "UPDATE alumnos SET Estatus = 0 WHERE ID_Matricula = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $idAlumno);
    $stmt->execute();
    
    if ($stmt->affected_rows === 0) {
        throw new Exception('No se encontró el alumno o ya estaba dado de baja');
    }
    
    echo json_encode([
        'success' => true,
        'message' => 'Alumno dado de baja correctamente'
    ]);
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?>