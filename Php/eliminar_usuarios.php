<?php
header('Content-Type: application/json');
require_once 'conexion.php'; // Ajusta según tu estructura

session_start();

try {
    $data = json_decode(file_get_contents('php://input'), true);
    
    // Validaciones básicas
    if (!isset($data['id_usuario']) || !isset($data['password'])) {
        throw new Exception('Datos incompletos');
    }
    
    // 1. Verificar que la contraseña pertenezca a un usuario con rol permitido
    $stmt = $conn->prepare("SELECT ID_Users, Rol, Contrasena FROM usuarios WHERE Rol IN ('Directora', 'Ingeniero')");
    $stmt->execute();
    $usuariosPermitidos = $stmt->get_result();
    
    $credencialValida = false;
    $usuarioValidador = null;
    
    while ($usuario = $usuariosPermitidos->fetch_assoc()) {
        if (password_verify($data['password'], $usuario['Contrasena'])) {
            $credencialValida = true;
            $usuarioValidador = $usuario;
            break;
        }
    }
    
    if (!$credencialValida) {
        throw new Exception('La contraseña no corresponde a un usuario autorizado');
    }
    
    
    $stmt = $conn->prepare("DELETE FROM usuarios WHERE ID_Users=?");
    $stmt->bind_param("i", $data['id_usuario']);
    $stmt->execute();
    
    if ($stmt->affected_rows > 0) {
        echo json_encode([
            'success' => true,
            'message' => 'Usuario eliminado correctamente'
        ]);
    } else {
        throw new Exception('No se pudo eliminar el usuario');
    }
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?>