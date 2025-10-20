import React, { useState } from 'react';
import { Calendar, Download, Eye, Settings, TrendingUp } from 'lucide-react';
import { ReportFilter, TimePeriod } from '../types';
import ReportOverview from './reports/ReportOverview';
import BudgetAnalysis from './reports/BudgetAnalysis';
import SupplierAnalysis from './reports/SupplierAnalysis';
import ProcessAnalysis from './reports/ProcessAnalysis';
import InventoryAnalysis from './reports/InventoryAnalysis';
import PriceAnalysis from './reports/PriceAnalysis';
import ReportFilters from './reports/ReportFilters';
import SavedViews from './reports/SavedViews';
import ExportModal from './reports/ExportModal';

const Reportes: React.FC = () => {
  const [filters, setFilters] = useState<ReportFilter>({
    period: 'Mes',
    currency: 'PEN',
    category: 'Todos',
    supplier: 'Todos',
    warehouse: 'Todos',
    status: 'Todos'
  });

  const [activeReport, setActiveReport] = useState<string>('overview');
  const [showFilters, setShowFilters] = useState(false);
  const [showSavedViews, setShowSavedViews] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);

  const reportTabs = [
    { id: 'overview', label: 'Resumen Ejecutivo', icon: TrendingUp },
    { id: 'budget', label: 'Presupuesto vs Real', icon: Calendar },
    { id: 'suppliers', label: 'Desempeño Proveedores', icon: Settings },
    { id: 'process', label: 'Eficiencia Procesos', icon: Calendar },
    { id: 'inventory', label: 'Rotación Inventario', icon: Calendar },
    { id: 'pricing', label: 'Análisis de Precios', icon: TrendingUp }
  ];

  const handleFilterChange = (newFilters: Partial<ReportFilter>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const renderActiveReport = () => {
    switch (activeReport) {
      case 'overview':
        return <ReportOverview filters={filters} />;
      case 'budget':
        return <BudgetAnalysis filters={filters} />;
      case 'suppliers':
        return <SupplierAnalysis filters={filters} />;
      case 'process':
        return <ProcessAnalysis filters={filters} />;
      case 'inventory':
        return <InventoryAnalysis filters={filters} />;
      case 'pricing':
        return <PriceAnalysis filters={filters} />;
      default:
        return <ReportOverview filters={filters} />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-dark">Reportes y Analítica</h1>
          <p className="text-gray-medium">Dashboard ejecutivo de compras e inventarios</p>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* Period and Currency Toggle */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-600">Periodo:</label>
              <select
                value={filters.period}
                onChange={(e) => handleFilterChange({ period: e.target.value as TimePeriod | 'Rango personalizado' })}
                className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-main focus:border-transparent"
              >
                <option value="Semana">Semana</option>
                <option value="Mes">Mes</option>
                <option value="Trimestre">Trimestre</option>
                <option value="Rango personalizado">Rango personalizado</option>
              </select>
            </div>
            
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => handleFilterChange({ currency: 'PEN' })}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  filters.currency === 'PEN' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                S/
              </button>
              <button
                onClick={() => handleFilterChange({ currency: 'USD' })}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  filters.currency === 'USD' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                $
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowSavedViews(true)}
              className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
              title="Vistas guardadas"
            >
              <Eye className="w-4 h-4 mr-1" />
              Vistas
            </button>
            
            <button
              onClick={() => setShowFilters(true)}
              className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
              title="Filtros avanzados"
            >
              <Settings className="w-4 h-4 mr-1" />
              Filtros
            </button>
            
            <button
              onClick={() => setShowExportModal(true)}
              className="btn-primary flex items-center"
            >
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </button>
          </div>
        </div>
      </div>

      {/* Report Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8 overflow-x-auto">
          {reportTabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveReport(tab.id)}
                className={`flex items-center whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeReport === tab.id
                    ? 'border-primary-main text-primary-main'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Report Content */}
      <div className="min-h-[600px]">
        {renderActiveReport()}
      </div>

      {/* Modals */}
      {showFilters && (
        <ReportFilters
          filters={filters}
          onFiltersChange={handleFilterChange}
          onClose={() => setShowFilters(false)}
        />
      )}

      {showSavedViews && (
        <SavedViews
          onViewSelect={(view) => {
            setFilters(view.filters);
            setShowSavedViews(false);
          }}
          onClose={() => setShowSavedViews(false)}
        />
      )}

      {showExportModal && (
        <ExportModal
          reportType={activeReport}
          filters={filters}
          onClose={() => setShowExportModal(false)}
        />
      )}
    </div>
  );
};

export default Reportes;