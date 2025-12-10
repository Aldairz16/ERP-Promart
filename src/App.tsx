import { useState } from 'react'
import Layout from './components/Layout'
import Dashboard from './components/Dashboard'
import Proveedores from './components/Proveedores'
import OrdenesCompra from './components/OrdenesCompra'
import Inventario from './components/Inventario'
import Reportes from './components/Reportes'
import { ToastProvider } from './components/ui/ToastProvider'

type Section = 'dashboard' | 'proveedores' | 'ordenes' | 'inventario' | 'reportes';

function App() {
  const [activeSection, setActiveSection] = useState<Section>('dashboard');

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard />;
      case 'proveedores':
        return <Proveedores />;
      case 'ordenes':
        return <OrdenesCompra />;
      case 'inventario':
        return <Inventario />;
      case 'reportes':
        return <Reportes />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <ToastProvider>
      <Layout activeSection={activeSection} onSectionChange={setActiveSection}>
        {renderContent()}
      </Layout>
    </ToastProvider>
  )
}

export default App