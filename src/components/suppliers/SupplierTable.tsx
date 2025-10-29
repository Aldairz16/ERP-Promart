import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Download, 
  MoreVertical, 
  Eye, 
  Edit, 
  Pause, 
  Trash2,
  CheckSquare,
  Square
} from 'lucide-react';
import { Supplier, SupplierFilters } from '../../types';
import { supplierSectors, EXCHANGE_RATE } from '../../data/mockData';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface SupplierTableProps {
  suppliers: Supplier[];
  currency: 'PEN' | 'USD';
  filters: SupplierFilters;
  onFilterChange: (filters: Partial<SupplierFilters>) => void;
  onSupplierSelect: (supplier: Supplier) => void; 
  onCreateSupplier: () => void;
  onEditSupplier: (supplier: Supplier) => void;  
  onDeleteSupplier: (id: number) => void;    
  onSuspendSupplier?: (supplier: Supplier) => void;     
}

const SupplierTable: React.FC<SupplierTableProps> = ({
  suppliers,
  currency,
  filters,
  onFilterChange,
  onSupplierSelect,
  onCreateSupplier,
  onEditSupplier,
  onDeleteSupplier,
  onSuspendSupplier,
}) => {
  const [selectedSuppliers, setSelectedSuppliers] = useState<number[]>([]);
  const [showActionsMenu, setShowActionsMenu] = useState<number | null>(null);
  const [showToast, setShowToast] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const formatAmount = (amount?: number) => {
  if (typeof amount !== 'number' || isNaN(amount)) {
    return currency === 'USD' ? '$0.00' : 'S/0.00';
  }

  const value = currency === 'USD' ? amount / EXCHANGE_RATE : amount;
  const symbol = currency === 'USD' ? '$' : 'S/';

  return `${symbol}${value.toLocaleString('es-PE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
};

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Activo':
        return 'bg-success text-white';
      case 'En evaluación':
        return 'bg-yellow-500 text-white';
      case 'Suspendido':
        return 'bg-alert text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const handleSelectAll = () => {
    if (selectedSuppliers.length === suppliers.length) {
      setSelectedSuppliers([]);
    } else {
      setSelectedSuppliers(suppliers.map(s => s.id));
    }
  };

  const handleSelectSupplier = (supplierId: number) => {
  setSelectedSuppliers(prev => 
    prev.includes(supplierId) 
      ? prev.filter(id => id !== supplierId)
      : [...prev, supplierId]
  );
};

  const handleAction = async (action: string, supplier?: Supplier) => {
    setShowActionsMenu(null);
    
    // Simulate loading
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    let message = '';
    switch (action) {
      case 'suspend':
        message = `Proveedor ${supplier?.name} suspendido exitosamente`;
        break;
      case 'delete':
        message = `Proveedor ${supplier?.name} eliminado exitosamente`;
        break;
      case 'export':
        message = 'Lista de proveedores exportada exitosamente';
        break;
      case 'bulk-suspend':
        message = `${selectedSuppliers.length} proveedores suspendidos`;
        setSelectedSuppliers([]);
        break;
      default:
        message = 'Acción completada exitosamente';
    }
    
    setShowToast(message);
    setTimeout(() => setShowToast(null), 3000);
  };

  // Pagination
  const totalPages = Math.ceil(suppliers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentSuppliers = suppliers.slice(startIndex, endIndex);

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
              placeholder="Buscar proveedores..."
              value={filters.search}
              onChange={(e) => onFilterChange({ search: e.target.value })}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-main focus:border-transparent w-full sm:w-80"
            />
          </div>
          
          {/* Filters */}
          <div className="flex gap-2">
            <select
              value={filters.status}
              onChange={(e) => onFilterChange({ status: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-main"
            >
              <option value="Todos">Todos los estados</option>
              <option value="Activo">Activo</option>
              <option value="En evaluación">En evaluación</option>
              <option value="Suspendido">Suspendido</option>
            </select>
            
            <select
              value={filters.sector}
              onChange={(e) => onFilterChange({ sector: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-main"
            >
              {supplierSectors.map(sector => (
                <option key={sector} value={sector}>
                  {sector === 'Todos' ? 'Todos los sectores' : sector}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          {selectedSuppliers.length > 0 && (
            <button
              onClick={() => handleAction('bulk-suspend')}
              className="flex items-center space-x-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors"
            >
              <Pause size={16} />
              <span>Suspender ({selectedSuppliers.length})</span>
            </button>
          )}
          
          <button
            onClick={() => handleAction('export')}
            className="flex items-center space-x-2 btn-secondary"
          >
            <Download size={16} />
            <span>Exportar</span>
          </button>
          
          <button
            onClick={onCreateSupplier}
            className="flex items-center space-x-2 btn-primary"
          >
            <Plus size={16} />
            <span>Agregar Proveedor</span>
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
                  {selectedSuppliers.length === suppliers.length ? (
                    <CheckSquare size={16} className="text-primary-main" />
                  ) : (
                    <Square size={16} className="text-gray-400" />
                  )}
                </button>
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">Proveedor</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">RUC</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">Sector</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">Estado</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">Registro</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">Última Orden</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">Total Facturado</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {currentSuppliers.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center py-8 text-gray-500">
                  No se encontraron proveedores que coincidan con los filtros
                </td>
              </tr>
            ) : (
              currentSuppliers.map((supplier) => (
                <tr 
                  key={supplier.id} 
                  className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => onSupplierSelect(supplier)}
                >
                  <td className="py-3 px-4">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectSupplier(supplier.id);
                      }}
                      className="focus:outline-none"
                    >
                      {selectedSuppliers.includes(supplier.id) ? (
                        <CheckSquare size={16} className="text-primary-main" />
                      ) : (
                        <Square size={16} className="text-gray-400" />
                      )}
                    </button>
                  </td>
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-medium text-gray-dark">{supplier.name}</p>
                      <p className="text-sm text-gray-500">{supplier.representative}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{supplier.ruc}</td>
                  <td className="py-3 px-4 text-gray-600">{supplier.sector}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(supplier.status)}`}>
                      {supplier.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    {supplier.registrationDate
                      ? format(new Date(supplier.registrationDate), 'dd MMM yyyy', { locale: es })
                      : '—'}
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    {supplier.lastOrder 
                      ? format(new Date(supplier.lastOrder), 'dd MMM yyyy', { locale: es })
                      : 'Sin órdenes'
                    }
                  </td>
                  <td className="py-3 px-4 text-gray-600 font-medium">
                    {formatAmount(supplier.totalBilled)}
                  </td>
                  <td className="py-3 px-4">
                    <div className="relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowActionsMenu(showActionsMenu === supplier.id ? null : supplier.id);
                        }}
                        className="p-1 rounded-lg hover:bg-gray-200 transition-colors focus:outline-none"
                      >
                        <MoreVertical size={16} />
                      </button>
                      
                      {showActionsMenu === supplier.id && (
                        <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onSupplierSelect(supplier);
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                          >
                            <Eye size={16} />
                            <span>Ver detalles</span>
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onEditSupplier(supplier);
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                          >
                            <Edit size={16} />
                            <span>Editar</span>
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (onSuspendSupplier) {
                                onSuspendSupplier(supplier); // 👈 Llama a la función del padre
                              } else {
                                handleAction('suspend', supplier); // 👈 Si no se pasó prop, muestra el toast
                              }
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-yellow-600 hover:bg-gray-100 flex items-center space-x-2"
                          >
                            <Pause size={16} />
                            <span>Suspender</span>
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteSupplier(Number(supplier.id)); 
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-alert hover:bg-gray-100 flex items-center space-x-2"
                          >
                            <Trash2 size={16} />
                            <span>Eliminar</span>
                          </button>
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
            Mostrando {startIndex + 1} a {Math.min(endIndex, suppliers.length)} de {suppliers.length} proveedores
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

export default SupplierTable;