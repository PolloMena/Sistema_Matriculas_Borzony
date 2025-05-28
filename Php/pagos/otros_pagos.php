<?php
header('Content-Type: application/json');

// Configuración de la base de datos
require_once '../conexion.php'; // Archivo con las constantes de conexión

try {
    // Verificar acción solicitada
    $accion = isset($_POST['accion']) ? $_POST['accion'] : '';

    // Acción para buscar alumno y sus pagos
    if ($accion == 'buscar_alumno_y_pagos') {
        // Obtener y sanitizar parámetros
        $apellidoPaterno = isset($_POST['apellido_paterno']) ? $conn->real_escape_string($_POST['apellido_paterno']) : '';
        $apellidoMaterno = isset($_POST['apellido_materno']) ? $conn->real_escape_string($_POST['apellido_materno']) : '';
        $nombre = isset($_POST['nombre']) ? $conn->real_escape_string($_POST['nombre']) : '';

        // Construir consulta SQL segura para alumnos
        $sqlAlumnos = "SELECT ID_Matricula, Apellido_PAT, Apellido_MAT, Nombre, Ano, Grupo FROM Alumnos WHERE 1=1 AND Estatus = 1";
        $types = '';
        $params = [];

        if (!empty($apellidoPaterno)) {
            $sqlAlumnos .= " AND Apellido_PAT LIKE CONCAT(?, '%')";
            $types .= 's';
            $params[] = $apellidoPaterno;
        }

        if (!empty($apellidoMaterno)) {
            $sqlAlumnos .= " AND Apellido_MAT LIKE CONCAT(?, '%')";
            $types .= 's';
            $params[] = $apellidoMaterno;
        }

        if (!empty($nombre)) {
            $sqlAlumnos .= " AND Nombre LIKE CONCAT('%', ?, '%')";
            $types .= 's';
            $params[] = $nombre;
        }

        $sqlAlumnos .= " ORDER BY Apellido_PAT, Apellido_MAT, Nombre LIMIT 10";

        // Preparar y ejecutar consulta de alumnos
        $stmtAlumnos = $conn->prepare($sqlAlumnos);

        if ($types) {
            $stmtAlumnos->bind_param($types, ...$params);
        }

        if (!$stmtAlumnos->execute()) {
            throw new Exception("Error en la consulta de alumnos: " . $stmtAlumnos->error);
        }

        $resultAlumnos = $stmtAlumnos->get_result();
        $alumnos = $resultAlumnos->fetch_all(MYSQLI_ASSOC);

        // AGREGAR el campo de Último Pago de colegiatura
        foreach ($alumnos as &$alumno) {
            $idMatricula = $alumno['ID_Matricula'];

            $sqlUltimoPago = "SELECT Mes, Ano FROM Colegiatura 
                            WHERE FK_Matricula = ? 
                            ORDER BY Fecha_Colegiatura DESC 
                            LIMIT 1";
            $stmtUltimoPago = $conn->prepare($sqlUltimoPago);
            $stmtUltimoPago->bind_param('i', $idMatricula);
            $stmtUltimoPago->execute();
            $resultUltimoPago = $stmtUltimoPago->get_result();
            $pago = $resultUltimoPago->fetch_assoc();

            $alumno['Ultimo_Pago'] = $pago ? $pago['Mes'] . ' ' . $pago['Ano'] : 'Sin registro';
        }

        //  Consulta de pagos de materiales
        $pagos = [];
        if (count($alumnos) > 0) {
            $matricula = $alumnos[0]['ID_Matricula']; // Tomamos el primer alumno

            $sqlPagos = "SELECT ID_Otros, Fecha, Monto 
                        FROM Otros_Pagos 
                        WHERE FK_Matricula = ? AND Concepto = 'Materiales' AND Estatus = 1
                        ORDER BY Fecha ASC
                        LIMIT 4";

            $stmtPagos = $conn->prepare($sqlPagos);
            $stmtPagos->bind_param('i', $matricula);

            if (!$stmtPagos->execute()) {
                throw new Exception("Error en la consulta de pagos: " . $stmtPagos->error);
            }

            $resultPagos = $stmtPagos->get_result();
            $pagos = $resultPagos->fetch_all(MYSQLI_ASSOC);
        }

        echo json_encode([
            'alumnos' => $alumnos,
            'pagos' => $pagos
        ]);
    }

    // Acción para obtener pagos de un alumno específico (al navegar entre resultados)
    elseif ($accion == 'obtener_pagos_alumno' && isset($_POST['matricula'])) {
        $matricula = (int)$_POST['matricula'];
        
        $sqlPagos = "SELECT ID_Otros, Fecha, Monto 
                    FROM Otros_Pagos 
                    WHERE FK_Matricula = ? AND Concepto = 'Materiales' AND Estatus = 1
                    ORDER BY Fecha ASC
                    LIMIT 4";
        
        $stmt = $conn->prepare($sqlPagos);
        $stmt->bind_param('i', $matricula);
        
        if (!$stmt->execute()) {
            throw new Exception("Error en la consulta de pagos: " . $stmt->error);
        }
        
        $result = $stmt->get_result();
        $pagos = $result->fetch_all(MYSQLI_ASSOC);
        
        echo json_encode([
            'pagos' => $pagos
        ]);
    }// Añadir este caso al switch de acciones en tu PHP
    elseif ($accion == 'registrar_pagos' && isset($_POST['matricula'])) {
        $matricula = (int)$_POST['matricula'];
        $pagos = json_decode($_POST['pagos'], true);
        $registrados = 0;

        
        
        try {
            $conn->autocommit(FALSE); // Iniciar transacción
            
            $stmt = $conn->prepare("
                INSERT INTO Otros_Pagos 
                (FK_Matricula, Fecha, Concepto, Monto) 
                VALUES (?, ?, 'Materiales', ?)
            ");
            
            foreach ($pagos as $pago) {
                // Validar datos del pago
                if (!empty($pago['fecha']) && is_numeric($pago['monto']) && $pago['monto'] > 0) {
                    $stmt->bind_param('isd', 
                        $matricula,
                        $pago['fecha'],
                        $pago['monto']
                    );
                    
                    if ($stmt->execute()) {
                        $registrados++;
                    }
                }
            }
            
            $conn->commit();
            
            echo json_encode([
                'success' => true,
                'registrados' => $registrados,
                'total' => count($pagos)
            ]);
            
        } catch (Exception $e) {
            $conn->rollback();
            echo json_encode([
                'success' => false,
                'error' => 'Error en la transacción: ' . $e->getMessage()
            ]);
        }
    }
    // Añadir este caso al switch de acciones
    elseif ($accion == 'registrar_pago_extra' && isset($_POST['matricula'])) {
        $matricula = (int)$_POST['matricula'];
        $fecha = $conn->real_escape_string($_POST['fecha']);
        $concepto = $conn->real_escape_string($_POST['concepto']);
        $monto = (float)$_POST['monto'];
        
        try {
            $stmt = $conn->prepare("
                INSERT INTO Otros_Pagos 
                (FK_Matricula, Fecha, Concepto, Monto) 
                VALUES (?, ?, ?, ?)
            ");
            
            $stmt->bind_param('issd', $matricula, $fecha, $concepto, $monto);
            
            if ($stmt->execute()) {
                echo json_encode([
                    'success' => true,
                    'id' => $stmt->insert_id
                ]);
            } else {
                throw new Exception("Error al ejecutar la consulta");
            }
        } catch (Exception $e) {
            echo json_encode([
                'success' => false,
                'error' => 'Error en la base de datos: ' . $e->getMessage()
            ]);
        }
    }
    // Búsqueda normal de alumnos (compatibilidad con código existente)
    else {
        // Obtener y sanitizar parámetros
        $apellidoPaterno = isset($_POST['apellido_paterno']) ? $conn->real_escape_string($_POST['apellido_paterno']) : '';
        $apellidoMaterno = isset($_POST['apellido_materno']) ? $conn->real_escape_string($_POST['apellido_materno']) : '';
        $nombre = isset($_POST['nombre']) ? $conn->real_escape_string($_POST['nombre']) : '';

        // Construir consulta SQL segura
        $sql = "SELECT ID_Matricula, Apellido_PAT, Apellido_MAT, Nombre, Ano, Grupo FROM Alumnos WHERE 1=1";
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

        // Preparar y ejecutar consulta
        $stmt = $conn->prepare($sql);
        
        if ($types) {
            $stmt->bind_param($types, ...$params);
        }
        
        if (!$stmt->execute()) {
            throw new Exception("Error en la consulta: " . $stmt->error);
        }
        
        $result = $stmt->get_result();
        $alumnos = $result->fetch_all(MYSQLI_ASSOC);
        
        echo json_encode($alumnos);
    }
    
} catch (Exception $e) {
    echo json_encode(['error' => $e->getMessage()]);
} finally {
    if (isset($conn)) $conn->close();
}
?>