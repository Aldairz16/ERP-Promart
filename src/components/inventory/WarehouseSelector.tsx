import React from 'react';
import { MapPin, Building, TrendingUp, TrendingDown } from 'lucide-react';
import { inventoryWarehouses, warehouseCapacities, warehouseLocations } from '../../data/mockData';

interface WarehouseSelectorProps {
  selectedWarehouse: string;
  selectedLocation: string;
  onWarehouseChange: (warehouse: string) => void;
  onLocationChange: (location: string) => void;
}

const WarehouseSelector: React.FC<WarehouseSelectorProps> = ({
  selectedWarehouse,
  selectedLocation,
  onWarehouseChange,
  onLocationChange
}) => {
  const getWarehouseLocations = (warehouse: string) => {
    if (warehouse === 'Todos') return [];
    return warehouseLocations.filter(loc => loc.warehouse === warehouse);
  };

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-dark flex items-center">
          <Building size={20} className="mr-2 text-primary-main" />
          Selección de Almacén y Ubicación
        </h3>
        
        <div className="text-sm text-gray-500">
          {selectedWarehouse !== 'Todos' && selectedLocation && (
            <span className="bg-primary-light text-primary-dark px-2 py-1 rounded-full">
              {selectedWarehouse} → {selectedLocation}
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Warehouse Selection */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Almacén
            </label>
            <select
              value={selectedWarehouse}
              onChange={(e) => {
                onWarehouseChange(e.target.value);
                onLocationChange('');
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-main focus:border-transparent"
            >
              <option value="Todos">Todos los almacenes</option>
              {inventoryWarehouses.map(warehouse => (
                <option key={warehouse.code} value={warehouse.name}>
                  {warehouse.fullName}
                </option>
              ))}
            </select>
          </div>

          {selectedWarehouse !== 'Todos' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ubicación
              </label>
              <select
                value={selectedLocation}
                onChange={(e) => onLocationChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-main focus:border-transparent"
              >
                <option value="">Todas las ubicaciones</option>
                {getWarehouseLocations(selectedWarehouse).map(location => (
                  <option key={location.id} value={location.fullLocation}>
                    {location.fullLocation} (Cap: {location.capacity} - {location.utilization}% usado)
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Warehouse Capacity Summary */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-gray-700">Resumen por Almacén</h4>
          
          <div className="grid grid-cols-1 gap-3">
            {warehouseCapacities.map(capacity => (
              <div key={capacity.warehouse} className="bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-700">{capacity.warehouse}</span>
                  <span className="text-sm text-gray-500">{capacity.utilization}% usado</span>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                  <div 
                    className={`h-2 rounded-full ${
                      capacity.utilization >= 85 ? 'bg-alert' :
                      capacity.utilization >= 70 ? 'bg-yellow-500' :
                      'bg-success'
                    }`}
                    style={{ width: `${capacity.utilization}%` }}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="flex items-center">
                    <TrendingUp size={12} className="text-success mr-1" />
                    <span className="text-gray-600">Entradas: {capacity.entriesThisPeriod.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center">
                    <TrendingDown size={12} className="text-blue-500 mr-1" />
                    <span className="text-gray-600">Salidas: {capacity.exitsThisPeriod.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      {(selectedWarehouse !== 'Todos' || selectedLocation) && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center text-sm text-gray-600">
            <MapPin size={14} className="mr-1" />
            <span>Ubicación actual:</span>
            <span className="ml-2 font-medium">
              {selectedWarehouse === 'Todos' ? 'Todos los almacenes' : selectedWarehouse}
              {selectedLocation && ` → ${selectedLocation}`}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default WarehouseSelector;