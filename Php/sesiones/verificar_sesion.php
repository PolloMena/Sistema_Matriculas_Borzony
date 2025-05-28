<?php
session_start();
header('Content-Type: application/json');

// Verificar si existe sesión activa
if (isset($_SESSION['usuario'])) {
    echo json_encode(['autenticado' => true, 'usuario' => $_SESSION['usuario'], 'rol' => $_SESSION['rol'], 'ID_Users' => $_SESSION['ID_Users']]);
} else {
    echo json_encode(['autenticado' => false]);
}
?>
