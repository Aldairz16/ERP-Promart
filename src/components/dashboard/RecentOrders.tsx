import React from 'react';
import { mockOrders, EXCHANGE_RATE } from '../../data/mockData';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface RecentOrdersProps {
  currency: 'PEN' | 'USD';
}

const RecentOrders: React.FC<RecentOrdersProps> = ({ currency }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Aprobada':
        return 'bg-success text-white';
      case 'Pendiente':
        return 'bg-yellow-500 text-white';
      case 'En Proceso':
        return 'bg-primary-main text-white';
      case 'Rechazada':
        return 'bg-alert text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const formatAmount = (amount: number) => {
    const value = currency === 'USD' ? amount / EXCHANGE_RATE : amount;
    const symbol = currency === 'USD' ? '$' : 'S/';
    return `${symbol}${value.toLocaleString('es-PE', { 
      minimumFractionDigits: 2,
      maximumFractionDigits: 2 
    })}`;
  };

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-dark mb-4">
        Órdenes Recientes
      </h3>
      
      <div className="space-y-4">
        {mockOrders.slice(0, 5).map((order) => (
          <div key={order.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="font-medium text-gray-dark">{order.id}</p>
                <p className="text-sm text-gray-600">{order.supplier}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                {order.status}
              </span>
            </div>
            
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">
                {format(new Date(order.date), 'dd MMM yyyy', { locale: es })}
              </span>
              <span className="font-semibold text-gray-dark">
                {formatAmount(order.amount)}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <button className="w-full text-sm text-primary-main hover:text-primary-dark font-medium transition-colors">
          Ver todas las órdenes →
        </button>
      </div>
    </div>
  );
};

export default RecentOrders;