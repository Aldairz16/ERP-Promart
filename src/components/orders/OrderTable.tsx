<<<<<<< HEAD
// src/components/orders/OrderTable.tsx
=======
>>>>>>> 87921f61849e3e0eb14846645dbdd687c465f7c5
import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Download, 
  MoreVertical, 
  Eye, 
  Edit, 
  Copy, 
  FileText, 
  Trash2,
  CheckSquare,
  Square,
  Check,
  X
} from 'lucide-react';
import { PurchaseOrder, OrderFilters } from '../../types';
import { warehouses, categories, EXCHANGE_RATE } from '../../data/mockData';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

<<<<<<< HEAD
// URL base de tu backend para las acciones
const API_URL = 'http://localhost:4000/api'; 

=======
>>>>>>> 87921f61849e3e0eb14846645dbdd687c465f7c5
interface OrderTableProps {
  orders: PurchaseOrder[];
  currency: 'PEN' | 'USD';
  filters: OrderFilters;
  onFilterChange: (filters: Partial<OrderFilters>) => void;
  onOrderSelect: (order: PurchaseOrder) => void;
  onCreateOrder: () => void;
<<<<<<< HEAD
  allSuppliers: string[];
  onDataUpdate: () => void; 
  onDuplicateOrder: (order: PurchaseOrder) => void; 
  onEditOrder: (order: PurchaseOrder) => void; // <-- Propiedad clave para la edición
=======
>>>>>>> 87921f61849e3e0eb14846645dbdd687c465f7c5
}

