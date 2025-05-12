<?php
header('Content-Type: application/json');
require_once 'conexion.php'; // Ajusta la ruta según tu estructura

try {
    // Consulta para alumnos sin grupo asignado (donde Grupo es NULL o vacío)
    $sql = "SELECT 
                ID_Matricula, 
                CONCAT(Apellido_PAT, ' ', Apellido_MAT, ' ', Nombre) AS NombreCompleto,
                Ano,
                Grupo
            FROM Alumnos
            WHERE Grupo IS NULL OR Grupo = '' AND Estatus = 1";
    
    $stmt = $conn->prepare($sql);
    $stmt->execute();
    $result = $stmt->get_result();
    
    $alumnos = [];
    while ($row = $result->fetch_assoc()) {
        $alumnos[] = [
            'matricula' => $row['ID_Matricula'],
            'nombre' => $row['NombreCompleto'],
            'ano' => $row['Ano'],
            'grupo' => $row['Grupo']
        ];
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