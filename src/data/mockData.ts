import { KPIData, Order, Activity, StockItem, Currency, Supplier, PurchaseOrder, PurchaseOrderItem, InventoryItem, WarehouseLocation, StockMovement, WarehouseCapacity, BudgetVsActual, SupplierPerformance, ProcessEfficiency, InventoryRotation, PriceAnalysis, ReportView, Notification } from '../types';

export const EXCHANGE_RATE = 3.75; // Fixed PEN to USD rate
export const IGV_RATE = 0.18; // Peru's IGV tax rate

export const currencies: Currency[] = [
  { code: 'PEN', symbol: 'S/', rate: 1 },
  { code: 'USD', symbol: '$', rate: EXCHANGE_RATE }
];

export const notifications: Notification[] = [
  {
    id: 'NOT-001',
    type: 'order_approved',
    title: 'OC-2024-001 Aprobada',
    description: 'La orden de compra para Constructora ABC ha sido aprobada',
    timestamp: '2024-03-15T10:30:00Z',
    isRead: false
  },
  {
    id: 'NOT-002',
    type: 'stock_alert',
    title: 'Stock Bajo: Cemento Portland',
    description: 'Solo quedan 15 unidades en Lima Centro',
    timestamp: '2024-03-15T09:15:00Z',
    isRead: false
  },
  {
    id: 'NOT-003',
    type: 'supplier_updated',
    title: 'Proveedor Actualizado',
    description: 'Ferretería Central actualizó sus datos de contacto',
    timestamp: '2024-03-15T08:45:00Z',
    isRead: false
  },
  {
    id: 'NOT-004',
    type: 'reception_registered',
    title: 'Recepción Registrada',
    description: 'Se recibieron 50 unidades de Tornillos M12x80',
    timestamp: '2024-03-14T16:20:00Z',
    isRead: true
  },
  {
    id: 'NOT-005',
    type: 'budget_alert',
    title: 'Presupuesto: 85% Utilizado',
    description: 'El presupuesto de TI está cerca del límite mensual',
    timestamp: '2024-03-14T14:30:00Z',
    isRead: true
  },
  {
    id: 'NOT-006',
    type: 'payment_due',
    title: 'Pago Vencido',
    description: 'Factura FC-001 de Distribuidora Lima vence hoy',
    timestamp: '2024-03-14T11:00:00Z',
    isRead: true
  }
];

export const warehouses = [
  'Lima Centro',
  'Lima Norte', 
  'Arequipa',
  'Chimbote',
  'Trujillo'
];

export const categories = [
  'Construcción',
  'Ferretería', 
  'TI',
  'Mobiliario',
  'Oficina',
  'Mantenimiento'
];

export const paymentTerms = [
  'Contado',
  '30 días',
  '45 días',
  '60 días',
  '90 días'
];

// Sample purchase order items
const sampleItems: PurchaseOrderItem[] = [
  {
    id: 'ITEM-001',
    sku: 'CEMENTO-001',
    description: 'Cemento Portland Tipo I - 42.5kg',
    uom: 'Bolsa',
    quantity: 100,
    unitPrice: 28.50,
    discount: 0,
    subtotal: 2850.00,
    igv: 513.00,
    total: 3363.00
  },
  {
    id: 'ITEM-002', 
    sku: 'FIERRO-008',
    description: 'Fierro corrugado 8mm x 9m',
    uom: 'Varilla',
    quantity: 50,
    unitPrice: 42.80,
    discount: 5,
    subtotal: 2140.00,
    igv: 385.20,
    total: 2525.20
  }
];

