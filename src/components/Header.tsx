import React, { useState } from 'react';
import { Bell, User, LogOut, ChevronDown, Menu } from 'lucide-react';
import { useNotifications } from '../hooks/useNotifications';
import NotificationPanel from './NotificationPanel';

type Section = 'dashboard' | 'proveedores' | 'ordenes' | 'inventario' | 'reportes';

interface HeaderProps {
  activeSection: Section;
  onMobileMenuToggle?: () => void;
}

const sectionTitles = {
  dashboard: 'Dashboard',
  proveedores: 'Proveedores',
  ordenes: 'Órdenes de Compra',
  inventario: 'Inventario',
  reportes: 'Reportes'
};

const sectionDescriptions = {
  dashboard: 'Bienvenido al sistema de compras',
  proveedores: 'Gestión y administración de proveedores',
  ordenes: 'Control de órdenes de compra',
  inventario: 'Gestión de inventario y stock',
  reportes: 'Reportes y análisis'
};

const Header: React.FC<HeaderProps> = ({ activeSection, onMobileMenuToggle }) => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationPanelOpen, setNotificationPanelOpen] = useState(false);
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearAll } = useNotifications();

  return (
    <>
      <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            {/* Mobile menu button */}
            <button
              onClick={onMobileMenuToggle}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-main"
              aria-label="Abrir menú"
            >
              <Menu size={20} className="text-gray-600" />
            </button>
            
            <div>
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-dark">{sectionTitles[activeSection]}</h2>
              <p className="text-xs sm:text-sm text-gray-medium hidden sm:block">{sectionDescriptions[activeSection]}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Notifications */}
            <button 
              onClick={() => setNotificationPanelOpen(true)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative focus:outline-none focus:ring-2 focus:ring-primary-main"
              aria-label={`Notificaciones${unreadCount > 0 ? ` (${unreadCount} sin leer)` : ''}`}
            >
              <Bell size={20} className="text-gray-600" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-alert text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* User menu */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-main"
              >
                <div className="w-8 h-8 bg-primary-main rounded-full flex items-center justify-center">
                  <User size={16} className="text-white" />
                </div>
                <div className="text-left hidden md:block">
                  <p className="text-sm font-medium text-gray-dark">Ana García</p>
                  <p className="text-xs text-gray-medium">Administradora</p>
                </div>
                <ChevronDown size={16} className="text-gray-600" />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-dark">Ana García</p>
                    <p className="text-xs text-gray-medium">ana.garcia@empresa.com</p>
                    <p className="text-xs text-gray-medium">Administradora</p>
                  </div>
                  <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2">
                    <LogOut size={16} />
                    <span>Cerrar sesión</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Notification Panel */}
      <NotificationPanel
        isOpen={notificationPanelOpen}
        onClose={() => setNotificationPanelOpen(false)}
        notifications={notifications}
        unreadCount={unreadCount}
        onMarkAsRead={markAsRead}
        onMarkAllAsRead={markAllAsRead}
        onClearAll={clearAll}
      />
    </>
  );
};

export default Header;