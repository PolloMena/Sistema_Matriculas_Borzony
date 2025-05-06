<?php

include 'conexion.php';

// Iniciar transacción para integridad de datos
$conn->begin_transaction();

try {
    // =============================================
    // 1. Insertar en tabla Alumnos
    // =============================================
    $stmt = $conn->prepare("INSERT INTO Alumnos (
        Apellido_PAT, 
        Apellido_MAT, 
        Nombre, 
        Fecha_Nac, 
        CURP
    ) VALUES (?, ?, ?, ?, ?)");
    
    $stmt->bind_param("sssss",
        $_POST['apellido_paterno'],
        $_POST['apellido_materno'],
        $_POST['nombres'],
        $_POST['fecha_nacimiento'],
        $_POST['curp']
    );
    
    if (!$stmt->execute()) {
        throw new Exception("Error al guardar alumno: " . $stmt->error);
    }
    
    $matricula_id = $stmt->insert_id;
    $stmt->close();

    // =============================================
    // 2. Insertar en tabla Contacto
    // =============================================
    $stmt = $conn->prepare("INSERT INTO Contacto (
        FK_Matricula,
        Apellido_PAT,
        Apellido_MAT,
        Nombre,
        Correo,
        Telefono,
        Parentesco
    ) VALUES (?, ?, ?, ?, ?, ?, ?)");
    
    // Convertir valores de parentesco a formato de ENUM
    $parentesco_map = [
        'madre' => 'Madre',
        'padre' => 'Padre',
        'hermano' => 'Hermano',
        'otro' => 'Otro',
        'tutor' => 'Tutor'
    ];
    $parentesco = $parentesco_map[$_POST['parentesco']] ?? 'Tutor';
    
    $stmt->bind_param("issssss",
        $matricula_id,
        $_POST['contacto_apellido_paterno'],
        $_POST['contacto_apellido_materno'],
        $_POST['contacto_nombres'],
        $_POST['contacto_email'],
        $_POST['telefono'],
        $parentesco
    );
    
    if (!$stmt->execute()) {
        throw new Exception("Error al guardar contacto: " . $stmt->error);
    }
    
    $stmt->close();

    // =============================================
    // 3. Insertar en tabla Facturacion
    // =============================================
    $stmt = $conn->prepare("INSERT INTO Facturacion (
        FK_Matricula,
        Monto_Inscripcion,
        Nombre_SAT,
        RFC,
        CFDI,
        Correo,
        Constancia
    ) VALUES (?, ?, ?, ?, ?, ?, ?)");
    
    // Mapear valores de constancia fiscal
    $constancia = ($_POST['constancia_fiscal'] == 'si') ? 'Si' : 'No';
    
    $stmt->bind_param("idsssss",
        $matricula_id,
        $_POST['monto_inscripcion'],
        $_POST['nombre_sat'],
        $_POST['rfc'],
        $_POST['uso_cfdi'],
        $_POST['correo_facturacion'],
        $constancia
    );
    
    if (!$stmt->execute()) {
        throw new Exception("Error al guardar facturación: " . $stmt->error);
    }
    
    // En caso de ÉXITO:
    $conn->commit();
    echo "<script>
        localStorage.setItem('notification', JSON.stringify({
            type: 'success',
            message: 'Registro exitoso - Bienvenido a Borzony!!!'
        }));
        window.location.href = '" . $_SERVER['HTTP_REFERER'] . "';
    </script>";
    exit();

} catch (Exception $e) {
    // En caso de ERROR:
    $conn->rollback();
    echo "<script>
    localStorage.setItem('notification', JSON.stringify({
        type: 'error',
        message: 'Error: " . addslashes(str_replace("\n", " ", $e->getMessage())) . "'
    }));
    window.location.href = '" . $_SERVER['HTTP_REFERER'] . "';
    </script>";
    exit();
}

$conn->close();
?>