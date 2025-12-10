// backend/controllers/orderController.js
import { pool } from '../config/connection.js';

// --- FUNCIONES AUXILIARES ---

// Función para generar ID (OC-YYYY-NNNN)
const generateOrderId = async (client) => {
    const year = new Date().getFullYear();
    const prefix = `OC-${year}-`;
    
    const lastOrderQuery = `
        SELECT id FROM ordenes_compra WHERE id LIKE $1 ORDER BY id DESC LIMIT 1;
    `;
    const lastOrderResult = await client.query(lastOrderQuery, [`${prefix}%`]);

    let nextNumber = 1;
    if (lastOrderResult.rows.length > 0) {
        const lastId = lastOrderResult.rows[0].id;
        const lastNumber = parseInt(lastId.split('-')[2]);
        nextNumber = lastNumber + 1;
    }
    
    const formattedNumber = nextNumber.toString().padStart(4, '0');
    return `${prefix}${formattedNumber}`;
};

// Datos simulados para tendencias (ya que la DB solo tiene datos brutos)
const SIMULATED_TRENDS = {
    'Total de OCs': { direction: 'down', percentage: 8.5 },
    'En aprobación': { direction: 'down', percentage: 15.2 },
    'Aprobadas': { direction: 'up', percentage: 12.8 },
    'Pendientes de recepción': { direction: 'neutral', percentage: 0 },
    '% entregas a tiempo': { direction: 'up', percentage: 2.1 },
    'Tiempo promedio aprobación': { direction: 'down', percentage: 8.5 },
    'Gasto del mes (con IGV)': { direction: 'down', percentage: 15.2 }
};


// **********************************************
// 1. OBTENER KPIS (GET /api/orders/kpis)
// **********************************************
export const getOrdersKPIs = async (req, res) => {
    const client = await pool.connect();
    
    try {
        const today = new Date();
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const startOfPreviousMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        
        // 1. Calcular Totales y Gasto del mes actual
        const totalsQuery = `
            SELECT
                COUNT(*) AS "totalOrders",
                SUM(CASE WHEN estado = 'En aprobación' THEN 1 ELSE 0 END) AS "pendingApproval",
                SUM(CASE WHEN estado = 'Aprobada' THEN 1 ELSE 0 END) AS "approved",
                SUM(CASE WHEN estado IN ('Enviada', 'Recibida parcial') THEN 1 ELSE 0 END) AS "pendingReceipt",
                SUM(CASE WHEN estado NOT IN ('Anulada', 'Cerrada') AND fecha_emision >= $1 THEN total ELSE 0 END) AS "monthlySpending"
            FROM
                ordenes_compra
            WHERE
                fecha_emision >= $1;
        `;
        const totalsResult = await client.query(totalsQuery, [startOfMonth]);
        const totals = totalsResult.rows[0];

        // 2. Calcular Tiempo Promedio de Aprobación
        const avgTimeQuery = `
            WITH OrderCreated AS (
                SELECT orden_id, fecha FROM orden_compra_aprobacion 
                WHERE accion = 'Creada'
            ),
            OrderApproved AS (
                SELECT orden_id, fecha FROM orden_compra_aprobacion 
                WHERE accion = 'Aprobada'
            )
            SELECT
                AVG(EXTRACT(EPOCH FROM (a.fecha - c.fecha))) / 86400 AS "avgDays"
            FROM
                OrderApproved a
            JOIN
                OrderCreated c ON a.orden_id = c.orden_id;
        `;
        const avgTimeResult = await client.query(avgTimeQuery);
        const avgTime = avgTimeResult.rows[0].avgDays || 2.4;

        // 3. Calcular % Entregas a Tiempo (Simulación simple)
        const onTimeQuery = `
            SELECT
                COUNT(*) AS total_orders,
                SUM(CASE WHEN estado IN ('Recibida total', 'Recibida parcial') AND fecha_entrega_est >= CURRENT_DATE THEN 1 ELSE 0 END) AS on_time_orders
            FROM
                ordenes_compra
            WHERE
                fecha_emision >= $1;
        `;
        const onTimeResult = await client.query(onTimeQuery, [startOfPreviousMonth]); 
        
        const totalOrdersForOntime = parseInt(onTimeResult.rows[0].total_orders) || 0;
        const onTimeOrders = parseInt(onTimeResult.rows[0].on_time_orders) || 0;
        
        const onTimePercentage = totalOrdersForOntime > 0 
            ? (onTimeOrders / totalOrdersForOntime) * 100 
            : 94.2;

        // Mapeo final al formato del frontend
        const kpiData = [
            {
                title: 'Total de OCs',
                value: totals.totalOrders.toString(),
                caption: 'Órdenes mes',
                trend: SIMULATED_TRENDS['Total de OCs']
            },
            {
                title: 'En aprobación',
                value: totals.pendingApproval.toString(),
                caption: 'Requieren revisión',
                trend: SIMULATED_TRENDS['En aprobación']
            },
            {
                title: 'Aprobadas',
                value: totals.approved.toString(),
                caption: 'Listas para procesar',
                trend: SIMULATED_TRENDS['Aprobadas']
            },
            {
                title: 'Pendientes de recepción',
                value: totals.pendingReceipt.toString(),
                caption: 'En tránsito',
                trend: SIMULATED_TRENDS['Pendientes de recepción']
            },
            {
                title: '% entregas a tiempo',
                value: onTimePercentage.toFixed(1),
                caption: 'Últimos 30 días',
                trend: SIMULATED_TRENDS['% entregas a tiempo']
            },
            {
                title: 'Tiempo promedio aprobación',
                value: parseFloat(avgTime).toFixed(1),
                caption: 'Días promedio',
                trend: SIMULATED_TRENDS['Tiempo promedio aprobación']
            },
            {
                title: 'Gasto del mes (con IGV)',
                value: (parseFloat(totals.monthlySpending) || 0).toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
                caption: 'Incluye IGV 18%',
                trend: SIMULATED_TRENDS['Gasto del mes (con IGV)']
            },
        ];
        
        res.status(200).json(kpiData);

    } catch (error) {
        console.error("Error al obtener KPIs de órdenes:", error);
        res.status(500).json({ message: "Error interno del servidor al obtener KPIs" });
    } finally {
        client.release();
    }
};


