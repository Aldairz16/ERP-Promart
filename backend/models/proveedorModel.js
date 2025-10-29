import { pool } from "../config/connection.js";

export const ProveedorModel = {
  async obtenerTodos() {
    const result = await pool.query("SELECT * FROM proveedores ORDER BY id ASC");
    return result.rows;
  },

  async obtenerPorId(id) {
    const result = await pool.query("SELECT * FROM proveedores WHERE id = $1", [id]);
    return result.rows[0];
  },

  async crear(data) {
    const {
      proveedor,
      ruc,
      sector,
      estado,
      fecha_registro,
      ultima_orden,
      total_facturado
    } = data;

    const query = `
      INSERT INTO proveedores (proveedor, ruc, sector, estado, fecha_registro, ultima_orden, total_facturado)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `;

    const values = [
      proveedor,
      ruc,
      sector,
      estado,
      fecha_registro,
      ultima_orden,
      total_facturado
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  },

  async actualizar(id, data) {
    const {
      proveedor,
      ruc,
      sector,
      estado,
      fecha_registro,
      ultima_orden,
      total_facturado
    } = data;

    const query = `
      UPDATE proveedores
      SET proveedor=$1, ruc=$2, sector=$3, estado=$4, fecha_registro=$5, ultima_orden=$6, total_facturado=$7
      WHERE id=$8
      RETURNING *;
    `;

    const values = [
      proveedor,
      ruc,
      sector,
      estado,
      fecha_registro,
      ultima_orden,
      total_facturado,
      id
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  },

  async eliminar(id) {
    await pool.query("DELETE FROM proveedores WHERE id = $1", [id]);
  }
};
