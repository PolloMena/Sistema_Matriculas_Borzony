-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 16-06-2025 a las 19:01:12
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
(1, 'MenaF', '$2y$10$QoLXMBmCD9RQf.TC/zObMefZhJV6WY.Fb3DzTCMPZ5x1hMfaWSiTm', 'Ingeniero'),
(2, 'Adriana', '$2y$10$7mGgvg0/BWfB/9CZ3RH.VOZ6CfLUy3ybFRMH8Z0ujSSRnitbym4SK', 'Directora'),
(3, 'Gabriela', '$2y$10$GqhBSAp3Fy6T0Hfc3/O2eOwynViqwMrIrNZ2y9xtPgib6kOXk/cnC', 'Administrador'),
(4, 'Edith', '$2y$10$6u7RZLOvaE2..cg9Itp..OQqe3wax7pV77hLfnjn/065D8Ets6QG2', 'Administrador');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `alumnos`
--
ALTER TABLE `alumnos`
  ADD PRIMARY KEY (`ID_Matricula`);

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
  MODIFY `ID_Matricula` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `colegiatura`
--
ALTER TABLE `colegiatura`
  MODIFY `ID_Colegiatura` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `contacto`
--
ALTER TABLE `contacto`
  MODIFY `ID_Contacto` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `facturacion`
--
ALTER TABLE `facturacion`
  MODIFY `ID_Facturacion` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `otros_pagos`
--
ALTER TABLE `otros_pagos`
  MODIFY `ID_Otros` int(11) NOT NULL AUTO_INCREMENT;

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
