<?php
header('Content-Type: application/json');
require_once 'conexion.php';

try {
    // Consulta modificada para excluir roles específicos
    $sql = "SELECT ID_Users, Usuario, Rol 
            FROM Usuarios 
            WHERE Rol NOT IN ('Directora', 'Ingeniero') 
            ORDER BY Rol, Usuario";
    
    $stmt = $conn->prepare($sql);
    $stmt->execute();
    $result = $stmt->get_result();
    
    $usuarios = [];
    while ($row = $result->fetch_assoc()) {
        $usuarios[] = $row;
    }
    
    echo json_encode($usuarios);
} catch (Exception $e) {
    echo json_encode(['error' => $e->getMessage()]);
} finally {
    $conn->close();
}
?>