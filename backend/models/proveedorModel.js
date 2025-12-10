import { pool } from "../config/connection.js";

export const ProveedorModel = {
  // Función llamada por ProveedorController.listar()
  async obtenerTodos() {
    const query = `
      SELECT 
        id, proveedor, ruc, sector, estado, fecha_registro,
        ultima_orden, total_facturado, representante,
        telefono, email, direccion
      FROM proveedores
      ORDER BY id ASC
    `;
    const { rows } = await pool.query(query);
    return rows;
  },

  // Obtener proveedor por ID
  async obtenerPorId(id) {
    const query = "SELECT * FROM proveedores WHERE id = $1";
    const { rows } = await pool.query(query, [id]);
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
