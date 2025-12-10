import React from 'react';
import { X, Calendar } from 'lucide-react';
import { ReportFilter } from '../../types';

interface ReportFiltersProps {
  filters: ReportFilter;
  onFiltersChange: (filters: Partial<ReportFilter>) => void;
  onClose: () => void;
}

const ReportFilters: React.FC<ReportFiltersProps> = ({ filters, onFiltersChange, onClose }) => {
  const categories = ['Todos', 'Construcción', 'TI', 'Ferretería', 'Oficina', 'Mobiliario', 'Mantenimiento'];
  const warehouses = ['Todos', 'Lima Centro', 'Lurín', 'Arequipa', 'Chimbote'];
  const statuses = ['Todos', 'Activo', 'En evaluación', 'Suspendido'];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl m-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Filtros Avanzados</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Period Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Período de Análisis
            </label>
            <select
              value={filters.period}
              onChange={(e) => onFiltersChange({ period: e.target.value as any })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-main focus:border-transparent"
            >
              <option value="Semana">Semana</option>
              <option value="Mes">Mes</option>
              <option value="Trimestre">Trimestre</option>
              <option value="Rango personalizado">Rango personalizado</option>
            </select>
          </div>

          {/* Custom Date Range */}
          {filters.period === 'Rango personalizado' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha Inicio
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={filters.startDate || ''}
                    onChange={(e) => onFiltersChange({ startDate: e.target.value })}
                    className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-main focus:border-transparent"
                  />
                  <Calendar className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha Fin
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={filters.endDate || ''}
                    onChange={(e) => onFiltersChange({ endDate: e.target.value })}
                    className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-main focus:border-transparent"
                  />
                  <Calendar className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
                </div>
              </div>
            </div>
          )}

          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categoría
            </label>
            <select
              value={filters.category}
              onChange={(e) => onFiltersChange({ category: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-main focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Warehouse Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Almacén
            </label>
            <select
              value={filters.warehouse}
              onChange={(e) => onFiltersChange({ warehouse: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-main focus:border-transparent"
            >
              {warehouses.map(warehouse => (
                <option key={warehouse} value={warehouse}>
                  {warehouse}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estado
            </label>
            <select
              value={filters.status}
              onChange={(e) => onFiltersChange({ status: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-main focus:border-transparent"
            >
              {statuses.map(status => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          {/* Currency Toggle */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Moneda
            </label>
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => onFiltersChange({ currency: 'PEN' })}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex-1 ${
                  filters.currency === 'PEN' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Soles (S/)
              </button>
              <button
                onClick={() => onFiltersChange({ currency: 'USD' })}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex-1 ${
                  filters.currency === 'USD' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Dólares ($)
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end space-x-3 p-6 border-t">
          <button
            onClick={onClose}
            className="btn-secondary"
          >
            Cancelar
          </button>
          <button
            onClick={() => {
              // Reset filters to default
              onFiltersChange({
                period: 'Mes',
                currency: 'PEN',
                category: 'Todos',
                warehouse: 'Todos',
                status: 'Todos',
                startDate: undefined,
                endDate: undefined
              });
            }}
            className="btn-secondary"
          >
            Limpiar
          </button>
          <button
            onClick={onClose}
            className="btn-primary"
          >
            Aplicar Filtros
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportFilters;