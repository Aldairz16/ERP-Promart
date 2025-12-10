import React from 'react';
import { CheckCircle, AlertTriangle, UserPlus, Clock } from 'lucide-react';
import { mockActivities } from '../../data/mockData';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

const RecentActivity: React.FC = () => {
  const getActivityIcon = (type: string, status: string) => {
    switch (type) {
      case 'approval':
        return status === 'success' ? (
          <CheckCircle size={16} className="text-success" />
        ) : (
          <Clock size={16} className="text-primary-main" />
        );
      case 'supplier':
        return <UserPlus size={16} className="text-success" />;
      case 'stock':
        return status === 'warning' ? (
          <AlertTriangle size={16} className="text-yellow-500" />
        ) : (
          <CheckCircle size={16} className="text-success" />
        );
      default:
        return <Clock size={16} className="text-gray-medium" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'border-l-success';
      case 'warning':
        return 'border-l-yellow-500';
      case 'error':
        return 'border-l-alert';
      default:
        return 'border-l-gray-300';
    }
  };

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-dark mb-4">
        Actividad Reciente
      </h3>
      
      <div className="space-y-4">
        {mockActivities.map((activity) => (
          <div
            key={activity.id}
            className={`border-l-4 pl-4 py-2 ${getStatusColor(activity.status)}`}
          >
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 mt-1">
                {getActivityIcon(activity.type, activity.status)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-dark leading-relaxed">
                  {activity.description}
                </p>
                <p className="text-xs text-gray-medium mt-1">
                  {formatDistanceToNow(new Date(activity.timestamp), {
                    addSuffix: true,
                    locale: es
                  })}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <button className="w-full text-sm text-primary-main hover:text-primary-dark font-medium transition-colors">
          Ver todas las actividades →
        </button>
      </div>
    </div>
  );
};

export default RecentActivity;