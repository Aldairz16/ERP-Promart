import express from "express";
// 🛑 Aquí debes importar el objeto ProveedorController con las funciones en español
import { ProveedorController } from "../controllers/proveedorController.js"; 

const router = express.Router();

// Rutas CRUD para Proveedores usando el controlador en español
router.get("/", ProveedorController.listar);
router.get("/:id", ProveedorController.ver);
router.post("/", ProveedorController.crear);
router.put("/:id", ProveedorController.actualizar);
router.delete("/:id", ProveedorController.eliminar);

export default router;