// **********************************************
// 2. OBTENER DATOS PARA GRÁFICOS (GET /api/orders/charts)
// **********************************************
export const getOrderChartsData = async (req, res) => {
    const client = await pool.connect();
    
    try {
        // --- 1. Gasto por Categoría (Pie Chart) ---
        const categoryQuery = `
            SELECT 
                categoria AS name,
                COUNT(id) AS orders,
                SUM(total) AS value
            FROM 
                ordenes_compra
            WHERE
                estado NOT IN ('Borrador', 'Anulada')
            GROUP BY 
                categoria
            ORDER BY 
                value DESC;
        `;
        const categoryResult = await client.query(categoryQuery);
        const categoryData = categoryResult.rows.map(row => ({
            name: row.name,
            orders: parseInt(row.orders),
            value: parseFloat(row.value)
        }));

        // --- 2. Top 5 Proveedores (Bar Chart) ---
        const supplierQuery = `
            SELECT
                nombre_proveedor AS name,
                SUM(total) AS value
            FROM
                ordenes_compra
            WHERE
                estado NOT IN ('Borrador', 'Anulada')
            GROUP BY
                nombre_proveedor
            ORDER BY
                value DESC
            LIMIT 5;
        `;
        const supplierResult = await client.query(supplierQuery);
        const supplierData = supplierResult.rows.map(row => ({
            name: row.name,
            value: parseFloat(row.value)
        }));

        // --- 3. Aging de Aprobaciones ---
        const agingQuery = `
            WITH ApprovalTimes AS (
                SELECT
                    oc.id,
                    oc.estado,
                    EXTRACT(DAY FROM (NOW() - oc.fecha_emision)) AS days_in_system
                FROM
                    ordenes_compra oc
                WHERE
                    oc.estado = 'En aprobación' -- Solo órdenes pendientes
            )
            SELECT
                COUNT(*) AS count,
                CASE
                    WHEN days_in_system <= 3 THEN '0-3 días'
                    WHEN days_in_system <= 7 THEN '4-7 días'
                    WHEN days_in_system <= 15 THEN '8-15 días'
                    ELSE '+15 días'
                END AS range_label
            FROM
                ApprovalTimes
            GROUP BY
                range_label
            ORDER BY 
                MIN(days_in_system);
        `;
        const agingResult = await client.query(agingQuery);
        
        let totalPending = agingResult.rows.reduce((sum, row) => sum + parseInt(row.count), 0);
        
        const agingData = agingResult.rows.map(row => ({
            range: row.range_label,
            count: parseInt(row.count),
            percentage: totalPending > 0 ? ((parseInt(row.count) / totalPending) * 100).toFixed(1) : '0'
        }));

        res.status(200).json({
            categoryData,
            supplierData,
            agingData
        });

    } catch (error) {
        console.error("Error al obtener datos de gráficos:", error);
        res.status(500).json({ message: "Error interno del servidor al obtener datos de gráficos" });
    } finally {
        client.release();
    }
};


