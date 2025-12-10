// models/orderModel.js
import { pool } from "../config/connection.js";

const OrderModel = {
  // Obtener todas las órdenes con datos relevantes
  getAll: async () => {
    const query = `
      SELECT
        oc.oc_id,
        oc.razon_social_proveedor,
        oc.ruc_proveedor,
        oc.fecha_emision,
        oc.fecha_entrega_estimada,
        oc.estado,
        oc.almacen_destino,
        oc.total,
        oc.moneda,
        oc.terminos_pago,
        oc.categoria_oc,
        (SELECT COUNT(*) FROM orden_compra_items WHERE oc_id = oc.id) as total_items,
        oc.id
      FROM ordenes_compra oc
      ORDER BY oc.fecha_emision DESC;
    `;
    const { rows } = await pool.query(query);

    // Mapear los nombres de columna de la DB al formato esperado por el frontend
    return rows.map(row => ({
      id: row.oc_id,
      supplierName: row.razon_social_proveedor,
      supplierRuc: row.ruc_proveedor,
      issueDate: row.fecha_emision,
      estimatedDelivery: row.fecha_entrega_estimada,
      status: row.estado,
      warehouse: row.almacen_destino,
      total: parseFloat(row.total),
      currency: row.moneda,
      paymentTerms: row.terminos_pago,
      category: row.categoria_oc,
      // Solo para la tabla, otros detalles se cargan en el detalle
    }));
  },

  // Obtener una orden por su oc_id (incluyendo items y timeline)
  getDetailsById: async (ocId) => {
    // Consulta principal
    const ocQuery = "SELECT * FROM ordenes_compra WHERE oc_id = $1";
    const ocResult = await pool.query(ocQuery, [ocId]);
    const oc = ocResult.rows[0];

    if (!oc) return null;

    // Items
    const itemsQuery = "SELECT * FROM orden_compra_items WHERE oc_id = $1";
    const itemsResult = await pool.query(itemsQuery, [oc.id]);
    
    // Timeline
    const timelineQuery = "SELECT * FROM orden_compra_timeline WHERE oc_id = $1 ORDER BY fecha ASC";
    const timelineResult = await pool.query(timelineQuery, [oc.id]);

    // Mapear los datos al formato del frontend
    return {
        id: oc.oc_id,
        supplierName: oc.razon_social_proveedor,
        supplierRuc: oc.ruc_proveedor,
        issueDate: oc.fecha_emision,
        estimatedDelivery: oc.fecha_entrega_estimada,
        status: oc.estado,
        warehouse: oc.almacen_destino,
        buyer: oc.comprador,
        paymentTerms: oc.terminos_pago,
        currency: oc.moneda,
        category: oc.categoria_oc,
        notes: oc.notas,
        subtotal: parseFloat(oc.subtotal),
        igv: parseFloat(oc.igv),
        total: parseFloat(oc.total),
        deliveryAddress: "Simulado: se obtendría del proveedor o de la OC",
        attachments: [], // Simulado: requiere tabla aparte
        approvalHistory: [], // Simulado: requiere tabla aparte
        
        items: itemsResult.rows.map(item => ({
            id: item.item_id.toString(), // ID interno de la tabla detalle
            sku: item.sku,
            description: item.descripcion,
            quantity: parseFloat(item.cantidad),
            unitPrice: parseFloat(item.precio_unitario),
            uom: item.uom,
            discount: parseFloat(item.descuento),
            subtotal: parseFloat(item.subtotal),
            igv: parseFloat(item.igv),
            total: parseFloat(item.total),
        })),

        timeline: timelineResult.rows.map(t => ({
            id: t.timeline_id,
            stage: t.etapa,
            date: t.fecha,
            user: t.usuario,
            completed: t.completado
        }))
    };
  },

  // Crear una nueva orden con items y timeline (usando transacción)
  create: async (data) => {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // 1. Insertar Cabecera de la OC
      const ocId = `OC-${Date.now()}`;
      const headerQuery = `
        INSERT INTO ordenes_compra (
          oc_id, ruc_proveedor, razon_social_proveedor, fecha_entrega_estimada, 
          almacen_destino, comprador, terminos_pago, moneda, categoria_oc, notas, 
          subtotal, igv, total, estado
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
        RETURNING id, fecha_emision;
      `;
      const headerValues = [
        ocId, data.supplierRuc, data.supplierName, data.estimatedDelivery, 
        data.warehouse, data.buyer, data.paymentTerms, data.currency, data.category || 'General', data.notes, 
        data.subtotal, data.igv, data.total, 'En aprobación' 
      ];
      const headerResult = await client.query(headerQuery, headerValues);
      const newOcId = headerResult.rows[0].id;
      const issueDate = headerResult.rows[0].fecha_emision;

      // 2. Insertar Items de la OC
      const itemsQuery = `
        INSERT INTO orden_compra_items (
          oc_id, sku, descripcion, cantidad, uom, precio_unitario, subtotal, igv, total, descuento
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      `;
      for (const item of data.items) {
        const itemValues = [
          newOcId, item.sku, item.description, item.quantity, item.uom, item.unitPrice, 
          item.subtotal, item.igv, item.total, item.discount
        ];
        await client.query(itemsQuery, itemValues);
      }

      // 3. Insertar Timeline inicial
      const timelineQuery = `
        INSERT INTO orden_compra_timeline (oc_id, etapa, usuario)
        VALUES ($1, $2, $3)
      `;
      await client.query(timelineQuery, [newOcId, 'Creada', data.buyer]);
      await client.query(timelineQuery, [newOcId, 'En Aprobación', 'Sistema']);
      

      await client.query('COMMIT');
      
      // Devolver un objeto que el frontend pueda usar
      return { oc_id: ocId, issueDate: issueDate }; 

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  },
};

export default OrderModel;