import React, { useState } from 'react';
import { 
  X, 
  Package, 
  Truck, 
  Edit, 
  BarChart3,
  Search,
  Plus,
  Minus
} from 'lucide-react';
import { InventoryItem } from '../../types';
import { inventoryWarehouses, EXCHANGE_RATE } from '../../data/mockData';

interface StockOperationsModalProps {
  type: 'receipt' | 'transfer' | 'adjustment' | 'count';
  item: InventoryItem | null;
  currency: 'PEN' | 'USD';
  onClose: () => void;
}

const StockOperationsModal: React.FC<StockOperationsModalProps> = ({
  type,
  item,
  currency,
  onClose
}) => {
  const [formData, setFormData] = useState({
    // Receipt fields
    purchaseOrder: '',
    quantityReceived: 0,
    quantityExpected: 0,
    warehouse: item?.warehouse || '',
    location: item?.location || '',
    
    // Transfer fields
    fromWarehouse: item?.warehouse || '',
    fromLocation: item?.location || '',
    toWarehouse: '',
    toLocation: '',
    transferQuantity: 0,
    transferReason: '',
    
    // Adjustment fields
    adjustmentType: 'increase',
    adjustmentQuantity: 0,
    adjustmentReason: 'Recuento',
    adjustmentComment: '',
    
    // Count fields
    systemQuantity: item?.availableStock || 0,
    countedQuantity: 0,
    countReason: '',
    
    // Common fields
    notes: ''
  });

  const [showToast, setShowToast] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<InventoryItem[]>(item ? [item] : []);

  const formatAmount = (amount: number) => {
    const value = currency === 'USD' ? amount / EXCHANGE_RATE : amount;
    const symbol = currency === 'USD' ? '$' : 'S/';
    return `${symbol}${value.toLocaleString('es-PE', { 
      minimumFractionDigits: 2,
      maximumFractionDigits: 2 
    })}`;
  };

  const getTitle = () => {
    switch (type) {
      case 'receipt':
        return 'Registrar Recepción';
      case 'transfer':
        return 'Transferencia entre Almacenes';
      case 'adjustment':
        return 'Ajuste de Stock';
      case 'count':
        return 'Recuento Cíclico';
      default:
        return 'Operación de Stock';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'receipt':
        return <Package size={20} className="text-primary-main" />;
      case 'transfer':
        return <Truck size={20} className="text-blue-500" />;
      case 'adjustment':
        return <Edit size={20} className="text-yellow-500" />;
      case 'count':
        return <BarChart3 size={20} className="text-purple-500" />;
      default:
        return <Package size={20} className="text-gray-500" />;
    }
  };

  const handleSubmit = async () => {
    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    let message = '';
    switch (type) {
      case 'receipt':
        message = `Recepción registrada: ${formData.quantityReceived} unidades`;
        break;
      case 'transfer':
        message = `Transferencia iniciada: ${formData.transferQuantity} unidades`;
        break;
      case 'adjustment':
        message = `Ajuste procesado: ${formData.adjustmentType === 'increase' ? '+' : '-'}${formData.adjustmentQuantity} unidades`;
        break;
      case 'count':
        const variance = formData.countedQuantity - formData.systemQuantity;
        message = `Recuento completado. Diferencia: ${variance > 0 ? '+' : ''}${variance} unidades`;
        break;
    }
    
    setShowToast(message);
    setTimeout(() => {
      setShowToast(null);
      onClose();
    }, 2000);
  };

  const addItemToOperation = () => {
    // This would open an item selector in a real implementation
    console.log('Opening item selector...');
  };

  const removeItemFromOperation = (itemId: string) => {
    setSelectedItems(prev => prev.filter(item => item.id !== itemId));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            {getIcon()}
            <div>
              <h2 className="text-xl font-semibold text-gray-dark">{getTitle()}</h2>
              <p className="text-sm text-gray-medium mt-1">
                {item ? `Item: ${item.sku} - ${item.description}` : 'Operación múltiple'}
              </p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-main"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          {type === 'receipt' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Orden de Compra
                  </label>
                  <input
                    type="text"
                    value={formData.purchaseOrder}
                    onChange={(e) => setFormData({ ...formData, purchaseOrder: e.target.value })}
                    placeholder="OC-2024-001"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-main focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Almacén Destino
                  </label>
                  <select
                    value={formData.warehouse}
                    onChange={(e) => setFormData({ ...formData, warehouse: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-main focus:border-transparent"
                  >
                    {inventoryWarehouses.map(warehouse => (
                      <option key={warehouse.code} value={warehouse.name}>{warehouse.fullName}</option>
                    ))}
                  </select>
                </div>
              </div>

              {item && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-700 mb-3">Item a Recibir</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Cantidad Esperada
                      </label>
                      <input
                        type="number"
                        value={formData.quantityExpected}
                        onChange={(e) => setFormData({ ...formData, quantityExpected: parseInt(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-main focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Cantidad Recibida
                      </label>
                      <input
                        type="number"
                        value={formData.quantityReceived}
                        onChange={(e) => setFormData({ ...formData, quantityReceived: parseInt(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-main focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Ubicación
                      </label>
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        placeholder="A-01-15"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-main focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {type === 'transfer' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Origin */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-700 mb-3">Origen</h4>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Almacén Origen
                      </label>
                      <select
                        value={formData.fromWarehouse}
                        onChange={(e) => setFormData({ ...formData, fromWarehouse: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-main focus:border-transparent"
                      >
                        {inventoryWarehouses.map(warehouse => (
                          <option key={warehouse.code} value={warehouse.name}>{warehouse.fullName}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Ubicación Origen
                      </label>
                      <input
                        type="text"
                        value={formData.fromLocation}
                        onChange={(e) => setFormData({ ...formData, fromLocation: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-main focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Destination */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-700 mb-3">Destino</h4>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Almacén Destino
                      </label>
                      <select
                        value={formData.toWarehouse}
                        onChange={(e) => setFormData({ ...formData, toWarehouse: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-main focus:border-transparent"
                      >
                        <option value="">Seleccionar almacén</option>
                        {inventoryWarehouses.map(warehouse => (
                          <option key={warehouse.code} value={warehouse.name}>{warehouse.fullName}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Ubicación Destino
                      </label>
                      <input
                        type="text"
                        value={formData.toLocation}
                        onChange={(e) => setFormData({ ...formData, toLocation: e.target.value })}
                        placeholder="B-02-10"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-main focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cantidad a Transferir
                  </label>
                  <input
                    type="number"
                    value={formData.transferQuantity}
                    onChange={(e) => setFormData({ ...formData, transferQuantity: parseInt(e.target.value) })}
                    max={item?.availableStock || 0}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-main focus:border-transparent"
                  />
                  {item && (
                    <p className="text-sm text-gray-500 mt-1">
                      Disponible: {item.availableStock.toLocaleString()}
                    </p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Motivo de Transferencia
                  </label>
                  <select
                    value={formData.transferReason}
                    onChange={(e) => setFormData({ ...formData, transferReason: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-main focus:border-transparent"
                  >
                    <option value="">Seleccionar motivo</option>
                    <option value="Reposición">Reposición de stock</option>
                    <option value="Redistribución">Redistribución</option>
                    <option value="Optimización">Optimización de espacio</option>
                    <option value="Demanda">Alta demanda</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {type === 'adjustment' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Ajuste
                  </label>
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="increase"
                        checked={formData.adjustmentType === 'increase'}
                        onChange={(e) => setFormData({ ...formData, adjustmentType: e.target.value as 'increase' | 'decrease' })}
                        className="mr-2"
                      />
                      <Plus size={16} className="text-green-500 mr-1" />
                      Incremento
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="decrease"
                        checked={formData.adjustmentType === 'decrease'}
                        onChange={(e) => setFormData({ ...formData, adjustmentType: e.target.value as 'increase' | 'decrease' })}
                        className="mr-2"
                      />
                      <Minus size={16} className="text-red-500 mr-1" />
                      Decremento
                    </label>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cantidad a Ajustar
                  </label>
                  <input
                    type="number"
                    value={formData.adjustmentQuantity}
                    onChange={(e) => setFormData({ ...formData, adjustmentQuantity: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-main focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Motivo del Ajuste
                  </label>
                  <select
                    value={formData.adjustmentReason}
                    onChange={(e) => setFormData({ ...formData, adjustmentReason: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-main focus:border-transparent"
                  >
                    <option value="Recuento">Recuento físico</option>
                    <option value="Merma">Merma</option>
                    <option value="Daño">Producto dañado</option>
                    <option value="Pérdida">Pérdida</option>
                    <option value="Corrección">Corrección de sistema</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Comentarios
                  </label>
                  <textarea
                    value={formData.adjustmentComment}
                    onChange={(e) => setFormData({ ...formData, adjustmentComment: e.target.value })}
                    rows={3}
                    placeholder="Detalles del ajuste..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-main focus:border-transparent"
                  />
                </div>
              </div>

              {item && (
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-700 mb-2">Impacto del Ajuste</h4>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Stock Actual:</span>
                      <p className="font-semibold">{item.availableStock.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Stock Final:</span>
                      <p className="font-semibold">
                        {(item.availableStock + (formData.adjustmentType === 'increase' ? formData.adjustmentQuantity : -formData.adjustmentQuantity)).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600">Impacto Valor:</span>
                      <p className="font-semibold">
                        {formatAmount(item.unitCost * (formData.adjustmentType === 'increase' ? formData.adjustmentQuantity : -formData.adjustmentQuantity))}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {type === 'count' && (
            <div className="space-y-6">
              {!item && (
                <div>
                  <button
                    onClick={addItemToOperation}
                    className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Search size={16} />
                    <span>Seleccionar Items para Contar</span>
                  </button>
                </div>
              )}

              {selectedItems.map((countItem) => (
                <div key={countItem.id} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-medium text-gray-700">{countItem.sku}</h4>
                      <p className="text-sm text-gray-600">{countItem.description}</p>
                      <p className="text-sm text-gray-500">{countItem.warehouse} - {countItem.location}</p>
                    </div>
                    {!item && (
                      <button
                        onClick={() => removeItemFromOperation(countItem.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Cantidad Sistema
                      </label>
                      <input
                        type="number"
                        value={countItem.availableStock}
                        disabled
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Cantidad Contada
                      </label>
                      <input
                        type="number"
                        value={formData.countedQuantity}
                        onChange={(e) => setFormData({ ...formData, countedQuantity: parseInt(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-main focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Diferencia
                      </label>
                      <input
                        type="number"
                        value={formData.countedQuantity - countItem.availableStock}
                        disabled
                        className={`w-full px-3 py-2 border border-gray-300 rounded-lg ${
                          formData.countedQuantity - countItem.availableStock === 0 ? 'bg-green-50' :
                          formData.countedQuantity - countItem.availableStock > 0 ? 'bg-blue-50' : 'bg-red-50'
                        }`}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notas Adicionales
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              placeholder="Observaciones adicionales..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-main focus:border-transparent"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancelar
            </button>
            
            <button
              onClick={handleSubmit}
              className="px-6 py-2 bg-primary-main hover:bg-primary-dark text-white rounded-lg transition-colors"
            >
              {type === 'receipt' ? 'Registrar Recepción' :
               type === 'transfer' ? 'Iniciar Transferencia' :
               type === 'adjustment' ? 'Procesar Ajuste' :
               'Completar Recuento'}
            </button>
          </div>
        </div>

        {/* Toast notification */}
        {showToast && (
          <div className="fixed bottom-4 right-4 bg-success text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-pulse">
            {showToast}
          </div>
        )}
      </div>
    </div>
  );
};

export default StockOperationsModal;