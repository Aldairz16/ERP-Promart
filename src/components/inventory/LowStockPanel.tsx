import React, { useState } from 'react';
import { 
  X, 
  AlertTriangle, 
  ShoppingCart, 
  Clock, 
  Package,
  TrendingDown,
  CheckCircle2
} from 'lucide-react';
import { getLowStockItems, EXCHANGE_RATE } from '../../data/mockData';

interface LowStockPanelProps {
  currency: 'PEN' | 'USD';
  onClose: () => void;
  onGeneratePurchaseOrder: () => void;
}

const LowStockPanel: React.FC<LowStockPanelProps> = ({
  currency,
  onClose,
  onGeneratePurchaseOrder
}) => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const lowStockItems = getLowStockItems();

  const formatAmount = (amount: number) => {
    const value = currency === 'USD' ? amount / EXCHANGE_RATE : amount;
    const symbol = currency === 'USD' ? '$' : 'S/';
    return `${symbol}${value.toLocaleString('es-PE', { 
      minimumFractionDigits: 2,
      maximumFractionDigits: 2 
    })}`;
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default:
        return 'text-green-600 bg-green-50 border-green-200';
    }
  };

  const getUrgencyIcon = (urgency: string) => {
    switch (urgency) {
      case 'high':
        return <AlertTriangle size={14} />;
      case 'medium':
        return <Clock size={14} />;
      default:
        return <CheckCircle2 size={14} />;
    }
  };

  const getUrgencyLabel = (urgency: string) => {
    switch (urgency) {
      case 'high':
        return 'Crítico';
      case 'medium':
        return 'Medio';
      default:
        return 'Bajo';
    }
  };

  const handleSelectAll = () => {
    if (selectedItems.length === lowStockItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(lowStockItems.map(item => item.id));
    }
  };

  const handleSelectItem = (itemId: string) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const calculateReorderQuantity = (item: any) => {
    // Simple reorder calculation: bring stock to reorder point + safety buffer
    const safetyBuffer = Math.ceil(item.reorderPoint * 0.2);
    return Math.max(0, item.reorderPoint + safetyBuffer - item.availableStock);
  };

  const selectedItemsData = lowStockItems.filter(item => selectedItems.includes(item.id));
  const totalReorderValue = selectedItemsData.reduce((sum, item) => {
    const reorderQty = calculateReorderQuantity(item);
    return sum + (reorderQty * item.unitCost);
  }, 0);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-red-500 flex items-center justify-center">
              <AlertTriangle size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-dark">Stock Bajo</h2>
              <p className="text-sm text-gray-medium mt-1">
                {lowStockItems.length} productos requieren reposición
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

        {/* Summary Cards */}
        <div className="p-6 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-red-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-red-600">Críticos</p>
                  <p className="text-2xl font-bold text-red-700">
                    {lowStockItems.filter(item => item.urgency === 'high').length}
                  </p>
                </div>
                <AlertTriangle size={24} className="text-red-500" />
              </div>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-yellow-600">Urgencia Media</p>
                  <p className="text-2xl font-bold text-yellow-700">
                    {lowStockItems.filter(item => item.urgency === 'medium').length}
                  </p>
                </div>
                <Clock size={24} className="text-yellow-500" />
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600">Valor Total Reorden</p>
                  <p className="text-2xl font-bold text-blue-700">
                    {formatAmount(totalReorderValue)}
                  </p>
                </div>
                <TrendingDown size={24} className="text-blue-500" />
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600">Items Seleccionados</p>
                  <p className="text-2xl font-bold text-green-700">
                    {selectedItems.length}
                  </p>
                </div>
                <Package size={24} className="text-green-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-dark">
              Items con Stock Bajo
            </h3>
            
            <div className="flex space-x-3">
              <button
                onClick={handleSelectAll}
                className="btn-secondary text-sm"
              >
                {selectedItems.length === lowStockItems.length ? 'Deseleccionar Todo' : 'Seleccionar Todo'}
              </button>
              
              <button
                onClick={onGeneratePurchaseOrder}
                disabled={selectedItems.length === 0}
                className="flex items-center space-x-2 px-4 py-2 bg-primary-main hover:bg-primary-dark text-white rounded-lg transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                <ShoppingCart size={16} />
                <span>Generar Propuesta de Compra</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border border-gray-200 rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="w-12 px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedItems.length === lowStockItems.length && lowStockItems.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-primary-main focus:ring-primary-main"
                    />
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Urgencia</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">SKU</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Descripción</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Almacén</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-600">Stock Actual</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-600">Stock Mín.</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-600">Días Cobertura</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-600">Cant. Reorden</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-600">Valor Reorden</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Proveedor</th>
                </tr>
              </thead>
              
              <tbody className="bg-white divide-y divide-gray-200">
                {lowStockItems.map((item) => {
                  const reorderQuantity = calculateReorderQuantity(item);
                  const reorderValue = reorderQuantity * item.unitCost;
                  
                  return (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(item.id)}
                          onChange={() => handleSelectItem(item.id)}
                          className="rounded border-gray-300 text-primary-main focus:ring-primary-main"
                        />
                      </td>
                      
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getUrgencyColor(item.urgency)}`}>
                          {getUrgencyIcon(item.urgency)}
                          <span className="ml-1">{getUrgencyLabel(item.urgency)}</span>
                        </div>
                      </td>
                      
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{item.sku}</div>
                        <div className="text-sm text-gray-500">{item.category}</div>
                      </td>
                      
                      <td className="px-4 py-4">
                        <div className="text-sm text-gray-900">{item.description}</div>
                        <div className="text-sm text-gray-500">{item.brand}</div>
                      </td>
                      
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div>{item.warehouse}</div>
                        <div className="text-xs text-gray-400">{item.location}</div>
                      </td>
                      
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                        {item.availableStock.toLocaleString()}
                      </td>
                      
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                        {item.minStock.toLocaleString()}
                      </td>
                      
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-right">
                        <span className={`font-medium ${
                          item.daysOfCoverage <= 5 ? 'text-red-600' :
                          item.daysOfCoverage <= 15 ? 'text-yellow-600' :
                          'text-green-600'
                        }`}>
                          {item.daysOfCoverage} días
                        </span>
                      </td>
                      
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                        {reorderQuantity.toLocaleString()}
                      </td>
                      
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                        {formatAmount(reorderValue)}
                      </td>
                      
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.preferredSupplier}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Selected Items Summary */}
          {selectedItems.length > 0 && (
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-800 mb-3">
                Resumen de Propuesta de Compra
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-blue-600">Items seleccionados:</span>
                  <p className="font-semibold text-blue-800">{selectedItems.length}</p>
                </div>
                
                <div>
                  <span className="text-blue-600">Cantidad total:</span>
                  <p className="font-semibold text-blue-800">
                    {selectedItemsData.reduce((sum, item) => sum + calculateReorderQuantity(item), 0).toLocaleString()} unidades
                  </p>
                </div>
                
                <div>
                  <span className="text-blue-600">Valor total:</span>
                  <p className="font-semibold text-blue-800">
                    {formatAmount(totalReorderValue)}
                  </p>
                </div>
              </div>
              
              <div className="mt-3">
                <span className="text-blue-600 text-sm">Proveedores involucrados:</span>
                <p className="text-sm text-blue-700">
                  {Array.from(new Set(selectedItemsData.map(item => item.preferredSupplier))).join(', ')}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LowStockPanel;