<?php
header('Content-Type: application/json');
require_once('../conexion.php');

try {
    // Validar y sanitizar el ID
    $idAlumno = isset($_GET['id']) ? intval($_GET['id']) : 0;
    if ($idAlumno <= 0) {
        throw new Exception('ID de alumno inválido');
    }

    $sql = "SELECT 
                Apellido_PAT,
                Apellido_MAT,
                Nombre
            FROM alumnos
            WHERE ID_Matricula = ?";
    
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('i', $idAlumno);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        throw new Exception('Alumno no encontrado');
    }
    
    $alumno = $result->fetch_assoc();
    
    echo json_encode([
        'success' => true,
        'alumno' => $alumno
    ]);
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
} finally {
    if (isset($conn)) $conn->close();
}
?>