export const mockPurchaseOrders: PurchaseOrder[] = [
  {
    id: 'OC-2024-001',
    supplierId: 'SUP-001',
    supplierName: 'Distribuidora Lima SAC',
    supplierRuc: '20123456789',
    issueDate: '2024-09-28',
    estimatedDelivery: '2024-10-05',
    warehouse: 'Lima Centro',
    buyer: 'Carlos Mendoza',
    currency: 'PEN',
    paymentTerms: '30 días',
    status: 'En aprobación',
    category: 'Construcción',
    items: sampleItems,
    subtotal: 4990.00,
    igv: 898.20,
    total: 5888.20,
    deliveryAddress: 'Av. Industrial 123, Lima - Almacén Central',
    notes: 'Entrega urgente para proyecto Edificio Los Olivos',
    approvalHistory: [
      {
        id: 'APR-001',
        user: 'Ana García',
        action: 'Comentario',
        date: '2024-09-28T10:30:00',
        comment: 'Revisar precios con proveedor alternativo'
      }
    ],
    timeline: [
      {
        id: 'TL-001',
        stage: 'Creada',
        date: '2024-09-28T09:15:00',
        user: 'Carlos Mendoza',
        completed: true
      },
      {
        id: 'TL-002',
        stage: 'Aprobación',
        date: '2024-09-28T10:30:00',
        user: 'Ana García',
        completed: false
      }
    ],
    attachments: [
      {
        id: 'ATT-001',
        name: 'Cotización_Distribuidora_Lima.pdf',
        type: 'PDF',
        size: '2.3 MB',
        uploadDate: '2024-09-28T09:20:00'
      }
    ]
  },
  {
    id: 'OC-2024-002',
    supplierId: 'SUP-002',
    supplierName: 'Tech Solutions Peru SAC',
    supplierRuc: '20456789123',
    issueDate: '2024-09-27',
    estimatedDelivery: '2024-10-10',
    warehouse: 'Lima Norte',
    buyer: 'María Rodríguez',
    currency: 'USD',
    paymentTerms: '45 días',
    status: 'Aprobada',
    category: 'TI',
    items: [
      {
        id: 'ITEM-003',
        sku: 'LAPTOP-HP001',
        description: 'Laptop HP ProBook 450 G9 - Intel i5, 8GB RAM, 256GB SSD',
        uom: 'Unidad',
        quantity: 10,
        unitPrice: 850.00,
        discount: 10,
        subtotal: 8500.00,
        igv: 1530.00,
        total: 10030.00
      }
    ],
    subtotal: 8500.00,
    igv: 1530.00,
    total: 10030.00,
    deliveryAddress: 'Av. Tecnológica 789, San Isidro - Oficina Principal',
    approvalHistory: [
      {
        id: 'APR-002',
        user: 'José Martinez',
        action: 'Aprobada',
        date: '2024-09-27T14:45:00',
        comment: 'Aprobado para renovación de equipos'
      }
    ],
    timeline: [
      {
        id: 'TL-003',
        stage: 'Creada',
        date: '2024-09-27T10:00:00',
        user: 'María Rodríguez',
        completed: true
      },
      {
        id: 'TL-004',
        stage: 'Aprobación',
        date: '2024-09-27T14:45:00',
        user: 'José Martinez',
        completed: true
      },
      {
        id: 'TL-005',
        stage: 'Enviada',
        date: '2024-09-27T15:00:00',
        user: 'Sistema',
        completed: true
      }
    ],
    attachments: [
      {
        id: 'ATT-002',
        name: 'Especificaciones_Laptops.pdf',
        type: 'PDF',
        size: '1.8 MB',
        uploadDate: '2024-09-27T10:15:00'
      }
    ]
  },
  {
    id: 'OC-2024-003',
    supplierId: 'SUP-004',
    supplierName: 'Materiales Express SA',
    supplierRuc: '20321654987',
    issueDate: '2024-09-26',
    estimatedDelivery: '2024-10-02',
    warehouse: 'Arequipa',
    buyer: 'Luis Fernández',
    currency: 'PEN',
    paymentTerms: 'Contado',
    status: 'Enviada',
    category: 'Ferretería',
    items: [
      {
        id: 'ITEM-004',
        sku: 'HERR-TALADRO01',
        description: 'Taladro percutor BOSCH GSB 13 RE - 600W',
        uom: 'Unidad',
        quantity: 5,
        unitPrice: 180.00,
        discount: 0,
        subtotal: 900.00,
        igv: 162.00,
        total: 1062.00
      },
      {
        id: 'ITEM-005',
        sku: 'HERR-SIERRA01',
        description: 'Sierra circular DEWALT DWE575 - 7 1/4"',
        uom: 'Unidad',
        quantity: 3,
        unitPrice: 350.00,
        discount: 5,
        subtotal: 1050.00,
        igv: 189.00,
        total: 1239.00
      }
    ],
    subtotal: 1950.00,
    igv: 351.00,
    total: 2301.00,
    deliveryAddress: 'Jr. Ferretería 147, Arequipa - Sucursal Sur',
    approvalHistory: [
      {
        id: 'APR-003',
        user: 'Pedro Silva',
        action: 'Aprobada',
        date: '2024-09-26T11:30:00',
        comment: 'Aprobado para mantenimiento'
      }
    ],
    timeline: [
      {
        id: 'TL-006',
        stage: 'Creada',
        date: '2024-09-26T09:00:00',
        user: 'Luis Fernández',
        completed: true
      },
      {
        id: 'TL-007',
        stage: 'Aprobación',
        date: '2024-09-26T11:30:00',
        user: 'Pedro Silva',
        completed: true
      },
      {
        id: 'TL-008',
        stage: 'Enviada',
        date: '2024-09-26T12:00:00',
        user: 'Sistema',
        completed: true
      }
    ],
    attachments: []
  },
  {
    id: 'OC-2024-004',
    supplierId: 'SUP-005',
    supplierName: 'Suministros Modernos SAC',
    supplierRuc: '20159753468',
    issueDate: '2024-09-25',
    estimatedDelivery: '2024-09-30',
    warehouse: 'Lima Centro',
    buyer: 'Ana Vargas',
    currency: 'PEN',
    paymentTerms: '30 días',
    status: 'Recibida total',
    category: 'Oficina',
    items: [
      {
        id: 'ITEM-006',
        sku: 'OF-ESCRITORIO01',
        description: 'Escritorio ejecutivo 120x60cm - Melamina nogal',
        uom: 'Unidad',
        quantity: 8,
        unitPrice: 280.00,
        discount: 0,
        subtotal: 2240.00,
        igv: 403.20,
        total: 2643.20
      }
    ],
    subtotal: 2240.00,
    igv: 403.20,
    total: 2643.20,
    deliveryAddress: 'Jr. Oficinas 159, Miraflores - Sede Administrativa',
    approvalHistory: [
      {
        id: 'APR-004',
        user: 'Carmen López',
        action: 'Aprobada',
        date: '2024-09-25T10:15:00',
        comment: 'Aprobado para nueva oficina'
      }
    ],
    timeline: [
      {
        id: 'TL-009',
        stage: 'Creada',
        date: '2024-09-25T08:30:00',
        user: 'Ana Vargas',
        completed: true
      },
      {
        id: 'TL-010',
        stage: 'Aprobación',
        date: '2024-09-25T10:15:00',
        user: 'Carmen López',
        completed: true
      },
      {
        id: 'TL-011',
        stage: 'Enviada',
        date: '2024-09-25T10:30:00',
        user: 'Sistema',
        completed: true
      },
      {
        id: 'TL-012',
        stage: 'Recibo',
        date: '2024-09-30T14:20:00',
        user: 'Roberto Gutiérrez',
        completed: true
      }
    ],
    attachments: [
      {
        id: 'ATT-003',
        name: 'Guía_Remisión_001234.pdf',
        type: 'PDF',
        size: '850 KB',
        uploadDate: '2024-09-30T14:25:00'
      }
    ]
  },
  {
    id: 'OC-2024-005',
    supplierId: 'SUP-001',
    supplierName: 'Distribuidora Lima SAC',
    supplierRuc: '20123456789',
    issueDate: '2024-09-24',
    estimatedDelivery: '2024-10-01',
    warehouse: 'Chimbote',
    buyer: 'Carlos Mendoza',
    currency: 'PEN',
    paymentTerms: '60 días',
    status: 'Borrador',
    category: 'Construcción',
    items: [
      {
        id: 'ITEM-007',
        sku: 'ARENA-GRUESA01',
        description: 'Arena gruesa para construcción',
        uom: 'm³',
        quantity: 20,
        unitPrice: 45.00,
        discount: 0,
        subtotal: 900.00,
        igv: 162.00,
        total: 1062.00
      }
    ],
    subtotal: 900.00,
    igv: 162.00,
    total: 1062.00,
    deliveryAddress: 'Av. Construcción 500, Chimbote - Obra Norte',
    approvalHistory: [],
    timeline: [
      {
        id: 'TL-013',
        stage: 'Creada',
        date: '2024-09-24T16:45:00',
        user: 'Carlos Mendoza',
        completed: true
      }
    ],
    attachments: []
  }
];

// Purchase Order KPIs based on period
export const getOrderKPIsByPeriod = (period: string) => {
  const orders = mockPurchaseOrders;
  const approvedOrders = orders.filter(o => o.status === 'Aprobada' || o.status === 'Enviada' || o.status === 'Recibida total' || o.status === 'Recibida parcial');
  const pendingOrders = orders.filter(o => o.status === 'En aprobación');
  const pendingReceiptOrders = orders.filter(o => o.status === 'Enviada');
  
  return {
    totalOrders: {
      title: 'Total de OCs',
      value: orders.length.toString(),
      caption: `Órdenes ${period.toLowerCase()}`,
      trend: { direction: 'up' as const, percentage: 8.5 }
    },
    pendingApproval: {
      title: 'En aprobación',
      value: pendingOrders.length.toString(),
      caption: 'Requieren revisión',
      trend: { direction: 'down' as const, percentage: 15.2 }
    },
    approved: {
      title: 'Aprobadas',
      value: approvedOrders.length.toString(),
      caption: 'Listas para procesar',
      trend: { direction: 'up' as const, percentage: 12.8 }
    },
    pendingReceipt: {
      title: 'Pendientes de recepción',
      value: pendingReceiptOrders.length.toString(),
      caption: 'En tránsito',
      trend: { direction: 'neutral' as const, percentage: 0 }
    },
    onTimeDelivery: {
      title: '% entregas a tiempo',
      value: '94.2',
      caption: 'Últimos 30 días',
      trend: { direction: 'up' as const, percentage: 2.1 }
    },
    avgApprovalTime: {
      title: 'Tiempo promedio aprobación',
      value: '2.4',
      caption: 'Días promedio',
      trend: { direction: 'down' as const, percentage: 8.5 }
    },
    monthlySpending: {
      title: 'Gasto del mes (con IGV)',
      value: period === 'Semana' ? '45,280' : period === 'Mes' ? '156,430' : '487,250',
      caption: 'Incluye IGV 18%',
      trend: { direction: 'up' as const, percentage: 15.2 }
    }
  };
};

// Chart data for categories and suppliers
export const getCategorySpendingData = (currency: 'PEN' | 'USD') => {
  const data = [
    { name: 'Construcción', value: 89450, orders: 12 },
    { name: 'TI', value: 67230, orders: 8 },
    { name: 'Ferretería', value: 34120, orders: 15 },
    { name: 'Oficina', value: 23680, orders: 6 },
    { name: 'Mobiliario', value: 18920, orders: 4 },
    { name: 'Mantenimiento', value: 12450, orders: 7 }
  ];
  
  return data.map(item => ({
    ...item,
    value: currency === 'USD' ? item.value / EXCHANGE_RATE : item.value
  }));
};

