import React, { ReactNode } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { useSidebar } from '../hooks/useSidebar';

type Section = 'dashboard' | 'proveedores' | 'ordenes' | 'inventario' | 'reportes';

interface LayoutProps {
  children: ReactNode;
  activeSection: Section;
  onSectionChange: (section: Section) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeSection, onSectionChange }) => {
  const { isCollapsed, isMobileOpen, toggleCollapsed, toggleMobile, closeMobile } = useSidebar();

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar 
        activeSection={activeSection} 
        onSectionChange={onSectionChange}
        isCollapsed={isCollapsed}
        onToggleCollapsed={toggleCollapsed}
        isMobileOpen={isMobileOpen}
        onCloseMobile={closeMobile}
      />
      <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${
        isCollapsed ? 'lg:ml-0' : 'lg:ml-0'
      }`}>
        <Header 
          activeSection={activeSection} 
          onMobileMenuToggle={toggleMobile}
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;