// **********************************************
// 3. OBTENER TODAS LAS ÓRDENES (GET /api/orders)
// **********************************************
export const getAllOrders = async (req, res) => {
    try {
        const query = `
            SELECT 
                oc.id, 
                oc.fecha_emision AS "issueDate", 
                oc.fecha_entrega_est AS "estimatedDelivery",
                oc.estado AS status,
                oc.total, 
                oc.moneda AS currency,
                oc.terminos_pago AS "paymentTerms",
                oc.almacen AS warehouse,
                oc.comprador AS buyer,
                oc.nombre_proveedor AS "supplierName",
                p.ruc AS "supplierRuc",
                oc.categoria AS category,
                oc.subtotal,
                oc.igv,
                oc.direccion_entrega AS "deliveryAddress"
            FROM 
                ordenes_compra oc
            JOIN
                proveedores p ON oc.id_proveedor = p.id
            ORDER BY
                oc.fecha_emision DESC;
        `;
        
        const result = await pool.query(query);
        
        const mappedOrders = result.rows.map(row => ({
            ...row,
            issueDate: row.issueDate.toISOString().split('T')[0], 
            estimatedDelivery: row.estimatedDelivery.toISOString().split('T')[0], 
        }));

        res.status(200).json(mappedOrders);
    } catch (error) {
        console.error("Error al obtener todas las órdenes:", error);
        res.status(500).json({ message: "Error interno del servidor al obtener órdenes" });
    }
};

