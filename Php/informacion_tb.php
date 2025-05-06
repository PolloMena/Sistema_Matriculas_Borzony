<?php
header('Content-Type: application/json');

try {
    require_once('conexion.php');
    
    $query = "
    SELECT 
        a.ID_Matricula, 
        CONCAT(a.Apellido_PAT, ' ', a.Apellido_MAT, ' ', a.Nombre) AS NombreCompleto,
        a.Ano AS GradoEscolar,
        a.Grupo,
        c.Mes AS UltimoMesPagado,
        c.Ano AS UltimoAnoPagado
    FROM Alumnos a
    LEFT JOIN (
        SELECT 
            FK_Matricula, 
            Mes, 
            Ano,
            -- Ordenamos por año DESC y mes DESC (usando mapeo numérico)
            ROW_NUMBER() OVER (
                PARTITION BY FK_Matricula 
                ORDER BY Ano DESC, 
                CASE Mes
                    WHEN 'Enero' THEN 1
                    WHEN 'Febrero' THEN 2
                    WHEN 'Marzo' THEN 3
                    WHEN 'Abril' THEN 4
                    WHEN 'Mayo' THEN 5
                    WHEN 'Junio' THEN 6
                    WHEN 'Julio' THEN 7
                    WHEN 'Agosto' THEN 8
                    WHEN 'Septiembre' THEN 9
                    WHEN 'Octubre' THEN 10
                    WHEN 'Noviembre' THEN 11
                    WHEN 'Diciembre' THEN 12
                END DESC
            ) AS rn
        FROM Colegiatura
    ) c ON a.ID_Matricula = c.FK_Matricula AND c.rn = 1
";

    $result = $conn->query($query);
    if (!$result) {
        throw new Exception("Error en la consulta: " . $conn->error);
    }

    $data = [];
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }

    echo json_encode(['success' => true, 'data' => $data]);
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?>