export const getTopSuppliersData = (currency: 'PEN' | 'USD') => {
  const data = [
    { name: 'Distribuidora Lima', value: 125450, orders: 8 },
    { name: 'Tech Solutions Peru', value: 89320, orders: 5 },
    { name: 'Materiales Express', value: 67890, orders: 12 },
    { name: 'Suministros Modernos', value: 45670, orders: 6 },
    { name: 'Importadora Global', value: 34520, orders: 4 }
  ];
  
  return data.map(item => ({
    ...item,
    value: currency === 'USD' ? item.value / EXCHANGE_RATE : item.value
  }));
};

export const getApprovalAgingData = () => {
  return [
    { range: '0-2 días', count: 8, percentage: 65 },
    { range: '3-5 días', count: 3, percentage: 25 },
    { range: '6-10 días', count: 1, percentage: 8 },
    { range: '> 10 días', count: 0, percentage: 2 }
  ];
};

export const mockSuppliers: Supplier[] = [
  {
    id: 'SUP-001',
    name: 'Distribuidora Lima SAC',
    ruc: '20123456789',
    sector: 'Distribución',
    status: 'Activo',
    registrationDate: '2023-01-15',
    lastOrder: '2024-09-25',
    totalBilled: 125450.75,
    currency: 'PEN',
    contact: {
      phone: '+51 1 234-5678',
      email: 'ventas@distribuidoralima.com',
      address: 'Av. Industrial 123, Lima'
    },
    representative: 'Carlos Mendoza'
  },
  {
    id: 'SUP-002',
    name: 'Importadora Global EIRL',
    ruc: '20987654321',
    sector: 'Importación',
    status: 'Activo',
    registrationDate: '2022-11-08',
    lastOrder: '2024-09-28',
    totalBilled: 89320.50,
    currency: 'PEN',
    contact: {
      phone: '+51 1 567-8901',
      email: 'contacto@importadoraglobal.pe',
      address: 'Jr. Comercio 456, Callao'
    },
    representative: 'María Rodríguez'
  },
  {
    id: 'SUP-003',
    name: 'Tech Solutions Peru SAC',
    ruc: '20456789123',
    sector: 'Tecnología',
    status: 'En evaluación',
    registrationDate: '2024-08-20',
    lastOrder: null,
    totalBilled: 0,
    currency: 'PEN',
    contact: {
      phone: '+51 1 789-0123',
      email: 'info@techsolutionsperu.com',
      address: 'Av. Tecnológica 789, San Isidro'
    },
    representative: 'Roberto Silva'
  },
  {
    id: 'SUP-004',
    name: 'Materiales Express SA',
    ruc: '20321654987',
    sector: 'Construcción',
    status: 'Activo',
    registrationDate: '2023-03-12',
    lastOrder: '2024-09-20',
    totalBilled: 203750.00,
    currency: 'PEN',
    contact: {
      phone: '+51 1 345-6789',
      email: 'ventas@materialesexpress.pe',
      address: 'Av. Construcción 321, Villa El Salvador'
    },
    representative: 'Luis Fernández'
  },
  {
    id: 'SUP-005',
    name: 'Suministros Modernos SAC',
    ruc: '20159753468',
    sector: 'Oficina',
    status: 'Activo',
    registrationDate: '2023-07-05',
    lastOrder: '2024-09-26',
    totalBilled: 67890.25,
    currency: 'PEN',
    contact: {
      phone: '+51 1 012-3456',
      email: 'pedidos@suministrosmodernos.com',
      address: 'Jr. Oficinas 159, Miraflores'
    },
    representative: 'Ana Vargas'
  },
  {
    id: 'SUP-006',
    name: 'Alimentos del Norte EIRL',
    ruc: '20753951456',
    sector: 'Alimentos',
    status: 'Suspendido',
    registrationDate: '2022-05-18',
    lastOrder: '2024-07-15',
    totalBilled: 145620.80,
    currency: 'PEN',
    contact: {
      phone: '+51 1 654-3210',
      email: 'ventas@alimentosdelnorte.pe',
      address: 'Av. Alimentos 753, Trujillo'
    },
    representative: 'Jorge Castillo'
  },
  {
    id: 'SUP-007',
    name: 'Productos Químicos SAC',
    ruc: '20852741963',
    sector: 'Químicos',
    status: 'Activo',
    registrationDate: '2023-09-14',
    lastOrder: '2024-09-22',
    totalBilled: 98340.60,
    currency: 'PEN',
    contact: {
      phone: '+51 1 852-7419',
      email: 'info@productosquimicos.com.pe',
      address: 'Av. Industrial 852, Ventanilla'
    },
    representative: 'Patricia Morales'
  },
  {
    id: 'SUP-008',
    name: 'Textil Peruano SA',
    ruc: '20741852963',
    sector: 'Textil',
    status: 'Activo',
    registrationDate: '2022-12-03',
    lastOrder: '2024-09-18',
    totalBilled: 176540.90,
    currency: 'PEN',
    contact: {
      phone: '+51 1 741-8529',
      email: 'pedidos@textilperuano.pe',
      address: 'Jr. Textil 741, Ate'
    },
    representative: 'Miguel Torres'
  },
  {
    id: 'SUP-009',
    name: 'Equipos Médicos Lima',
    ruc: '20963741852',
    sector: 'Salud',
    status: 'En evaluación',
    registrationDate: '2024-09-01',
    lastOrder: null,
    totalBilled: 0,
    currency: 'PEN',
    contact: {
      phone: '+51 1 963-7418',
      email: 'ventas@equiposmedicos.pe',
      address: 'Av. Salud 963, San Borja'
    },
    representative: 'Diana López'
  },
  {
    id: 'SUP-010',
    name: 'Logística Integral SAC',
    ruc: '20147258369',
    sector: 'Logística',
    status: 'Activo',
    registrationDate: '2023-04-22',
    lastOrder: '2024-09-27',
    totalBilled: 112890.35,
    currency: 'PEN',
    contact: {
      phone: '+51 1 147-2583',
      email: 'operaciones@logisticaintegral.pe',
      address: 'Av. Logística 147, Villa María del Triunfo'
    },
    representative: 'Eduardo Ramírez'
  }
];

export const supplierKPIs = {
  totalSuppliers: {
    title: 'Total de proveedores',
    value: mockSuppliers.length.toString(),
    caption: 'Registrados en el sistema',
    trend: { direction: 'up' as const, percentage: 5.2 }
  },
  activeSuppliers: {
    title: 'Proveedores activos',
    value: mockSuppliers.filter(s => s.status === 'Activo').length.toString(),
    caption: 'Con transacciones recientes',
    trend: { direction: 'up' as const, percentage: 3.1 }
  },
  suspendedSuppliers: {
    title: 'Proveedores suspendidos',
    value: mockSuppliers.filter(s => s.status === 'Suspendido').length.toString(),
    caption: 'Requieren revisión',
    trend: { direction: 'down' as const, percentage: 2.5 }
  },
  newSuppliers: {
    title: 'Nuevos este mes',
    value: mockSuppliers.filter(s => new Date(s.registrationDate) >= new Date('2024-09-01')).length.toString(),
    caption: 'Registrados en septiembre',
    trend: { direction: 'up' as const, percentage: 12.0 }
  }
};

export const supplierSectors = [
  'Todos',
  'Distribución',
  'Importación',
  'Tecnología',
  'Construcción',
  'Oficina',
  'Alimentos',
  'Químicos',
  'Textil',
  'Salud',
  'Logística'
];

