// backend/models/reportModel.js
import { pool } from "../config/connection.js";

export const ReporteModel = {

    /**
     * @description Obtiene el total facturado (TOTAL) agrupado por mes de todas las órdenes de compra.
     * @returns {Array} [{ mes: 'YYYY-MM', total_compras: '1234.56' }]
     */
    async obtenerTotalFacturadoMensual() {
        const query = `
            SELECT 
                TO_CHAR(fecha_emision, 'YYYY-MM') AS mes,
                SUM(total) AS total_compras
            FROM ordenes_compra
            -- Filtramos estados finales si es necesario, ej: WHERE estado = 'Aprobada'
            GROUP BY 1
            ORDER BY mes ASC;
        `;
        const { rows } = await pool.query(query);
        return rows;
    }
    
    // Aquí puedes añadir más funciones de reportes (ej. por proveedor, por estado, etc.)
};