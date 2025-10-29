import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import proveedorRoutes from "./routes/proveedorRoutes.js";
import { pool } from "./config/connection.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// RUTA PRINCIPAL
app.use("/api/proveedores", proveedorRoutes);

// Verificar conexión a PostgreSQL
pool.connect()
  .then(() => console.log("✅ Conectado a PostgreSQL"))
  .catch((err) => console.error("❌ Error al conectar a PostgreSQL", err));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Servidor backend en puerto ${PORT}`));
