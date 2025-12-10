import { pool } from "../config/connection.js";

export const ProveedorModel = {

  // Obtener todos los proveedores
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

  // Crear proveedor
  async crear(data) {
    const {
      proveedor,
      ruc,
      sector,
      estado = true,
      fecha_registro,
      ultima_orden,
      total_facturado,
      representante,
      telefono,
      email,
      direccion
    } = data;

    const query = `
      INSERT INTO proveedores
      (proveedor, ruc, sector, estado, fecha_registro, ultima_orden, total_facturado, representante, telefono, email, direccion)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
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
      representante,
      telefono,
      email,
      direccion
    ];

    const { rows } = await pool.query(query, values);
    return rows[0];
  },

  // Actualizar proveedor
  async actualizar(id, data) {
    const {
      proveedor,
      ruc,
      sector,
      estado,
      fecha_registro,
      ultima_orden,
      total_facturado,
      representante,
      telefono,
      email,
      direccion
    } = data;

    const query = `
      UPDATE proveedores
      SET proveedor=$1, ruc=$2, sector=$3, estado=$4, fecha_registro=$5,
          ultima_orden=$6, total_facturado=$7, representante=$8, telefono=$9,
          email=$10, direccion=$11
      WHERE id=$12
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
      representante,
      telefono,
      email,
      direccion,
      id
    ];

    const { rows } = await pool.query(query, values);
    return rows[0];
  },

  // Eliminar proveedor
  async eliminar(id) {
    const query = "DELETE FROM proveedores WHERE id = $1 RETURNING id";
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  }
};