// **********************************************
// 4. OBTENER ORDEN POR ID (GET /api/orders/:id)
// **********************************************
export const getOrderById = async (req, res) => {
    const { id } = req.params;
    const client = await pool.connect();
    
    try {
        // 1. Obtener la cabecera
        const headerQuery = `
            SELECT 
                oc.id, 
                oc.fecha_emision AS "issueDate", 
                oc.fecha_entrega_est AS "estimatedDelivery",
                oc.estado AS status,
                oc.total, 
                oc.moneda AS currency,
                oc.terminos_pago AS "paymentTerms",
                oc.almacen AS warehouse,
                oc.comprador AS buyer,
                oc.nombre_proveedor AS "supplierName",
                p.ruc AS "supplierRuc",
                oc.categoria AS category,
                oc.subtotal,
                oc.igv,
                oc.direccion_entrega AS "deliveryAddress",
                oc.notas
            FROM 
                ordenes_compra oc
            JOIN
                proveedores p ON oc.id_proveedor = p.id
            WHERE 
                oc.id = $1;
        `;
        const headerResult = await client.query(headerQuery, [id]);

        if (headerResult.rows.length === 0) {
            return res.status(404).json({ message: "Orden de compra no encontrada" });
        }

        const order = headerResult.rows[0];
        
        // 2. Obtener el detalle (items)
        const itemsQuery = `
            SELECT 
                id, 
                sku, 
                descripcion AS description, 
                uom, 
                cantidad AS quantity, 
                precio_unitario AS "unitPrice", 
                descuento AS discount, 
                subtotal, 
                igv, 
                total 
            FROM 
                orden_compra_detalle 
            WHERE 
                orden_id = $1;
        `;
        const itemsResult = await client.query(itemsQuery, [id]);
        
        // 3. Obtener el historial de aprobación
        const approvalQuery = `
            SELECT 
                id, 
                accion AS action, 
                usuario AS user, 
                fecha AS date, 
                comentario AS comment 
            FROM 
                orden_compra_aprobacion 
            WHERE 
                orden_id = $1
            ORDER BY 
                fecha ASC;
        `;
        const approvalResult = await client.query(approvalQuery, [id]);

        // 4. Obtener adjuntos
        const attachmentsQuery = `
            SELECT 
                id,
                nombre_archivo AS name,
                tipo AS type,
                tamanho_bytes AS size,
                fecha_subida AS "uploadDate"
            FROM
                orden_compra_adjuntos
            WHERE
                orden_id = $1;
        `;
        const attachmentsResult = await client.query(attachmentsQuery, [id]);

        // Mapear y combinar resultados
        const detailedOrder = {
            ...order,
            issueDate: order.issueDate.toISOString().split('T')[0],
            estimatedDelivery: order.estimatedDelivery.toISOString().split('T')[0],
            items: itemsResult.rows,
            timeline: [
                { id: 1, stage: 'Creación de Borrador', user: order.buyer, date: order.issueDate, completed: true },
                ...approvalResult.rows.map(a => ({ 
                    id: `tl-${a.id}`, 
                    stage: `Acción de Aprobación (${a.action})`, 
                    user: a.user, 
                    date: a.date, 
                    completed: true 
                })),
                { id: 99, stage: 'Recepción de Mercadería', user: 'Sistema', date: new Date().toISOString(), completed: order.status.includes('Recibida') }
            ],
            approvalHistory: approvalResult.rows, 
            attachments: attachmentsResult.rows.map(att => ({
                ...att,
                size: att.size ? `${(att.size / 1024 / 1024).toFixed(1)} MB` : '0 MB'
            })) 
        };

        res.status(200).json(detailedOrder);

    } catch (error) {
        console.error("Error al obtener orden de compra por ID:", error);
        res.status(500).json({ message: "Error interno del servidor al obtener la orden" });
    } finally {
        client.release();
    }
};

// **********************************************
// 5. CREAR ORDEN (POST /api/orders)
// **********************************************
export const createOrder = async (req, res) => {
    const { 
        supplierRuc, supplierName, warehouse, deliveryAddress, paymentTerms, 
        estimatedDelivery, buyer, notes, currency, category, 
        subtotal, igv, total, items 
    } = req.body;

    if (!supplierRuc || items.length === 0) {
        return res.status(400).json({ message: "RUC de proveedor y items son requeridos." });
    }

    const client = await pool.connect();

    try {
        await client.query('BEGIN'); // Iniciar transacción

        // 1. Obtener id_proveedor a partir del RUC
        const supplierIdQuery = 'SELECT id FROM proveedores WHERE ruc = $1';
        const supplierIdResult = await client.query(supplierIdQuery, [supplierRuc]);

        if (supplierIdResult.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ message: `Proveedor con RUC ${supplierRuc} no encontrado.` });
        }
        const id_proveedor = supplierIdResult.rows[0].id;

        // 2. Generar el nuevo ID de la orden
        const orderId = await generateOrderId(client);
        
        // 3. Insertar la cabecera en ordenes_compra
        const headerInsertQuery = `
            INSERT INTO ordenes_compra (
                id, id_proveedor, nombre_proveedor, categoria, fecha_entrega_est, 
                almacen, direccion_entrega, terminos_pago, comprador, notas, 
                moneda, subtotal, igv, total, estado
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
            RETURNING id;
        `;
        const headerValues = [
            orderId, id_proveedor, supplierName, category, estimatedDelivery,
            warehouse, deliveryAddress, paymentTerms, buyer, notes,
            currency, subtotal, igv, total, 'En aprobación' 
        ];
        await client.query(headerInsertQuery, headerValues);

        // 4. Insertar los items en orden_compra_detalle
        for (const item of items) {
            const itemInsertQuery = `
                INSERT INTO orden_compra_detalle (
                    orden_id, sku, descripcion, uom, cantidad, precio_unitario, 
                    descuento, subtotal, igv, total
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10);
            `;
            const itemValues = [
                orderId, item.sku, item.description, item.uom, item.quantity, 
                item.unitPrice, item.discount, item.subtotal, item.igv, item.total
            ];
            await client.query(itemInsertQuery, itemValues);
        }

        // 5. Registrar la creación en la tabla de aprobación/timeline
        const timelineInsertQuery = `
            INSERT INTO orden_compra_aprobacion (
                orden_id, accion, usuario, comentario
            ) VALUES ($1, $2, $3, $4);
        `;
        await client.query(timelineInsertQuery, [orderId, 'Creada', buyer, 'Orden creada y enviada a aprobación.']);
        

        await client.query('COMMIT'); 

        res.status(201).json({ 
            message: "Orden de compra creada exitosamente", 
            orderId: orderId 
        });

    } catch (error) {
        await client.query('ROLLBACK'); 
        console.error("Error al crear la orden de compra:", error);
        res.status(500).json({ message: "Error interno del servidor al crear la orden" });
    } finally {
        client.release();
    }
};

