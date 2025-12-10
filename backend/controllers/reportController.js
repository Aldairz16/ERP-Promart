// backend/controllers/reportController.js
import { ReporteModel } from '../models/reportModel.js';

/**
 * Controlador para obtener el total de facturación mensual.
 * Ruta: GET /api/reports/facturacion-mensual
 */
export const getTotalFacturadoMensual = async (req, res) => {
    try {
        const reportData = await ReporteModel.obtenerTotalFacturadoMensual();
        
        // El frontend espera un objeto JSON.
        res.status(200).json(reportData);
        
    } catch (error) {
        console.error("❌ Error en reporte de facturación mensual:", error);
        res.status(500).json({ 
            message: "Error al generar el reporte", 
            error: error.message 
        });
    }
};

// Puedes añadir otros controladores aquí (ej. getTotalPorProveedor, etc.)