export const mockKPIData: Record<string, KPIData> = {
  Semana: {
    title: 'Total de proveedores',
    value: '245',
    caption: 'Activos este periodo',
    trend: { direction: 'up', percentage: 2.5 }
  },
  Mes: {
    title: 'Total de proveedores',
    value: '312',
    caption: 'Activos este periodo',
    trend: { direction: 'up', percentage: 8.2 }
  },
  Trimestre: {
    title: 'Total de proveedores',
    value: '387',
    caption: 'Activos este periodo',
    trend: { direction: 'up', percentage: 15.7 }
  }
};

export const mockOrders: Order[] = [
  {
    id: 'OC-2024-001',
    supplier: 'Distribuidora Lima SAC',
    date: '2024-09-28',
    status: 'Pendiente',
    amount: 15420.50,
    currency: 'PEN'
  },
  {
    id: 'OC-2024-002',
    supplier: 'Importadora Global EIRL',
    date: '2024-09-27',
    status: 'Aprobada',
    amount: 8750.00,
    currency: 'PEN'
  },
  {
    id: 'OC-2024-003',
    supplier: 'Proveedores Unidos SA',
    date: '2024-09-26',
    status: 'En Proceso',
    amount: 22150.75,
    currency: 'PEN'
  },
  {
    id: 'OC-2024-004',
    supplier: 'Tech Solutions Peru',
    date: '2024-09-25',
    status: 'Aprobada',
    amount: 12300.00,
    currency: 'PEN'
  },
  {
    id: 'OC-2024-005',
    supplier: 'Materiales Express',
    date: '2024-09-24',
    status: 'Pendiente',
    amount: 5890.25,
    currency: 'PEN'
  }
];

export const mockActivities: Activity[] = [
  {
    id: '1',
    type: 'approval',
    description: 'Orden de compra OC-2024-002 aprobada por José Martinez',
    timestamp: '2024-09-28T14:30:00',
    status: 'success'
  },
  {
    id: '2',
    type: 'stock',
    description: 'Alerta: Stock bajo para Papel Bond A4 (12 unidades restantes)',
    timestamp: '2024-09-28T13:15:00',
    status: 'warning'
  },
  {
    id: '3',
    type: 'supplier',
    description: 'Nuevo proveedor registrado: Suministros Modernos SAC',
    timestamp: '2024-09-28T11:45:00',
    status: 'success'
  },
  {
    id: '4',
    type: 'approval',
    description: 'Orden de compra OC-2024-001 requiere aprobación urgente',
    timestamp: '2024-09-28T10:20:00',
    status: 'warning'
  },
  {
    id: '5',
    type: 'stock',
    description: 'Inventario actualizado para categoría Oficina',
    timestamp: '2024-09-28T09:30:00',
    status: 'success'
  }
];

export const mockLowStock: StockItem[] = [
  {
    id: '1',
    name: 'Papel Bond A4 75g',
    currentStock: 12,
    minStock: 50,
    unit: 'paquetes',
    category: 'Oficina'
  },
  {
    id: '2',
    name: 'Toner HP LaserJet Negro',
    currentStock: 3,
    minStock: 10,
    unit: 'unidades',
    category: 'Tecnología'
  },
  {
    id: '3',
    name: 'Cables USB Tipo C',
    currentStock: 8,
    minStock: 25,
    unit: 'unidades',
    category: 'Tecnología'
  },
  {
    id: '4',
    name: 'Carpetas Manila Tamaño A4',
    currentStock: 15,
    minStock: 40,
    unit: 'paquetes',
    category: 'Oficina'
  },
  {
    id: '5',
    name: 'Marcadores Permanentes',
    currentStock: 6,
    minStock: 20,
    unit: 'cajas',
    category: 'Oficina'
  }
];

export const generateChartData = (period: string) => {
  const baseValues = period === 'Semana' ? [45, 52, 48, 61, 55, 67, 73] :
                     period === 'Mes' ? [120, 135, 142, 158, 171, 163, 189, 195, 201, 218, 225, 234] :
                     [480, 520, 495, 580, 635, 678, 702, 745, 789, 812, 856, 890];
  
  return baseValues.map((value, index) => ({
    name: period === 'Semana' ? `Día ${index + 1}` :
          period === 'Mes' ? `S${index + 1}` :
          `M${index + 1}`,
    gasto: value * 1000,
    anterior: value * 0.85 * 1000
  }));
};

export const getKPIsByPeriod = (period: string) => {
  const baseKPIs = {
    proveedores: mockKPIData[period] || mockKPIData.Mes,
    ordenesPendientes: {
      title: 'Órdenes de compra pendientes',
      value: period === 'Semana' ? '8' : period === 'Mes' ? '23' : '67',
      caption: 'Requieren aprobación',
      trend: { direction: 'down' as const, percentage: 12.5 }
    },
    alertasStock: {
      title: 'Alertas de stock',
      value: period === 'Semana' ? '5' : period === 'Mes' ? '12' : '28',
      caption: 'Productos bajo mínimo',
      trend: { direction: 'up' as const, percentage: 8.3 }
    },
    gastoMes: {
      title: 'Gasto del periodo',
      value: period === 'Semana' ? '156,430' : period === 'Mes' ? '487,250' : '1,425,680',
      caption: period === 'Semana' ? 'Esta semana' : period === 'Mes' ? 'Este mes' : 'Este trimestre',
      trend: { direction: 'up' as const, percentage: 15.2 },
      miniChart: period === 'Semana' ? [45, 52, 48, 61, 55, 67, 73] :
                 period === 'Mes' ? [120, 135, 142, 158, 171, 163, 189, 195, 201, 218, 225, 234] :
                 [480, 520, 495, 580, 635, 678, 702, 745, 789, 812, 856, 890]
    }
  };
  
  return baseKPIs;
};

// Inventory Data
export const inventoryCategories = [
  'Todos',
  'Construcción',
  'Ferretería',
  'TI',
  'Mobiliario', 
  'Oficina',
  'Mantenimiento',
  'Químicos',
  'Textiles'
];

export const inventoryBrands = [
  'Todos',
  'Promart',
  'Sodimac',
  'BOSCH',
  'DeWALT',
  'HP',
  'Canon',
  'Stanley',
  'Makita',
  'Bticino',
  'Eternit'
];

export const inventoryWarehouses = [
  { code: 'LIM-LUR', name: 'Lurín', fullName: 'Lurín (LIM-LUR)' },
  { code: 'ARE-CER', name: 'Arequipa', fullName: 'Arequipa (ARE-CER)' },
  { code: 'ANC-CHI', name: 'Chimbote', fullName: 'Chimbote (ANC-CHI)' }
];

