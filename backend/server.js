// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import proveedorRoutes from "./routes/proveedorRoutes.js";
import orderRoutes from "./routes/orderRoutes.js"; // <--- NUEVO
import { pool } from "./config/connection.js";
import reportRoutes from "./routes/reportRoutes.js"; // <-- NUEVO

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// RUTAS
app.use("/api/proveedores", proveedorRoutes);
app.use("/api/orders", orderRoutes); // <--- NUEVO
app.use("/api/reports", reportRoutes); // <-- NUEVO ENDPOINT PARA REPORTES

// Verificar conexión a PostgreSQL
pool.connect()
  .then(() => console.log("✅ Conectado a PostgreSQL"))
  .catch((err) => console.error("❌ Error al conectar a PostgreSQL", err));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Servidor backend en puerto ${PORT}`));
