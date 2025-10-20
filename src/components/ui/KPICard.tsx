import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { KPIData } from '../../types';

interface KPICardProps {
  data: KPIData;
  className?: string;
}

const KPICard: React.FC<KPICardProps> = ({ data, className = '' }) => {
  const { title, value, caption, trend } = data;

  return (
    <div className={`bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200 transition-all duration-200 hover:shadow-md ${className}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-gray-medium mb-2 truncate" title={title}>
            {title}
          </h3>
          <div className="space-y-1">
            <p className="text-2xl sm:text-3xl font-bold text-gray-dark" title={value}>
              {value}
            </p>
            <p className="text-xs sm:text-sm text-gray-medium" title={caption}>
              {caption}
            </p>
          </div>
        </div>
        
        {trend && (
          <div className={`flex items-center space-x-1 ml-2 ${
            trend.direction === 'up' 
              ? 'text-success' 
              : trend.direction === 'down' 
                ? 'text-alert' 
                : 'text-gray-500'
          }`}>
            {trend.direction === 'up' && <TrendingUp size={16} className="flex-shrink-0" />}
            {trend.direction === 'down' && <TrendingDown size={16} className="flex-shrink-0" />}
            <span className="text-sm font-medium">
              {trend.percentage > 0 ? '+' : ''}{trend.percentage}%
            </span>
          </div>
        )}
      </div>
      
      {/* Mini chart placeholder - could be enhanced with actual mini charts */}
      {data.miniChart && data.miniChart.length > 0 && (
        <div className="mt-4 h-8 flex items-end space-x-1">
          {data.miniChart.slice(0, 12).map((value: number, index: number) => (
            <div
              key={index}
              className="flex-1 bg-primary-main bg-opacity-20 rounded-sm min-w-0"
              style={{ 
                height: `${Math.max(8, (value / Math.max(...data.miniChart!)) * 100)}%` 
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default KPICard;