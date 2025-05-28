<?php
header('Content-Type: application/json');
require_once '../conexion.php';

try {
    $data = json_decode(file_get_contents('php://input'), true);
    
    // Validar datos
    if (empty($data['usuario']) || empty($data['password'])) {
        throw new Exception('Usuario y contraseña requeridos');
    }
    
    $sql = "SELECT ID_Users, Usuario, Contrasena, Rol FROM usuarios WHERE Usuario = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $data['usuario']);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        throw new Exception('Usuario no encontrado');
    }
    
    $usuario = $result->fetch_assoc();
    
    if (!password_verify($data['password'], $usuario['Contrasena'])) {
        throw new Exception('Contraseña incorrecta');
    }
    
    echo json_encode([
        'success' => true,
        'usuario' => $usuario['Usuario'],
        'rol' => $usuario['Rol'],
        'id_usuario' => $usuario['ID_Users']
    ]);
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?>