export const warehouseLocations: WarehouseLocation[] = [
  // Lurín locations
  { id: 'LUR-A-01-15', warehouse: 'Lurín', warehouseCode: 'LIM-LUR', aisle: 'A', shelf: '01', bin: '15', fullLocation: 'A-01-15', capacity: 1000, usedCapacity: 750, utilization: 75 },
  { id: 'LUR-A-02-08', warehouse: 'Lurín', warehouseCode: 'LIM-LUR', aisle: 'A', shelf: '02', bin: '08', fullLocation: 'A-02-08', capacity: 800, usedCapacity: 480, utilization: 60 },
  { id: 'LUR-B-01-22', warehouse: 'Lurín', warehouseCode: 'LIM-LUR', aisle: 'B', shelf: '01', bin: '22', fullLocation: 'B-01-22', capacity: 1200, usedCapacity: 960, utilization: 80 },
  // Arequipa locations
  { id: 'ARE-C-03-12', warehouse: 'Arequipa', warehouseCode: 'ARE-CER', aisle: 'C', shelf: '03', bin: '12', fullLocation: 'C-03-12', capacity: 900, usedCapacity: 540, utilization: 60 },
  { id: 'ARE-D-01-05', warehouse: 'Arequipa', warehouseCode: 'ARE-CER', aisle: 'D', shelf: '01', bin: '05', fullLocation: 'D-01-05', capacity: 1100, usedCapacity: 770, utilization: 70 },
  // Chimbote locations
  { id: 'CHI-E-02-18', warehouse: 'Chimbote', warehouseCode: 'ANC-CHI', aisle: 'E', shelf: '02', bin: '18', fullLocation: 'E-02-18', capacity: 800, usedCapacity: 400, utilization: 50 },
  { id: 'CHI-F-01-09', warehouse: 'Chimbote', warehouseCode: 'ANC-CHI', aisle: 'F', shelf: '01', bin: '09', fullLocation: 'F-01-09', capacity: 1000, usedCapacity: 650, utilization: 65 }
];

export const mockInventoryItems: InventoryItem[] = [
  {
    id: 'INV-001',
    sku: 'CEMENTO-001',
    description: 'Cemento Portland Tipo I - 42.5kg',
    category: 'Construcción',
    brand: 'Promart',
    uom: 'Bolsa',
    status: 'Activo',
    warehouse: 'Lurín',
    location: 'A-01-15',
    availableStock: 450,
    committedStock: 50,
    minStock: 100,
    reorderPoint: 150,
    unitCost: 28.50,
    totalValue: 12825.00,
    lastMovement: '2024-09-28T14:20:00',
    batch: 'LT240928',
    abcClass: 'A',
    leadTimeDays: 7,
    preferredSupplier: 'Distribuidora Lima SAC',
    image: 'https://via.placeholder.com/300x200/FF6F00/FFFFFF?text=Cemento'
  },
  {
    id: 'INV-002',
    sku: 'FIERRO-008',
    description: 'Fierro corrugado 8mm x 9m',
    category: 'Construcción',
    brand: 'Sodimac',
    uom: 'Varilla',
    status: 'Activo',
    warehouse: 'Lurín',
    location: 'A-02-08',
    availableStock: 280,
    committedStock: 20,
    minStock: 50,
    reorderPoint: 80,
    unitCost: 42.80,
    totalValue: 11984.00,
    lastMovement: '2024-09-27T16:45:00',
    batch: 'VAR240927',
    abcClass: 'A',
    leadTimeDays: 5,
    preferredSupplier: 'Materiales Express SA'
  },
  {
    id: 'INV-003',
    sku: 'TALADRO-BOSCH001',
    description: 'Taladro percutor BOSCH GSB 13 RE - 600W',
    category: 'Ferretería',
    brand: 'BOSCH',
    uom: 'Unidad',
    status: 'Activo',
    warehouse: 'Arequipa',
    location: 'C-03-12',
    availableStock: 15,
    committedStock: 5,
    minStock: 8,
    reorderPoint: 12,
    unitCost: 180.00,
    totalValue: 2700.00,
    lastMovement: '2024-09-26T11:30:00',
    serialNumber: 'BSH001-240926',
    abcClass: 'B',
    leadTimeDays: 10,
    preferredSupplier: 'Materiales Express SA'
  },
  {
    id: 'INV-004',
    sku: 'LAPTOP-HP001',
    description: 'Laptop HP ProBook 450 G9 - Intel i5, 8GB RAM, 256GB SSD',
    category: 'TI',
    brand: 'HP',
    uom: 'Unidad',
    status: 'Activo',
    warehouse: 'Lurín',
    location: 'B-01-22',
    availableStock: 8,
    committedStock: 2,
    minStock: 5,
    reorderPoint: 10,
    unitCost: 850.00,
    totalValue: 6800.00,
    lastMovement: '2024-09-25T13:15:00',
    serialNumber: 'HP001-240925',
    abcClass: 'A',
    leadTimeDays: 15,
    preferredSupplier: 'Tech Solutions Peru SAC'
  },
  {
    id: 'INV-005',
    sku: 'ESCRITORIO-001',
    description: 'Escritorio ejecutivo 120x60cm - Melamina nogal',
    category: 'Mobiliario',
    brand: 'Promart',
    uom: 'Unidad',
    status: 'Activo',
    warehouse: 'Arequipa',
    location: 'D-01-05',
    availableStock: 12,
    committedStock: 3,
    minStock: 5,
    reorderPoint: 8,
    unitCost: 280.00,
    totalValue: 3360.00,
    lastMovement: '2024-09-24T10:45:00',
    abcClass: 'B',
    leadTimeDays: 12,
    preferredSupplier: 'Suministros Modernos SAC'
  },
  {
    id: 'INV-006',
    sku: 'PAPEL-A4-001',
    description: 'Papel Bond A4 75g - Paquete x500 hojas',
    category: 'Oficina',
    brand: 'Canon',
    uom: 'Paquete',
    status: 'Activo',
    warehouse: 'Chimbote',
    location: 'E-02-18',
    availableStock: 35,
    committedStock: 5,
    minStock: 50,
    reorderPoint: 75,
    unitCost: 12.50,
    totalValue: 437.50,
    lastMovement: '2024-09-28T09:20:00',
    batch: 'PAP240928',
    abcClass: 'C',
    leadTimeDays: 3,
    preferredSupplier: 'Suministros Modernos SAC'
  },
  {
    id: 'INV-007',
    sku: 'SIERRA-DEWALT001',
    description: 'Sierra circular DEWALT DWE575 - 7 1/4"',
    category: 'Ferretería',
    brand: 'DeWALT',
    uom: 'Unidad',
    status: 'Activo',
    warehouse: 'Chimbote',
    location: 'F-01-09',
    availableStock: 6,
    committedStock: 1,
    minStock: 4,
    reorderPoint: 8,
    unitCost: 350.00,
    totalValue: 2100.00,
    lastMovement: '2024-09-23T15:30:00',
    serialNumber: 'DWE001-240923',
    abcClass: 'B',
    leadTimeDays: 14,
    preferredSupplier: 'Materiales Express SA'
  },
  {
    id: 'INV-008',
    sku: 'PINTURA-001',
    description: 'Pintura látex blanco mate - Galón 3.8L',
    category: 'Químicos',
    brand: 'Promart',
    uom: 'Galón',
    status: 'Activo',
    warehouse: 'Lurín',
    location: 'A-01-15',
    availableStock: 45,
    committedStock: 8,
    minStock: 20,
    reorderPoint: 30,
    unitCost: 65.00,
    totalValue: 2925.00,
    lastMovement: '2024-09-27T12:10:00',
    batch: 'PIN240927',
    expiryDate: '2026-09-27',
    abcClass: 'B',
    leadTimeDays: 8,
    preferredSupplier: 'Distribuidora Lima SAC'
  },
  {
    id: 'INV-009',
    sku: 'TUBERIA-PVC-001',
    description: 'Tubería PVC 4" clase 10 - 6m',
    category: 'Construcción',
    brand: 'Eternit',
    uom: 'Metro',
    status: 'Activo',
    warehouse: 'Arequipa',
    location: 'C-03-12',
    availableStock: 120,
    committedStock: 30,
    minStock: 40,
    reorderPoint: 60,
    unitCost: 18.50,
    totalValue: 2220.00,
    lastMovement: '2024-09-26T08:15:00',
    batch: 'TUB240926',
    abcClass: 'B',
    leadTimeDays: 6,
    preferredSupplier: 'Distribuidora Lima SAC'
  },
  {
    id: 'INV-010',
    sku: 'IMPRESORA-HP001',
    description: 'Impresora HP LaserJet Pro M404n',
    category: 'TI',
    brand: 'HP',
    uom: 'Unidad',
    status: 'Activo',
    warehouse: 'Lurín',
    location: 'B-01-22',
    availableStock: 4,
    committedStock: 1,
    minStock: 3,
    reorderPoint: 6,
    unitCost: 420.00,
    totalValue: 1680.00,
    lastMovement: '2024-09-25T16:40:00',
    serialNumber: 'HP-LJ001-240925',
    abcClass: 'C',
    leadTimeDays: 12,
    preferredSupplier: 'Tech Solutions Peru SAC'
  },
  {
    id: 'INV-011',
    sku: 'CABLE-USB-001',
    description: 'Cable USB Tipo C 2m - Alta velocidad',
    category: 'TI',
    brand: 'HP',
    uom: 'Unidad',
    status: 'Activo',
    warehouse: 'Chimbote',
    location: 'E-02-18',
    availableStock: 18,
    committedStock: 7,
    minStock: 25,
    reorderPoint: 40,
    unitCost: 15.00,
    totalValue: 270.00,
    lastMovement: '2024-09-28T11:05:00',
    batch: 'CAB240928',
    abcClass: 'C',
    leadTimeDays: 5,
    preferredSupplier: 'Tech Solutions Peru SAC'
  },
  {
    id: 'INV-012',
    sku: 'DESTORNILLADOR-STANLEY001',
    description: 'Juego destornilladores Stanley 6 piezas',
    category: 'Ferretería',
    brand: 'Stanley',
    uom: 'Juego',
    status: 'Activo',
    warehouse: 'Arequipa',
    location: 'D-01-05',
    availableStock: 22,
    committedStock: 3,
    minStock: 10,
    reorderPoint: 15,
    unitCost: 45.00,
    totalValue: 990.00,
    lastMovement: '2024-09-24T14:25:00',
    abcClass: 'C',
    leadTimeDays: 7,
    preferredSupplier: 'Materiales Express SA'
  }
];

