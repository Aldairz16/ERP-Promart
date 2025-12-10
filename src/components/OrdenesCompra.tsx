<<<<<<< HEAD
// src/pages/OrdenesCompra.tsx
import React, { useState, useEffect, useCallback } from 'react';
import OrderOverview from '../components/orders/OrderOverview';
import OrderCharts from '../components/orders/OrderCharts';
import OrderTable from '../components/orders/OrderTable';
import OrderDetailModal from '../components/orders/OrderDetailModal';
import CreateOrderModal from '../components/orders/CreateOrderModal';
import CurrencyToggle from '../components/dashboard/CurrencyToggle';
import TimeFilter from '../components/dashboard/TimeFilter';
import { PurchaseOrder, OrderFilters, TimePeriod } from '../types';
import { mockPurchaseOrders } from '../data/mockData'; 

// URL base de tu backend
const API_URL = 'http://localhost:4000/api';

const OrdenesCompra: React.FC = () => {
  const [selectedCurrency, setSelectedCurrency] = useState<'PEN' | 'USD'>('PEN');
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('Mes');
  
  // Datos del backend
  const [orders, setOrders] = useState<PurchaseOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); 
  const [suppliers, setSuppliers] = useState<any[]>([]); // Proveedores de PostgreSQL
  const [kpis, setKpis] = useState<any[]>([]); 
  const [chartData, setChartData] = useState<any | null>(null); 

  const [filteredOrders, setFilteredOrders] = useState<PurchaseOrder[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<PurchaseOrder | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  // Estado para la Duplicación y Edición
  const [orderToDuplicate, setOrderToDuplicate] = useState<PurchaseOrder | null>(null); 
  const [orderToEdit, setOrderToEdit] = useState<PurchaseOrder | null>(null); // <-- Estado para EDICIÓN
    
  const [filters, setFilters] = useState<OrderFilters>({
    search: '',
    status: 'Todos',
    supplier: 'Todos',
    dateRange: 'Todos',
    warehouse: 'Todos',
    category: 'Todos',
    currency: 'Todos'
  });

  // Función unificada para cargar TODOS los datos del backend
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null); 
    try {
      
      // Petición 4: Datos de Gráficos
      const chartsResponse = await fetch(`${API_URL}/orders/charts`);
      if (!chartsResponse.ok) throw new Error(`Failed to fetch charts: ${chartsResponse.statusText}`);
      const chartsData = await chartsResponse.json();
      setChartData(chartsData);

      // Petición 3: KPIs
      const kpisResponse = await fetch(`${API_URL}/orders/kpis`);
      if (!kpisResponse.ok) throw new Error(`Failed to fetch KPIs: ${kpisResponse.statusText}`);
      const kpisData = await kpisResponse.json();
      setKpis(kpisData);

      // Petición 2: Proveedores
      const suppliersResponse = await fetch(`${API_URL}/proveedores`);
      if (!suppliersResponse.ok) throw new Error(`Failed to fetch suppliers: ${suppliersResponse.statusText}`);
      const suppliersRawData = await suppliersResponse.json();

      // Mapeo de proveedores 
      const mappedSuppliers = suppliersRawData.map((p: any) => ({ 
        ruc: p.ruc, 
        name: p.proveedor, 
        status: p.estado ? 'Activo' : 'Inactivo',
        contact: { address: p.direccion || 'N/A' },
        sector: p.sector || 'General' 
      }));
      
      setSuppliers(mappedSuppliers); 

      // Petición 1: Órdenes de Compra
      const ordersResponse = await fetch(`${API_URL}/orders`);
      if (!ordersResponse.ok) throw new Error(`Failed to fetch orders: ${ordersResponse.statusText}`);
      const ordersData = await ordersResponse.json();
      
      setOrders(ordersData); 
      setFilteredOrders(ordersData);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error desconocido al cargar datos.";
      console.error("Error crítico al cargar datos:", err);
      setSuppliers([]);
      setOrders([]);
      setKpis([]);
      setChartData(null);
      setError(`Fallo al cargar datos: ${errorMessage}. Verifique el servidor backend.`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);


  // Lógica de filtrado (sin cambios)
  const handleFilterChange = (newFilters: Partial<OrderFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    
    let filtered = orders;

    // Search filter
    if (updatedFilters.search) {
      const searchTerm = updatedFilters.search.toLowerCase();
      filtered = filtered.filter(order => 
        order.id.toLowerCase().includes(searchTerm) ||
        order.supplierName.toLowerCase().includes(searchTerm) ||
        order.supplierRuc.includes(searchTerm) ||
        order.buyer?.toLowerCase().includes(searchTerm)
      );
    }

    // Status filter
    if (updatedFilters.status !== 'Todos') {
      filtered = filtered.filter(order => order.status === updatedFilters.status);
    }

    // Supplier filter
    if (updatedFilters.supplier !== 'Todos') {
      filtered = filtered.filter(order => order.supplierName === updatedFilters.supplier);
    }

    // Warehouse filter
    if (updatedFilters.warehouse !== 'Todos') {
      filtered = filtered.filter(order => order.warehouse === updatedFilters.warehouse);
    }

    // Category filter
    if (updatedFilters.category !== 'Todos') {
      filtered = filtered.filter(order => order.category === updatedFilters.category);
    }

    // Currency filter
    if (updatedFilters.currency !== 'Todos') {
      filtered = filtered.filter(order => order.currency === updatedFilters.currency);
    }

    setFilteredOrders(filtered);
  };

  // Manejo de la selección de orden (para modal de detalle)
  const handleOrderSelect = async (order: PurchaseOrder) => {
    // Fetch DETALLES de la OC al abrir el modal (requiere /api/orders/:id)
    try {
        const response = await fetch(`${API_URL}/orders/${order.id}`);
        if (!response.ok) throw new Error("Failed to fetch order details");
        const detailedOrder = await response.json();
        
        const finalOrder: PurchaseOrder = {
          ...detailedOrder,
          attachments: detailedOrder.attachments || [],
          approvalHistory: detailedOrder.approvalHistory || []
        }

        setSelectedOrder(finalOrder);
        setShowDetailModal(true);
    } catch (error) {
        console.error("Error fetching order details:", error);
    }
  };

  // Función de Duplicar
  const handleDuplicateOrder = (order: PurchaseOrder) => {
    setOrderToDuplicate(order);
    setShowCreateModal(true);
  };
  
  // Función de Editar (Inicia el flujo de edición)
  const handleEditOrder = async (order: PurchaseOrder) => {
    // Es CRUCIAL obtener los detalles COMPLETO (incluyendo ítems) antes de editar
    try {
        const response = await fetch(`${API_URL}/orders/${order.id}`);
        if (!response.ok) throw new Error("Failed to fetch order details for editing");
        const detailedOrder = await response.json();
        
        setOrderToEdit(detailedOrder);
        setShowCreateModal(true); // Reutilizamos el mismo modal
    } catch (error) {
        console.error("Error al preparar orden para edición:", error);
    }
  };


  // Función de Nueva Orden (Vacía)
  const handleCreateOrder = () => {
    setOrderToDuplicate(null); 
    setOrderToEdit(null); // Asegura que no estemos en modo edición
    setShowCreateModal(true);
  };

  const handleCloseDetailModal = () => {
    setShowDetailModal(false);
    setSelectedOrder(null);
  };

  const handleCloseCreateModal = () => {
    setOrderToDuplicate(null); 
    setOrderToEdit(null); // Limpiar datos de edición/duplicación al cerrar
    setShowCreateModal(false);
  };

  // Envío de la Orden de Compra (POST a PostgreSQL)
  const handleCreateOrderSubmit = async (orderData: any) => {
    try {
      const response = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        fetchData(); // Recargar datos tras la creación
      } else {
        const errorData = await response.json();
        console.error("Error al crear orden en el servidor:", errorData.message);
      }
    } catch (error) {
      console.error("Error al conectar con el servidor:", error);
    }

    handleCloseCreateModal(); 
  };

  // Envío de la Orden de Edición (PUT a PostgreSQL)
  const handleEditOrderSubmit = async (orderData: any) => {
    const editId = orderData.id;
    try {
      const response = await fetch(`${API_URL}/orders/${editId}`, { 
        method: 'PUT', // <-- USAMOS PUT PARA EDITAR
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Fallo al actualizar: ${errorData.message}`);
      }

      fetchData(); // Recargar datos tras la edición
      
    } catch (error) {
      console.error("Error al editar orden:", error);
      // Aquí podrías mostrar un toast de error
    }

    handleCloseCreateModal();
  };


  // --- RENDERIZADO CONDICIONAL ---

  if (loading) {
    return (
      <div className="text-center py-10">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-main mx-auto"></div>
        <p className="mt-4 text-gray-600">Cargando datos de la Base de Datos...</p>
      </div>
    );
  }

  if (error) {
    return (
        <div className="text-center py-10 bg-red-100 border border-red-400 text-red-700 rounded-lg p-6">
            <p className="font-semibold text-lg mb-2">🚨 Error de Conexión o Carga de Datos 🚨</p>
            <p className="mb-4">{error}</p>
            <p className="text-sm">Por favor, asegúrate de que tu servidor backend esté corriendo en el puerto 4000 y que la base de datos PostgreSQL esté accesible.</p>
            <button
                onClick={() => fetchData()}
                className="mt-4 px-4 py-2 bg-primary-main text-white rounded hover:bg-primary-dark transition-colors"
            >
                Reintentar Carga
            </button>
        </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <h1 className="text-lg font-semibold text-gray-dark">
            Órdenes de Compra
          </h1>
          <TimeFilter 
            selectedPeriod={selectedPeriod} 
            onPeriodChange={setSelectedPeriod} 
          />
        </div>
        <CurrencyToggle 
          selectedCurrency={selectedCurrency} 
          onCurrencyChange={setSelectedCurrency} 
        />
      </div>

      {/* KPI Overview */}
      <OrderOverview 
        period={selectedPeriod} 
        currency={selectedCurrency}
        kpis={kpis} 
      />

      {/* Separador visual */}
      <hr className="border-gray-200" />
      
      {/* Charts Section */}
      {chartData && (
        <OrderCharts 
            currency={selectedCurrency}
            period={selectedPeriod}
            chartData={chartData} 
        />
      )}

      {/* Separador visual */}
      <hr className="border-gray-200" />

      {/* Orders Table */}
      <OrderTable
        orders={filteredOrders}
        currency={selectedCurrency}
        filters={filters}
        onFilterChange={handleFilterChange}
        onOrderSelect={handleOrderSelect}
        onCreateOrder={handleCreateOrder}
        onDuplicateOrder={handleDuplicateOrder}
        onEditOrder={handleEditOrder} // <-- PASAR FUNCIÓN DE EDICIÓN
        allSuppliers={suppliers.map(s => s.name)} 
        onDataUpdate={fetchData} 
      />

      {/* Order Detail Modal */}
      {showDetailModal && selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          currency={selectedCurrency}
          onClose={handleCloseDetailModal}
        />
      )}

      {/* Create/Duplicate/Edit Modal (Reutilizado) */}
      {showCreateModal && (
        <CreateOrderModal
          currency={selectedCurrency}
          onClose={handleCloseCreateModal}
          onSubmit={orderToEdit ? handleEditOrderSubmit : handleCreateOrderSubmit} // <-- Elegir PUT o POST
          allSuppliers={suppliers} 
          // Priorizar Edición, si no hay, usar Duplicación
          initialData={orderToEdit || orderToDuplicate} 
          isEditMode={!!orderToEdit} // <-- Activar modo edición si orderToEdit existe
        />
      )}
    </div>
  );
=======
import React, { useState } from 'react';
import OrderOverview from './orders/OrderOverview';
import OrderCharts from './orders/OrderCharts';
import OrderTable from './orders/OrderTable';
import OrderDetailModal from './orders/OrderDetailModal';
import CreateOrderModal from './orders/CreateOrderModal';
import CurrencyToggle from './dashboard/CurrencyToggle';
import TimeFilter from './dashboard/TimeFilter';
import { PurchaseOrder, OrderFilters, TimePeriod } from '../types';
import { mockPurchaseOrders } from '../data/mockData';

const OrdenesCompra: React.FC = () => {
  const [selectedCurrency, setSelectedCurrency] = useState<'PEN' | 'USD'>('PEN');
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('Mes');
  const [orders] = useState<PurchaseOrder[]>(mockPurchaseOrders);
  const [filteredOrders, setFilteredOrders] = useState<PurchaseOrder[]>(mockPurchaseOrders);
  const [selectedOrder, setSelectedOrder] = useState<PurchaseOrder | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filters, setFilters] = useState<OrderFilters>({
    search: '',
    status: 'Todos',
    supplier: 'Todos',
    dateRange: 'Todos',
    warehouse: 'Todos',
    category: 'Todos',
    currency: 'Todos'
  });

  const handleFilterChange = (newFilters: Partial<OrderFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    
    let filtered = orders;

    // Search filter
    if (updatedFilters.search) {
      const searchTerm = updatedFilters.search.toLowerCase();
      filtered = filtered.filter(order => 
        order.id.toLowerCase().includes(searchTerm) ||
        order.supplierName.toLowerCase().includes(searchTerm) ||
        order.supplierRuc.includes(searchTerm) ||
        order.buyer.toLowerCase().includes(searchTerm)
      );
    }

    // Status filter
    if (updatedFilters.status !== 'Todos') {
      filtered = filtered.filter(order => order.status === updatedFilters.status);
    }

    // Supplier filter
    if (updatedFilters.supplier !== 'Todos') {
      filtered = filtered.filter(order => order.supplierName === updatedFilters.supplier);
    }

    // Warehouse filter
    if (updatedFilters.warehouse !== 'Todos') {
      filtered = filtered.filter(order => order.warehouse === updatedFilters.warehouse);
    }

    // Category filter
    if (updatedFilters.category !== 'Todos') {
      filtered = filtered.filter(order => order.category === updatedFilters.category);
    }

    // Currency filter
    if (updatedFilters.currency !== 'Todos') {
      filtered = filtered.filter(order => order.currency === updatedFilters.currency);
    }

    setFilteredOrders(filtered);
  };

  const handleOrderSelect = (order: PurchaseOrder) => {
    setSelectedOrder(order);
    setShowDetailModal(true);
  };

  const handleCreateOrder = () => {
    setShowCreateModal(true);
  };

  const handleCloseDetailModal = () => {
    setShowDetailModal(false);
    setSelectedOrder(null);
  };

  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
  };

  const handleCreateOrderSubmit = async (orderData: any) => {
    console.log("Orden creada:", orderData);

    try {
      // Si luego conectas con tu backend:
      /*
      await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });
      */
    } catch (error) {
      console.error("Error al crear orden:", error);
    }

    setShowCreateModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <h1 className="text-lg font-semibold text-gray-dark">
            Órdenes de Compra
          </h1>
          <TimeFilter 
            selectedPeriod={selectedPeriod} 
            onPeriodChange={setSelectedPeriod} 
          />
        </div>
        <CurrencyToggle 
          selectedCurrency={selectedCurrency} 
          onCurrencyChange={setSelectedCurrency} 
        />
      </div>

      {/* KPI Overview */}
      <OrderOverview 
        period={selectedPeriod} 
        currency={selectedCurrency} 
      />

      {/* Charts Section */}
      <OrderCharts 
        currency={selectedCurrency}
        period={selectedPeriod}
      />

      {/* Orders Table */}
      <OrderTable
        orders={filteredOrders}
        currency={selectedCurrency}
        filters={filters}
        onFilterChange={handleFilterChange}
        onOrderSelect={handleOrderSelect}
        onCreateOrder={handleCreateOrder}
      />

      {/* Order Detail Modal */}
      {showDetailModal && selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          currency={selectedCurrency}
          onClose={handleCloseDetailModal}
        />
      )}

      {/* Create Order Modal */}
      {showCreateModal && (
        <CreateOrderModal
          currency={selectedCurrency}
          onClose={handleCloseCreateModal}
           onSubmit={handleCreateOrderSubmit}
        />
      )}
    </div>
  );
>>>>>>> 87921f61849e3e0eb14846645dbdd687c465f7c5
};

export default OrdenesCompra;