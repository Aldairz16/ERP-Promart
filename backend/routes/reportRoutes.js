// backend/routes/reportRoutes.js
import express from 'express';
import { getTotalFacturadoMensual } from '../controllers/reportController.js';

const router = express.Router();

// Definición de la ruta para el reporte
router.get('/facturacion-mensual', getTotalFacturadoMensual);

export default router;