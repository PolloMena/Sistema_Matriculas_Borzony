<?php
header('Content-Type: application/json; charset=utf-8');

require_once '../conexion.php'; // Codigo de conexión a la base de datos

// Resto del codigo
$response = [
    'success' => false,
    'message' => '',
    'pago_id' => null
];

try {
    // Verificar método POST
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new Exception("Método no permitido", 405);
    }

    // Obtener y decodificar el JSON recibido
    $json = file_get_contents('php://input');
    $data = json_decode($json, true);

    // Validar datos recibidos
    if (json_last_error() !== JSON_ERROR_NONE) {
        throw new Exception("JSON inválido: " . json_last_error_msg());
    }

    if (empty($data['matricula_id'])) {
        throw new Exception("ID de matrícula no proporcionado");
    }

    if (empty($data['monto'])) {
        throw new Exception("Monto no proporcionado");
    }

    if (empty($data['mes'])) {
        throw new Exception("Mes no proporcionado");
    }

    if (empty($data['ano'])) {
        throw new Exception("Año no proporcionado");
    }

    // Conexión a la base de datos
    $conn = new mysqli($servername, $username, $password, $dbname);
    if ($conn->connect_error) {
        throw new Exception("Error de conexión: " . $conn->connect_error);
    }

    // Validar y formatear fecha (usando el campo 'fecha' enviado desde JS)
    if (empty($data['fecha'])) {
        throw new Exception("Fecha no proporcionada");
    }

    // Validar formato de fecha (YYYY-MM-DD)
    $fechaColegiatura = $data['fecha'];
    if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $fechaColegiatura)) {
        throw new Exception("Formato de fecha inválido. Use YYYY-MM-DD");
    }

    // Preparar consulta SQL
    $sql = "INSERT INTO Colegiatura (
                FK_Matricula, 
                Monto, 
                Mes, 
                Ano, 
                Fecha_Colegiatura
            ) VALUES (?, ?, ?, ?, ?)";

    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        throw new Exception("Error al preparar consulta: " . $conn->error);
    }

    // Bind parameters
    $stmt->bind_param(
        "idsss",  // i: entero, d: decimal, s: string (x4)
        $data['matricula_id'],
        $data['monto'],
        $data['mes'],
        $data['ano'],
        $fechaColegiatura  // Usamos la fecha validada
    );

    // Ejecutar consulta
    if (!$stmt->execute()) {
        throw new Exception("Error al registrar pago: " . $stmt->error);
    }

    // Éxito
    $response['success'] = true;
    $response['message'] = "Pago registrado correctamente";
    $response['pago_id'] = $stmt->insert_id;

} catch (Exception $e) {
    $response['message'] = $e->getMessage();
    http_response_code($e->getCode() ?: 500);
} finally {
    // Cerrar conexión si existe
    if (isset($conn)) {
        $conn->close();
    }
    
    // Enviar respuesta JSON
    echo json_encode($response, JSON_UNESCAPED_UNICODE);
}
?>