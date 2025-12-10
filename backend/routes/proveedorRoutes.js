import express from "express";
<<<<<<< HEAD
// 🛑 Aquí debes importar el objeto ProveedorController con las funciones en español
import { ProveedorController } from "../controllers/proveedorController.js"; 

const router = express.Router();

// Rutas CRUD para Proveedores usando el controlador en español
=======
import { ProveedorController } from "../controllers/proveedorController.js";

const router = express.Router();

>>>>>>> 87921f61849e3e0eb14846645dbdd687c465f7c5
router.get("/", ProveedorController.listar);
router.get("/:id", ProveedorController.ver);
router.post("/", ProveedorController.crear);
router.put("/:id", ProveedorController.actualizar);
router.delete("/:id", ProveedorController.eliminar);

export default router;