const OrderTable: React.FC<OrderTableProps> = ({
  orders,
  currency,
  filters,
  onFilterChange,
  onOrderSelect,
<<<<<<< HEAD
  onCreateOrder,
  allSuppliers,
  onDataUpdate,
  onDuplicateOrder,
  onEditOrder // <-- Usada para Editar
=======
  onCreateOrder
>>>>>>> 87921f61849e3e0eb14846645dbdd687c465f7c5
}) => {
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [showActionsMenu, setShowActionsMenu] = useState<string | null>(null);
  const [showToast, setShowToast] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const formatAmount = (amount: number) => {
    const value = currency === 'USD' ? amount / EXCHANGE_RATE : amount;
    const symbol = currency === 'USD' ? '$' : 'S/';
    return `${symbol}${value.toLocaleString('es-PE', { 
      minimumFractionDigits: 2,
      maximumFractionDigits: 2 
    })}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Borrador':
        return 'bg-gray-500 text-white';
      case 'En aprobación':
        return 'bg-yellow-500 text-white';
      case 'Aprobada':
        return 'bg-success text-white';
      case 'Enviada':
        return 'bg-blue-500 text-white';
      case 'Recibida parcial':
        return 'bg-primary-main text-white';
      case 'Recibida total':
        return 'bg-green-600 text-white';
      case 'Cerrada':
        return 'bg-gray-600 text-white';
      case 'Anulada':
        return 'bg-alert text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const handleSelectAll = () => {
    if (selectedOrders.length === orders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(orders.map(o => o.id));
    }
  };

  const handleSelectOrder = (orderId: string) => {
    setSelectedOrders(prev => 
      prev.includes(orderId) 
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  const handleAction = async (action: string, order?: PurchaseOrder) => {
    setShowActionsMenu(null);
<<<<<<< HEAD
    let message = '';
    let success = false;
    const orderId = order?.id;
    
    try {
        switch (action) {
            case 'duplicate':
                if (order) {
                    onDuplicateOrder(order); // Llama a la función que abre el modal pre-cargado
                }
                return; // No mostrar toast, ya que abre un modal
            
            case 'edit':
                // 🛑 CORRECCIÓN: Llama a la función real de edición
                if (order) {
                    onEditOrder(order); 
                }
                return; // No mostrar toast
                
            case 'download':
                // LLAMADA REAL: GET /api/orders/:id/pdf 
                await fetch(`${API_URL}/orders/${orderId}/pdf`);
                message = `PDF de orden ${orderId} descargado`;
                success = true;
                break;
                
            case 'cancel':
                // LLAMADA REAL: PUT /api/orders/:id/status para ANULAR
                if (orderId && order.status !== 'Anulada') {
                    const res = await fetch(`${API_URL}/orders/${orderId}/status`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ newStatus: 'Anulada', user: 'Ana García', comment: 'Anulación manual.' }) 
                    });
                    if (!res.ok) throw new Error(`Fallo al anular la orden: ${res.statusText}`);
                    message = `Orden ${orderId} anulada exitosamente`;
                    success = true;
                    onDataUpdate(); 
                } else if (orderId) {
                    message = `La Orden ${orderId} ya está anulada.`;
                    success = true;
                }
                break;

            case 'delete':
                // LLAMADA REAL: DELETE /api/orders/:id para ELIMINAR PERMANENTE
                if (orderId && confirm(`¿Estás seguro de eliminar permanentemente la orden ${orderId}? Esta acción es irreversible.`)) {
                    const res = await fetch(`${API_URL}/orders/${orderId}`, { method: 'DELETE' });
                    if (!res.ok) throw new Error(`Fallo al eliminar la orden: ${res.statusText}`);
                    message = `Orden ${orderId} eliminada permanentemente`;
                    success = true;
                    onDataUpdate(); 
                }
                break;

            case 'bulk-approve':
                // Simulación para acción masiva
                message = `${selectedOrders.length} órdenes aprobadas (Simulación)`;
                success = true;
                setSelectedOrders([]);
                onDataUpdate();
                break;
            
            case 'export':
                // ACCIÓN EXPORTAR (SIMULADA)
                message = 'Lista de órdenes exportada exitosamente (Simulación)';
                success = true;
                break;
            default:
                message = 'Acción completada exitosamente';
                success = true;
        }
        
    } catch (error) {
        message = `Error en la acción (${action}): ${error instanceof Error ? error.message : 'Desconocido'}`;
        setShowToast(message);
        setTimeout(() => setShowToast(null), 5000);
        return;
    }
    
    if (success) {
        setShowToast(message);
        setTimeout(() => setShowToast(null), 3000);
    }
  };

  const uniqueSuppliers = allSuppliers;
=======
    
    // Simulate loading
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    let message = '';
    switch (action) {
      case 'duplicate':
        message = `Orden ${order?.id} duplicada exitosamente`;
        break;
      case 'download':
        message = `PDF de orden ${order?.id} descargado`;
        break;
      case 'cancel':
        message = `Orden ${order?.id} anulada exitosamente`;
        break;
      case 'export':
        message = 'Lista de órdenes exportada exitosamente';
        break;
      case 'bulk-approve':
        message = `${selectedOrders.length} órdenes aprobadas`;
        setSelectedOrders([]);
        break;
      case 'bulk-reject':
        message = `${selectedOrders.length} órdenes rechazadas`;
        setSelectedOrders([]);
        break;
      default:
        message = 'Acción completada exitosamente';
    }
    
    setShowToast(message);
    setTimeout(() => setShowToast(null), 3000);
  };

  // Get unique suppliers for filter
  const uniqueSuppliers = Array.from(new Set(orders.map(o => o.supplierName)));
>>>>>>> 87921f61849e3e0eb14846645dbdd687c465f7c5

  // Pagination
  const totalPages = Math.ceil(orders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentOrders = orders.slice(startIndex, endIndex);

  return (
    <div className="card">
      {/* Header with Search and Filters */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
          {/* Search */}
          <div className="relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar órdenes..."
              value={filters.search}
              onChange={(e) => onFilterChange({ search: e.target.value })}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-main focus:border-transparent w-full sm:w-80"
            />
          </div>
          
          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            <select
              value={filters.status}
              onChange={(e) => onFilterChange({ status: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-main text-sm"
            >
              <option value="Todos">Estado</option>
              <option value="Borrador">Borrador</option>
              <option value="En aprobación">En aprobación</option>
              <option value="Aprobada">Aprobada</option>
              <option value="Enviada">Enviada</option>
              <option value="Recibida parcial">Recibida parcial</option>
              <option value="Recibida total">Recibida total</option>
              <option value="Cerrada">Cerrada</option>
              <option value="Anulada">Anulada</option>
            </select>
            
<<<<<<< HEAD
            {/* Filtro Proveedor */}
=======
>>>>>>> 87921f61849e3e0eb14846645dbdd687c465f7c5
            <select
              value={filters.supplier}
              onChange={(e) => onFilterChange({ supplier: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-main text-sm"
            >
              <option value="Todos">Proveedor</option>
              {uniqueSuppliers.map(supplier => (
                <option key={supplier} value={supplier}>{supplier}</option>
              ))}
            </select>
            
            <select
              value={filters.warehouse}
              onChange={(e) => onFilterChange({ warehouse: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-main text-sm"
            >
              <option value="Todos">Almacén</option>
              {warehouses.map(warehouse => (
                <option key={warehouse} value={warehouse}>{warehouse}</option>
              ))}
            </select>
            
            <select
              value={filters.category}
              onChange={(e) => onFilterChange({ category: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-main text-sm"
            >
              <option value="Todos">Categoría</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          {selectedOrders.length > 0 && (
            <div className="flex gap-2">
              <button
                onClick={() => handleAction('bulk-approve')}
                className="flex items-center space-x-2 px-4 py-2 bg-success hover:bg-green-700 text-white rounded-lg transition-colors text-sm"
              >
                <Check size={16} />
                <span>Aprobar ({selectedOrders.length})</span>
              </button>
              <button
                onClick={() => handleAction('bulk-reject')}
                className="flex items-center space-x-2 px-4 py-2 bg-alert hover:bg-red-700 text-white rounded-lg transition-colors text-sm"
              >
                <X size={16} />
                <span>Rechazar ({selectedOrders.length})</span>
              </button>
            </div>
          )}
          
          <button
            onClick={() => handleAction('export')}
            className="flex items-center space-x-2 btn-secondary text-sm"
          >
            <Download size={16} />
            <span>Exportar</span>
          </button>
          
          <button
            onClick={onCreateOrder}
            className="flex items-center space-x-2 btn-primary text-sm"
          >
            <Plus size={16} />
            <span>Nueva Orden</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4">
                <button onClick={handleSelectAll} className="focus:outline-none">
<<<<<<< HEAD
                  {selectedOrders.length === orders.length && orders.length > 0 ? (
=======
                  {selectedOrders.length === orders.length ? (
>>>>>>> 87921f61849e3e0eb14846645dbdd687c465f7c5
                    <CheckSquare size={16} className="text-primary-main" />
                  ) : (
                    <Square size={16} className="text-gray-400" />
                  )}
                </button>
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">N° OC</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">Proveedor</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">Fecha Emisión</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">Estado</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">Entrega Est.</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">Almacén</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">Total (IGV inc.)</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {currentOrders.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center py-8 text-gray-500">
                  No se encontraron órdenes que coincidan con los filtros
                </td>
              </tr>
            ) : (
              currentOrders.map((order) => (
                <tr 
                  key={order.id} 
                  className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => onOrderSelect(order)}
                >
                  <td className="py-3 px-4">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectOrder(order.id);
                      }}
                      className="focus:outline-none"
                    >
                      {selectedOrders.includes(order.id) ? (
                        <CheckSquare size={16} className="text-primary-main" />
                      ) : (
                        <Square size={16} className="text-gray-400" />
                      )}
                    </button>
                  </td>
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-medium text-gray-dark">{order.id}</p>
                      <p className="text-sm text-gray-500">{order.category}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-medium text-gray-dark">{order.supplierName}</p>
                      <p className="text-sm text-gray-500">RUC: {order.supplierRuc}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    {format(new Date(order.issueDate), 'dd/MM/yyyy', { locale: es })}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    {format(new Date(order.estimatedDelivery), 'dd/MM/yyyy', { locale: es })}
                  </td>
                  <td className="py-3 px-4 text-gray-600">{order.warehouse}</td>
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-medium text-gray-dark">{formatAmount(order.total)}</p>
                      <p className="text-sm text-gray-500">{order.currency} • {order.paymentTerms}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowActionsMenu(showActionsMenu === order.id ? null : order.id);
                        }}
                        className="p-1 rounded-lg hover:bg-gray-200 transition-colors focus:outline-none"
                      >
                        <MoreVertical size={16} />
                      </button>
                      
                      {showActionsMenu === order.id && (
                        <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onOrderSelect(order);
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                          >
                            <Eye size={16} />
                            <span>Ver detalle</span>
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
<<<<<<< HEAD
                              handleAction('edit', order); // Acción EDITAR (funcional)
=======
                              // Handle edit
>>>>>>> 87921f61849e3e0eb14846645dbdd687c465f7c5
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                          >
                            <Edit size={16} />
                            <span>Editar</span>
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
<<<<<<< HEAD
                              handleAction('duplicate', order); // Acción DUPLICAR (funcional)
=======
                              handleAction('duplicate', order);
>>>>>>> 87921f61849e3e0eb14846645dbdd687c465f7c5
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                          >
                            <Copy size={16} />
                            <span>Duplicar</span>
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
<<<<<<< HEAD
                              handleAction('download', order); // Acción DESCARGAR PDF
=======
                              handleAction('download', order);
>>>>>>> 87921f61849e3e0eb14846645dbdd687c465f7c5
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                          >
                            <FileText size={16} />
                            <span>Descargar PDF</span>
                          </button>
<<<<<<< HEAD
                          
                          {/* Botón Anular (Cambia estado a 'Anulada') */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAction('cancel', order); // Acción ANULAR (real)
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-alert hover:bg-gray-100 flex items-center space-x-2 border-t mt-1"
=======
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAction('cancel', order);
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-alert hover:bg-gray-100 flex items-center space-x-2"
>>>>>>> 87921f61849e3e0eb14846645dbdd687c465f7c5
                          >
                            <Trash2 size={16} />
                            <span>Anular</span>
                          </button>
<<<<<<< HEAD
                          
                          {/* Opción para eliminar permanente (solo si es Borrador) */}
                          {order.status === 'Borrador' && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleAction('delete', order); // Acción ELIMINAR (real)
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-red-900 hover:bg-red-50 flex items-center space-x-2"
                            >
                                <Trash2 size={16} />
                                <span>Eliminar Permanente</span>
                            </button>
                          )}
=======
>>>>>>> 87921f61849e3e0eb14846645dbdd687c465f7c5
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-6">
          <p className="text-sm text-gray-600">
            Mostrando {startIndex + 1} a {Math.min(endIndex, orders.length)} de {orders.length} órdenes
          </p>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Anterior
            </button>
            <span className="px-3 py-1 bg-primary-main text-white rounded">
              {currentPage}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}

      {/* Toast notification */}
      {showToast && (
        <div className="fixed bottom-4 right-4 bg-success text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-pulse">
          {showToast}
        </div>
      )}
    </div>
  );
};

export default OrderTable;