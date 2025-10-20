import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area } from 'recharts';
import { getCategoryValuationData, getRotationByCategory, getExpiryData, getWarehouseFlowData } from '../../data/mockData';

interface InventoryChartsProps {
  currency: 'PEN' | 'USD';
}

const CATEGORY_COLORS = ['#FF6F00', '#FF8F00', '#FFA000', '#FFB300', '#FFC107', '#2E7D32', '#388E3C'];

const InventoryCharts: React.FC<InventoryChartsProps> = ({ currency }) => {
  const categoryData = getCategoryValuationData(currency);
  const rotationData = getRotationByCategory();
  const expiryData = getExpiryData();
  const flowData = getWarehouseFlowData(currency);

  const formatCurrency = (value: number) => {
    const symbol = currency === 'USD' ? '$' : 'S/';
    return `${symbol}${value.toLocaleString('es-PE', { 
      minimumFractionDigits: 0,
      maximumFractionDigits: 0 
    })}`;
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      {/* Category Valuation */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-dark mb-4">
          Valorización por Categoría
        </h3>
        
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {categoryData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
          {categoryData.map((item, index) => (
            <div key={item.name} className="flex items-center">
              <div 
                className="w-3 h-3 rounded mr-2" 
                style={{ backgroundColor: CATEGORY_COLORS[index % CATEGORY_COLORS.length] }}
              />
              <span className="text-gray-600">{item.name} ({item.items} items)</span>
            </div>
          ))}
        </div>
      </div>

      {/* Rotation by Category */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-dark mb-4">
          Rotación por Categoría (Días)
        </h3>
        
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={rotationData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="Construcción" stroke="#FF6F00" strokeWidth={2} />
              <Line type="monotone" dataKey="TI" stroke="#2196F3" strokeWidth={2} />
              <Line type="monotone" dataKey="Ferretería" stroke="#4CAF50" strokeWidth={2} />
              <Line type="monotone" dataKey="Oficina" stroke="#9C27B0" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Expiry Analysis */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-dark mb-4">
          Vencimientos Próximos
        </h3>
        
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={expiryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="próximos" stackId="a" fill="#FFC107" name="Próximos a vencer" />
              <Bar dataKey="vencidos" stackId="a" fill="#F44336" name="Vencidos" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 flex items-center justify-center space-x-6 text-sm">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-yellow-500 rounded mr-2" />
            <span className="text-gray-600">Próximos a vencer</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-500 rounded mr-2" />
            <span className="text-gray-600">Vencidos</span>
          </div>
        </div>
      </div>

      {/* Warehouse Flow */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-dark mb-4">
          Flujo por Almacén ({currency})
        </h3>
        
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={flowData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(value) => formatCurrency(value)} />
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
              <Area 
                type="monotone" 
                dataKey="entradas" 
                stackId="1" 
                stroke="#4CAF50" 
                fill="#4CAF50" 
                fillOpacity={0.6}
                name="Entradas"
              />
              <Area 
                type="monotone" 
                dataKey="salidas" 
                stackId="2" 
                stroke="#2196F3" 
                fill="#2196F3" 
                fillOpacity={0.6}
                name="Salidas"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 flex items-center justify-center space-x-6 text-sm">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded mr-2" />
            <span className="text-gray-600">Entradas</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded mr-2" />
            <span className="text-gray-600">Salidas</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryCharts;