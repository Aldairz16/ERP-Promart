import React, { useState } from 'react';
import { X, Save, Phone, Mail, MapPin, User, Building, Calendar, DollarSign } from 'lucide-react';
import { Supplier } from '../../types';
import { EXCHANGE_RATE } from '../../data/mockData';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface SupplierModalProps {
  supplier: Supplier | null;
  mode: 'create' | 'edit' | 'view';
  onClose: () => void;
  currency: 'PEN' | 'USD';
}

const SupplierModal: React.FC<SupplierModalProps> = ({ supplier, mode, onClose, currency }) => {
  const [formData, setFormData] = useState({
    name: supplier?.name || '',
    ruc: supplier?.ruc || '',
    sector: supplier?.sector || '',
    representative: supplier?.representative || '',
    phone: supplier?.contact.phone || '',
    email: supplier?.contact.email || '',
    address: supplier?.contact.address || '',
    status: supplier?.status || 'En evaluación'
  });
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const isReadOnly = mode === 'view';
  const isCreating = mode === 'create';

  const formatAmount = (amount: number) => {
    const value = currency === 'USD' ? amount / EXCHANGE_RATE : amount;
    const symbol = currency === 'USD' ? '$' : 'S/';
    return `${symbol}${value.toLocaleString('es-PE', { 
      minimumFractionDigits: 2,
      maximumFractionDigits: 2 
    })}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setLoading(false);
    setShowToast(true);
    
    setTimeout(() => {
      setShowToast(false);
      onClose();
    }, 2000);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-dark">
              {isCreating ? 'Nuevo Proveedor' : 
               mode === 'edit' ? 'Editar Proveedor' : 'Detalles del Proveedor'}
            </h2>
            {supplier && (
              <p className="text-sm text-gray-medium mt-1">
                ID: {supplier.id} | Registrado: {format(new Date(supplier.registrationDate), 'dd MMMM yyyy', { locale: es })}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-main"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Basic Info */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-dark mb-4 flex items-center">
                  <Building size={20} className="mr-2 text-primary-main" />
                  Información Básica
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre del Proveedor *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      disabled={isReadOnly}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-main disabled:bg-gray-50"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      RUC *
                    </label>
                    <input
                      type="text"
                      value={formData.ruc}
                      onChange={(e) => handleInputChange('ruc', e.target.value)}
                      disabled={isReadOnly}
                      required
                      pattern="[0-9]{11}"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-main disabled:bg-gray-50"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Sector *
                    </label>
                    <select
                      value={formData.sector}
                      onChange={(e) => handleInputChange('sector', e.target.value)}
                      disabled={isReadOnly}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-main disabled:bg-gray-50"
                    >
                      <option value="">Seleccionar sector</option>
                      <option value="Distribución">Distribución</option>
                      <option value="Importación">Importación</option>
                      <option value="Tecnología">Tecnología</option>
                      <option value="Construcción">Construcción</option>
                      <option value="Oficina">Oficina</option>
                      <option value="Alimentos">Alimentos</option>
                      <option value="Químicos">Químicos</option>
                      <option value="Textil">Textil</option>
                      <option value="Salud">Salud</option>
                      <option value="Logística">Logística</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Representante *
                    </label>
                    <input
                      type="text"
                      value={formData.representative}
                      onChange={(e) => handleInputChange('representative', e.target.value)}
                      disabled={isReadOnly}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-main disabled:bg-gray-50"
                    />
                  </div>
                  
                  {!isCreating && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Estado
                      </label>
                      <select
                        value={formData.status}
                        onChange={(e) => handleInputChange('status', e.target.value)}
                        disabled={isReadOnly}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-main disabled:bg-gray-50"
                      >
                        <option value="Activo">Activo</option>
                        <option value="En evaluación">En evaluación</option>
                        <option value="Suspendido">Suspendido</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Contact & Stats */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-dark mb-4 flex items-center">
                  <User size={20} className="mr-2 text-primary-main" />
                  Información de Contacto
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <Phone size={16} className="inline mr-1" />
                      Teléfono *
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      disabled={isReadOnly}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-main disabled:bg-gray-50"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <Mail size={16} className="inline mr-1" />
                      Email *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      disabled={isReadOnly}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-main disabled:bg-gray-50"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <MapPin size={16} className="inline mr-1" />
                      Dirección *
                    </label>
                    <textarea
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      disabled={isReadOnly}
                      required
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-main disabled:bg-gray-50"
                    />
                  </div>
                </div>
              </div>

              {/* Statistics (only for existing suppliers) */}
              {supplier && mode === 'view' && (
                <div>
                  <h3 className="text-lg font-medium text-gray-dark mb-4 flex items-center">
                    <DollarSign size={20} className="mr-2 text-primary-main" />
                    Estadísticas
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">Total Facturado</p>
                      <p className="text-xl font-semibold text-gray-dark">
                        {formatAmount(supplier.totalBilled)}
                      </p>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">Última Orden</p>
                      <p className="text-lg font-medium text-gray-dark">
                        {supplier.lastOrder 
                          ? format(new Date(supplier.lastOrder), 'dd MMMM yyyy', { locale: es })
                          : 'Sin órdenes registradas'
                        }
                      </p>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">Fecha de Registro</p>
                      <p className="text-lg font-medium text-gray-dark flex items-center">
                        <Calendar size={16} className="mr-1" />
                        {format(new Date(supplier.registrationDate), 'dd MMMM yyyy', { locale: es })}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          {!isReadOnly && (
            <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex items-center space-x-2"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                ) : (
                  <Save size={16} />
                )}
                <span>{isCreating ? 'Crear Proveedor' : 'Guardar Cambios'}</span>
              </button>
            </div>
          )}
        </form>

        {/* Toast notification */}
        {showToast && (
          <div className="fixed bottom-4 right-4 bg-success text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-pulse">
            {isCreating ? 'Proveedor creado exitosamente' : 'Cambios guardados exitosamente'}
          </div>
        )}
      </div>
    </div>
  );
};

export default SupplierModal;