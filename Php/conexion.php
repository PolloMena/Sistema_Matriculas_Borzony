<?php
// Configuración de la base de datos
$servername = "127.0.0.1";
$username = "u724693148_gnasg";
$password = "?2p0fAEn";
$dbname = "u724693148_gnasg";

// Conexión a la base de datos
$conn = new mysqli($servername, $username, $password, $dbname);

// Verificar conexión
if ($conn->connect_error) {
    die("Error de conexión: " . $conn->connect_error);
}

?>
