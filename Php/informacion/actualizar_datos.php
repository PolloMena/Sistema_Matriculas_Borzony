<?php
header('Content-Type: application/json');
include '../conexion.php';

$input = json_decode(file_get_contents("php://input"), true);

$id = isset($input['id']) ? intval($input['id']) : 0;
$seccion = $input['seccion'] ?? '';

if (!$id || !$seccion) {
    echo json_encode(['success' => false, 'message' => 'Datos incompletos']);
    exit;
}

switch ($seccion) {
    case 'estudiante':
        $stmt = $conn->prepare("UPDATE Alumnos SET Apellido_PAT = ?, Apellido_MAT = ?, Nombre = ?, Fecha_Nac = ?, CURP = ? WHERE ID_Matricula = ?");
        $stmt->bind_param("sssssi", 
            $input['Apellido_PAT'], $input['Apellido_MAT'], $input['Nombre'], 
            $input['Fecha_Nac'], $input['CURP'], $id);
        break;

    case 'contacto':
        $stmt = $conn->prepare("UPDATE Contacto SET Apellido_PAT = ?, Apellido_MAT = ?, Nombre = ?, Correo = ?, Telefono = ?, Parentesco = ? WHERE FK_Matricula = ?");
        $stmt->bind_param("ssssssi",
            $input['Apellido_PAT'], $input['Apellido_MAT'], $input['Nombre'],
            $input['Correo'], $input['Telefono'], $input['Parentesco'], $id);
        break;

    case 'facturacion':
        $stmt = $conn->prepare("UPDATE Facturacion SET Nombre_SAT = ?, RFC = ?, CFDI = ?, Correo = ?, Constancia = ? WHERE FK_Matricula = ?");
        $stmt->bind_param("sssssi",
            $input['Nombre_SAT'], $input['RFC'], $input['CFDI'], 
            $input['Correo'], $input['Constancia'], $id);
        break;

    default:
        echo json_encode(['success' => false, 'message' => 'Sección inválida']);
        exit;
}

if ($stmt->execute()) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'message' => 'Error al actualizar']);
}
