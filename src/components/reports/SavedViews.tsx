import React, { useState } from 'react';
import { X, Eye, Star, Calendar, Save, Trash2 } from 'lucide-react';
import { ReportView } from '../../types';
import { getReportViews } from '../../data/mockData';

interface SavedViewsProps {
  onViewSelect: (view: ReportView) => void;
  onClose: () => void;
}

const SavedViews: React.FC<SavedViewsProps> = ({ onViewSelect, onClose }) => {
  const [savedViews] = useState<ReportView[]>(getReportViews());
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [newViewName, setNewViewName] = useState('');
  const [newViewDescription, setNewViewDescription] = useState('');

  const handleSaveView = () => {
    // In a real app, this would save to backend
    console.log('Saving view:', { name: newViewName, description: newViewDescription });
    setShowSaveModal(false);
    setNewViewName('');
    setNewViewDescription('');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-PE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getChartIcon = (chartType: string) => {
    // Return a generic icon for all chart types
    return <Eye className="w-4 h-4" />;
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl m-4 max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b">
            <h3 className="text-lg font-semibold text-gray-900">Vistas Guardadas</h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowSaveModal(true)}
                className="btn-primary flex items-center"
              >
                <Save className="w-4 h-4 mr-2" />
                Guardar Vista Actual
              </button>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {savedViews.map((view) => (
                <div
                  key={view.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                    view.isDefault ? 'border-primary-main bg-primary-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => onViewSelect(view)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      {getChartIcon(view.chartType)}
                      <h4 className="font-medium text-gray-900">{view.name}</h4>
                      {view.isDefault && (
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      )}
                    </div>
                    <button className="text-gray-400 hover:text-red-600 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3">{view.description}</p>
                  
                  <div className="space-y-2 text-xs text-gray-500">
                    <div className="flex items-center justify-between">
                      <span>Período:</span>
                      <span className="font-medium">{view.filters.period}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Moneda:</span>
                      <span className="font-medium">{view.filters.currency}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Categoría:</span>
                      <span className="font-medium">{view.filters.category}</span>
                    </div>
                    {view.filters.warehouse && view.filters.warehouse !== 'Todos' && (
                      <div className="flex items-center justify-between">
                        <span>Almacén:</span>
                        <span className="font-medium">{view.filters.warehouse}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                    <div className="flex items-center text-xs text-gray-500">
                      <Calendar className="w-3 h-3 mr-1" />
                      {formatDate(view.createdDate)}
                    </div>
                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full">
                      {view.chartType}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {savedViews.length === 0 && (
              <div className="text-center py-12">
                <Eye className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No hay vistas guardadas</h3>
                <p className="text-gray-600 mb-4">
                  Guarda configuraciones de filtros para acceso rápido
                </p>
                <button
                  onClick={() => setShowSaveModal(true)}
                  className="btn-primary"
                >
                  Crear Primera Vista
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center justify-end space-x-3 p-6 border-t">
            <button onClick={onClose} className="btn-secondary">
              Cerrar
            </button>
          </div>
        </div>
      </div>

      {/* Save New View Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md m-4">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Guardar Vista</h3>
              <button
                onClick={() => setShowSaveModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre de la vista
                </label>
                <input
                  type="text"
                  value={newViewName}
                  onChange={(e) => setNewViewName(e.target.value)}
                  placeholder="Ej: Reporte mensual gerencia"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-main focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción (opcional)
                </label>
                <textarea
                  value={newViewDescription}
                  onChange={(e) => setNewViewDescription(e.target.value)}
                  placeholder="Describe el propósito de esta vista..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-main focus:border-transparent"
                />
              </div>

              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  Se guardará la configuración actual de filtros, período y moneda.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 p-6 border-t">
              <button
                onClick={() => setShowSaveModal(false)}
                className="btn-secondary"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveView}
                disabled={!newViewName.trim()}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Guardar Vista
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SavedViews;