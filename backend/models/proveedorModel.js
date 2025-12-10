import { pool } from "../config/connection.js";

export const ProveedorModel = {
  // Función llamada por ProveedorController.listar()
  async obtenerTodos() {
    // 🛑 Columna crítica: Asegúrate de incluir TODAS las columnas usadas en el frontend
    const query = `
      SELECT 
        id, proveedor, ruc, sector, estado, 
        fecha_registro, telefono, email, direccion 
      FROM proveedores 
      ORDER BY id ASC
    `;
    const { rows } = await pool.query(query);
    return rows;
  },

  // Función llamada por ProveedorController.crear()
  async crear({ ruc, proveedor, direccion, telefono, email, sector, estado = true }) {
    const query = `
      INSERT INTO proveedores (ruc, proveedor, direccion, telefono, email, sector, estado)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `;
    const values = [ruc, proveedor, direccion, telefono, email, sector, estado];
    const { rows } = await pool.query(query, values);
    return rows[0];
  },

  // ... Implementa actualizar, eliminar, obtenerPorId con los nombres correctos
  
  async actualizar(id, data) {
      // Implementación de UPDATE con los campos que necesites...
      const query = `
          UPDATE proveedores SET 
              proveedor = $1, ruc = $2, direccion = $3, telefono = $4, email = $5, 
              sector = $6, estado = $7
          WHERE id = $8
          RETURNING *;
      `;
      const values = [data.proveedor, data.ruc, data.direccion, data.telefono, data.email, data.sector, data.estado, id];
      const { rows } = await pool.query(query, values);
      return rows[0];
  },
  
  async eliminar(id) {
      const query = "DELETE FROM proveedores WHERE id = $1 RETURNING id";
      const { rows } = await pool.query(query, [id]);
      return rows[0];
  },
  
  async obtenerPorId(id) {
      const query = "SELECT * FROM proveedores WHERE id = $1";
      const { rows } = await pool.query(query, [id]);
      return rows[0];
  }
};