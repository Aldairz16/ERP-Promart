import React, { useState } from 'react';
import { InventoryItem, InventoryFilters, TimePeriod } from '../types';
import { mockInventoryItems, getInventoryKPIsByPeriod } from '../data/mockData';
import InventoryOverview from './inventory/InventoryOverview';
import WarehouseSelector from './inventory/WarehouseSelector';
import InventoryTable from './inventory/InventoryTable';
import InventoryCharts from './inventory/InventoryCharts';
import ItemDetailModal from './inventory/ItemDetailModal';
import StockOperationsModal from './inventory/StockOperationsModal';
import LowStockPanel from './inventory/LowStockPanel';

const Inventario: React.FC = () => {
  const [currency, setCurrency] = useState<'PEN' | 'USD'>('PEN');
  const [period, setPeriod] = useState<TimePeriod>('Mes');
  const [selectedWarehouse, setSelectedWarehouse] = useState('Todos');
  const [selectedLocation, setSelectedLocation] = useState('');
  
  const [filters, setFilters] = useState<InventoryFilters>({
    search: '',
    warehouse: 'Todos',
    category: 'Todos',
    brand: 'Todos',
    status: 'Todos',
    stockLevel: '',
    abcClass: 'Todos'
  });

  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [showItemDetail, setShowItemDetail] = useState(false);
  const [showStockOperations, setShowStockOperations] = useState(false);
  const [operationType, setOperationType] = useState<'receipt' | 'transfer' | 'adjustment' | 'count'>('receipt');
  const [showLowStock, setShowLowStock] = useState(false);

  const kpis = getInventoryKPIsByPeriod(currency);

  const handleItemSelect = (item: InventoryItem) => {
    setSelectedItem(item);
    setShowItemDetail(true);
  };

  const handleStockOperation = (type: 'receipt' | 'transfer' | 'adjustment' | 'count', item?: InventoryItem) => {
    setOperationType(type);
    setSelectedItem(item || null);
    setShowStockOperations(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-dark">Inventario</h1>
          <p className="text-gray-medium">Gestión y control de inventarios</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-600">Periodo:</label>
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value as TimePeriod)}
              className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-main focus:border-transparent"
            >
              <option value="Semana">Semana</option>
              <option value="Mes">Mes</option>
              <option value="Trimestre">Trimestre</option>
            </select>
          </div>
          
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setCurrency('PEN')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                currency === 'PEN' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              S/
            </button>
            <button
              onClick={() => setCurrency('USD')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                currency === 'USD' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              $
            </button>
          </div>
        </div>
      </div>

      {/* KPIs Overview */}
      <InventoryOverview 
        kpis={kpis} 
        currency={currency}
        period={period}
        onLowStockClick={() => setShowLowStock(true)}
        onStockOperation={handleStockOperation}
      />

      {/* Warehouse Selector */}
      <WarehouseSelector
        selectedWarehouse={selectedWarehouse}
        selectedLocation={selectedLocation}
        onWarehouseChange={setSelectedWarehouse}
        onLocationChange={setSelectedLocation}
        currency={currency}
      />

      {/* Charts */}
      <InventoryCharts currency={currency} />

      {/* Inventory Table */}
      <InventoryTable
        items={mockInventoryItems}
        filters={filters}
        onFiltersChange={setFilters}
        currency={currency}
        onItemSelect={handleItemSelect}
        onStockOperation={handleStockOperation}
      />

      {/* Item Detail Modal */}
      {showItemDetail && selectedItem && (
        <ItemDetailModal
          item={selectedItem}
          currency={currency}
          onClose={() => {
            setShowItemDetail(false);
            setSelectedItem(null);
          }}
          onStockOperation={handleStockOperation}
        />
      )}

      {/* Stock Operations Modal */}
      {showStockOperations && (
        <StockOperationsModal
          type={operationType}
          item={selectedItem}
          currency={currency}
          onClose={() => {
            setShowStockOperations(false);
            setSelectedItem(null);
          }}
        />
      )}

      {/* Low Stock Panel */}
      {showLowStock && (
        <LowStockPanel
          currency={currency}
          onClose={() => setShowLowStock(false)}
          onGeneratePurchaseOrder={() => {
            // Simulate purchase order generation
            alert('Propuesta de compra generada exitosamente');
            setShowLowStock(false);
          }}
        />
      )}
    </div>
  );
};

export default Inventario;