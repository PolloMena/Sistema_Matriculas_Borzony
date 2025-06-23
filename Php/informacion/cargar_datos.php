<?php
header('Content-Type: application/json');
include '../conexion.php'; // Asegúrate de tener tu conexión a la BD aquí

$id = isset($_GET['id']) ? intval($_GET['id']) : 0;
if (!$id) {
    echo json_encode(['error' => 'ID no válido']);
    exit;
}

// Consulta a la tabla Alumnos
$alumnoQuery = $conn->prepare("SELECT Apellido_PAT, Apellido_MAT, Nombre, Fecha_Nac, CURP, Ano, Grupo FROM alumnos WHERE ID_Matricula = ?");
$alumnoQuery->bind_param("i", $id);
$alumnoQuery->execute();
$alumnoResult = $alumnoQuery->get_result()->fetch_assoc();

// Consulta a la tabla Contacto
$contactoQuery = $conn->prepare("SELECT Apellido_PAT, Apellido_MAT, Nombre, Correo, Telefono, Parentesco FROM contacto WHERE FK_Matricula = ?");
$contactoQuery->bind_param("i", $id);
$contactoQuery->execute();
$contactoResult = $contactoQuery->get_result()->fetch_assoc();

// Consulta a la tabla Facturacion
$facturacionQuery = $conn->prepare("SELECT Nombre_SAT, RFC, CFDI, Correo, Constancia FROM facturacion WHERE FK_Matricula = ?");
$facturacionQuery->bind_param("i", $id);
$facturacionQuery->execute();
$facturacionResult = $facturacionQuery->get_result()->fetch_assoc();

echo json_encode([
    'alumno' => $alumnoResult,
    'contacto' => $contactoResult,
    'facturacion' => $facturacionResult
]);
