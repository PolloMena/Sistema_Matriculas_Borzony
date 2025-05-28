<?php
header('Content-Type: application/json');
require_once '../conexion.php';

try {
    // Validar parámetros
    if (!isset($_GET['año']) || !isset($_GET['grupo'])) {
        throw new Exception('Parámetros incompletos');
    }
    
    $año = $_GET['año'];
    $grupo = $_GET['grupo'];
    
    // Consulta SQL con prepared statements
    $sql = "SELECT 
                ID_Matricula, 
                Apellido_PAT, 
                Apellido_MAT, 
                Nombre,
                Ano,
                Grupo
            FROM Alumnos
            WHERE Ano = ? AND Grupo = ? AND Estatus = 1
            ORDER BY Apellido_PAT, Apellido_MAT, Nombre";
    
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("is", $año, $grupo);
    $stmt->execute();
    $result = $stmt->get_result();
    
    $alumnos = [];
    while ($row = $result->fetch_assoc()) {
        $alumnos[] = $row;
    }
    
    echo json_encode([
        'success' => true,
        'alumnos' => $alumnos
    ]);
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?>