import React from 'react';
import { Package, AlertTriangle, TrendingUp, TrendingDown, Truck, RefreshCw, BarChart3 } from 'lucide-react';
import { TimePeriod } from '../../types';

interface InventoryOverviewProps {
  kpis: any;
  currency: 'PEN' | 'USD';
  period: TimePeriod;
  onLowStockClick: () => void;
  onStockOperation: (type: 'receipt' | 'transfer' | 'adjustment' | 'count') => void;
}

const InventoryOverview: React.FC<InventoryOverviewProps> = ({
  kpis,
  onLowStockClick,
  onStockOperation
}) => {
  const kpiCards = [
    {
      id: 'activeSKUs',
      icon: Package,
      data: kpis.activeSKUs,
      color: 'bg-primary-main'
    },
    {
      id: 'totalStock',
      icon: BarChart3,
      data: kpis.totalStock,
      color: 'bg-blue-500'
    },
    {
      id: 'stockValue',
      icon: TrendingUp,
      data: kpis.stockValue,
      color: 'bg-success'
    },
    {
      id: 'lowStockItems',
      icon: AlertTriangle,
      data: kpis.lowStockItems,
      color: 'bg-alert',
      onClick: onLowStockClick
    },
    {
      id: 'pendingReceipts',
      icon: Truck,
      data: kpis.pendingReceipts,
      color: 'bg-yellow-500',
      onClick: () => onStockOperation('receipt')
    },
    {
      id: 'transfersInTransit',
      icon: RefreshCw,
      data: kpis.transfersInTransit,
      color: 'bg-purple-500',
      onClick: () => onStockOperation('transfer')
    },
    {
      id: 'avgRotationDays',
      icon: TrendingDown,
      data: kpis.avgRotationDays,
      color: 'bg-indigo-500'
    }
  ];

  const getTrendIcon = (direction: 'up' | 'down' | 'neutral') => {
    switch (direction) {
      case 'up':
        return <TrendingUp size={12} className="text-success" />;
      case 'down':
        return <TrendingDown size={12} className="text-alert" />;
      default:
        return <div className="w-3 h-3 rounded-full bg-gray-400" />;
    }
  };

  const getTrendColor = (direction: 'up' | 'down' | 'neutral') => {
    switch (direction) {
      case 'up':
        return 'text-success';
      case 'down':
        return 'text-alert';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-dark">Resumen de Inventario</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => onStockOperation('adjustment')}
            className="btn-secondary text-sm"
          >
            Ajuste de Stock
          </button>
          <button
            onClick={() => onStockOperation('count')}
            className="btn-secondary text-sm"
          >
            Recuento Cíclico
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
        {kpiCards.map((card) => {
          const IconComponent = card.icon;
          return (
            <div
              key={card.id}
              className={`card p-4 ${card.onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}`}
              onClick={card.onClick}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-lg ${card.color} flex items-center justify-center`}>
                  <IconComponent size={20} className="text-white" />
                </div>
                {card.data.trend && (
                  <div className="flex items-center space-x-1">
                    {getTrendIcon(card.data.trend.direction)}
                    <span className={`text-xs font-medium ${getTrendColor(card.data.trend.direction)}`}>
                      {card.data.trend.percentage}%
                    </span>
                  </div>
                )}
              </div>
              
              <div>
                <p className="text-2xl font-bold text-gray-dark">{card.data.value}</p>
                <p className="text-sm text-gray-medium mt-1">{card.data.title}</p>
                <p className="text-xs text-gray-500">{card.data.caption}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default InventoryOverview;