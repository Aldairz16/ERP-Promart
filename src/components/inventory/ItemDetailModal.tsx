import React, { useState } from 'react';
import { 
  X, 
  Package, 
  MapPin, 
  Calendar, 
  TrendingUp, 
  BarChart3,
  AlertTriangle,
  RefreshCw,
  Edit
} from 'lucide-react';
import { InventoryItem } from '../../types';
import { mockStockMovements, EXCHANGE_RATE } from '../../data/mockData';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface ItemDetailModalProps {
  item: InventoryItem;
  currency: 'PEN' | 'USD';
  onClose: () => void;
  onStockOperation: (type: 'receipt' | 'transfer' | 'adjustment' | 'count', item: InventoryItem) => void;
}

const ItemDetailModal: React.FC<ItemDetailModalProps> = ({ 
  item, 
  currency, 
  onClose, 
  onStockOperation 
}) => {
  const [activeTab, setActiveTab] = useState<'details' | 'kardex' | 'analytics'>('details');

  const formatAmount = (amount: number) => {
    const value = currency === 'USD' ? amount / EXCHANGE_RATE : amount;
    const symbol = currency === 'USD' ? '$' : 'S/';
    return `${symbol}${value.toLocaleString('es-PE', { 
      minimumFractionDigits: 2,
      maximumFractionDigits: 2 
    })}`;
  };

  const getStockStatus = () => {
    if (item.availableStock <= item.minStock) {
      return { status: 'Bajo', color: 'text-red-600 bg-red-50', icon: AlertTriangle };
    }
    if (item.availableStock > item.reorderPoint * 2) {
      return { status: 'Sobrestock', color: 'text-yellow-600 bg-yellow-50', icon: TrendingUp };
    }
    return { status: 'Normal', color: 'text-green-600 bg-green-50', icon: Package };
  };

  const stockStatus = getStockStatus();
  const StatusIcon = stockStatus.icon;

  // Mock rotation data for the chart
  const rotationData = [45, 52, 38, 61, 55, 67, 43, 58, 72, 65, 48, 56];
  const consumptionData = [12, 15, 8, 18, 14, 22, 11, 16, 25, 19, 13, 17];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
              {item.image ? (
                <img src={item.image} alt={item.description} className="w-full h-full object-cover" />
              ) : (
                <Package size={24} className="text-gray-400" />
              )}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-dark">{item.sku}</h2>
              <p className="text-sm text-gray-medium mt-1">{item.description}</p>
              <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-2 ${stockStatus.color}`}>
                <StatusIcon size={14} className="mr-1" />
                Stock {stockStatus.status}
              </div>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-main"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('details')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'details'
                  ? 'border-primary-main text-primary-main'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Datos Maestros
            </button>
            <button
              onClick={() => setActiveTab('kardex')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'kardex'
                  ? 'border-primary-main text-primary-main'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Kardex
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'analytics'
                  ? 'border-primary-main text-primary-main'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Análitica
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'details' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Product Information */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-dark mb-4">Información del Producto</h3>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-600">SKU</label>
                        <p className="text-sm text-gray-900">{item.sku}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Categoría</label>
                        <p className="text-sm text-gray-900">{item.category}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-600">Marca</label>
                        <p className="text-sm text-gray-900">{item.brand}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Unidad de Medida</label>
                        <p className="text-sm text-gray-900">{item.uom}</p>
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-600">Descripción</label>
                      <p className="text-sm text-gray-900">{item.description}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-600">Clase ABC</label>
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                          item.abcClass === 'A' ? 'bg-red-100 text-red-800' :
                          item.abcClass === 'B' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          Clase {item.abcClass}
                        </span>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Estado</label>
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                          item.status === 'Activo' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {item.status}
                        </span>
                      </div>
                    </div>

                    {item.batch && (
                      <div>
                        <label className="text-sm font-medium text-gray-600">Lote</label>
                        <p className="text-sm text-gray-900">{item.batch}</p>
                      </div>
                    )}

                    {item.serialNumber && (
                      <div>
                        <label className="text-sm font-medium text-gray-600">Número de Serie</label>
                        <p className="text-sm text-gray-900">{item.serialNumber}</p>
                      </div>
                    )}

                    {item.expiryDate && (
                      <div>
                        <label className="text-sm font-medium text-gray-600">Fecha de Vencimiento</label>
                        <p className="text-sm text-gray-900">
                          {format(new Date(item.expiryDate), 'dd/MM/yyyy', { locale: es })}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Supplier Info */}
                <div>
                  <h4 className="text-md font-medium text-gray-dark mb-3">Información de Proveedor</h4>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Proveedor Preferente</label>
                      <p className="text-sm text-gray-900">{item.preferredSupplier}</p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-600">Lead Time</label>
                      <p className="text-sm text-gray-900">{item.leadTimeDays} días</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stock Information */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-dark mb-4">Stock por Almacén</h3>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <MapPin size={16} className="text-gray-500 mr-2" />
                        <span className="font-medium text-gray-700">{item.warehouse}</span>
                      </div>
                      <span className="text-sm text-gray-500">{item.location}</span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <label className="text-gray-600">Stock Disponible</label>
                        <p className="font-semibold text-gray-900">{item.availableStock.toLocaleString()}</p>
                      </div>
                      <div>
                        <label className="text-gray-600">Stock Comprometido</label>
                        <p className="font-semibold text-gray-900">{item.committedStock.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-md font-medium text-gray-dark mb-3">Puntos de Reorden</h4>
                  
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-600">Stock Mínimo</label>
                        <p className="text-sm text-gray-900">{item.minStock.toLocaleString()}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Punto de Reorden</label>
                        <p className="text-sm text-gray-900">{item.reorderPoint.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-md font-medium text-gray-dark mb-3">Valorización</h4>
                  
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-600">Costo Unitario</label>
                        <p className="text-sm font-semibold text-gray-900">{formatAmount(item.unitCost)}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Valor Total</label>
                        <p className="text-sm font-semibold text-gray-900">{formatAmount(item.totalValue)}</p>
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-600">Último Movimiento</label>
                      <p className="text-sm text-gray-900">
                        {format(new Date(item.lastMovement), 'dd/MM/yyyy HH:mm', { locale: es })}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <button
                    onClick={() => onStockOperation('adjustment', item)}
                    className="flex items-center space-x-2 px-4 py-2 bg-primary-main hover:bg-primary-dark text-white rounded-lg transition-colors"
                  >
                    <Edit size={16} />
                    <span>Ajustar Stock</span>
                  </button>
                  
                  <button
                    onClick={() => onStockOperation('transfer', item)}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                  >
                    <RefreshCw size={16} />
                    <span>Transferir</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'kardex' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-dark">Kardex de Movimientos</h3>
              
              <div className="overflow-x-auto">
                <table className="w-full border border-gray-200 rounded-lg">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Fecha</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Tipo</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Documento</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-600">Entrada</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-600">Salida</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-600">Saldo</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-600">Costo Unit.</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-600">Valor Total</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Usuario</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockStockMovements.map((movement) => (
                      <tr key={movement.id} className="border-t border-gray-200">
                        <td className="py-3 px-4 text-sm text-gray-700">
                          {format(new Date(movement.date), 'dd/MM/yyyy HH:mm', { locale: es })}
                        </td>
                        <td className="py-3 px-4 text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            movement.type === 'Entrada OC' ? 'bg-green-100 text-green-800' :
                            movement.type === 'Salida venta' ? 'bg-blue-100 text-blue-800' :
                            movement.type === 'Transferencia' ? 'bg-purple-100 text-purple-800' :
                            movement.type === 'Ajuste' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {movement.type}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">{movement.relatedDocument || '-'}</td>
                        <td className="py-3 px-4 text-sm text-gray-600 text-right">
                          {movement.quantityIn > 0 ? movement.quantityIn.toLocaleString() : '-'}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600 text-right">
                          {movement.quantityOut > 0 ? movement.quantityOut.toLocaleString() : '-'}
                        </td>
                        <td className="py-3 px-4 text-sm font-medium text-gray-700 text-right">
                          {movement.balance.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600 text-right">
                          {formatAmount(movement.unitCost)}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600 text-right">
                          {formatAmount(Math.abs(movement.totalValue))}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">{movement.user}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-dark">Análitica de Rotación y Consumo</h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Rotation Chart */}
                <div className="card p-4">
                  <h4 className="text-md font-medium text-gray-700 mb-4 flex items-center">
                    <BarChart3 size={16} className="mr-2 text-primary-main" />
                    Rotación Histórica (Días)
                  </h4>
                  
                  <div className="h-48 flex items-end space-x-2">
                    {rotationData.map((value, index) => (
                      <div key={index} className="flex-1 flex flex-col items-center">
                        <div 
                          className="w-full bg-primary-main rounded-t"
                          style={{ height: `${(value / Math.max(...rotationData)) * 100}%` }}
                        />
                        <span className="text-xs text-gray-500 mt-1">
                          {index + 1}
                        </span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4 text-center">
                    <p className="text-sm text-gray-600">Últimos 12 meses</p>
                    <p className="text-lg font-semibold text-gray-800">
                      Promedio: {Math.round(rotationData.reduce((a, b) => a + b, 0) / rotationData.length)} días
                    </p>
                  </div>
                </div>

                {/* Consumption Chart */}
                <div className="card p-4">
                  <h4 className="text-md font-medium text-gray-700 mb-4 flex items-center">
                    <TrendingUp size={16} className="mr-2 text-success" />
                    Consumo Histórico (Unidades)
                  </h4>
                  
                  <div className="h-48 flex items-end space-x-2">
                    {consumptionData.map((value, index) => (
                      <div key={index} className="flex-1 flex flex-col items-center">
                        <div 
                          className="w-full bg-success rounded-t"
                          style={{ height: `${(value / Math.max(...consumptionData)) * 100}%` }}
                        />
                        <span className="text-xs text-gray-500 mt-1">
                          {index + 1}
                        </span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4 text-center">
                    <p className="text-sm text-gray-600">Últimos 12 meses</p>
                    <p className="text-lg font-semibold text-gray-800">
                      Promedio: {Math.round(consumptionData.reduce((a, b) => a + b, 0) / consumptionData.length)} unid/mes
                    </p>
                  </div>
                </div>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Días de Cobertura</p>
                      <p className="text-2xl font-bold text-gray-800">
                        {Math.round(item.availableStock / (consumptionData.reduce((a, b) => a + b, 0) / 12))}
                      </p>
                    </div>
                    <Calendar size={24} className="text-gray-400" />
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Rotación Anual</p>
                      <p className="text-2xl font-bold text-gray-800">
                        {(365 / (rotationData.reduce((a, b) => a + b, 0) / 12)).toFixed(1)}x
                      </p>
                    </div>
                    <RefreshCw size={24} className="text-gray-400" />
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Valor Rotación</p>
                      <p className="text-2xl font-bold text-gray-800">
                        {formatAmount(item.unitCost * (consumptionData.reduce((a, b) => a + b, 0)))}
                      </p>
                    </div>
                    <TrendingUp size={24} className="text-gray-400" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItemDetailModal;