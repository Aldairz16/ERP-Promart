export interface KPIData {
  title: string;
  value: string;
  caption: string;
  trend?: {
    direction: 'up' | 'down' | 'neutral';
    percentage: number;
  };
  miniChart?: number[];
}

export interface Order {
  id: string;
  supplier: string;
  date: string;
  status: 'Pendiente' | 'Aprobada' | 'Rechazada' | 'En Proceso';
  amount: number;
  currency: 'PEN' | 'USD';
}

export interface Notification {
  id: string;
  type: 'order_approved' | 'stock_alert' | 'supplier_updated' | 'reception_registered' | 'budget_alert' | 'payment_due';
  title: string;
  description: string;
  timestamp: string;
  isRead: boolean;
  actionUrl?: string;
}

export interface Activity {
  id: string;
  type: 'approval' | 'supplier' | 'stock';
  description: string;
  timestamp: string;
  status: 'success' | 'warning' | 'error';
}

export interface StockItem {
  id: string;
  name: string;
  currentStock: number;
  minStock: number;
  unit: string;
  category: string;
}

export interface Currency {
  code: 'PEN' | 'USD';
  symbol: string;
  rate: number; // Rate to PEN
}

export interface Supplier {
  id: number;
  name: string;
  ruc: string;
  sector: string;
  status: 'Activo' | 'En evaluación' | 'Suspendido';
  registrationDate: string;
  lastOrder: string | null;
  totalBilled: number;
  currency: 'PEN' | 'USD';
  contact: {
    phone: string;
    email: string;
    address: string;
  };
  representative: string;
}

export interface SupplierFilters {
  search: string;
  status: string;
  sector: string;
  dateRange: string;
}

export interface PurchaseOrderItem {
  id: string;
  sku: string;
  description: string;
  uom: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  subtotal: number;
  igv: number;
  total: number;
  notes?: string;
}

export interface PurchaseOrder {
  id: string;
  supplierId: string;
  supplierName: string;
  supplierRuc: string;
  issueDate: string;
  estimatedDelivery: string;
  warehouse: string;
  buyer: string;
  currency: 'PEN' | 'USD';
  paymentTerms: string;
  status: 'Borrador' | 'En aprobación' | 'Aprobada' | 'Enviada' | 'Recibida parcial' | 'Recibida total' | 'Cerrada' | 'Anulada';
  category: string;
  items: PurchaseOrderItem[];
  subtotal: number;
  igv: number;
  total: number;
  deliveryAddress: string;
  notes?: string;
  approvalHistory: ApprovalRecord[];
  timeline: TimelineEvent[];
  attachments: AttachmentFile[];
}

export interface ApprovalRecord {
  id: string;
  user: string;
  action: 'Aprobada' | 'Rechazada' | 'Comentario';
  date: string;
  comment?: string;
}

export interface TimelineEvent {
  id: string;
  stage: 'Creada' | 'Aprobación' | 'Enviada' | 'Recibo' | 'Factura' | 'Cierre';
  date: string;
  user: string;
  completed: boolean;
}

export interface AttachmentFile {
  id: string;
  name: string;
  type: 'PDF' | 'Excel' | 'Imagen';
  size: string;
  uploadDate: string;
}

export interface OrderFilters {
  search: string;
  status: string;
  supplier: string;
  dateRange: string;
  warehouse: string;
  category: string;
  currency: string;
}

export type TimePeriod = 'Semana' | 'Mes' | 'Trimestre';

// Inventory Types
export interface InventoryItem {
  id: string;
  sku: string;
  description: string;
  category: string;
  brand: string;
  uom: string;
  status: 'Activo' | 'Inactivo';
  warehouse: string;
  location: string; // Bin/Ubicación
  availableStock: number;
  committedStock: number;
  minStock: number;
  reorderPoint: number;
  unitCost: number;
  totalValue: number;
  lastMovement: string;
  batch?: string;
  serialNumber?: string;
  expiryDate?: string;
  abcClass: 'A' | 'B' | 'C';
  leadTimeDays: number;
  preferredSupplier: string;
  image?: string;
}

export interface WarehouseLocation {
  id: string;
  warehouse: string;
  warehouseCode: string;
  aisle: string;
  shelf: string;
  bin: string;
  fullLocation: string; // e.g., "A-01-15"
  capacity: number;
  usedCapacity: number;
  utilization: number; // percentage
}

export interface StockMovement {
  id: string;
  date: string;
  type: 'Entrada OC' | 'Transferencia' | 'Ajuste' | 'Devolución' | 'Salida venta' | 'Merma';
  relatedDocument?: string;
  quantityIn: number;
  quantityOut: number;
  balance: number;
  unitCost: number;
  totalValue: number;
  reason?: string;
  user: string;
}

export interface StockTransfer {
  id: string;
  date: string;
  fromWarehouse: string;
  toWarehouse: string;
  fromLocation: string;
  toLocation: string;
  items: TransferItem[];
  status: 'En tránsito' | 'Recibido' | 'Cancelado';
  requestedBy: string;
  notes?: string;
}

export interface TransferItem {
  itemId: string;
  sku: string;
  description: string;
  quantityRequested: number;
  quantityReceived?: number;
  uom: string;
}

export interface StockAdjustment {
  id: string;
  date: string;
  itemId: string;
  warehouse: string;
  location: string;
  reason: 'Merma' | 'Daño' | 'Pérdida' | 'Recuento' | 'Corrección';
  quantityBefore: number;
  quantityAfter: number;
  adjustment: number;
  unitCost: number;
  totalImpact: number;
  comment?: string;
  approvedBy: string;
}

export interface CycleCount {
  id: string;
  date: string;
  warehouse: string;
  location?: string;
  status: 'Planificado' | 'En progreso' | 'Completado' | 'Diferencias';
  items: CycleCountItem[];
  plannedBy: string;
  countedBy?: string;
  reviewedBy?: string;
}

export interface CycleCountItem {
  itemId: string;
  sku: string;
  description: string;
  systemQty: number;
  countedQty?: number;
  variance?: number;
  variancePercent?: number;
  notes?: string;
}

export interface InventoryFilters {
  search: string;
  warehouse: string;
  category: string;
  brand: string;
  status: string;
  stockLevel: 'bajo' | 'ok' | 'sobrestock' | '';
  abcClass: string;
}

export interface WarehouseCapacity {
  warehouse: string;
  totalCapacity: number;
  usedCapacity: number;
  utilization: number;
  entriesThisPeriod: number;
  exitsThisPeriod: number;
}

// Reports Section Types
export interface ReportFilter {
  period: TimePeriod | 'Rango personalizado';
  startDate?: string;
  endDate?: string;
  currency: 'PEN' | 'USD';
  category?: string;
  supplier?: string;
  warehouse?: string;
  status?: string;
}

export interface BudgetVsActual {
  category: string;
  budgeted: number;
  actual: number;
  variance: number;
  variancePercent: number;
  monthlyData: {
    month: string;
    budgeted: number;
    actual: number;
  }[];
}

export interface SupplierPerformance {
  supplierId: string;
  supplierName: string;
  orderCount: number;
  onTimeDeliveryRate: number;
  fillRate: number;
  averageLeadTime: number;
  qualityScore: number;
  totalValue: number;
  defectRate: number;
  lastEvaluation: string;
  rating: 'Excelente' | 'Bueno' | 'Regular' | 'Deficiente';
}

export interface ProcessEfficiency {
  stage: string;
  averageTime: number;
  targetTime: number;
  efficiency: number;
  orderCount: number;
  bottleneckRisk: 'Alto' | 'Medio' | 'Bajo';
}

export interface InventoryRotation {
  category: string;
  turnoverRate: number;
  daysCoverage: number;
  averageStock: number;
  soldQuantity: number;
  stockValue: number;
  abcClass: 'A' | 'B' | 'C';
}

export interface PriceAnalysis {
  sku: string;
  productName: string;
  supplier: string;
  currentPrice: number;
  previousPrice: number;
  priceVariation: number;
  discountApplied: number;
  netPrice: number;
  igvAmount: number;
  totalPrice: number;
  lastPurchaseDate: string;
}

export interface ReportView {
  id: string;
  name: string;
  description: string;
  filters: ReportFilter;
  chartType: 'bar' | 'line' | 'pie' | 'area';
  createdDate: string;
  isDefault?: boolean;
}