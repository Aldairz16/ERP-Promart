import express from "express";
import { ProveedorController } from "../controllers/proveedorController.js";

const router = express.Router();

router.get("/", ProveedorController.listar);
router.get("/:id", ProveedorController.ver);
router.post("/", ProveedorController.crear);
router.put("/:id", ProveedorController.actualizar);
router.delete("/:id", ProveedorController.eliminar);

export default router;