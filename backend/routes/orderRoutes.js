// backend/routes/orderRoutes.js
import express from 'express';
import { 
    getAllOrders, 
    getOrderById, 
    createOrder, 
    getOrdersKPIs,
    getOrderChartsData,
    updateOrderStatus, // <-- Para Anular
    deleteOrderById,  // <-- Para Eliminar
    getPDFMock ,    // <-- Para Descargar PDF
    updateOrder
} from '../controllers/orderController.js';

const router = express.Router();

// Rutas de Dashboard y Lectura
router.get('/kpis', getOrdersKPIs);
router.get('/charts', getOrderChartsData);
router.get('/', getAllOrders);
router.get('/:id', getOrderById);

// Rutas de Acciones (CRUD)
router.post('/', createOrder);
router.put('/:id/status', updateOrderStatus); // Anular, Aprobar, Recibir
router.delete('/:id', deleteOrderById); // Eliminar permanente
router.get('/:id/pdf', getPDFMock); // Simulación de descarga
router.put('/:id', updateOrder);

export default router;