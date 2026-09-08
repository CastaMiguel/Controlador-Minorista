import mysql from "mysql2/promise";

const config = {
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "plaza_minorista",
};

const adminConnection = await mysql.createConnection({
  host: config.host,
  port: config.port,
  user: config.user,
  password: config.password,
});
await adminConnection.query(
  `CREATE DATABASE IF NOT EXISTS \`${config.database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
);
await adminConnection.end();

export const pool = mysql.createPool({
  ...config,
  waitForConnections: true,
  connectionLimit: 10,
});

export async function initializeDatabase() {
  await pool.query(`CREATE TABLE IF NOT EXISTS puestos (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    numero VARCHAR(20) NOT NULL UNIQUE,
    sector ENUM('Zapatos', 'Electronicos', 'Frutas y verduras', 'Restaurante', 'Tienda', 'Ropa', 'Varios') NOT NULL,
    arrendatario VARCHAR(120) NOT NULL DEFAULT 'Disponible',
    contacto VARCHAR(30) NULL,
    estado ENUM('Ocupado', 'Libre') NOT NULL DEFAULT 'Libre',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  ) ENGINE=InnoDB`);
  await pool.query(
    "ALTER TABLE puestos MODIFY sector ENUM('Frutas', 'Carnes', 'Verduras', 'Zapatos', 'Electronicos', 'Frutas y verduras', 'Restaurante', 'Tienda', 'Ropa', 'Varios') NOT NULL",
  );
  await pool.query(
    "UPDATE puestos SET sector = 'Frutas y verduras' WHERE sector IN ('Frutas', 'Verduras')",
  );
  await pool.query(
    "UPDATE puestos SET sector = 'Restaurante' WHERE sector = 'Carnes'",
  );
  await pool.query(
    "ALTER TABLE puestos MODIFY sector ENUM('Zapatos', 'Electronicos', 'Frutas y verduras', 'Restaurante', 'Tienda', 'Ropa', 'Varios') NOT NULL",
  );
  const [[{ total }]] = await pool.query("SELECT COUNT(*) AS total FROM puestos");
  const [[{ legacyDemo }]] = await pool.query("SELECT COUNT(*) AS legacyDemo FROM puestos WHERE numero IN ('F-021', 'R-008', 'FV-114', 'M-032', 'F-022', 'FV-115', 'R-009')");
  if (total === 0 || (total <= 7 && legacyDemo > 0)) {
    if (legacyDemo > 0) await pool.query("DELETE FROM puestos WHERE numero IN ('F-021', 'R-008', 'FV-114', 'M-032', 'F-022', 'FV-115', 'R-009')");
    await pool.query(`INSERT INTO puestos (numero, sector, arrendatario, contacto, estado) VALUES
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
      ('V-061', 'Varios', 'Disponible', NULL, 'Libre')`);
  }
}
