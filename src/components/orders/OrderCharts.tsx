<<<<<<< HEAD
// src/components/orders/OrderCharts.tsx
import React from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TimePeriod } from '../../types';

interface ChartData {
  categoryData: { name: string; value: number; orders: number }[];
  supplierData: { name: string; value: number }[];
  agingData: { range: string; count: number; percentage: string }[];
}

interface OrderChartsProps {
  currency: 'PEN' | 'USD';
  period: TimePeriod;
  chartData: ChartData; // <-- Usa datos reales
=======
import React from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getCategorySpendingData, getTopSuppliersData, getApprovalAgingData } from '../../data/mockData';
import { TimePeriod } from '../../types';

interface OrderChartsProps {
  currency: 'PEN' | 'USD';
  period: TimePeriod;
>>>>>>> 87921f61849e3e0eb14846645dbdd687c465f7c5
}

const CATEGORY_COLORS = ['#FF6F00', '#FF8F00', '#FFA000', '#FFB300', '#FFC107'];

<<<<<<< HEAD
const OrderCharts: React.FC<OrderChartsProps> = ({ currency, chartData }) => {
  
  const { categoryData, supplierData, agingData } = chartData;
=======
const OrderCharts: React.FC<OrderChartsProps> = ({ currency }) => {
  const categoryData = getCategorySpendingData(currency);
  const supplierData = getTopSuppliersData(currency);
  const agingData = getApprovalAgingData();
>>>>>>> 87921f61849e3e0eb14846645dbdd687c465f7c5

  const formatCurrency = (value: number) => {
    const symbol = currency === 'USD' ? '$' : 'S/';
    return `${symbol}${value.toLocaleString('es-PE', { 
      minimumFractionDigits: 0,
      maximumFractionDigits: 0 
    })}`;
  };

  const formatTooltip = (value: number, name: string) => {
    if (name === 'value' || name === 'gasto') {
      return [formatCurrency(value), 'Monto'];
    }
    return [value, name];
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      {/* Category Spending Chart */}
      <div className="card">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-dark">
              Gasto por Categoría
            </h3>
            <p className="text-sm text-gray-medium">
              Distribución de compras por rubro
            </p>
          </div>
        </div>
        
<<<<<<< HEAD
        {categoryData.length > 0 ? (
          <>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={formatTooltip} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-4 space-y-2">
              {categoryData.map((item, index) => (
                <div key={item.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: CATEGORY_COLORS[index % CATEGORY_COLORS.length] }}
                    />
                    <span className="text-gray-600">{item.name}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-dark">{formatCurrency(item.value)}</p>
                    <p className="text-xs text-gray-500">{item.orders} órdenes</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-10 text-gray-500">No hay datos de categorías.</div>
        )}
=======
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {categoryData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={formatTooltip} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-4 space-y-2">
          {categoryData.map((item, index) => (
            <div key={item.name} className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: CATEGORY_COLORS[index % CATEGORY_COLORS.length] }}
                />
                <span className="text-gray-600">{item.name}</span>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-dark">{formatCurrency(item.value)}</p>
                <p className="text-xs text-gray-500">{item.orders} órdenes</p>
              </div>
            </div>
          ))}
        </div>
>>>>>>> 87921f61849e3e0eb14846645dbdd687c465f7c5
      </div>

      {/* Top Suppliers Chart */}
      <div className="card">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-dark">
              Top 5 Proveedores
            </h3>
            <p className="text-sm text-gray-medium">
              Mayores montos facturados
            </p>
          </div>
        </div>
        
<<<<<<< HEAD
        {supplierData.length > 0 ? (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={supplierData} layout="horizontal" margin={{ left: 10, right: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  type="number" 
                  stroke="#6b7280"
                  fontSize={12}
                  tickFormatter={(value) => formatCurrency(value)}
                />
                <YAxis 
                  type="category" 
                  dataKey="name" 
                  stroke="#6b7280"
                  fontSize={12}
                  width={80}
                />
                <Tooltip
                  formatter={formatTooltip}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Bar dataKey="value" fill="#2E7D32" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="text-center py-10 text-gray-500">No hay datos de proveedores.</div>
        )}
=======
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={supplierData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                type="number" 
                stroke="#6b7280"
                fontSize={12}
                tickFormatter={(value) => formatCurrency(value)}
              />
              <YAxis 
                type="category" 
                dataKey="name" 
                stroke="#6b7280"
                fontSize={12}
                width={80}
              />
              <Tooltip
                formatter={formatTooltip}
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Bar dataKey="value" fill="#2E7D32" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
>>>>>>> 87921f61849e3e0eb14846645dbdd687c465f7c5
      </div>

      {/* Approval Aging Chart */}
      <div className="card">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-dark">
              Aging de Aprobaciones
            </h3>
            <p className="text-sm text-gray-medium">
              Tiempo en proceso de aprobación
            </p>
          </div>
        </div>
        
<<<<<<< HEAD
        {agingData.length > 0 ? (
          <div className="space-y-4">
            {agingData.map((item, index) => (
              <div key={item.range} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">{item.range}</span>
                  <div className="text-right">
                    <span className="text-sm font-semibold text-gray-dark">{item.count} OCs</span>
                    <span className="text-xs text-gray-500 ml-2">({item.percentage}%)</span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      index === 0 ? 'bg-success' :
                      index === 1 ? 'bg-yellow-500' :
                      index === 2 ? 'bg-primary-main' :
                      'bg-alert'
                    }`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-gray-500">No hay órdenes en aprobación.</div>
        )}
=======
        <div className="space-y-4">
          {agingData.map((item, index) => (
            <div key={item.range} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600">{item.range}</span>
                <div className="text-right">
                  <span className="text-sm font-semibold text-gray-dark">{item.count} OCs</span>
                  <span className="text-xs text-gray-500 ml-2">({item.percentage}%)</span>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${
                    index === 0 ? 'bg-success' :
                    index === 1 ? 'bg-yellow-500' :
                    index === 2 ? 'bg-primary-main' :
                    'bg-alert'
                  }`}
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
>>>>>>> 87921f61849e3e0eb14846645dbdd687c465f7c5
        
        <div className="mt-6 p-3 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-600">
            <span className="font-medium">Meta:</span> 90% de aprobaciones en menos de 3 días
          </p>
          <p className="text-xs text-success font-medium mt-1">
<<<<<<< HEAD
            Actual: {agingData.length > 0 ? (parseFloat(agingData.find(d => d.range === '0-3 días')?.percentage || '0')).toFixed(0) : '0'}% cumpliendo la meta
=======
            Actual: 90% cumpliendo la meta
>>>>>>> 87921f61849e3e0eb14846645dbdd687c465f7c5
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderCharts;