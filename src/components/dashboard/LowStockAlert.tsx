import React from 'react';
import { AlertTriangle, Package } from 'lucide-react';
import { mockLowStock } from '../../data/mockData';

const LowStockAlert: React.FC = () => {
  const getUrgencyLevel = (current: number, min: number) => {
    const percentage = (current / min) * 100;
    if (percentage <= 25) return 'critical';
    if (percentage <= 50) return 'warning';
    return 'low';
  };

  const getUrgencyColor = (level: string) => {
    switch (level) {
      case 'critical':
        return 'border-l-alert bg-red-50';
      case 'warning':
        return 'border-l-yellow-500 bg-yellow-50';
      default:
        return 'border-l-primary-main bg-orange-50';
    }
  };

  const getStockPercentage = (current: number, min: number) => {
    return Math.round((current / min) * 100);
  };

  return (
    <div className="card">
      <div className="flex items-center space-x-2 mb-4">
        <AlertTriangle size={20} className="text-alert" />
        <h3 className="text-lg font-semibold text-gray-dark">
          Stock Bajo
        </h3>
      </div>
      
      <div className="space-y-3">
        {mockLowStock.map((item) => {
          const urgency = getUrgencyLevel(item.currentStock, item.minStock);
          const percentage = getStockPercentage(item.currentStock, item.minStock);
          
          return (
            <div
              key={item.id}
              className={`border-l-4 pl-4 py-3 rounded-r-lg ${getUrgencyColor(urgency)}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <Package size={16} className="text-gray-600" />
                    <p className="font-medium text-gray-dark text-sm">
                      {item.name}
                    </p>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    {item.category}
                  </p>
                  <div className="flex items-center space-x-2 mt-2">
                    <span className={`text-sm font-semibold ${
                      urgency === 'critical' ? 'text-alert' :
                      urgency === 'warning' ? 'text-yellow-600' :
                      'text-primary-main'
                    }`}>
                      {item.currentStock} {item.unit}
                    </span>
                    <span className="text-xs text-gray-500">
                      / mín. {item.minStock} {item.unit}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                    urgency === 'critical' ? 'bg-alert text-white' :
                    urgency === 'warning' ? 'bg-yellow-500 text-white' :
                    'bg-primary-main text-white'
                  }`}>
                    {percentage}%
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <button className="w-full text-sm text-primary-main hover:text-primary-dark font-medium transition-colors">
          Ver inventario completo →
        </button>
      </div>
    </div>
  );
};

export default LowStockAlert;