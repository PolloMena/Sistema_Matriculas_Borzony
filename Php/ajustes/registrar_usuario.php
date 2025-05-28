<?php
header('Content-Type: application/json');
require_once '../conexion.php'; // Asegúrate de tener este archivo con la conexión a DB

try {
    // Validar datos recibidos
    if (empty($_POST['usuario']) || empty($_POST['rol']) || empty($_POST['password'])) {
        throw new Exception('Todos los campos son requeridos');
    }

    $usuario = trim($_POST['usuario']);
    $rol = $_POST['rol'];
    $password = $_POST['password'];

    
    // Validar longitud de usuario y contraseña
    if (strlen($usuario) < 3) {
        throw new Exception('El usuario debe tener al menos 3 caracteres');
    }

    if (strlen($password) < 5) {
        throw new Exception('La contraseña debe tener al menos 5 caracteres');
    }

    // Hash seguro de la contraseña
    $passwordHash = password_hash($password, PASSWORD_BCRYPT);

    // Insertar en la base de datos
    $stmt = $conn->prepare("INSERT INTO Usuarios (Usuario, Contrasena, Rol) VALUES (?, ?, ?)");
    $stmt->bind_param('sss', $usuario, $passwordHash, $rol);

    if ($stmt->execute()) {
        echo json_encode(['success' => true]);
    } else {
        // Manejar error de usuario duplicado
        if ($conn->errno === 1062) {
            throw new Exception('El nombre de usuario ya existe');
        }
        throw new Exception('Error al registrar usuario: ' . $stmt->error);
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