import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
//import { supplierKPIs, EXCHANGE_RATE } from '../../data/mockData';
import { EXCHANGE_RATE } from '../../data/mockData';

interface SupplierOverviewProps {
  currency: 'PEN' | 'USD';
  stats: {
    total: number;
    activos: number;
    suspendidos: number;
    nuevosMes: number;
  };
}

const SupplierOverview: React.FC<SupplierOverviewProps> = ({ currency, stats }) => {
  const formatValue = (value: string, isAmount: boolean = false) => {
    if (!isAmount) return value;
    
    const numValue = parseFloat(value.replace(/,/g, ''));
    if (currency === 'USD') {
      const convertedValue = numValue / EXCHANGE_RATE;
      return convertedValue.toLocaleString('en-US', { 
        minimumFractionDigits: 0,
        maximumFractionDigits: 0 
      });
    }
    return value;
  };

  const renderTrendIcon = (direction: 'up' | 'down' | 'neutral') => {
    switch (direction) {
      case 'up':
        return <TrendingUp size={16} className="text-success" />;
      case 'down':
        return <TrendingDown size={16} className="text-alert" />;
      default:
        return null;
    }
  };

  const kpiArray = [
  { title: "Total Proveedores", value: stats.total.toString(), caption: "", trend: null },
  { title: "Activos", value: stats.activos.toString(), caption: "", trend: null },
  { title: "Suspendidos", value: stats.suspendidos.toString(), caption: "", trend: null },
  { title: "Nuevos este mes", value: stats.nuevosMes.toString(), caption: "", trend: null },
];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {kpiArray.map((kpi, index) => (
        <div key={index} className="card">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <h3 className="text-sm font-medium text-gray-600 mb-1">
                {kpi.title}
              </h3>
              <div className="flex items-baseline space-x-1">
                <span className="text-2xl font-bold text-gray-dark">
                  {formatValue(kpi.value)}
                </span>
              </div>
              <p className="text-xs text-gray-medium mt-1">
                {kpi.caption}
              </p>
            </div>
          </div>
          
          {/*Comentario */}
          {/*
          {kpi.trend && (
            <div className="flex items-center space-x-1">
              {renderTrendIcon(kpi.trend.direction)}
              <span className={`text-sm font-medium ${
                kpi.trend.direction === 'up' ? 'text-success' :
                kpi.trend.direction === 'down' ? 'text-alert' :
                'text-gray-medium'
              }`}>
                {kpi.trend.percentage}%
              </span>
              <span className="text-xs text-gray-medium">
                vs mes anterior
              </span>
            </div>
          )}
          */}
        </div>
      ))}
    </div>
  );
};

export default SupplierOverview;