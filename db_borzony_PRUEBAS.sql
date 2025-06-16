-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 16-06-2025 a las 18:42:08
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `db_borzony`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `alumnos`
--

CREATE TABLE `alumnos` (
  `ID_Matricula` int(11) NOT NULL,
  `Apellido_PAT` varchar(50) NOT NULL,
  `Apellido_MAT` varchar(50) NOT NULL,
  `Nombre` varchar(100) NOT NULL,
  `Fecha_Nac` date NOT NULL,
  `CURP` varchar(20) NOT NULL,
  `Ano` int(11) DEFAULT NULL,
  `Grupo` varchar(10) DEFAULT NULL,
  `Estatus` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `alumnos`
--

INSERT INTO `alumnos` (`ID_Matricula`, `Apellido_PAT`, `Apellido_MAT`, `Nombre`, `Fecha_Nac`, `CURP`, `Ano`, `Grupo`, `Estatus`) VALUES
(1, 'Mena', 'Laurian', 'Francisco Javier', '2025-04-01', 'MELF020303HMMNRRA0', NULL, NULL, 0),
(3, 'MENA', 'LAURIAN', 'FRANCISCO JAVIER', '2025-04-02', 'MELF020303HMMNRRA1', 2, 'A', 1),
(5, 'FERNANDEZ', 'MIRANDA', 'SASHA', '2022-02-22', 'GOLM100315MDFNPR08', 2, 'A', 1),
(6, 'SANCHEZ', 'ALFARO', 'LUISA', '2025-01-27', 'SANS544A4SHMNA1', NULL, NULL, 1),
(10, 'Paterno', 'Materno', 'Nombres', '2020-06-10', 'PAMA031245FMMNOR01', 2, 'A', 1),
(11, 'Lopez', 'Martinez', 'Sofia', '2020-02-10', 'LOMA100815MDFRNR09', NULL, NULL, 0),
(12, 'Yañez', 'Briones', 'Hector', '2021-02-02', 'YABH020221HMMNOR00', NULL, NULL, 0),
(13, 'APODACA', 'RODRIGUEZ', 'NETZYELE', '2021-01-20', 'SEUIVUSHURSO', 1, 'B', 1),
(14, 'HUANTE', 'JERONIMO', 'EDGAR', '2025-05-01', 'AWDDEAAEFASCV', 1, 'B', 1),
(15, 'SORIA', 'ALVAREZ', 'DIANA SARAHI', '2002-03-11', 'SORIA61511W1', 1, 'B', 1),
(16, 'PEÑA', 'MAGAÑA', 'RAMIRO', '2016-05-24', 'RAMA416A5WHMNR1', 2, 'A', 1),
(17, 'LIRA', 'ROMERO', 'NAOMI CAROLINA', '2025-05-23', 'ADWHSADAW12', 1, 'A', 0),
(18, 'LIRA', 'ROMERO', 'NAOMI CAROLINA', '2025-05-06', 'AWDNJDSV', 2, 'A', 1),
(19, 'SANCHEZ', 'DIAZ', 'DEREK', '2025-05-05', 'SADD26ADWG6', 2, 'A', 1),
(20, 'LINARES', 'TSUKASA', 'ERIK GIOVANI', '2013-05-08', 'DAWBHUWA', 2, 'A', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `colegiatura`
--

CREATE TABLE `colegiatura` (
  `ID_Colegiatura` int(11) NOT NULL,
  `FK_Matricula` int(11) NOT NULL,
  `Monto` decimal(10,2) NOT NULL,
  `Mes` varchar(20) NOT NULL,
  `Ano` varchar(10) NOT NULL,
  `Fecha_Colegiatura` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `colegiatura`
--

INSERT INTO `colegiatura` (`ID_Colegiatura`, `FK_Matricula`, `Monto`, `Mes`, `Ano`, `Fecha_Colegiatura`) VALUES
(3, 1, 40.00, 'enero', '2025', '2025-04-07'),
(4, 1, 44.00, 'marzo', '2025', '2025-04-07'),
(5, 10, 55.00, 'enero', '2025', '2025-04-07'),
(6, 10, 131.00, 'febrero', '2025', '2025-04-07'),
(7, 1, 100.00, 'abril', '2025', '2025-04-07'),
(10, 1, 100.00, 'febrero', '2025', '2025-04-11'),
(11, 3, 100.00, 'abril', '2025', '2025-04-22'),
(12, 11, 100.00, 'abril', '2025', '2025-04-22'),
(13, 6, 100.00, 'mayo', '2025', '2025-04-22'),
(14, 5, 50.00, 'febrero', '2025', '2025-04-22'),
(15, 3, 100.00, 'marzo', '2025', '2025-04-22'),
(16, 3, 100.00, 'Enero', '2025', '2025-04-29'),
(17, 13, 100.00, 'Mayo', '2025', '2025-04-30'),
(18, 11, 100.00, 'Mayo', '2025', '2025-05-02'),
(19, 3, 3000.00, 'Mayo', '2025', '2025-05-02'),
(20, 14, 100.00, 'Mayo', '2025', '2025-05-12'),
(21, 17, 1500.00, 'Mayo', '2025', '2025-05-24'),
(22, 18, 1500.00, 'Mayo', '2025', '2025-05-25'),
(23, 19, 100.00, 'Mayo', '2025', '2025-05-28'),
(24, 20, 2000.00, 'Mayo', '2025', '2025-05-28'),
(25, 3, 1500.00, 'Junio', '2025', '2025-06-02');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `contacto`
--

CREATE TABLE `contacto` (
  `ID_Contacto` int(11) NOT NULL,
  `FK_Matricula` int(11) NOT NULL,
  `Apellido_PAT` varchar(50) NOT NULL,
  `Apellido_MAT` varchar(50) NOT NULL,
  `Nombre` varchar(100) NOT NULL,
  `Correo` varchar(100) DEFAULT NULL,
  `Telefono` varchar(15) DEFAULT NULL,
  `Parentesco` enum('Padre','Madre','Tutor','Hermano','Otro') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `contacto`
--

INSERT INTO `contacto` (`ID_Contacto`, `FK_Matricula`, `Apellido_PAT`, `Apellido_MAT`, `Nombre`, `Correo`, `Telefono`, `Parentesco`) VALUES
(1, 1, 'Mena', 'Sanchez', 'Francisco', 'fcomenalaurian@gmail.com', '4523056161', 'Padre'),
(2, 3, 'MENA', 'SANCHEZ', 'FRANCISCO', 'fcomenalaurian@gmail.com', '4523056161', 'Otro'),
(3, 5, 'González ', 'Rodriguez', 'Hector', 'hector123@hotmail.com', '4525551121', 'Tutor'),
(4, 6, 'Alvares', 'Alfaro', 'Maria', 'maria@gmail.com', '4526549412', 'Madre'),
(5, 10, 'Paterno', 'Materno', 'Nombres', 'correo@gmail.com', '4528494112', 'Tutor'),
(6, 11, 'Martinez', 'Sanchez', 'Morgan', 'morgan.martinez@gmail.com', '4521975113', 'Madre'),
(7, 12, 'Yañez', 'Sanchez', 'Hector', 'hector@gmail.com', '4524597714', 'Padre'),
(8, 13, 'MENA', 'LAURIAN', 'FRANCISCO', 'fcomenalaurian@gmail.com', '45324234234', 'Madre'),
(9, 14, 'CORREA', 'JUAREZ', 'ARLETTE', 'gabriel@gmail.com', '45213123123', 'Tutor'),
(10, 15, 'MENA', 'LAURIAN', 'FRANCISCO', 'fcomenalaurian@gmail.com', '4523056161', 'Tutor'),
(11, 16, 'ROCHA', 'SALGADO', 'FERNANDO', 'firs@gmail.com', '4525541611', 'Madre'),
(12, 17, 'MENA', 'LAURIAN', 'FRANCISCO', 'fcomenalaurian@gmail.com', '4523056161', 'Tutor'),
(13, 18, 'MENA', 'LAURIAN', 'FRANCISCO', 'fcomenalaurian@gmail.com', '4523056161', 'Tutor'),
(14, 19, 'FIGUEROA', 'GARCIA', 'JOSE ARMANDO', 'elpepe@gmail.com', '4522119843', 'Padre'),
(15, 20, 'MENA', 'LAURIAN', 'FRANCISCO', 'fcomenalaurian@gmail.com', '4523056161', 'Tutor');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `facturacion`
--

CREATE TABLE `facturacion` (
  `ID_Facturacion` int(11) NOT NULL,
  `FK_Matricula` int(11) NOT NULL,
  `Monto_Inscripcion` decimal(10,2) NOT NULL,
  `Nombre_SAT` varchar(100) NOT NULL,
  `RFC` varchar(20) NOT NULL,
  `CFDI` varchar(50) DEFAULT NULL,
  `Correo` varchar(100) DEFAULT NULL,
  `Constancia` enum('Si','No') DEFAULT NULL,
  `Fecha_Factura` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `facturacion`
--

INSERT INTO `facturacion` (`ID_Facturacion`, `FK_Matricula`, `Monto_Inscripcion`, `Nombre_SAT`, `RFC`, `CFDI`, `Correo`, `Constancia`, `Fecha_Factura`) VALUES
(1, 1, 100.00, 'Pollo PRO', 'MELF020303', 'P01', 'fcomenalaurian@gmail.com', 'Si', NULL),
(2, 3, 100.00, 'Pollo NORMAL', 'MELF020302', 'P01', 'fcomenalaurian@gmail.com', 'No', NULL),
(3, 5, 100.00, 'Hector nose', 'GORH800115ABC', 'G01', 'hector123@hotmail.com', 'Si', NULL),
(4, 6, 100.00, 'Maria', 'MARR123', 'G03', 'maria@gmail.com', 'Si', NULL),
(5, 10, 200.00, 'Soy SAT', 'PAMA444', 'G01', 'correo@gmail.com', 'No', NULL),
(6, 11, 500.00, 'Carmen Teresa Martínez Sánchez', 'MASC8010105X8', 'P01', 'morgan.martinez@gmail.com', 'Si', NULL),
(7, 12, 100.00, 'Hector Yañez Sanchez', 'YASH142', 'Pago de Servicios Educativos', 'hector@gmail.com', 'Si', NULL),
(8, 13, 100.00, 'POLLO', 'RSIFLJFSE', 'Pago de Servicios Educativos', 'fcomenalaurian@gmail.com', 'Si', NULL),
(9, 14, 100.00, 'RedOverdrive', 'RSIFLJFSE', 'Pago de Servicios Educativos', 'gabriel@gmail.com', 'Si', NULL),
(10, 15, 10.00, 'MenaF', 'melf0203', 'Pago de Servicios Educativos', 'fcomenalaurian@gmail.com', 'Si', NULL),
(11, 16, 100.00, 'RochaChad', 'FIRS111', 'Pago de Servicios Educativos', 'rochapro@gmail.com', 'Si', NULL),
(12, 17, 1000.00, 'iawdm', 'aefu', 'Pago de Servicios Educativos', 'fcomenalaurian@gmail.com', 'Si', NULL),
(13, 18, 1500.00, 'afsona', 'fesjnads', 'Pago de Servicios Educativos', 'fcomenalaurian@gmail.com', 'No', NULL),
(14, 19, 1000.00, 'Viruzz', 'PEPE', 'Pago de Servicios Educativos', 'elpepe@gmail.com', 'No', NULL),
(15, 20, 1000.00, 'KFC', 'EL KFC', 'Pago de Servicios Educativos', 'fcomenalaurian@gmail.com', 'No', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `otros_pagos`
--

CREATE TABLE `otros_pagos` (
  `ID_Otros` int(11) NOT NULL,
  `FK_Matricula` int(11) NOT NULL,
  `Fecha` date NOT NULL,
  `Concepto` varchar(100) NOT NULL,
  `Monto` decimal(10,2) NOT NULL,
  `Estatus` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `otros_pagos`
--

INSERT INTO `otros_pagos` (`ID_Otros`, `FK_Matricula`, `Fecha`, `Concepto`, `Monto`, `Estatus`) VALUES
(1, 6, '2025-04-08', 'Materiales', 10.00, 1),
(2, 6, '2025-01-19', 'Materiales', 50.00, 1),
(3, 1, '2025-04-08', 'Materiales', 50.00, 1),
(4, 1, '2025-04-09', 'Materiales', 60.00, 1),
(7, 3, '2025-04-01', 'Materiales', 50.00, 0),
(8, 6, '2025-04-01', 'inscripcion', 100.00, 1),
(9, 13, '2025-04-30', 'Materiales', 200.00, 1),
(10, 13, '2025-04-30', 'Uniformes', 300.00, 1),
(12, 13, '2025-05-01', 'Materiales', 200.00, 1),
(13, 13, '2025-05-01', 'Donativo', 1.00, 1),
(14, 3, '2025-05-02', 'Materiales', 70000.00, 0),
(15, 14, '2025-05-12', 'Materiales', 100.00, 0),
(16, 14, '2025-05-12', 'Uniformes', 500.00, 1),
(17, 14, '2025-05-13', 'Materiales', 100.00, 0),
(18, 14, '2025-05-13', 'Comida', 30.00, 1),
(19, 3, '2025-05-21', 'Materiales', 99.99, 0),
(20, 3, '2025-05-21', 'Materiales', 9.00, 0),
(21, 16, '2025-05-21', 'Inscripcion', 100.00, 1),
(22, 17, '2025-05-24', 'Inscripcion', 1000.00, 1),
(23, 18, '2025-05-24', 'Inscripcion', 1500.00, 1),
(24, 19, '2025-05-27', 'Inscripcion', 1000.00, 1),
(25, 19, '2025-06-03', 'Materiales', 200.00, 1),
(26, 6, '2025-05-27', 'Donativo', 300.00, 1),
(27, 20, '2025-05-27', 'Inscripcion', 1000.00, 1),
(28, 3, '2025-06-02', 'Uniformes', 500.00, 1),
(29, 3, '2025-06-09', 'Materiales', 500.00, 0),
(30, 3, '2025-06-09', 'Materiales', 500.00, 0),
(31, 3, '2025-06-09', 'Materiales', 500.00, 0),
(32, 3, '2025-06-09', 'Materiales', 500.00, 0),
(33, 14, '2025-06-11', 'Materiales', 100.00, 0),
(34, 14, '2025-06-11', 'Materiales', 100.00, 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `ID_Users` int(11) NOT NULL,
  `Usuario` varchar(50) NOT NULL,
  `Contrasena` varchar(255) NOT NULL,
  `Rol` enum('Directora','Administrador','Maestro','Auxiliar','Ingeniero') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`ID_Users`, `Usuario`, `Contrasena`, `Rol`) VALUES
(10, 'MenaF', '$2y$10$QoLXMBmCD9RQf.TC/zObMefZhJV6WY.Fb3DzTCMPZ5x1hMfaWSiTm', 'Ingeniero'),
(11, 'Adriana', '$2y$10$7mGgvg0/BWfB/9CZ3RH.VOZ6CfLUy3ybFRMH8Z0ujSSRnitbym4SK', 'Directora'),
(17, 'Gabriela', '$2y$10$GqhBSAp3Fy6T0Hfc3/O2eOwynViqwMrIrNZ2y9xtPgib6kOXk/cnC', 'Administrador'),
(22, 'miss edith', '$2y$10$sJQ6yEk8THQGs3AxPEZ7AerwwwLLpqEG5FhBRp96kBtYp5ZvD857u', 'Maestro'),
(28, 'Edith', '$2y$10$6u7RZLOvaE2..cg9Itp..OQqe3wax7pV77hLfnjn/065D8Ets6QG2', 'Administrador'),
(31, 'PRUEBA', '$2y$10$intI6ZcPWANzDc.z9q/z4.0HNhEAEtC8irTZJmNMw90cax1A5Vqmu', 'Maestro'),
(33, 'Actualizacion', '$2y$10$ifDklCJF13UqI.wp5p/pae8CsDztyyGOVp.XH29YZyhnCreiYIR.O', 'Auxiliar');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `alumnos`
--
ALTER TABLE `alumnos`
  ADD PRIMARY KEY (`ID_Matricula`),
  ADD UNIQUE KEY `CURP` (`CURP`);

--
-- Indices de la tabla `colegiatura`
--
ALTER TABLE `colegiatura`
  ADD PRIMARY KEY (`ID_Colegiatura`),
  ADD KEY `FK_Matricula` (`FK_Matricula`);

--
-- Indices de la tabla `contacto`
--
ALTER TABLE `contacto`
  ADD PRIMARY KEY (`ID_Contacto`),
  ADD KEY `FK_Matricula` (`FK_Matricula`);

--
-- Indices de la tabla `facturacion`
--
ALTER TABLE `facturacion`
  ADD PRIMARY KEY (`ID_Facturacion`),
  ADD KEY `FK_Matricula` (`FK_Matricula`);

--
-- Indices de la tabla `otros_pagos`
--
ALTER TABLE `otros_pagos`
  ADD PRIMARY KEY (`ID_Otros`),
  ADD KEY `FK_Matricula` (`FK_Matricula`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`ID_Users`),
  ADD UNIQUE KEY `Usuario` (`Usuario`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `alumnos`
--
ALTER TABLE `alumnos`
  MODIFY `ID_Matricula` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT de la tabla `colegiatura`
--
ALTER TABLE `colegiatura`
  MODIFY `ID_Colegiatura` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT de la tabla `contacto`
--
ALTER TABLE `contacto`
  MODIFY `ID_Contacto` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT de la tabla `facturacion`
--
ALTER TABLE `facturacion`
  MODIFY `ID_Facturacion` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT de la tabla `otros_pagos`
--
ALTER TABLE `otros_pagos`
  MODIFY `ID_Otros` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `ID_Users` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `colegiatura`
--
ALTER TABLE `colegiatura`
  ADD CONSTRAINT `colegiatura_ibfk_1` FOREIGN KEY (`FK_Matricula`) REFERENCES `alumnos` (`ID_Matricula`) ON DELETE CASCADE;

--
-- Filtros para la tabla `contacto`
--
ALTER TABLE `contacto`
  ADD CONSTRAINT `contacto_ibfk_1` FOREIGN KEY (`FK_Matricula`) REFERENCES `alumnos` (`ID_Matricula`) ON DELETE CASCADE;

--
-- Filtros para la tabla `facturacion`
--
ALTER TABLE `facturacion`
  ADD CONSTRAINT `facturacion_ibfk_1` FOREIGN KEY (`FK_Matricula`) REFERENCES `alumnos` (`ID_Matricula`) ON DELETE CASCADE;

--
-- Filtros para la tabla `otros_pagos`
--
ALTER TABLE `otros_pagos`
  ADD CONSTRAINT `otros_pagos_ibfk_1` FOREIGN KEY (`FK_Matricula`) REFERENCES `alumnos` (`ID_Matricula`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
