<?php
header('Content-Type: application/json');
require_once '../conexion.php';

try {
    // Consulta modificada para excluir roles específicos
    $rol = isset($_GET['rol']) ? $_GET['rol'] : '';

    if ($rol === 'Directora' || $rol === 'Ingeniero') {
        // Si es Directora, trae toda la tabla
        $sql = "SELECT ID_Users, Usuario, Rol FROM usuarios WHERE Rol NOT IN ('Ingeniero','Directora') ORDER BY Rol, Usuario";
    } else {
        // Si no, excluye ciertos roles
        $sql = "SELECT ID_Users, Usuario, Rol 
                FROM usuarios 
                WHERE Rol NOT IN ('Directora', 'Ingeniero', 'Administrador') 
                ORDER BY Rol, Usuario";
    }
    
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