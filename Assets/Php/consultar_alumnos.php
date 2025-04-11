<?php
header('Content-Type: application/json');
require_once 'conexion.php';

try {
    // Obtener y sanitizar parámetros
    $apellidoPaterno = isset($_POST['apellido_paterno']) ? $conn->real_escape_string($_POST['apellido_paterno']) : '';
    $apellidoMaterno = isset($_POST['apellido_materno']) ? $conn->real_escape_string($_POST['apellido_materno']) : '';
    $nombre = isset($_POST['nombre']) ? $conn->real_escape_string($_POST['nombre']) : '';

    // Construir consulta principal
    $sql = "SELECT ID_Matricula, Apellido_PAT, Apellido_MAT, Nombre, Ano, Grupo 
            FROM Alumnos 
            WHERE 1=1";
    $types = '';
    $params = [];

    if (!empty($apellidoPaterno)) {
        $sql .= " AND Apellido_PAT LIKE CONCAT(?, '%')";
        $types .= 's';
        $params[] = $apellidoPaterno;
    }

    if (!empty($apellidoMaterno)) {
        $sql .= " AND Apellido_MAT LIKE CONCAT(?, '%')";
        $types .= 's';
        $params[] = $apellidoMaterno;
    }

    if (!empty($nombre)) {
        $sql .= " AND Nombre LIKE CONCAT('%', ?, '%')";
        $types .= 's';
        $params[] = $nombre;
    }

    $sql .= " ORDER BY Apellido_PAT, Apellido_MAT, Nombre LIMIT 10";

    $stmt = $conn->prepare($sql);
    if ($types) {
        $stmt->bind_param($types, ...$params);
    }

    if (!$stmt->execute()) {
        throw new Exception("Error en la consulta: " . $stmt->error);
    }

    $result = $stmt->get_result();
    $alumnos = [];

    while ($row = $result->fetch_assoc()) {
        $idMatricula = $row['ID_Matricula'];

        // Consultar el último pago de ese alumno
        $stmtPago = $conn->prepare("SELECT Mes, Ano FROM Colegiatura 
                                    WHERE FK_Matricula = ? 
                                    ORDER BY Fecha_Colegiatura DESC LIMIT 1");
        $stmtPago->bind_param("i", $idMatricula);
        $stmtPago->execute();
        $resPago = $stmtPago->get_result();

        $ultimoPago = "Sin pagos registrados";
        if ($pago = $resPago->fetch_assoc()) {
            $ultimoPago = $pago['Mes'] . ' ' . $pago['Ano'];
        }

        // Agregar info del alumno + último pago
        $alumnos[] = [
            'ID_Matricula' => $row['ID_Matricula'],
            'Apellido_PAT' => $row['Apellido_PAT'],
            'Apellido_MAT' => $row['Apellido_MAT'],
            'Nombre' => $row['Nombre'],
            'Ano' => $row['Ano'],
            'Grupo' => $row['Grupo'],
            'Ultimo_Pago' => $ultimoPago
        ];
    }

    echo json_encode($alumnos);

} catch (Exception $e) {
    echo json_encode(['error' => $e->getMessage()]);
} finally {
    if (isset($conn)) $conn->close();
}
?>
