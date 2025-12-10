import { pool } from "../config/connection.js";

export const ProveedorModel = {
<<<<<<< HEAD
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
=======
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
      total_facturado, 
      representante, 
      telefono, 
      email, 
      direccion 
    } = data;

    const query = `
      INSERT INTO proveedores
    (proveedor, ruc, sector, estado, fecha_registro, ultima_orden, total_facturado, representante, telefono, email, direccion)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
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

    const result = await pool.query(query, values);
    return result.rows[0];
  },

  async eliminar(id) {
    await pool.query("DELETE FROM proveedores WHERE id = $1", [id]);
  }
};
>>>>>>> 87921f61849e3e0eb14846645dbdd687c465f7c5
