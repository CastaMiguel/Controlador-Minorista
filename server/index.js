import cors from "cors";
import express from "express";
import { pool, initializeDatabase } from "./db.js";

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (_request, response) =>
  response.json({
    service: "Plaza Minorista API",
    status: "running",
    frontend: "http://localhost:5173",
    endpoints: ["GET /api/health", "GET /api/puestos"],
  }),
);

app.get("/api/health", (_request, response) =>
  response.json({ ok: true, service: "plaza-minorista-api" }),
);

app.get("/api/puestos", async (request, response) => {
  try {
    const { sector, estado, search } = request.query;
    const conditions = [];
    const values = [];
    if (sector && sector !== "Todos") {
      conditions.push("sector = ?");
      values.push(sector);
    }
    if (estado) {
      conditions.push("estado = ?");
      values.push(estado);
    }
    if (search) {
      conditions.push("(numero LIKE ? OR arrendatario LIKE ?)");
      values.push(`%${search}%`, `%${search}%`);
    }
    const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
    const [rows] = await pool.query(
      `SELECT * FROM puestos ${where} ORDER BY numero`,
      values,
    );
    response.json(rows);
  } catch (error) {
    response
      .status(500)
      .json({
        message: "No se pudieron consultar los puestos",
        error: error.message,
      });
  }
});

app.post("/api/puestos", async (request, response) => {
  try {
    const {
      numero,
      sector,
      arrendatario,
      contacto,
      estado = "Ocupado",
    } = request.body;
    const finalEstado = arrendatario?.trim() ? "Ocupado" : "Libre";
    const [result] = await pool.query(
      "INSERT INTO puestos (numero, sector, arrendatario, contacto, estado) VALUES (?, ?, ?, ?, ?)",
      [
        numero,
        sector,
        arrendatario?.trim() || "Disponible",
        contacto || null,
        finalEstado,
      ],
    );
    const [rows] = await pool.query("SELECT * FROM puestos WHERE id = ?", [
      result.insertId,
    ]);
    response.status(201).json(rows[0]);
  } catch (error) {
    response
      .status(400)
      .json({ message: "No se pudo crear el puesto", error: error.message });
  }
});

app.put("/api/puestos/:id", async (request, response) => {
  try {
    const { numero, sector, arrendatario, contacto, estado } = request.body;
    const finalEstado = arrendatario?.trim() ? "Ocupado" : "Libre";
    await pool.query(
      "UPDATE puestos SET numero = ?, sector = ?, arrendatario = ?, contacto = ?, estado = ? WHERE id = ?",
      [
        numero,
        sector,
        arrendatario?.trim() || "Disponible",
        contacto || null,
        finalEstado,
        request.params.id,
      ],
    );
    const [rows] = await pool.query("SELECT * FROM puestos WHERE id = ?", [
      request.params.id,
    ]);
    if (!rows[0])
      return response.status(404).json({ message: "Puesto no encontrado" });
    response.json(rows[0]);
  } catch (error) {
    response
      .status(400)
      .json({
        message: "No se pudo actualizar el puesto",
        error: error.message,
      });
  }
});

app.delete("/api/puestos/:id", async (request, response) => {
  try {
    await pool.query("DELETE FROM puestos WHERE id = ?", [request.params.id]);
    response.status(204).end();
  } catch (error) {
    response
      .status(400)
      .json({ message: "No se pudo eliminar el puesto", error: error.message });
  }
});

initializeDatabase()
  .then(() =>
    app.listen(port, () =>
      console.log(
        `API de Plaza Minorista escuchando en http://localhost:${port}`,
      ),
    ),
  )
  .catch((error) => {
    console.error("No fue posible inicializar MySQL:", error.message);
    process.exit(1);
  });
