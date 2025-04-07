<?php
// Configuración de la base de datos
$servername = "localhost";
$username = "user_borzony";
$password = "b0rZ0n1@";
$dbname = "db_borzony";

// Conexión a la base de datos
$conn = new mysqli($servername, $username, $password, $dbname);

// Verificar conexión
if ($conn->connect_error) {
    die("Error de conexión: " . $conn->connect_error);
}

?>
