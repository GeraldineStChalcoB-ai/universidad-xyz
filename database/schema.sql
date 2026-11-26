--Base de datos del microservicio de los Estudiantes
CREATE DATABASE IF NOT EXISTS estudiantes_db;
USE estudiantes_db;

CREATE TABLE IF NOT EXISTS estudiantes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  codigo VARCHAR(20) NOT NULL UNIQUE,
  nombres VARCHAR(100) NOT NULL,
  apellidos VARCHAR(100) NOT NULL,
  correo VARCHAR(100) NOT NULL UNIQUE,
  carrera VARCHAR(100) NOT NULL
);

--Base de datos del microservicio de los Cursos
CREATE DATABASE IF NOT EXISTS cursos_db;
USE cursos_db;

CREATE TABLE IF NOT EXISTS cursos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  codigo VARCHAR(20) NOT NULL UNIQUE,
  nombre VARCHAR(100) NOT NULL,
  creditos INT NOT NULL,
  docente VARCHAR(100) NOT NULL
);
