import React from 'react';
import { X, CheckCheck, Trash2, Clock, CheckCircle, Package, AlertTriangle, CreditCard, Users } from 'lucide-react';
import { Notification } from '../types';
import { useToast } from './ui/ToastProvider';

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
  unreadCount: number;
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onClearAll: () => void;
}

const getNotificationIcon = (type: Notification['type']) => {
  switch (type) {
    case 'order_approved':
      return <CheckCircle className="text-success" size={20} />;
    case 'stock_alert':
      return <AlertTriangle className="text-alert" size={20} />;
    case 'supplier_updated':
      return <Users className="text-primary-main" size={20} />;
    case 'reception_registered':
      return <Package className="text-success" size={20} />;
    case 'budget_alert':
      return <AlertTriangle className="text-warning" size={20} />;
    case 'payment_due':
      return <CreditCard className="text-alert" size={20} />;
    default:
      return <Clock className="text-gray-500" size={20} />;
  }
};

const formatTimestamp = (timestamp: string): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 1) {
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    return `hace ${diffInMinutes} min`;
  } else if (diffInHours < 24) {
    return `hace ${diffInHours}h`;
  } else {
    const diffInDays = Math.floor(diffInHours / 24);
    return `hace ${diffInDays}d`;
  }
};

const NotificationPanel: React.FC<NotificationPanelProps> = ({
  isOpen,
  onClose,
  notifications,
  unreadCount,
  onMarkAsRead,
  onMarkAllAsRead,
  onClearAll
}) => {
  const { addToast } = useToast();

  const handleMarkAllAsRead = () => {
    onMarkAllAsRead();
    addToast({
      type: 'success',
      title: 'Notificaciones marcadas como leídas',
      message: 'Todas las notificaciones han sido marcadas como leídas'
    });
  };

  const handleClearAll = () => {
    onClearAll();
    addToast({
      type: 'info',
      title: 'Notificaciones eliminadas',
      message: 'Todas las notificaciones han sido eliminadas'
    });
  };

  const handleMarkAsRead = (id: string) => {
    onMarkAsRead(id);
    // Optionally show a toast for individual mark as read
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
        onClick={onClose}
      />
      
      {/* Panel */}
      <div className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div>
            <h3 className="text-lg font-semibold text-gray-dark">Notificaciones</h3>
            {unreadCount > 0 && (
              <span className="text-sm text-gray-medium">
                {unreadCount} sin leer
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-main"
            aria-label="Cerrar notificaciones"
          >
            <X size={20} className="text-gray-600" />
          </button>
        </div>

        {/* Actions */}
        {notifications.length > 0 && (
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <button
              onClick={handleMarkAllAsRead}
              disabled={unreadCount === 0}
              className="flex items-center space-x-2 text-sm text-primary-main hover:text-primary-dark disabled:text-gray-400 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-primary-main rounded"
            >
              <CheckCheck size={16} />
              <span>Marcar como leídas</span>
            </button>
            <button
              onClick={handleClearAll}
              className="flex items-center space-x-2 text-sm text-alert hover:text-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-alert rounded"
            >
              <Trash2 size={16} />
              <span>Limpiar todo</span>
            </button>
          </div>
        )}

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle size={32} className="text-gray-400" />
              </div>
              <h4 className="text-lg font-medium text-gray-dark mb-2">
                No hay notificaciones
              </h4>
              <p className="text-gray-medium">
                Te notificaremos cuando haya novedades
              </p>
            </div>
          ) : (
            <div className="p-2">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 rounded-lg mb-2 border cursor-pointer transition-all duration-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary-main ${
                    notification.isRead
                      ? 'bg-white border-gray-200'
                      : 'bg-blue-50 border-blue-200'
                  }`}
                  onClick={() => handleMarkAsRead(notification.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleMarkAsRead(notification.id);
                    }
                  }}
                  tabIndex={0}
                  role="button"
                  aria-label={`Notificación: ${notification.title}. ${notification.isRead ? 'Leída' : 'Sin leer'}`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className={`text-sm font-medium truncate ${
                          notification.isRead ? 'text-gray-700' : 'text-gray-900'
                        }`}>
                          {notification.title}
                        </h4>
                        {!notification.isRead && (
                          <div className="w-2 h-2 bg-primary-main rounded-full flex-shrink-0 ml-2" />
                        )}
                      </div>
                      
                      <p className={`text-sm mt-1 ${
                        notification.isRead ? 'text-gray-500' : 'text-gray-700'
                      }`}>
                        {notification.description}
                      </p>
                      
                      <p className="text-xs text-gray-400 mt-2">
                        {formatTimestamp(notification.timestamp)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="p-4 border-t border-gray-200">
            <button
              className="w-full text-center text-sm text-primary-main hover:text-primary-dark transition-colors focus:outline-none focus:ring-2 focus:ring-primary-main rounded py-2"
              onClick={() => {
                // This could navigate to a full notifications page
                console.log('Ver todas las notificaciones');
              }}
            >
              Ver todas las notificaciones
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default NotificationPanel;