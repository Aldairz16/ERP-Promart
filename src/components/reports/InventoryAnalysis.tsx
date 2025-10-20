import React from 'react';
import { ReportFilter } from '../../types';
import { Package, RotateCcw, TrendingUp, TrendingDown, AlertCircle, Calendar } from 'lucide-react';
import { getInventoryRotationData } from '../../data/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

interface InventoryAnalysisProps {
  filters: ReportFilter;
}

const InventoryAnalysis: React.FC<InventoryAnalysisProps> = ({ filters }) => {
  const rotationData = getInventoryRotationData();
  
  const formatCurrency = (amount: number) => {
    return filters.currency === 'PEN' 
      ? `S/ ${amount.toLocaleString('es-PE', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
      : `$ ${amount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  };

  const totalStockValue = rotationData.reduce((sum, item) => sum + item.stockValue, 0);
  const avgTurnover = rotationData.reduce((sum, item) => sum + item.turnoverRate, 0) / rotationData.length;
  const avgCoverage = rotationData.reduce((sum, item) => sum + item.daysCoverage, 0) / rotationData.length;
  
  const abcDistribution = [
    { class: 'A', count: rotationData.filter(item => item.abcClass === 'A').length, value: rotationData.filter(item => item.abcClass === 'A').reduce((sum, item) => sum + item.stockValue, 0) },
    { class: 'B', count: rotationData.filter(item => item.abcClass === 'B').length, value: rotationData.filter(item => item.abcClass === 'B').reduce((sum, item) => sum + item.stockValue, 0) },
    { class: 'C', count: rotationData.filter(item => item.abcClass === 'C').length, value: rotationData.filter(item => item.abcClass === 'C').reduce((sum, item) => sum + item.stockValue, 0) }
  ];

  const monthlyTurnover = [
    { month: 'Jul', turnover: 7.8, coverage: 47 },
    { month: 'Ago', turnover: 8.1, coverage: 45 },
    { month: 'Sep', turnover: avgTurnover, coverage: avgCoverage }
  ];

  const COLORS = ['#FF6F00', '#2E7D32', '#E53935'];

  const getABCColor = (abcClass: string) => {
    switch (abcClass) {
      case 'A':
        return 'bg-green-100 text-green-800';
      case 'B':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-red-100 text-red-800';
    }
  };

  const getTurnoverStatus = (turnover: number) => {
    if (turnover >= 8) return { status: 'Excelente', color: 'text-green-600', icon: TrendingUp };
    if (turnover >= 5) return { status: 'Buena', color: 'text-yellow-600', icon: RotateCcw };
    return { status: 'Baja', color: 'text-red-600', icon: TrendingDown };
  };

  const getCoverageStatus = (coverage: number) => {
    if (coverage <= 30) return { status: 'Óptimo', color: 'text-green-600' };
    if (coverage <= 60) return { status: 'Aceptable', color: 'text-yellow-600' };
    return { status: 'Excesivo', color: 'text-red-600' };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-gray-900">Análisis de Rotación de Inventario</h2>
        <p className="text-gray-600">Métricas de turnover, cobertura y clasificación ABC</p>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Valor Total Stock</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalStockValue)}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Rotación Promedio</p>
              <p className="text-2xl font-bold text-gray-900">{avgTurnover.toFixed(1)}x</p>
              <p className="text-sm text-gray-500">anual</p>
            </div>
            <div className="p-3 bg-orange-50 rounded-lg">
              <RotateCcw className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Cobertura Promedio</p>
              <p className="text-2xl font-bold text-gray-900">{avgCoverage.toFixed(0)}</p>
              <p className="text-sm text-gray-500">días</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Productos Clase A</p>
              <p className="text-2xl font-bold text-green-600">{abcDistribution[0].count}</p>
              <p className="text-sm text-gray-500">80% del valor</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Turnover by Category */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Rotación por Categoría</h3>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={rotationData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="turnoverRate" fill="#FF6F00" name="Rotación (veces/año)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* ABC Distribution */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribución ABC por Valor</h3>
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={abcDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ class: abcClass, percent }) => `Clase ${abcClass}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {abcDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Coverage Analysis */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Análisis de Cobertura (Días de Stock)</h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={rotationData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="daysCoverage" fill="#2E7D32" name="Días de Cobertura" />
            <Bar dataKey={60} fill="transparent" stroke="#E53935" strokeDasharray="3 3" name="Target (60 días)" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Detailed Analysis Table */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Análisis Detallado por Categoría</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Categoría
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rotación
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cobertura
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock Promedio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Valor Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Clase ABC
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {rotationData.map((item, index) => {
                const turnoverStatus = getTurnoverStatus(item.turnoverRate);
                const coverageStatus = getCoverageStatus(item.daysCoverage);
                const TurnoverIcon = turnoverStatus.icon;
                
                return (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center space-x-2">
                        <span className={`font-medium ${turnoverStatus.color}`}>
                          {item.turnoverRate.toFixed(1)}x
                        </span>
                        <TurnoverIcon className="w-4 h-4" />
                      </div>
                      <p className={`text-xs ${turnoverStatus.color}`}>
                        {turnoverStatus.status}
                      </p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`font-medium ${coverageStatus.color}`}>
                        {item.daysCoverage} días
                      </span>
                      <p className={`text-xs ${coverageStatus.color}`}>
                        {coverageStatus.status}
                      </p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(item.averageStock)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(item.stockValue)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getABCColor(item.abcClass)}`}>
                        Clase {item.abcClass}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        item.turnoverRate >= 8 && item.daysCoverage <= 60 
                          ? 'bg-green-100 text-green-800'
                          : item.turnoverRate >= 5 && item.daysCoverage <= 90
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {item.turnoverRate >= 8 && item.daysCoverage <= 60 
                          ? 'Óptimo'
                          : item.turnoverRate >= 5 && item.daysCoverage <= 90
                          ? 'Aceptable'
                          : 'Requiere atención'
                        }
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Trend Analysis */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Tendencia de Rotación</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthlyTurnover}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Line 
              yAxisId="left"
              type="monotone" 
              dataKey="turnover" 
              stroke="#FF6F00" 
              strokeWidth={3}
              name="Rotación (x)" 
            />
            <Line 
              yAxisId="right"
              type="monotone" 
              dataKey="coverage" 
              stroke="#2E7D32" 
              strokeWidth={2}
              strokeDasharray="5 5"
              name="Cobertura (días)" 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Action Items and Recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Alertas de Inventario</h3>
          <div className="space-y-3">
            {rotationData.filter(item => item.daysCoverage > 90).length > 0 && (
              <div className="p-3 bg-red-50 rounded-lg">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-red-900">Sobrestock Detectado</p>
                    <p className="text-sm text-red-700">
                      {rotationData.filter(item => item.daysCoverage > 90).length} categorías con más de 90 días de cobertura
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {rotationData.filter(item => item.turnoverRate < 4).length > 0 && (
              <div className="p-3 bg-yellow-50 rounded-lg">
                <div className="flex items-start space-x-2">
                  <TrendingDown className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-yellow-900">Rotación Baja</p>
                    <p className="text-sm text-yellow-700">
                      {rotationData.filter(item => item.turnoverRate < 4).length} categorías con rotación menor a 4x/año
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="flex items-start space-x-2">
                <Package className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-900">Optimización ABC</p>
                  <p className="text-sm text-blue-700">
                    Revisar política de reposición para productos Clase C
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recomendaciones</h3>
          <div className="space-y-3">
            <div className="p-3 bg-green-50 rounded-lg">
              <p className="text-sm font-medium text-green-900">Categorías de Alto Rendimiento</p>
              <div className="mt-2 space-y-1">
                {rotationData.filter(item => item.turnoverRate >= 8).map((item, index) => (
                  <div key={index} className="text-sm text-green-700">
                    • {item.category}: {item.turnoverRate.toFixed(1)}x rotación
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3 bg-purple-50 rounded-lg">
              <p className="text-sm font-medium text-purple-900">Acciones Sugeridas</p>
              <div className="mt-2 space-y-1 text-sm text-purple-700">
                <div>• Reducir stock en categorías con &gt;90 días cobertura</div>
                <div>• Implementar just-in-time para productos Clase A</div>
                <div>• Revisar proveedores de productos con baja rotación</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryAnalysis;