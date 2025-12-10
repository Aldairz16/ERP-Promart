<<<<<<< HEAD
// server.js
=======
>>>>>>> 87921f61849e3e0eb14846645dbdd687c465f7c5
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import proveedorRoutes from "./routes/proveedorRoutes.js";
<<<<<<< HEAD
import orderRoutes from "./routes/orderRoutes.js"; // <--- NUEVO
=======
>>>>>>> 87921f61849e3e0eb14846645dbdd687c465f7c5
import { pool } from "./config/connection.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

<<<<<<< HEAD
// RUTAS
app.use("/api/proveedores", proveedorRoutes);
app.use("/api/orders", orderRoutes); // <--- NUEVO
=======
// RUTA PRINCIPAL
app.use("/api/proveedores", proveedorRoutes);
>>>>>>> 87921f61849e3e0eb14846645dbdd687c465f7c5

// Verificar conexión a PostgreSQL
pool.connect()
  .then(() => console.log("✅ Conectado a PostgreSQL"))
  .catch((err) => console.error("❌ Error al conectar a PostgreSQL", err));

const PORT = process.env.PORT || 4000;
<<<<<<< HEAD
app.listen(PORT, () => console.log(`🚀 Servidor backend en puerto ${PORT}`));
=======
app.listen(PORT, () => console.log(`🚀 Servidor backend en puerto ${PORT}`));
>>>>>>> 87921f61849e3e0eb14846645dbdd687c465f7c5
