<?php
// Configuración de la base de datos
$servername = "127.0.0.1";
$username = "username";
$password = "password";
$dbname = "dbname";

// Conexión a la base de datos
$conn = new mysqli($servername, $username, $password, $dbname);

// Verificar conexión
if ($conn->connect_error) {
    die("Error de conexión: " . $conn->connect_error);
}

?>
