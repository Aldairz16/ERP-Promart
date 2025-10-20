import React, { useState } from 'react';
import SupplierOverview from './suppliers/SupplierOverview';
import SupplierTable from './suppliers/SupplierTable';
import SupplierModal from './suppliers/SupplierModal';
import CurrencyToggle from './dashboard/CurrencyToggle';
import { Supplier, SupplierFilters } from '../types';
import { mockSuppliers } from '../data/mockData';

const Proveedores: React.FC = () => {
  const [selectedCurrency, setSelectedCurrency] = useState<'PEN' | 'USD'>('PEN');
  const [suppliers] = useState<Supplier[]>(mockSuppliers);
  const [filteredSuppliers, setFilteredSuppliers] = useState<Supplier[]>(mockSuppliers);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('view');
  const [filters, setFilters] = useState<SupplierFilters>({
    search: '',
    status: 'Todos',
    sector: 'Todos',
    dateRange: 'Todos'
  });

  const handleFilterChange = (newFilters: Partial<SupplierFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    
    let filtered = suppliers;

    // Search filter
    if (updatedFilters.search) {
      const searchTerm = updatedFilters.search.toLowerCase();
      filtered = filtered.filter(supplier => 
        supplier.name.toLowerCase().includes(searchTerm) ||
        supplier.ruc.includes(searchTerm) ||
        supplier.representative.toLowerCase().includes(searchTerm)
      );
    }

    // Status filter
    if (updatedFilters.status !== 'Todos') {
      filtered = filtered.filter(supplier => supplier.status === updatedFilters.status);
    }

    // Sector filter
    if (updatedFilters.sector !== 'Todos') {
      filtered = filtered.filter(supplier => supplier.sector === updatedFilters.sector);
    }

    setFilteredSuppliers(filtered);
  };

  const handleSupplierSelect = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setModalMode('view');
    setShowModal(true);
  };

  const handleCreateSupplier = () => {
    setSelectedSupplier(null);
    setModalMode('create');
    setShowModal(true);
  };

  const handleEditSupplier = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setModalMode('edit');
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedSupplier(null);
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center space-x-4">
          <h1 className="text-lg font-semibold text-gray-dark">
            Gestión de Proveedores
          </h1>
        </div>
        <CurrencyToggle 
          selectedCurrency={selectedCurrency} 
          onCurrencyChange={setSelectedCurrency} 
        />
      </div>

      {/* KPI Overview */}
      <SupplierOverview currency={selectedCurrency} />

      {/* Supplier Table */}
      <SupplierTable
        suppliers={filteredSuppliers}
        currency={selectedCurrency}
        filters={filters}
        onFilterChange={handleFilterChange}
        onSupplierSelect={handleSupplierSelect}
        onCreateSupplier={handleCreateSupplier}
        onEditSupplier={handleEditSupplier}
      />

      {/* Supplier Modal */}
      {showModal && (
        <SupplierModal
          supplier={selectedSupplier}
          mode={modalMode}
          onClose={handleCloseModal}
          currency={selectedCurrency}
        />
      )}
    </div>
  );
};

export default Proveedores;