// Sample stock movements for an item
export const mockStockMovements: StockMovement[] = [
  {
    id: 'MOV-001',
    date: '2024-09-28T14:20:00',
    type: 'Entrada OC',
    relatedDocument: 'OC-2024-001',
    quantityIn: 100,
    quantityOut: 0,
    balance: 450,
    unitCost: 28.50,
    totalValue: 2850.00,
    user: 'Roberto Gutiérrez'
  },
  {
    id: 'MOV-002',
    date: '2024-09-27T16:45:00',
    type: 'Salida venta',
    relatedDocument: 'VTA-2024-089',
    quantityIn: 0,
    quantityOut: 50,
    balance: 350,
    unitCost: 28.50,
    totalValue: -1425.00,
    user: 'Sistema POS'
  },
  {
    id: 'MOV-003',
    date: '2024-09-25T10:30:00',
    type: 'Transferencia',
    relatedDocument: 'TRF-2024-015',
    quantityIn: 0,
    quantityOut: 25,
    balance: 400,
    unitCost: 28.50,
    totalValue: -712.50,
    user: 'Carlos Mendoza'
  },
  {
    id: 'MOV-004',
    date: '2024-09-22T11:15:00',
    type: 'Ajuste',
    relatedDocument: 'AJS-2024-003',
    quantityIn: 0,
    quantityOut: 5,
    balance: 425,
    unitCost: 28.50,
    totalValue: -142.50,
    reason: 'Merma por humedad',
    user: 'Ana García'
  }
];

export const warehouseCapacities: WarehouseCapacity[] = [
  {
    warehouse: 'Lurín',
    totalCapacity: 50000,
    usedCapacity: 37500,
    utilization: 75,
    entriesThisPeriod: 1250,
    exitsThisPeriod: 980
  },
  {
    warehouse: 'Arequipa',
    totalCapacity: 30000,
    usedCapacity: 19500,
    utilization: 65,
    entriesThisPeriod: 850,
    exitsThisPeriod: 720
  },
  {
    warehouse: 'Chimbote',
    totalCapacity: 25000,
    usedCapacity: 13750,
    utilization: 55,
    entriesThisPeriod: 650,
    exitsThisPeriod: 580
  }
];

// Inventory KPIs
export const getInventoryKPIsByPeriod = (currency: 'PEN' | 'USD') => {
  const exchangeRate = currency === 'USD' ? EXCHANGE_RATE : 1;
  
  return {
    activeSKUs: {
      title: 'SKUs activos',
      value: mockInventoryItems.filter(item => item.status === 'Activo').length.toString(),
      caption: 'Productos en catálogo',
      trend: { direction: 'up' as const, percentage: 2.5 }
    },
    totalStock: {
      title: 'Stock total',
      value: mockInventoryItems.reduce((sum, item) => sum + item.availableStock, 0).toLocaleString('es-PE'),
      caption: 'Unidades disponibles',
      trend: { direction: 'neutral' as const, percentage: 0 }
    },
    stockValue: {
      title: 'Stock valorizado',
      value: `${currency === 'USD' ? '$' : 'S/'} ${(mockInventoryItems.reduce((sum, item) => sum + item.totalValue, 0) / exchangeRate).toLocaleString('es-PE', { minimumFractionDigits: 2 })}`,
      caption: 'Valorización total',
      trend: { direction: 'up' as const, percentage: 5.8 }
    },
    lowStockItems: {
      title: 'Items con stock bajo',
      value: mockInventoryItems.filter(item => item.availableStock <= item.minStock).length.toString(),
      caption: 'Requieren reposición',
      trend: { direction: 'down' as const, percentage: 12.3 }
    },
    pendingReceipts: {
      title: 'Órdenes pendientes de recepción',
      value: '8',
      caption: 'Entregas esperadas',
      trend: { direction: 'neutral' as const, percentage: 0 }
    },
    transfersInTransit: {
      title: 'Transferencias en tránsito',
      value: '5',
      caption: 'Entre almacenes',
      trend: { direction: 'up' as const, percentage: 25.0 }
    },
    avgRotationDays: {
      title: 'Rotación promedio',
      value: '45',
      caption: 'Días de inventario',
      trend: { direction: 'down' as const, percentage: 8.7 }
    }
  };
};

// Chart data generators
export const getCategoryValuationData = (currency: 'PEN' | 'USD') => {
  const categoryTotals: Record<string, number> = {};
  
  mockInventoryItems.forEach(item => {
    if (!categoryTotals[item.category]) {
      categoryTotals[item.category] = 0;
    }
    categoryTotals[item.category] += item.totalValue;
  });
  
  const exchangeRate = currency === 'USD' ? EXCHANGE_RATE : 1;
  
  return Object.entries(categoryTotals).map(([category, value]) => ({
    name: category,
    value: value / exchangeRate,
    items: mockInventoryItems.filter(item => item.category === category).length
  }));
};

export const getRotationByCategory = () => {
  const categories = Array.from(new Set(mockInventoryItems.map(item => item.category)));
  const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep'];
  
  return months.map(month => {
    const data: any = { month };
    categories.forEach(category => {
      // Simulate rotation data
      data[category] = Math.floor(Math.random() * 60) + 20;
    });
    return data;
  });
};

export const getExpiryData = () => {
  const months = ['Oct', 'Nov', 'Dic', 'Ene 25', 'Feb 25', 'Mar 25'];
  
  return months.map(month => ({
    month,
    próximos: Math.floor(Math.random() * 20) + 5,
    vencidos: Math.floor(Math.random() * 5)
  }));
};

