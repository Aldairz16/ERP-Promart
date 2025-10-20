import React, { useState } from 'react';
import { 
  X, 
  Calendar, 
  MapPin, 
  User, 
  Building, 
  CreditCard, 
  Truck, 
  FileText, 
  Download,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';
import { PurchaseOrder } from '../../types';
import { EXCHANGE_RATE } from '../../data/mockData';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface OrderDetailModalProps {
  order: PurchaseOrder;
  currency: 'PEN' | 'USD';
  onClose: () => void;
}

const OrderDetailModal: React.FC<OrderDetailModalProps> = ({ order, currency, onClose }) => {
  const [showToast, setShowToast] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'details' | 'timeline' | 'attachments'>('details');

  const formatAmount = (amount: number) => {
    const value = currency === 'USD' ? amount / EXCHANGE_RATE : amount;
    const symbol = currency === 'USD' ? '$' : 'S/';
    return `${symbol}${value.toLocaleString('es-PE', { 
      minimumFractionDigits: 2,
      maximumFractionDigits: 2 
    })}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Borrador':
        return 'bg-gray-500';
      case 'En aprobación':
        return 'bg-yellow-500';
      case 'Aprobada':
        return 'bg-success';
      case 'Enviada':
        return 'bg-blue-500';
      case 'Recibida parcial':
        return 'bg-primary-main';
      case 'Recibida total':
        return 'bg-green-600';
      case 'Cerrada':
        return 'bg-gray-600';
      case 'Anulada':
        return 'bg-alert';
      default:
        return 'bg-gray-500';
    }
  };

  const getTimelineStageIcon = (completed: boolean) => {
    if (completed) {
      return <CheckCircle size={20} className="text-success" />;
    } else {
      return <Clock size={20} className="text-gray-400" />;
    }
  };

  const handleReceiveOrder = async (receiptType: 'partial' | 'total') => {
    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const message = receiptType === 'partial' 
      ? `Recepción parcial registrada para ${order.id}`
      : `Recepción total registrada para ${order.id}`;
    
    setShowToast(message);
    setTimeout(() => setShowToast(null), 3000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-dark">
                Orden de Compra {order.id}
              </h2>
              <p className="text-sm text-gray-medium mt-1">
                Proveedor: {order.supplierName} | RUC: {order.supplierRuc}
              </p>
            </div>
            <span className={`px-3 py-1 rounded-full text-white text-sm font-medium ${getStatusColor(order.status)}`}>
              {order.status}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-main"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('details')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'details'
                  ? 'border-primary-main text-primary-main'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Detalles
            </button>
            <button
              onClick={() => setActiveTab('timeline')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'timeline'
                  ? 'border-primary-main text-primary-main'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Timeline
            </button>
            <button
              onClick={() => setActiveTab('attachments')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'attachments'
                  ? 'border-primary-main text-primary-main'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Adjuntos ({order.attachments.length})
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'details' && (
            <div className="space-y-6">
              {/* Order Info Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Basic Info */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-dark flex items-center">
                    <FileText size={20} className="mr-2 text-primary-main" />
                    Información General
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 text-sm">
                      <Calendar size={16} className="text-gray-500" />
                      <span className="text-gray-600">Fecha emisión:</span>
                      <span className="font-medium">{format(new Date(order.issueDate), 'dd/MM/yyyy', { locale: es })}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-sm">
                      <Truck size={16} className="text-gray-500" />
                      <span className="text-gray-600">Entrega estimada:</span>
                      <span className="font-medium">{format(new Date(order.estimatedDelivery), 'dd/MM/yyyy', { locale: es })}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-sm">
                      <Building size={16} className="text-gray-500" />
                      <span className="text-gray-600">Almacén:</span>
                      <span className="font-medium">{order.warehouse}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-sm">
                      <User size={16} className="text-gray-500" />
                      <span className="text-gray-600">Comprador:</span>
                      <span className="font-medium">{order.buyer}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-sm">
                      <CreditCard size={16} className="text-gray-500" />
                      <span className="text-gray-600">Términos pago:</span>
                      <span className="font-medium">{order.paymentTerms}</span>
                    </div>
                  </div>
                </div>

                {/* Delivery Address */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-dark flex items-center">
                    <MapPin size={20} className="mr-2 text-primary-main" />
                    Dirección de Entrega
                  </h3>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-700">{order.deliveryAddress}</p>
                  </div>
                  
                  {order.notes && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-600 mb-2">Notas:</h4>
                      <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
                        <p className="text-sm text-gray-700">{order.notes}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Summary */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-dark">
                    Resumen Financiero
                  </h3>
                  
                  <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal:</span>
                      <span className="font-medium">{formatAmount(order.subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">IGV (18%):</span>
                      <span className="font-medium">{formatAmount(order.igv)}</span>
                    </div>
                    <hr className="border-gray-300" />
                    <div className="flex justify-between text-lg font-semibold">
                      <span className="text-gray-700">Total:</span>
                      <span className="text-gray-dark">{formatAmount(order.total)}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Moneda: {order.currency}
                    </p>
                  </div>
                </div>
              </div>

              {/* Items Table */}
              <div>
                <h3 className="text-lg font-medium text-gray-dark mb-4">
                  Items de la Orden
                </h3>
                
                <div className="overflow-x-auto">
                  <table className="w-full border border-gray-200 rounded-lg">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">SKU</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Descripción</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">UOM</th>
                        <th className="text-right py-3 px-4 font-medium text-gray-600">Cantidad</th>
                        <th className="text-right py-3 px-4 font-medium text-gray-600">Precio Unit.</th>
                        <th className="text-right py-3 px-4 font-medium text-gray-600">Subtotal</th>
                        <th className="text-right py-3 px-4 font-medium text-gray-600">IGV</th>
                        <th className="text-right py-3 px-4 font-medium text-gray-600">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.items.map((item) => (
                        <tr key={item.id} className="border-t border-gray-200">
                          <td className="py-3 px-4 text-sm font-medium text-gray-700">{item.sku}</td>
                          <td className="py-3 px-4 text-sm text-gray-700">{item.description}</td>
                          <td className="py-3 px-4 text-sm text-gray-600">{item.uom}</td>
                          <td className="py-3 px-4 text-sm text-gray-600 text-right">{item.quantity}</td>
                          <td className="py-3 px-4 text-sm text-gray-600 text-right">{formatAmount(item.unitPrice)}</td>
                          <td className="py-3 px-4 text-sm text-gray-600 text-right">{formatAmount(item.subtotal)}</td>
                          <td className="py-3 px-4 text-sm text-gray-600 text-right">{formatAmount(item.igv)}</td>
                          <td className="py-3 px-4 text-sm font-medium text-gray-700 text-right">{formatAmount(item.total)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Action Buttons */}
              {order.status === 'Enviada' && (
                <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => handleReceiveOrder('partial')}
                    className="flex items-center space-x-2 px-4 py-2 bg-primary-main hover:bg-primary-dark text-white rounded-lg transition-colors"
                  >
                    <AlertCircle size={16} />
                    <span>Registrar Recepción Parcial</span>
                  </button>
                  <button
                    onClick={() => handleReceiveOrder('total')}
                    className="flex items-center space-x-2 px-4 py-2 bg-success hover:bg-green-700 text-white rounded-lg transition-colors"
                  >
                    <CheckCircle size={16} />
                    <span>Registrar Recepción Total</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'timeline' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-dark">
                Timeline de la Orden
              </h3>
              
              <div className="space-y-4">
                {order.timeline.map((event, index) => (
                  <div key={event.id} className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      {getTimelineStageIcon(event.completed)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className={`text-sm font-medium ${event.completed ? 'text-gray-900' : 'text-gray-500'}`}>
                          {event.stage}
                        </p>
                        <p className="text-xs text-gray-500">
                          {format(new Date(event.date), 'dd/MM/yyyy HH:mm', { locale: es })}
                        </p>
                      </div>
                      <p className="text-sm text-gray-600">Por: {event.user}</p>
                      {index < order.timeline.length - 1 && (
                        <div className="mt-2 h-8 w-px bg-gray-200 ml-2" />
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Approval History */}
              {order.approvalHistory.length > 0 && (
                <div className="mt-8">
                  <h4 className="text-md font-medium text-gray-dark mb-4">
                    Historial de Aprobaciones
                  </h4>
                  
                  <div className="space-y-3">
                    {order.approvalHistory.map((approval) => (
                      <div key={approval.id} className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            approval.action === 'Aprobada' ? 'bg-success text-white' :
                            approval.action === 'Rechazada' ? 'bg-alert text-white' :
                            'bg-gray-500 text-white'
                          }`}>
                            {approval.action}
                          </span>
                          <span className="text-sm text-gray-500">
                            {format(new Date(approval.date), 'dd/MM/yyyy HH:mm', { locale: es })}
                          </span>
                        </div>
                        <p className="text-sm font-medium text-gray-700">Por: {approval.user}</p>
                        {approval.comment && (
                          <p className="text-sm text-gray-600 mt-2">{approval.comment}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'attachments' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-dark">
                Archivos Adjuntos
              </h3>
              
              {order.attachments.length === 0 ? (
                <div className="text-center py-8">
                  <FileText size={48} className="mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500">No hay archivos adjuntos</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {order.attachments.map((attachment) => (
                    <div key={attachment.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <FileText size={24} className="text-primary-main" />
                          <div>
                            <p className="text-sm font-medium text-gray-700 truncate">
                              {attachment.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {attachment.size} • {attachment.type}
                            </p>
                            <p className="text-xs text-gray-500">
                              {format(new Date(attachment.uploadDate), 'dd/MM/yyyy', { locale: es })}
                            </p>
                          </div>
                        </div>
                        <button className="p-1 rounded-lg hover:bg-gray-100 transition-colors">
                          <Download size={16} className="text-gray-600" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Toast notification */}
        {showToast && (
          <div className="fixed bottom-4 right-4 bg-success text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-pulse">
            {showToast}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetailModal;