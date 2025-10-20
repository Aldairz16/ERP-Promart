import React, { useState } from 'react';
import { 
  X, 
  Plus, 
  Search, 
  Calendar, 
  Building, 
  CreditCard,
  User,
  Package,
  Trash2,
  AlertCircle
} from 'lucide-react';
import { PurchaseOrderItem } from '../../types';
import { warehouses, mockSuppliers, EXCHANGE_RATE } from '../../data/mockData';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface CreateOrderModalProps {
  currency: 'PEN' | 'USD';
  onClose: () => void;
  onSubmit: (orderData: any) => void;
}

interface OrderFormData {
  supplierRuc: string;
  supplierName: string;
  warehouse: string;
  deliveryAddress: string;
  paymentTerms: string;
  estimatedDelivery: string;
  buyer: string;
  notes: string;
  currency: 'PEN' | 'USD';
  items: PurchaseOrderItem[];
}

const CreateOrderModal: React.FC<CreateOrderModalProps> = ({ currency, onClose, onSubmit }) => {
  const [currentStep, setCurrentStep] = useState<'supplier' | 'details' | 'items' | 'review'>('supplier');
  const [showToast, setShowToast] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<OrderFormData>({
    supplierRuc: '',
    supplierName: '',
    warehouse: '',
    deliveryAddress: '',
    paymentTerms: '30 días',
    estimatedDelivery: '',
    buyer: 'Ana García',
    notes: '',
    currency: currency,
    items: []
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [newItem, setNewItem] = useState<Partial<PurchaseOrderItem>>({
    sku: '',
    description: '',
    quantity: 1,
    unitPrice: 0,
    uom: 'UNID'
  });

  const filteredSuppliers = mockSuppliers.filter((supplier: any) =>
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.ruc.includes(searchTerm)
  );

  const formatAmount = (amount: number) => {
    const value = currency === 'USD' ? amount / EXCHANGE_RATE : amount;
    const symbol = currency === 'USD' ? '$' : 'S/';
    return `${symbol}${value.toLocaleString('es-PE', { 
      minimumFractionDigits: 2,
      maximumFractionDigits: 2 
    })}`;
  };

  const calculateItemTotals = (item: Partial<PurchaseOrderItem>) => {
    const quantity = item.quantity || 0;
    const unitPrice = item.unitPrice || 0;
    const subtotal = quantity * unitPrice;
    const igv = subtotal * 0.18;
    const total = subtotal + igv;
    
    return { subtotal, igv, total };
  };

  const calculateOrderTotals = () => {
    const subtotal = formData.items.reduce((sum, item) => sum + item.subtotal, 0);
    const igv = formData.items.reduce((sum, item) => sum + item.igv, 0);
    const total = subtotal + igv;
    
    return { subtotal, igv, total };
  };

  const handleSupplierSelect = (supplier: any) => {
    setFormData({
      ...formData,
      supplierRuc: supplier.ruc,
      supplierName: supplier.name,
      deliveryAddress: supplier.contact.address
    });
    setCurrentStep('details');
  };

  const handleAddItem = () => {
    if (!newItem.sku || !newItem.description || !newItem.quantity || !newItem.unitPrice) {
      setShowToast('Por favor complete todos los campos del item');
      setTimeout(() => setShowToast(null), 3000);
      return;
    }

    const totals = calculateItemTotals(newItem);
    const item: PurchaseOrderItem = {
      id: `item-${Date.now()}`,
      sku: newItem.sku!,
      description: newItem.description!,
      quantity: newItem.quantity!,
      unitPrice: newItem.unitPrice!,
      uom: newItem.uom!,
      discount: 0,
      ...totals
    };

    setFormData({
      ...formData,
      items: [...formData.items, item]
    });

    setNewItem({
      sku: '',
      description: '',
      quantity: 1,
      unitPrice: 0,
      uom: 'UNID'
    });
  };

  const handleRemoveItem = (itemId: string) => {
    setFormData({
      ...formData,
      items: formData.items.filter(item => item.id !== itemId)
    });
  };

  const handleSubmitOrder = () => {
    if (formData.items.length === 0) {
      setShowToast('Debe agregar al menos un item a la orden');
      setTimeout(() => setShowToast(null), 3000);
      return;
    }

    const totals = calculateOrderTotals();
    const orderData = {
      ...formData,
      ...totals,
      issueDate: new Date().toISOString(),
      status: 'Borrador',
      id: `OC-${Date.now()}`
    };

    onSubmit(orderData);
    onClose();
  };

  const steps = [
    { id: 'supplier', title: 'Proveedor', completed: formData.supplierRuc !== '' },
    { id: 'details', title: 'Detalles', completed: formData.warehouse !== '' && formData.estimatedDelivery !== '' },
    { id: 'items', title: 'Items', completed: formData.items.length > 0 },
    { id: 'review', title: 'Revisión', completed: false }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-dark">
              Nueva Orden de Compra
            </h2>
            <p className="text-sm text-gray-medium mt-1">
              Complete la información para crear una nueva orden de compra
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-main"
          >
            <X size={20} />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                  currentStep === step.id 
                    ? 'bg-primary-main text-white'
                    : step.completed 
                      ? 'bg-success text-white'
                      : 'bg-gray-200 text-gray-600'
                }`}>
                  {step.completed ? '✓' : index + 1}
                </div>
                <span className={`ml-2 text-sm font-medium ${
                  currentStep === step.id 
                    ? 'text-primary-main'
                    : step.completed 
                      ? 'text-success'
                      : 'text-gray-500'
                }`}>
                  {step.title}
                </span>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-px mx-4 ${
                    step.completed ? 'bg-success' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="p-6">
          {currentStep === 'supplier' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-dark">
                Seleccionar Proveedor
              </h3>
              
              <div className="relative">
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por nombre o RUC..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-main focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                {filteredSuppliers.map((supplier) => (
                  <div
                    key={supplier.ruc}
                    onClick={() => handleSupplierSelect(supplier)}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-sm hover:border-primary-main cursor-pointer transition-all"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-gray-dark">{supplier.name}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        supplier.status === 'Activo' ? 'bg-success text-white' : 'bg-gray-400 text-white'
                      }`}>
                        {supplier.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">RUC: {supplier.ruc}</p>
                    <p className="text-sm text-gray-600 mb-2">{supplier.contact.address}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Sector: {supplier.sector}</span>
                      <span>Estado: {supplier.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentStep === 'details' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-dark">
                Detalles de la Orden
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                      <Building size={16} className="mr-2" />
                      Almacén de Destino
                    </label>
                    <select
                      value={formData.warehouse}
                      onChange={(e) => setFormData({ ...formData, warehouse: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-main focus:border-transparent"
                    >
                      <option value="">Seleccionar almacén</option>
                      {warehouses.map((warehouse: string) => (
                        <option key={warehouse} value={warehouse}>{warehouse}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                      <Calendar size={16} className="mr-2" />
                      Fecha de Entrega Estimada
                    </label>
                    <input
                      type="date"
                      value={formData.estimatedDelivery}
                      onChange={(e) => setFormData({ ...formData, estimatedDelivery: e.target.value })}
                      min={format(new Date(), 'yyyy-MM-dd')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-main focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                      <CreditCard size={16} className="mr-2" />
                      Términos de Pago
                    </label>
                    <select
                      value={formData.paymentTerms}
                      onChange={(e) => setFormData({ ...formData, paymentTerms: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-main focus:border-transparent"
                    >
                      <option value="Contado">Contado</option>
                      <option value="15 días">15 días</option>
                      <option value="30 días">30 días</option>
                      <option value="45 días">45 días</option>
                      <option value="60 días">60 días</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                      <User size={16} className="mr-2" />
                      Comprador Asignado
                    </label>
                    <input
                      type="text"
                      value={formData.buyer}
                      onChange={(e) => setFormData({ ...formData, buyer: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-main focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Dirección de Entrega
                    </label>
                    <textarea
                      value={formData.deliveryAddress}
                      onChange={(e) => setFormData({ ...formData, deliveryAddress: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-main focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Notas Adicionales
                    </label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      rows={3}
                      placeholder="Instrucciones especiales, observaciones..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-main focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => setCurrentStep('supplier')}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  ← Volver
                </button>
                <button
                  onClick={() => setCurrentStep('items')}
                  disabled={!formData.warehouse || !formData.estimatedDelivery}
                  className="px-6 py-2 bg-primary-main hover:bg-primary-dark text-white rounded-lg transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Continuar →
                </button>
              </div>
            </div>
          )}

          {currentStep === 'items' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-dark">
                Agregar Items
              </h3>
              
              {/* Add Item Form */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-700 mb-4 flex items-center">
                  <Package size={16} className="mr-2" />
                  Nuevo Item
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-gray-700 mb-1 block">SKU</label>
                    <input
                      type="text"
                      value={newItem.sku}
                      onChange={(e) => setNewItem({ ...newItem, sku: e.target.value })}
                      placeholder="SKU del producto"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-main focus:border-transparent"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Descripción</label>
                    <input
                      type="text"
                      value={newItem.description}
                      onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                      placeholder="Descripción del producto"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-main focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">UOM</label>
                    <select
                      value={newItem.uom}
                      onChange={(e) => setNewItem({ ...newItem, uom: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-main focus:border-transparent"
                    >
                      <option value="UNID">UNID</option>
                      <option value="KG">KG</option>
                      <option value="LT">LT</option>
                      <option value="MT">MT</option>
                      <option value="M2">M2</option>
                      <option value="M3">M3</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Cantidad</label>
                    <input
                      type="number"
                      value={newItem.quantity}
                      onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) || 0 })}
                      min="1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-main focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Precio Unit.</label>
                    <input
                      type="number"
                      value={newItem.unitPrice}
                      onChange={(e) => setNewItem({ ...newItem, unitPrice: parseFloat(e.target.value) || 0 })}
                      min="0"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-main focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <button
                      onClick={handleAddItem}
                      className="w-full flex items-center justify-center px-4 py-2 bg-primary-main hover:bg-primary-dark text-white rounded-lg transition-colors"
                    >
                      <Plus size={16} className="mr-2" />
                      Agregar
                    </button>
                  </div>
                </div>
                
                {newItem.quantity && newItem.unitPrice && (
                  <div className="mt-4 text-sm text-gray-600">
                    <span>Total del item: {formatAmount(calculateItemTotals(newItem).total)}</span>
                  </div>
                )}
              </div>

              {/* Items Table */}
              {formData.items.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-700 mb-4">Items Agregados</h4>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full border border-gray-200 rounded-lg">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="text-left py-3 px-4 font-medium text-gray-600">SKU</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-600">Descripción</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-600">UOM</th>
                          <th className="text-right py-3 px-4 font-medium text-gray-600">Cant.</th>
                          <th className="text-right py-3 px-4 font-medium text-gray-600">P. Unit.</th>
                          <th className="text-right py-3 px-4 font-medium text-gray-600">Total</th>
                          <th className="text-center py-3 px-4 font-medium text-gray-600">Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {formData.items.map((item) => (
                          <tr key={item.id} className="border-t border-gray-200">
                            <td className="py-3 px-4 text-sm font-medium text-gray-700">{item.sku}</td>
                            <td className="py-3 px-4 text-sm text-gray-700">{item.description}</td>
                            <td className="py-3 px-4 text-sm text-gray-600">{item.uom}</td>
                            <td className="py-3 px-4 text-sm text-gray-600 text-right">{item.quantity}</td>
                            <td className="py-3 px-4 text-sm text-gray-600 text-right">{formatAmount(item.unitPrice)}</td>
                            <td className="py-3 px-4 text-sm font-medium text-gray-700 text-right">{formatAmount(item.total)}</td>
                            <td className="py-3 px-4 text-center">
                              <button
                                onClick={() => handleRemoveItem(item.id)}
                                className="p-1 text-alert hover:bg-red-50 rounded transition-colors"
                              >
                                <Trash2 size={16} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="mt-4 flex justify-end">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-sm space-y-1">
                        <div className="flex justify-between">
                          <span>Subtotal:</span>
                          <span>{formatAmount(calculateOrderTotals().subtotal)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>IGV (18%):</span>
                          <span>{formatAmount(calculateOrderTotals().igv)}</span>
                        </div>
                        <div className="flex justify-between font-semibold text-base border-t pt-2">
                          <span>Total:</span>
                          <span>{formatAmount(calculateOrderTotals().total)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-between">
                <button
                  onClick={() => setCurrentStep('details')}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  ← Volver
                </button>
                <button
                  onClick={() => setCurrentStep('review')}
                  disabled={formData.items.length === 0}
                  className="px-6 py-2 bg-primary-main hover:bg-primary-dark text-white rounded-lg transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Revisar →
                </button>
              </div>
            </div>
          )}

          {currentStep === 'review' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-dark">
                Revisión Final
              </h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-700 mb-3">Información del Proveedor</h4>
                    <div className="space-y-2 text-sm">
                      <div><span className="font-medium">Nombre:</span> {formData.supplierName}</div>
                      <div><span className="font-medium">RUC:</span> {formData.supplierRuc}</div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-700 mb-3">Detalles de Entrega</h4>
                    <div className="space-y-2 text-sm">
                      <div><span className="font-medium">Almacén:</span> {formData.warehouse}</div>
                      <div><span className="font-medium">Fecha estimada:</span> {format(new Date(formData.estimatedDelivery), 'dd/MM/yyyy', { locale: es })}</div>
                      <div><span className="font-medium">Términos pago:</span> {formData.paymentTerms}</div>
                      <div><span className="font-medium">Comprador:</span> {formData.buyer}</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-700 mb-3">Resumen de Items</h4>
                    <div className="space-y-2 text-sm">
                      <div><span className="font-medium">Total items:</span> {formData.items.length}</div>
                      <div><span className="font-medium">Cantidad total:</span> {formData.items.reduce((sum, item) => sum + item.quantity, 0)}</div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-700 mb-3">Resumen Financiero</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>{formatAmount(calculateOrderTotals().subtotal)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>IGV (18%):</span>
                        <span>{formatAmount(calculateOrderTotals().igv)}</span>
                      </div>
                      <div className="flex justify-between font-semibold border-t pt-2">
                        <span>Total:</span>
                        <span>{formatAmount(calculateOrderTotals().total)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {formData.notes && (
                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-700 mb-2 flex items-center">
                    <AlertCircle size={16} className="mr-2 text-yellow-600" />
                    Notas Adicionales
                  </h4>
                  <p className="text-sm text-gray-700">{formData.notes}</p>
                </div>
              )}

              <div className="flex justify-between">
                <button
                  onClick={() => setCurrentStep('items')}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  ← Volver
                </button>
                <button
                  onClick={handleSubmitOrder}
                  className="px-6 py-2 bg-success hover:bg-green-700 text-white rounded-lg transition-colors"
                >
                  Crear Orden de Compra
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Toast notification */}
        {showToast && (
          <div className="fixed bottom-4 right-4 bg-alert text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-pulse">
            {showToast}
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateOrderModal;