<?php
header('Content-Type: application/json');
require_once '../conexion.php';

try {
    $data = json_decode(file_get_contents('php://input'), true);
    
    // Validaciones básicas
    if (empty($data['id']) || empty($data['nuevaContrasena'])) {
        throw new Exception('Datos incompletos');
    }

    $userId = intval($data['id']);
    $nuevaContrasena = $data['nuevaContrasena'];

    // Validar longitud de contraseña
    if (strlen($nuevaContrasena) < 5) {
        throw new Exception('La contraseña debe tener al menos 5 caracteres');
    }

    // Verificar que el usuario no sea de rol protegido
    $stmtCheck = $conn->prepare("SELECT Rol FROM Usuarios WHERE ID_Users = ?");
    $stmtCheck->bind_param("i", $userId);
    $stmtCheck->execute();
    $usuario = $stmtCheck->get_result()->fetch_assoc();

    if (in_array($usuario['Rol'], ['Directora', 'Ingeniero'])) {
        throw new Exception('No puedes modificar contraseñas de este rol');
    }

    // Hash seguro de la nueva contraseña
    $hash = password_hash($nuevaContrasena, PASSWORD_BCRYPT);

    // Actualizar en la base de datos
    $stmtUpdate = $conn->prepare("UPDATE Usuarios SET Contrasena = ? WHERE ID_Users = ?");
    $stmtUpdate->bind_param("si", $hash, $userId);

    if ($stmtUpdate->execute()) {
        echo json_encode(['success' => true]);
    } else {
        throw new Exception('Error al actualizar en la base de datos');
    }
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
} finally {
    if (isset($conn)) $conn->close();
}
?>