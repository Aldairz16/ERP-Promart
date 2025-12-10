import React, { useState } from 'react';
import { Plus, Users, Package, CheckCircle, AlertCircle, Clock } from 'lucide-react';

const QuickActions: React.FC = () => {
  const [loading, setLoading] = useState<string | null>(null);
  const [showToast, setShowToast] = useState<string | null>(null);

  const handleAction = async (action: string) => {
    setLoading(action);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setLoading(null);
    setShowToast(`Acción "${action}" ejecutada exitosamente`);
    
    // Hide toast after 3 seconds
    setTimeout(() => setShowToast(null), 3000);
  };

  const actions = [
    {
      id: 'crear-orden',
      label: 'Crear Orden de Compra',
      icon: Plus,
      color: 'bg-primary-main hover:bg-primary-dark',
    },
    {
      id: 'agregar-proveedor',
      label: 'Agregar Proveedor',
      icon: Users,
      color: 'bg-success hover:bg-green-700',
    },
    {
      id: 'reporte-inventario',
      label: 'Ver Reporte de Inventario',
      icon: Package,
      color: 'bg-blue-600 hover:bg-blue-700',
    },
  ];

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-dark mb-4">
        Acciones Rápidas
      </h3>
      
      <div className="space-y-3">
        {actions.map((action) => (
          <button
            key={action.id}
            onClick={() => handleAction(action.label)}
            disabled={loading !== null}
            className={`w-full flex items-center space-x-3 p-3 rounded-lg text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-main disabled:opacity-50 disabled:cursor-not-allowed ${action.color}`}
          >
            {loading === action.label ? (
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
            ) : (
              <action.icon size={20} />
            )}
            <span className="font-medium">{action.label}</span>
          </button>
        ))}
      </div>

      {/* Recent Actions Summary */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <h4 className="text-sm font-medium text-gray-600 mb-3">
          Resumen de Actividades
        </h4>
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-sm">
            <CheckCircle size={16} className="text-success" />
            <span className="text-gray-600">5 órdenes procesadas hoy</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <AlertCircle size={16} className="text-alert" />
            <span className="text-gray-600">3 requieren aprobación</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <Clock size={16} className="text-primary-main" />
            <span className="text-gray-600">2 proveedores pendientes</span>
          </div>
        </div>
      </div>

      {/* Toast notification */}
      {showToast && (
        <div className="fixed bottom-4 right-4 bg-success text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-pulse">
          {showToast}
        </div>
      )}
    </div>
  );
};

export default QuickActions;