export const getWarehouseFlowData = (currency: 'PEN' | 'USD') => {
  const exchangeRate = currency === 'USD' ? EXCHANGE_RATE : 1;
  const months = ['Jul', 'Ago', 'Sep'];
  
  return months.map(month => ({
    month,
    entradas: (Math.floor(Math.random() * 50000) + 30000) / exchangeRate,
    salidas: (Math.floor(Math.random() * 40000) + 25000) / exchangeRate
  }));
};

export const getLowStockItems = () => {
  return mockInventoryItems
    .filter(item => item.availableStock <= item.minStock)
    .map(item => {
      const daysOfCoverage = Math.floor(item.availableStock / 5); // Simulate consumption rate
      return {
        ...item,
        daysOfCoverage,
        urgency: daysOfCoverage <= 5 ? 'high' : daysOfCoverage <= 15 ? 'medium' : 'low'
      };
    });
};

// Reports Section Mock Data
export const mockBudgetVsActual: BudgetVsActual[] = [
  {
    category: 'Construcción',
    budgeted: 120000,
    actual: 89450,
    variance: -30550,
    variancePercent: -25.46,
    monthlyData: [
      { month: 'Jul', budgeted: 40000, actual: 35200 },
      { month: 'Ago', budgeted: 40000, actual: 42800 },
      { month: 'Sep', budgeted: 40000, actual: 34200 }
    ]
  },
  {
    category: 'TI',
    budgeted: 80000,
    actual: 95230,
    variance: 15230,
    variancePercent: 19.04,
    monthlyData: [
      { month: 'Jul', budgeted: 26667, actual: 28900 },
      { month: 'Ago', budgeted: 26667, actual: 31200 },
      { month: 'Sep', budgeted: 26667, actual: 35130 }
    ]
  },
  {
    category: 'Ferretería',
    budgeted: 45000,
    actual: 34120,
    variance: -10880,
    variancePercent: -24.18,
    monthlyData: [
      { month: 'Jul', budgeted: 15000, actual: 12400 },
      { month: 'Ago', budgeted: 15000, actual: 11900 },
      { month: 'Sep', budgeted: 15000, actual: 9820 }
    ]
  },
  {
    category: 'Oficina',
    budgeted: 30000,
    actual: 23680,
    variance: -6320,
    variancePercent: -21.07,
    monthlyData: [
      { month: 'Jul', budgeted: 10000, actual: 8900 },
      { month: 'Ago', budgeted: 10000, actual: 7200 },
      { month: 'Sep', budgeted: 10000, actual: 7580 }
    ]
  },
  {
    category: 'Mobiliario',
    budgeted: 25000,
    actual: 31920,
    variance: 6920,
    variancePercent: 27.68,
    monthlyData: [
      { month: 'Jul', budgeted: 8333, actual: 9200 },
      { month: 'Ago', budgeted: 8333, actual: 12800 },
      { month: 'Sep', budgeted: 8333, actual: 9920 }
    ]
  },
  {
    category: 'Mantenimiento',
    budgeted: 20000,
    actual: 18450,
    variance: -1550,
    variancePercent: -7.75,
    monthlyData: [
      { month: 'Jul', budgeted: 6667, actual: 6200 },
      { month: 'Ago', budgeted: 6667, actual: 5900 },
      { month: 'Sep', budgeted: 6667, actual: 6350 }
    ]
  }
];

export const mockSupplierPerformance: SupplierPerformance[] = [
  {
    supplierId: 'SUP-001',
    supplierName: 'Distribuidora Lima SAC',
    orderCount: 15,
    onTimeDeliveryRate: 96.7,
    fillRate: 98.2,
    averageLeadTime: 4.2,
    qualityScore: 94.5,
    totalValue: 125450,
    defectRate: 1.8,
    lastEvaluation: '2024-09-25',
    rating: 'Excelente'
  },
  {
    supplierId: 'SUP-002',
    supplierName: 'Tech Solutions Peru SAC',
    orderCount: 8,
    onTimeDeliveryRate: 92.5,
    fillRate: 95.8,
    averageLeadTime: 6.8,
    qualityScore: 91.2,
    totalValue: 89320,
    defectRate: 2.4,
    lastEvaluation: '2024-09-20',
    rating: 'Excelente'
  },
  {
    supplierId: 'SUP-004',
    supplierName: 'Materiales Express SA',
    orderCount: 22,
    onTimeDeliveryRate: 88.6,
    fillRate: 92.4,
    averageLeadTime: 5.1,
    qualityScore: 87.8,
    totalValue: 203750,
    defectRate: 3.2,
    lastEvaluation: '2024-09-18',
    rating: 'Bueno'
  },
  {
    supplierId: 'SUP-005',
    supplierName: 'Suministros Modernos SAC',
    orderCount: 12,
    onTimeDeliveryRate: 85.2,
    fillRate: 89.6,
    averageLeadTime: 7.3,
    qualityScore: 83.4,
    totalValue: 67890,
    defectRate: 4.1,
    lastEvaluation: '2024-09-15',
    rating: 'Bueno'
  },
  {
    supplierId: 'SUP-007',
    supplierName: 'Productos Químicos SAC',
    orderCount: 10,
    onTimeDeliveryRate: 78.9,
    fillRate: 86.3,
    averageLeadTime: 9.2,
    qualityScore: 79.1,
    totalValue: 98340,
    defectRate: 5.8,
    lastEvaluation: '2024-09-10',
    rating: 'Regular'
  },
  {
    supplierId: 'SUP-008',
    supplierName: 'Textil Peruano SA',
    orderCount: 18,
    onTimeDeliveryRate: 94.1,
    fillRate: 96.7,
    averageLeadTime: 5.8,
    qualityScore: 90.3,
    totalValue: 176540,
    defectRate: 2.9,
    lastEvaluation: '2024-09-22',
    rating: 'Excelente'
  }
];

export const mockProcessEfficiency: ProcessEfficiency[] = [
  {
    stage: 'Solicitud de cotización',
    averageTime: 2.1,
    targetTime: 2.0,
    efficiency: 95.2,
    orderCount: 45,
    bottleneckRisk: 'Bajo'
  },
  {
    stage: 'Revisión y aprobación',
    averageTime: 3.8,
    targetTime: 3.0,
    efficiency: 78.9,
    orderCount: 38,
    bottleneckRisk: 'Medio'
  },
  {
    stage: 'Emisión de OC',
    averageTime: 1.2,
    targetTime: 1.0,
    efficiency: 83.3,
    orderCount: 35,
    bottleneckRisk: 'Bajo'
  },
  {
    stage: 'Confirmación proveedor',
    averageTime: 4.5,
    targetTime: 2.0,
    efficiency: 44.4,
    orderCount: 32,
    bottleneckRisk: 'Alto'
  },
  {
    stage: 'Entrega y recepción',
    averageTime: 6.2,
    targetTime: 5.0,
    efficiency: 80.6,
    orderCount: 28,
    bottleneckRisk: 'Medio'
  },
  {
    stage: 'Validación y cierre',
    averageTime: 2.8,
    targetTime: 2.0,
    efficiency: 71.4,
    orderCount: 25,
    bottleneckRisk: 'Medio'
  }
];

