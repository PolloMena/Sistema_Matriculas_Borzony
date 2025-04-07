<?php
session_start();

include 'conexion.php';
// Obtener datos del formulario
$usuario = $_POST['usuario'];
$contrasena = $_POST['contrasena'];

// Consulta SQL (usa prepared statements para seguridad)
$sql = "SELECT * FROM usuarios WHERE usuario = ? AND contrasena = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ss", $usuario, $contrasena);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    // Login exitoso
    $_SESSION['usuario'] = $usuario;
    header("Location: ../../Views/index.html"); // Redirige a la página principal
} else {
    // Login fallido
    echo "<script>alert('Usuario o contraseña incorrectos'); window.history.back();</script>";
}

$stmt->close();
$conn->close();
?>