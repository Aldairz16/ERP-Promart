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
        />
      )}
    </div>
  );
};

export default OrdenesCompra;