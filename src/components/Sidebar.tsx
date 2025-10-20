import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  ShoppingCart, 
  Package, 
  BarChart3,
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react';

type Section = 'dashboard' | 'proveedores' | 'ordenes' | 'inventario' | 'reportes';

const menuItems = [
  { id: 'dashboard' as Section, label: 'Dashboard', icon: LayoutDashboard },
  { id: 'proveedores' as Section, label: 'Proveedores', icon: Users },
  { id: 'ordenes' as Section, label: 'Órdenes de compra', icon: ShoppingCart },
  { id: 'inventario' as Section, label: 'Inventario', icon: Package },
  { id: 'reportes' as Section, label: 'Reportes', icon: BarChart3 },
];

interface SidebarProps {
  activeSection: Section;
  onSectionChange: (section: Section) => void;
  isCollapsed: boolean;
  onToggleCollapsed: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  activeSection, 
  onSectionChange, 
  isCollapsed, 
  onToggleCollapsed,
  isMobileOpen,
  onCloseMobile
}) => {
  const handleSectionChange = (section: Section) => {
    onSectionChange(section);
    onCloseMobile(); // Close mobile sidebar when navigating
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:relative inset-y-0 left-0 z-50 lg:z-auto
        bg-white border-r border-gray-200 
        transition-all duration-300 ease-in-out
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        ${isCollapsed ? 'lg:w-16' : 'lg:w-64'}
        w-64
      `}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className={`transition-all duration-200 ${isCollapsed ? 'lg:opacity-0 lg:w-0 lg:overflow-hidden' : 'opacity-100'}`}>
            <h1 className="text-xl font-bold text-gray-dark">Compras ERP</h1>
            <p className="text-sm text-gray-medium">Sistema de Compras</p>
          </div>
          
          {/* Mobile close button */}
          <button
            onClick={onCloseMobile}
            className="lg:hidden p-1 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-main"
            aria-label="Cerrar menú"
          >
            <X size={20} />
          </button>
          
          {/* Desktop collapse button */}
          <button
            onClick={onToggleCollapsed}
            className="hidden lg:block p-1 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-main"
            aria-label={isCollapsed ? 'Expandir sidebar' : 'Contraer sidebar'}
            aria-expanded={!isCollapsed}
          >
            {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>
        
        <nav className="p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => handleSectionChange(item.id)}
                  className={`w-full flex items-center px-3 py-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-main group relative ${
                    activeSection === item.id 
                      ? 'bg-primary-main text-white shadow-md' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  title={isCollapsed ? item.label : undefined}
                >
                  <item.icon size={20} className="flex-shrink-0" />
                  <span className={`ml-3 transition-all duration-200 ${
                    isCollapsed ? 'lg:opacity-0 lg:w-0 lg:overflow-hidden' : 'opacity-100'
                  }`}>
                    {item.label}
                  </span>
                  
                  {/* Tooltip for collapsed state */}
                  {isCollapsed && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 hidden lg:block">
                      {item.label}
                    </div>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;