// **********************************************
// 6. ACTUALIZAR ESTADO DE ORDEN (PUT /api/orders/:id/status)
// **********************************************
export const updateOrderStatus = async (req, res) => {
    const { id } = req.params;
    const { newStatus, user, comment } = req.body;
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // 1. Actualizar el estado en la cabecera
        const updateQuery = `
            UPDATE ordenes_compra
            SET estado = $1
            WHERE id = $2
            RETURNING estado, comprador;
        `;
        const updateResult = await client.query(updateQuery, [newStatus, id]);

        if (updateResult.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ message: "Orden no encontrada." });
        }
        
        const { estado, comprador } = updateResult.rows[0];

        // 2. Registrar la acción en el historial de aprobación (Timeline)
        const userAction = user || comprador;
        const actionType = newStatus.includes('Anulada') ? 'Anulada' : 
                           newStatus.includes('Aprobada') ? 'Aprobada' : 
                           newStatus.includes('Recibida') ? 'Recibida' : 'Actualizada';
                           
        const timelineInsertQuery = `
            INSERT INTO orden_compra_aprobacion (orden_id, accion, usuario, comentario)
            VALUES ($1, $2, $3, $4);
        `;
        await client.query(timelineInsertQuery, [id, actionType, userAction, comment || `Estado cambiado a ${newStatus}.`]);

        await client.query('COMMIT');
        res.status(200).json({ message: `Orden ${id} actualizada a estado: ${estado}`, status: estado });

    } catch (error) {
        await client.query('ROLLBACK');
        console.error("Error al actualizar el estado de la orden:", error);
        res.status(500).json({ message: "Error interno del servidor al actualizar el estado." });
    } finally {
        client.release();
    }
};

// **********************************************
// 7. ELIMINAR ORDEN (DELETE /api/orders/:id)
// **********************************************
export const deleteOrderById = async (req, res) => {
    const { id } = req.params;
    const client = await pool.connect();

    try {
        const deleteQuery = `
            DELETE FROM ordenes_compra
            WHERE id = $1
            RETURNING id;
        `;
        const result = await client.query(deleteQuery, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Orden no encontrada." });
        }

        res.status(200).json({ message: `Orden ${id} eliminada exitosamente.` });

    } catch (error) {
        console.error("Error al eliminar la orden:", error);
        res.status(500).json({ message: "Error interno del servidor al eliminar la orden." });
    } finally {
        client.release();
    }
};

