import React, { useEffect, useState } from 'react';
import SupplierOverview from './suppliers/SupplierOverview';
import SupplierTable from './suppliers/SupplierTable';
import SupplierModal from './suppliers/SupplierModal';
import CurrencyToggle from './dashboard/CurrencyToggle';
import { Supplier, SupplierFilters } from '../types';

const API_URL = "http://localhost:4000/api/proveedores"; 

const Proveedores: React.FC = () => {
  const [selectedCurrency, setSelectedCurrency] = useState<'PEN' | 'USD'>('PEN');
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [filteredSuppliers, setFilteredSuppliers] = useState<Supplier[]>([]);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('view');
  const [filters, setFilters] = useState<SupplierFilters>({
    search: '',
    status: 'Todos',
    sector: 'Todos',
    dateRange: 'Todos'
  });

  // 🔹 Cargar proveedores desde la BD
  const fetchSuppliers = async () => {
    const res = await fetch(API_URL);
    const data = await res.json();

    // 🔁 Convertimos los nombres de campos al formato que espera el frontend
  const mappedData = data.map((item: any) => ({
    id: item.id,
    name: item.proveedor,            
    ruc: item.ruc,
    sector: item.sector,
    status: item.estado,
    registrationDate: item.fecha_registro,
    lastOrder: item.ultima_orden,
    totalBilled: item.total_facturado,
    representative: item.representante || "", 
  }));

    setSuppliers(mappedData);
  setFilteredSuppliers(mappedData);
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  // 🔹 Crear proveedor
const handleSaveSupplier = async (newSupplier: Supplier) => {
  console.log("📦 Enviando proveedor:", newSupplier);

  const supplierData = {
      proveedor: newSupplier.name,
      ruc: newSupplier.ruc,
      sector: newSupplier.sector,
      estado: newSupplier.status,
      fecha_registro: new Date().toISOString().split('T')[0], // Fecha actual (YYYY-MM-DD)
      ultima_orden: new Date().toISOString().split('T')[0],
      total_facturado: 0 // Valor inicial
    };

    await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(supplierData),
    });

    await fetchSuppliers(); 
  };


  // 🔹 Editar proveedor
      const handleEditSupplier = async (supplier: Supplier) => {
        console.log("✏️ Editando proveedor:", supplier);

        const supplierData = {
          proveedor: supplier.name,
          ruc: supplier.ruc,
          sector: supplier.sector,
          estado: supplier.status,
          fecha_registro: supplier.registrationDate
            ? new Date(supplier.registrationDate).toISOString().split('T')[0]
            : new Date().toISOString().split('T')[0],
          ultima_orden: supplier.lastOrder
            ? new Date(supplier.lastOrder).toISOString().split('T')[0]
            : new Date().toISOString().split('T')[0],
          total_facturado: supplier.totalBilled || 0,
        };

        await fetch(`${API_URL}/${supplier.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(supplierData),
        });

        await fetchSuppliers(); // 🔄 Refresca la tabla
      };

      // 🔹 Eliminar proveedor
      const handleDeleteSupplier = async (id: number) => {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        await fetchSuppliers(); // 🔄 refresca la tabla luego de borrar
      };


      // 🔹 Suspender proveedor
const handleSuspendSupplier = async (supplier: Supplier) => {
  const updatedSupplier = { ...supplier, status: "Suspendido" };

  await fetch(`${API_URL}/${supplier.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      proveedor: supplier.name,
      ruc: supplier.ruc,
      sector: supplier.sector,
      estado: "Suspendido", // 👈 Cambia el estado
      fecha_registro: supplier.registrationDate,
      ultima_orden: supplier.lastOrder,
      total_facturado: supplier.totalBilled,
    }),
  });

  await fetchSuppliers(); // 🔄 refresca la tabla
};

  // 🔹 Filtrado
  const handleFilterChange = (newFilters: Partial<SupplierFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    
    let filtered = suppliers;

    if (updatedFilters.search) {
      const searchTerm = updatedFilters.search.toLowerCase();
      filtered = filtered.filter(supplier => 
        supplier.name.toLowerCase().includes(searchTerm) ||  // ✅ antes decía "nombre"
        supplier.ruc.includes(searchTerm) ||
        supplier.representative.toLowerCase().includes(searchTerm)  // ✅ antes decía "representante"
      );
    }

    if (updatedFilters.status !== 'Todos') {
      filtered = filtered.filter(supplier => supplier.status === updatedFilters.status);
    }

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

  const handleOpenEditSupplier = (supplier: Supplier) => {
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

      <SupplierOverview currency={selectedCurrency} />

      <SupplierTable
        suppliers={filteredSuppliers}
        currency={selectedCurrency}
        filters={filters}
        onFilterChange={handleFilterChange}
        onSupplierSelect={handleSupplierSelect}
        onCreateSupplier={handleCreateSupplier}
        onEditSupplier={handleOpenEditSupplier}
        onDeleteSupplier={handleDeleteSupplier} 
      />

      {showModal && (
        <SupplierModal
          supplier={selectedSupplier}
          mode={modalMode}
          onClose={handleCloseModal}
          currency={selectedCurrency}
          onSave={modalMode === 'create' ? handleSaveSupplier : handleEditSupplier}
        />
      )}
    </div>
  );
};

export default Proveedores;
