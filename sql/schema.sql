CREATE DATABASE IF NOT EXISTS plaza_minorista CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE plaza_minorista;

CREATE TABLE IF NOT EXISTS puestos (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  numero VARCHAR(20) NOT NULL UNIQUE,
  sector ENUM('Zapatos', 'Electronicos', 'Frutas y verduras', 'Restaurante', 'Tienda', 'Ropa', 'Varios') NOT NULL,
  arrendatario VARCHAR(120) NOT NULL DEFAULT 'Disponible',
  contacto VARCHAR(30) NULL,
  estado ENUM('Ocupado', 'Libre') NOT NULL DEFAULT 'Libre',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

INSERT IGNORE INTO puestos (numero, sector, arrendatario, contacto, estado) VALUES
('Z-001', 'Zapatos', 'Calzado Medellín', '300 456 7890', 'Ocupado'),
('Z-002', 'Zapatos', 'Pasos Urbanos', '310 445 2198', 'Ocupado'),
('E-010', 'Electronicos', 'Tecno Plaza', '315 982 0031', 'Ocupado'),
('E-011', 'Electronicos', 'Disponible', NULL, 'Libre'),
('FV-021', 'Frutas y verduras', 'Frutas La 30', '300 225 7812', 'Ocupado'),
('FV-022', 'Frutas y verduras', 'Disponible', NULL, 'Libre'),
('R-030', 'Restaurante', 'Sazón del Paisa', '301 344 5566', 'Ocupado'),
('R-031', 'Restaurante', 'Disponible', NULL, 'Libre'),
('T-040', 'Tienda', 'El Abarrotero', '300 775 4102', 'Ocupado'),
('T-041', 'Tienda', 'Disponible', NULL, 'Libre'),
('RO-050', 'Ropa', 'Moda Villa', '314 668 2015', 'Ocupado'),
('RO-051', 'Ropa', 'Disponible', NULL, 'Libre'),
('V-060', 'Varios', 'Artesanías del Valle', '316 441 9088', 'Ocupado'),
('V-061', 'Varios', 'Disponible', NULL, 'Libre');