// **********************************************
// 8. SIMULACIÓN DESCARGA PDF (GET /api/orders/:id/pdf)
// **********************************************
export const getPDFMock = (req, res) => {
    const { id } = req.params;
    // En una aplicación real, se generaría el PDF aquí.
    res.status(200).json({ message: `Simulación de descarga de PDF para OC ${id} completada.` });
};

// **********************************************
// 9. ACTUALIZAR ORDEN EXISTENTE (PUT /api/orders/:id)
// **********************************************
export const updateOrder = async (req, res) => {
    const { id } = req.params;
    const { 
        supplierRuc, warehouse, deliveryAddress, paymentTerms, 
        estimatedDelivery, buyer, notes, 
        subtotal, igv, total, items, 
        // Asumimos que el nombre y la categoría ya fueron validados en el frontend 
        // o que no cambian si el RUC no cambia.
        supplierName, category, currency
    } = req.body;

    const client = await pool.connect();

    try {
        await client.query('BEGIN'); // Iniciar transacción

        // 1. Obtener id_proveedor a partir del RUC (si el RUC cambia, esto es necesario)
        const supplierIdQuery = 'SELECT id FROM proveedores WHERE ruc = $1';
        const supplierIdResult = await client.query(supplierIdQuery, [supplierRuc]);

        if (supplierIdResult.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ message: `Proveedor con RUC ${supplierRuc} no encontrado.` });
        }
        const id_proveedor = supplierIdResult.rows[0].id;
        
        // 2. Actualizar la Cabecera en ordenes_compra
        const headerUpdateQuery = `
            UPDATE ordenes_compra SET
                id_proveedor = $1,
                nombre_proveedor = $2,
                categoria = $3,
                fecha_entrega_est = $4,
                almacen = $5,
                direccion_entrega = $6,
                terminos_pago = $7,
                comprador = $8,
                notas = $9,
                moneda = $10,
                subtotal = $11,
                igv = $12,
                total = $13
            WHERE id = $14 AND estado = 'Borrador' 
            RETURNING id;
        `;
        const headerValues = [
            id_proveedor, supplierName, category, estimatedDelivery,
            warehouse, deliveryAddress, paymentTerms, buyer, notes,
            currency, subtotal, igv, total, id
        ];
        const result = await client.query(headerUpdateQuery, headerValues);

        if (result.rows.length === 0) {
            await client.query('ROLLBACK');
            // La orden no se encuentra o no está en estado 'Borrador' para ser editable.
            return res.status(403).json({ message: "Orden no puede ser editada (Debe estar en estado Borrador)." });
        }

        // 3. Eliminar el Detalle antiguo (Método más simple y seguro para editar detalle)
        const deleteDetailQuery = `
            DELETE FROM orden_compra_detalle 
            WHERE orden_id = $1;
        `;
        await client.query(deleteDetailQuery, [id]);

        // 4. Insertar el Detalle nuevo (los ítems actualizados)
        for (const item of items) {
            const itemInsertQuery = `
                INSERT INTO orden_compra_detalle (
                    orden_id, sku, descripcion, uom, cantidad, precio_unitario, 
                    descuento, subtotal, igv, total
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10);
            `;
            const itemValues = [
                id, item.sku, item.description, item.uom, item.quantity, 
                item.unitPrice, item.discount, item.subtotal, item.igv, item.total
            ];
            await client.query(itemInsertQuery, itemValues);
        }

        // 5. Registrar la acción de edición en la tabla de aprobación/timeline
        const timelineInsertQuery = `
            INSERT INTO orden_compra_aprobacion (
                orden_id, accion, usuario, comentario
            ) VALUES ($1, $2, $3, $4);
        `;
        await client.query(timelineInsertQuery, [id, 'Editada', buyer, 'Orden modificada.']);
        
        await client.query('COMMIT'); // Confirmar transacción

        res.status(200).json({ 
            message: `Orden ${id} actualizada exitosamente.`
        });

    } catch (error) {
        await client.query('ROLLBACK'); // Revertir si hay error
        console.error("Error al actualizar la orden de compra:", error);
        res.status(500).json({ message: "Error interno del servidor al actualizar la orden." });
    } finally {
        client.release();
    }
};