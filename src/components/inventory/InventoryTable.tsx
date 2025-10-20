import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  MoreHorizontal, 
  Eye, 
  Edit, 
  ArrowUpDown, 
  RefreshCw,
  Minus,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { InventoryItem, InventoryFilters } from '../../types';
import { inventoryCategories, inventoryBrands, inventoryWarehouses, EXCHANGE_RATE } from '../../data/mockData';

interface InventoryTableProps {
  items: InventoryItem[];
  filters: InventoryFilters;
  onFiltersChange: (filters: InventoryFilters) => void;
  currency: 'PEN' | 'USD';
  onItemSelect: (item: InventoryItem) => void;
  onStockOperation: (type: 'receipt' | 'transfer' | 'adjustment' | 'count', item: InventoryItem) => void;
}

const InventoryTable: React.FC<InventoryTableProps> = ({
  items,
  filters,
  onFiltersChange,
  currency,
  onItemSelect,
  onStockOperation
}) => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [sortField, setSortField] = useState<keyof InventoryItem>('sku');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null);
  
  const itemsPerPage = 10;

  const formatAmount = (amount: number) => {
    const value = currency === 'USD' ? amount / EXCHANGE_RATE : amount;
    const symbol = currency === 'USD' ? '$' : 'S/';
    return `${symbol}${value.toLocaleString('es-PE', { 
      minimumFractionDigits: 2,
      maximumFractionDigits: 2 
    })}`;
  };

  const getStockLevelStatus = (item: InventoryItem) => {
    if (item.availableStock <= item.minStock) return 'bajo';
    if (item.availableStock > item.reorderPoint * 2) return 'sobrestock';
    return 'ok';
  };

  const getStockLevelColor = (status: string) => {
    switch (status) {
      case 'bajo':
        return 'text-red-600 bg-red-50';
      case 'sobrestock':
        return 'text-yellow-600 bg-yellow-50';
      default:
        return 'text-green-600 bg-green-50';
    }
  };

  const getStockLevelIcon = (status: string) => {
    switch (status) {
      case 'bajo':
        return <AlertTriangle size={14} />;
      case 'sobrestock':
        return <ArrowUpDown size={14} />;
      default:
        return <CheckCircle size={14} />;
    }
  };

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesSearch = !filters.search || 
        item.sku.toLowerCase().includes(filters.search.toLowerCase()) ||
        item.description.toLowerCase().includes(filters.search.toLowerCase());
      
      const matchesWarehouse = filters.warehouse === 'Todos' || item.warehouse === filters.warehouse;
      const matchesCategory = filters.category === 'Todos' || item.category === filters.category;
      const matchesBrand = filters.brand === 'Todos' || item.brand === filters.brand;
      const matchesStatus = filters.status === 'Todos' || item.status === filters.status;
      
      const stockLevel = getStockLevelStatus(item);
      const matchesStockLevel = !filters.stockLevel || stockLevel === filters.stockLevel;
      
      const matchesABCClass = filters.abcClass === 'Todos' || item.abcClass === filters.abcClass;

      return matchesSearch && matchesWarehouse && matchesCategory && 
             matchesBrand && matchesStatus && matchesStockLevel && matchesABCClass;
    });
  }, [items, filters]);

  const sortedItems = useMemo(() => {
    return [...filteredItems].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      return 0;
    });
  }, [filteredItems, sortField, sortDirection]);

  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedItems.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedItems, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(sortedItems.length / itemsPerPage);

  const handleSort = (field: keyof InventoryItem) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleSelectAll = () => {
    if (selectedItems.length === paginatedItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(paginatedItems.map(item => item.id));
    }
  };

  const handleSelectItem = (itemId: string) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleExport = () => {
    // Simulate export functionality
    const exportData = sortedItems.map(item => ({
      SKU: item.sku,
      Descripción: item.description,
      Categoría: item.category,
      Marca: item.brand,
      Almacén: item.warehouse,
      Ubicación: item.location,
      'Stock Disponible': item.availableStock,
      'Stock Comprometido': item.committedStock,
      'Stock Mínimo': item.minStock,
      'Punto de Reorden': item.reorderPoint,
      'Costo Unitario': formatAmount(item.unitCost),
      'Valor Total': formatAmount(item.totalValue),
      'Clase ABC': item.abcClass,
      Estado: item.status
    }));
    
    console.log('Exportando datos:', exportData);
    alert('Exportación iniciada. El archivo se descargará automáticamente.');
  };

  return (
    <div className="card">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-dark">
            Inventario de Stock
          </h3>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg border transition-colors ${
                showFilters ? 'bg-primary-main text-white border-primary-main' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
              }`}
            >
              <Filter size={16} />
              <span>Filtros</span>
            </button>
            
            <button
              onClick={handleExport}
              className="flex items-center space-x-2 px-3 py-2 bg-white text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Download size={16} />
              <span>Exportar</span>
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por SKU o descripción..."
            value={filters.search}
            onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-main focus:border-transparent"
          />
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <select
              value={filters.warehouse}
              onChange={(e) => onFiltersChange({ ...filters, warehouse: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-main focus:border-transparent"
            >
              <option value="Todos">Todos los almacenes</option>
              {inventoryWarehouses.map(warehouse => (
                <option key={warehouse.code} value={warehouse.name}>{warehouse.name}</option>
              ))}
            </select>

            <select
              value={filters.category}
              onChange={(e) => onFiltersChange({ ...filters, category: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-main focus:border-transparent"
            >
              {inventoryCategories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            <select
              value={filters.brand}
              onChange={(e) => onFiltersChange({ ...filters, brand: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-main focus:border-transparent"
            >
              {inventoryBrands.map(brand => (
                <option key={brand} value={brand}>{brand}</option>
              ))}
            </select>

            <select
              value={filters.status}
              onChange={(e) => onFiltersChange({ ...filters, status: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-main focus:border-transparent"
            >
              <option value="Todos">Todos los estados</option>
              <option value="Activo">Activo</option>
              <option value="Inactivo">Inactivo</option>
            </select>

            <select
              value={filters.stockLevel}
              onChange={(e) => onFiltersChange({ ...filters, stockLevel: e.target.value as any })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-main focus:border-transparent"
            >
              <option value="">Todos los niveles</option>
              <option value="bajo">Stock bajo</option>
              <option value="ok">Stock normal</option>
              <option value="sobrestock">Sobrestock</option>
            </select>

            <select
              value={filters.abcClass}
              onChange={(e) => onFiltersChange({ ...filters, abcClass: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-main focus:border-transparent"
            >
              <option value="Todos">Todas las clases</option>
              <option value="A">Clase A</option>
              <option value="B">Clase B</option>
              <option value="C">Clase C</option>
            </select>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="w-12 px-6 py-3 text-left">
                <input
                  type="checkbox"
                  checked={selectedItems.length === paginatedItems.length && paginatedItems.length > 0}
                  onChange={handleSelectAll}
                  className="rounded border-gray-300 text-primary-main focus:ring-primary-main"
                />
              </th>
              
              {[
                { key: 'sku', label: 'SKU' },
                { key: 'description', label: 'Descripción' },
                { key: 'category', label: 'Categoría' },
                { key: 'uom', label: 'UOM' },
                { key: 'warehouse', label: 'Almacén' },
                { key: 'location', label: 'Ubicación' },
                { key: 'availableStock', label: 'Stock Disponible' },
                { key: 'committedStock', label: 'Stock Comprometido' },
                { key: 'minStock', label: 'Stock Mínimo' },
                { key: 'reorderPoint', label: 'Reorden' },
                { key: 'unitCost', label: 'Costo Unit.' },
                { key: 'totalValue', label: 'Valorizado' },
                { key: 'lastMovement', label: 'Último Movimiento' }
              ].map((column) => (
                <th
                  key={column.key}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort(column.key as keyof InventoryItem)}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.label}</span>
                    <ArrowUpDown size={12} />
                  </div>
                </th>
              ))}
              
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedItems.map((item) => {
              const stockStatus = getStockLevelStatus(item);
              return (
                <tr 
                  key={item.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => onItemSelect(item)}
                >
                  <td className="px-6 py-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.id)}
                      onChange={() => handleSelectItem(item.id)}
                      className="rounded border-gray-300 text-primary-main focus:ring-primary-main"
                    />
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{item.sku}</div>
                    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStockLevelColor(stockStatus)}`}>
                      {getStockLevelIcon(stockStatus)}
                      <span className="ml-1 capitalize">{stockStatus}</span>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{item.description}</div>
                    <div className="text-sm text-gray-500">{item.brand}</div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.category}
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.uom}
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.warehouse}
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.location}
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.availableStock.toLocaleString()}
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.committedStock.toLocaleString()}
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.minStock.toLocaleString()}
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.reorderPoint.toLocaleString()}
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatAmount(item.unitCost)}
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {formatAmount(item.totalValue)}
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(item.lastMovement).toLocaleDateString('es-PE')}
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-center" onClick={(e) => e.stopPropagation()}>
                    <div className="relative">
                      <button
                        onClick={() => setShowActionMenu(showActionMenu === item.id ? null : item.id)}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <MoreHorizontal size={16} />
                      </button>
                      
                      {showActionMenu === item.id && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                          <button
                            onClick={() => {
                              onItemSelect(item);
                              setShowActionMenu(null);
                            }}
                            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                          >
                            <Eye size={14} className="mr-2" />
                            Ver detalle
                          </button>
                          
                          <button
                            onClick={() => {
                              onStockOperation('adjustment', item);
                              setShowActionMenu(null);
                            }}
                            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                          >
                            <Edit size={14} className="mr-2" />
                            Ajuste de stock
                          </button>
                          
                          <button
                            onClick={() => {
                              onStockOperation('transfer', item);
                              setShowActionMenu(null);
                            }}
                            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                          >
                            <RefreshCw size={14} className="mr-2" />
                            Transferir
                          </button>
                          
                          <button
                            onClick={() => {
                              // Toggle item status
                              setShowActionMenu(null);
                            }}
                            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                          >
                            <Minus size={14} className="mr-2" />
                            Marcar como inactivo
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
        <div className="text-sm text-gray-700">
          Mostrando {((currentPage - 1) * itemsPerPage) + 1} a {Math.min(currentPage * itemsPerPage, sortedItems.length)} de {sortedItems.length} resultados
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border border-gray-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Anterior
          </button>
          
          <span className="text-sm text-gray-600">
            Página {currentPage} de {totalPages}
          </span>
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border border-gray-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Siguiente
          </button>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedItems.length > 0 && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white border border-gray-300 rounded-lg shadow-lg p-4 flex items-center space-x-4">
          <span className="text-sm text-gray-600">
            {selectedItems.length} item(s) seleccionado(s)
          </span>
          
          <button
            onClick={() => console.log('Bulk transfer:', selectedItems)}
            className="btn-secondary text-sm"
          >
            Transferir
          </button>
          
          <button
            onClick={() => console.log('Bulk adjustment:', selectedItems)}
            className="btn-secondary text-sm"
          >
            Ajustar stock
          </button>
          
          <button
            onClick={() => setSelectedItems([])}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Cancelar
          </button>
        </div>
      )}
    </div>
  );
};

export default InventoryTable;