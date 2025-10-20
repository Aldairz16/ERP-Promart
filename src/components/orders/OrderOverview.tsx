import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { getOrderKPIsByPeriod, EXCHANGE_RATE } from '../../data/mockData';
import { TimePeriod } from '../../types';

interface OrderOverviewProps {
  period: TimePeriod;
  currency: 'PEN' | 'USD';
}

const OrderOverview: React.FC<OrderOverviewProps> = ({ period, currency }) => {
  const kpis = getOrderKPIsByPeriod(period);
  
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

  const getCurrencySymbol = () => currency === 'USD' ? '$' : 'S/';

  const renderTrendIcon = (direction: 'up' | 'down' | 'neutral') => {
    switch (direction) {
      case 'up':
        return <TrendingUp size={16} className="text-success" />;
      case 'down':
        return <TrendingDown size={16} className="text-alert" />;
      default:
        return <Minus size={16} className="text-gray-medium" />;
    }
  };

  const kpiArray = [
    kpis.totalOrders,
    kpis.pendingApproval,
    kpis.approved,
    kpis.pendingReceipt,
    kpis.onTimeDelivery,
    kpis.avgApprovalTime,
    kpis.monthlySpending
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-7 gap-6">
      {kpiArray.map((kpi, index) => (
        <div key={index} className="card">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <h3 className="text-sm font-medium text-gray-600 mb-1">
                {kpi.title}
              </h3>
              <div className="flex items-baseline space-x-1">
                {(kpi.title.includes('Gasto') || kpi.title.includes('entregas')) && (
                  <span className="text-lg font-semibold text-gray-dark">
                    {kpi.title.includes('Gasto') ? getCurrencySymbol() : ''}
                  </span>
                )}
                <span className="text-2xl font-bold text-gray-dark">
                  {formatValue(kpi.value, kpi.title.includes('Gasto'))}
                  {kpi.title.includes('entregas') ? '%' : ''}
                  {kpi.title.includes('Tiempo') ? ' días' : ''}
                </span>
              </div>
              <p className="text-xs text-gray-medium mt-1">
                {kpi.caption}
              </p>
            </div>
          </div>
          
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
                vs periodo anterior
              </span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default OrderOverview;