export const mockInventoryRotation: InventoryRotation[] = [
  {
    category: 'Construcción',
    turnoverRate: 8.2,
    daysCoverage: 44,
    averageStock: 450000,
    soldQuantity: 3690000,
    stockValue: 420000,
    abcClass: 'A'
  },
  {
    category: 'TI',
    turnoverRate: 12.5,
    daysCoverage: 29,
    averageStock: 280000,
    soldQuantity: 3500000,
    stockValue: 320000,
    abcClass: 'A'
  },
  {
    category: 'Ferretería',
    turnoverRate: 6.8,
    daysCoverage: 54,
    averageStock: 180000,
    soldQuantity: 1224000,
    stockValue: 165000,
    abcClass: 'B'
  },
  {
    category: 'Oficina',
    turnoverRate: 4.2,
    daysCoverage: 87,
    averageStock: 120000,
    soldQuantity: 504000,
    stockValue: 98000,
    abcClass: 'B'
  },
  {
    category: 'Mobiliario',
    turnoverRate: 3.1,
    daysCoverage: 118,
    averageStock: 95000,
    soldQuantity: 294500,
    stockValue: 89000,
    abcClass: 'C'
  },
  {
    category: 'Mantenimiento',
    turnoverRate: 5.5,
    daysCoverage: 66,
    averageStock: 85000,
    soldQuantity: 467500,
    stockValue: 78000,
    abcClass: 'B'
  }
];

export const mockPriceAnalysis: PriceAnalysis[] = [
  {
    sku: 'CEMENT-001',
    productName: 'Cemento Andino Tipo I',
    supplier: 'Distribuidora Lima SAC',
    currentPrice: 28.50,
    previousPrice: 26.80,
    priceVariation: 6.34,
    discountApplied: 0,
    netPrice: 28.50,
    igvAmount: 5.13,
    totalPrice: 33.63,
    lastPurchaseDate: '2024-09-25'
  },
  {
    sku: 'LAPTOP-HP001',
    productName: 'Laptop HP ProBook 450 G9',
    supplier: 'Tech Solutions Peru SAC',
    currentPrice: 850.00,
    previousPrice: 920.00,
    priceVariation: -7.61,
    discountApplied: 10,
    netPrice: 765.00,
    igvAmount: 137.70,
    totalPrice: 902.70,
    lastPurchaseDate: '2024-09-20'
  },
  {
    sku: 'FIERRO-008',
    productName: 'Fierro corrugado 8mm x 9m',
    supplier: 'Materiales Express SA',
    currentPrice: 42.80,
    previousPrice: 41.20,
    priceVariation: 3.88,
    discountApplied: 5,
    netPrice: 40.66,
    igvAmount: 7.32,
    totalPrice: 47.98,
    lastPurchaseDate: '2024-09-18'
  },
  {
    sku: 'OF-ESCRITORIO01',
    productName: 'Escritorio ejecutivo 120x60cm',
    supplier: 'Suministros Modernos SAC',
    currentPrice: 280.00,
    previousPrice: 275.00,
    priceVariation: 1.82,
    discountApplied: 0,
    netPrice: 280.00,
    igvAmount: 50.40,
    totalPrice: 330.40,
    lastPurchaseDate: '2024-09-15'
  },
  {
    sku: 'HERR-TALADRO01',
    productName: 'Taladro percutor BOSCH GSB 13 RE',
    supplier: 'Materiales Express SA',
    currentPrice: 180.00,
    previousPrice: 185.00,
    priceVariation: -2.70,
    discountApplied: 0,
    netPrice: 180.00,
    igvAmount: 32.40,
    totalPrice: 212.40,
    lastPurchaseDate: '2024-09-12'
  }
];

export const mockReportViews: ReportView[] = [
  {
    id: 'RV-001',
    name: 'Reporte Mensual Gerencia',
    description: 'Vista ejecutiva para presentación mensual a gerencia',
    filters: {
      period: 'Mes',
      currency: 'PEN',
      category: 'Todos',
      supplier: 'Todos',
      warehouse: 'Todos'
    },
    chartType: 'bar',
    createdDate: '2024-09-01',
    isDefault: true
  },
  {
    id: 'RV-002',
    name: 'Análisis TI Trimestral',
    description: 'Seguimiento específico de inversiones en tecnología',
    filters: {
      period: 'Trimestre',
      currency: 'USD',
      category: 'TI',
      supplier: 'Todos',
      warehouse: 'Todos'
    },
    chartType: 'line',
    createdDate: '2024-08-15',
    isDefault: false
  },
  {
    id: 'RV-003',
    name: 'Performance Proveedores Top',
    description: 'Evaluación de proveedores principales por volumen',
    filters: {
      period: 'Trimestre',
      currency: 'PEN',
      category: 'Todos',
      supplier: 'Todos',
      warehouse: 'Todos'
    },
    chartType: 'area',
    createdDate: '2024-09-10',
    isDefault: false
  },
  {
    id: 'RV-004',
    name: 'Control Almacén Lima',
    description: 'Seguimiento específico de operaciones en Lima Centro',
    filters: {
      period: 'Mes',
      currency: 'PEN',
      category: 'Todos',
      supplier: 'Todos',
      warehouse: 'Lima Centro'
    },
    chartType: 'bar',
    createdDate: '2024-09-05',
    isDefault: false
  }
];

// Helper functions for reports
export const getBudgetVarianceByPeriod = (period: string, currency: 'PEN' | 'USD') => {
  const exchangeRate = currency === 'USD' ? EXCHANGE_RATE : 1;
  return mockBudgetVsActual.map(item => ({
    ...item,
    budgeted: item.budgeted / exchangeRate,
    actual: item.actual / exchangeRate,
    variance: item.variance / exchangeRate,
    monthlyData: item.monthlyData.map(month => ({
      ...month,
      budgeted: month.budgeted / exchangeRate,
      actual: month.actual / exchangeRate
    }))
  }));
};

export const getSupplierPerformanceMetrics = () => {
  return mockSupplierPerformance;
};

export const getProcessEfficiencyData = () => {
  return mockProcessEfficiency;
};

export const getInventoryRotationData = () => {
  return mockInventoryRotation;
};

export const getPriceAnalysisData = (currency: 'PEN' | 'USD') => {
  const exchangeRate = currency === 'USD' ? EXCHANGE_RATE : 1;
  return mockPriceAnalysis.map(item => ({
    ...item,
    currentPrice: item.currentPrice / exchangeRate,
    previousPrice: item.previousPrice / exchangeRate,
    netPrice: item.netPrice / exchangeRate,
    igvAmount: item.igvAmount / exchangeRate,
    totalPrice: item.totalPrice / exchangeRate
  }));
};

export const getReportViews = () => {
  return mockReportViews;
};

export const getMonthlySpendingTrend = (currency: 'PEN' | 'USD') => {
  const exchangeRate = currency === 'USD' ? EXCHANGE_RATE : 1;
  const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep'];
  
  return months.map(month => ({
    month,
    gasto: (Math.floor(Math.random() * 200000) + 150000) / exchangeRate,
    presupuesto: (Math.floor(Math.random() * 50000) + 320000) / exchangeRate
  }));
};

export const getCategoryEvolutionData = (currency: 'PEN' | 'USD') => {
  const exchangeRate = currency === 'USD' ? EXCHANGE_RATE : 1;
  const months = ['Jul', 'Ago', 'Sep'];
  
  return months.map(month => ({
    month,
    Construcción: (Math.floor(Math.random() * 50000) + 30000) / exchangeRate,
    TI: (Math.floor(Math.random() * 40000) + 25000) / exchangeRate,
    Ferretería: (Math.floor(Math.random() * 20000) + 15000) / exchangeRate,
    Oficina: (Math.floor(Math.random() * 15000) + 8000) / exchangeRate,
    Mobiliario: (Math.floor(Math.random() * 25000) + 12000) / exchangeRate,
    Mantenimiento: (Math.floor(Math.random() * 12000) + 8000) / exchangeRate
  }));
};