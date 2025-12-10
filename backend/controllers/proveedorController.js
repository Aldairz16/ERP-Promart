import { ProveedorModel } from "../models/proveedorModel.js";

export const ProveedorController = {
  async listar(req, res) {
    try {
      const proveedores = await ProveedorModel.obtenerTodos();
      res.json(proveedores);
    } catch (err) {
      console.error("❌ Error al listar proveedores:", err);
      res.status(500).json({ error: "Error al listar proveedores" });
    }
  },

  async crear(req, res) {
    try {
      const nuevoProveedor = await ProveedorModel.crear(req.body);
      res.json(nuevoProveedor);
    } catch (err) {
      console.error("❌ Error al crear proveedor:", err);
      res.status(500).json({ error: "Error al crear proveedor" });
    }
  },

  async actualizar(req, res) {
    try {
      const { id } = req.params;
      const proveedor = await ProveedorModel.actualizar(id, req.body);
      res.json(proveedor);
    } catch (err) {
      res.status(500).json({ error: "Error al actualizar proveedor" });
    }
  },

  async eliminar(req, res) {
    try {
      const { id } = req.params;
      await ProveedorModel.eliminar(id);
      res.json({ message: "Proveedor eliminado correctamente" });
    } catch (err) {
      res.status(500).json({ error: "Error al eliminar proveedor" });
    }
  },

  async ver(req, res) {
    try {
      const { id } = req.params;
      const proveedor = await ProveedorModel.obtenerPorId(id);
      res.json(proveedor);
    } catch (err) {
      res.status(500).json({ error: "Error al obtener proveedor" });
    }
  },
};
