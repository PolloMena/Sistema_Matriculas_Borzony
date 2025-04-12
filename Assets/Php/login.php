<?php
session_start();
include 'conexion.php';

$usuario = $_POST['usuario'];
$contrasena_ingresada = $_POST['contrasena'];

header('Content-Type: application/json'); // Importante para JSON

try {
    $sql = "SELECT * FROM usuarios WHERE usuario = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $usuario);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $fila = $result->fetch_assoc();
        
        if (password_verify($contrasena_ingresada, $fila['Contrasena'])) {
            $_SESSION['usuario'] = $usuario;
            $_SESSION['rol'] = $fila['Rol'];
            echo json_encode(['success' => true]);
            exit();
        } else {
            echo json_encode(['success' => false, 'error' => 'contraseña']);
        }
    } else {
        echo json_encode(['success' => false, 'error' => 'usuario']);
    }
} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}

$stmt->close();
$conn->close();
?>