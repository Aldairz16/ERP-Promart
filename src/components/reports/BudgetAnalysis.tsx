import React, { useState } from 'react';
import { ReportFilter } from '../../types';
import { TrendingUp, TrendingDown, AlertTriangle, Eye, Download } from 'lucide-react';
import { getBudgetVarianceByPeriod, getCategoryEvolutionData } from '../../data/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';

interface BudgetAnalysisProps {
  filters: ReportFilter;
}

const BudgetAnalysis: React.FC<BudgetAnalysisProps> = ({ filters }) => {
  const [viewMode, setViewMode] = useState<'variance' | 'evolution' | 'detailed'>('variance');
  
  const budgetData = getBudgetVarianceByPeriod(filters.period || 'Mes', filters.currency);
  const evolutionData = getCategoryEvolutionData(filters.currency);
  
  const formatCurrency = (amount: number) => {
    return filters.currency === 'PEN' 
      ? `S/ ${amount.toLocaleString('es-PE', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
      : `$ ${amount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  };

  const totalBudget = budgetData.reduce((sum, item) => sum + item.budgeted, 0);
  const totalActual = budgetData.reduce((sum, item) => sum + item.actual, 0);
  const totalVariance = totalActual - totalBudget;
  const variancePercent = (totalVariance / totalBudget) * 100;

  const criticalVariances = budgetData.filter(item => Math.abs(item.variancePercent) > 15);
  const goodPerformance = budgetData.filter(item => Math.abs(item.variancePercent) <= 5);

  const monthlyComparison = budgetData[0]?.monthlyData.map(month => {
    const categoryData: any = { month: month.month };
    budgetData.forEach(category => {
      const monthData = category.monthlyData.find(m => m.month === month.month);
      if (monthData) {
        categoryData[`${category.category}_Presupuesto`] = monthData.budgeted;
        categoryData[`${category.category}_Real`] = monthData.actual;
      }
    });
    return categoryData;
  }) || [];

  return (
    <div className="space-y-6">
      {/* Header with View Toggle */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Análisis Presupuesto vs Real</h2>
          <p className="text-gray-600">Desviaciones y tendencias por categoría de gasto</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('variance')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'variance' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Variaciones
            </button>
            <button
              onClick={() => setViewMode('evolution')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'evolution' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Evolución
            </button>
            <button
              onClick={() => setViewMode('detailed')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'detailed' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Detallado
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Presupuesto Total</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalBudget)}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Gasto Real</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalActual)}</p>
            </div>
            <div className="p-3 bg-orange-50 rounded-lg">
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Variación Total</p>
              <p className={`text-2xl font-bold ${totalVariance >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                {totalVariance >= 0 ? '+' : ''}{formatCurrency(totalVariance)}
              </p>
              <p className={`text-sm font-medium ${totalVariance >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                {variancePercent >= 0 ? '+' : ''}{variancePercent.toFixed(1)}%
              </p>
            </div>
            <div className={`p-3 rounded-lg ${totalVariance >= 0 ? 'bg-red-50' : 'bg-green-50'}`}>
              {totalVariance >= 0 ? 
                <TrendingUp className="w-6 h-6 text-red-600" /> :
                <TrendingDown className="w-6 h-6 text-green-600" />
              }
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Categorías en Riesgo</p>
              <p className="text-2xl font-bold text-red-600">{criticalVariances.length}</p>
              <p className="text-sm text-gray-500">Variación &gt; 15%</p>
            </div>
            <div className="p-3 bg-red-50 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Based on View Mode */}
      {viewMode === 'variance' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Variance Chart */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Variaciones por Categoría</h3>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={budgetData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis tickFormatter={(value) => formatCurrency(value)} />
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Legend />
                <Bar dataKey="budgeted" fill="#2E7D32" name="Presupuesto" />
                <Bar dataKey="actual" fill="#FF6F00" name="Real" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Variance Percentage */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Porcentaje de Variación</h3>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={budgetData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip formatter={(value: number) => `${value.toFixed(1)}%`} />
                <Bar 
                  dataKey="variancePercent" 
                  fill="#FF6F00"
                  name="Variación %"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {viewMode === 'evolution' && (
        <div className="grid grid-cols-1 gap-6">
          {/* Evolution Chart */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Evolución Mensual por Categoría</h3>
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={evolutionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => formatCurrency(value)} />
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Legend />
                <Area type="monotone" dataKey="Construcción" stackId="1" stroke="#FF6F00" fill="#FF6F00" />
                <Area type="monotone" dataKey="TI" stackId="1" stroke="#2E7D32" fill="#2E7D32" />
                <Area type="monotone" dataKey="Ferretería" stackId="1" stroke="#E53935" fill="#E53935" />
                <Area type="monotone" dataKey="Oficina" stackId="1" stroke="#1976D2" fill="#1976D2" />
                <Area type="monotone" dataKey="Mobiliario" stackId="1" stroke="#7B1FA2" fill="#7B1FA2" />
                <Area type="monotone" dataKey="Mantenimiento" stackId="1" stroke="#455A64" fill="#455A64" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Monthly Comparison Table */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Comparativo Mensual Detallado</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Mes
                    </th>
                    {budgetData.map(category => (
                      <th key={category.category} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {category.category}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {monthlyComparison.map((month, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {month.month}
                      </td>
                      {budgetData.map(category => (
                        <td key={category.category} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div className="space-y-1">
                            <div className="text-green-600 font-medium">
                              P: {formatCurrency(month[`${category.category}_Presupuesto`] || 0)}
                            </div>
                            <div className="text-orange-600">
                              R: {formatCurrency(month[`${category.category}_Real`] || 0)}
                            </div>
                          </div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {viewMode === 'detailed' && (
        <div className="space-y-6">
          {/* Critical Variances Alert */}
          {criticalVariances.length > 0 && (
            <div className="card border-l-4 border-red-500 bg-red-50">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-6 h-6 text-red-600 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-red-800">Variaciones Críticas Detectadas</h3>
                  <p className="text-red-600 mb-3">
                    {criticalVariances.length} categorías presentan desviaciones superiores al 15%
                  </p>
                  <div className="space-y-2">
                    {criticalVariances.map((item, index) => (
                      <div key={index} className="flex items-center justify-between bg-white p-3 rounded-lg">
                        <span className="font-medium text-gray-900">{item.category}</span>
                        <span className="text-red-600 font-bold">
                          {item.variancePercent > 0 ? '+' : ''}{item.variancePercent.toFixed(1)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Detailed Analysis Table */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Análisis Detallado por Categoría</h3>
              <button className="btn-secondary flex items-center">
                <Download className="w-4 h-4 mr-2" />
                Exportar Detalle
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Categoría
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Presupuesto
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Real
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Variación Absoluta
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Variación %
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {budgetData.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {item.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(item.budgeted)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(item.actual)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`font-medium ${
                          item.variance > 0 ? 'text-red-600' : 'text-green-600'
                        }`}>
                          {item.variance > 0 ? '+' : ''}{formatCurrency(item.variance)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`font-medium ${
                          item.variancePercent > 0 ? 'text-red-600' : 'text-green-600'
                        }`}>
                          {item.variancePercent > 0 ? '+' : ''}{item.variancePercent.toFixed(1)}%
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          Math.abs(item.variancePercent) <= 5 
                            ? 'bg-green-100 text-green-800'
                            : Math.abs(item.variancePercent) <= 15
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {Math.abs(item.variancePercent) <= 5 
                            ? 'En rango' 
                            : Math.abs(item.variancePercent) <= 15
                            ? 'Alerta'
                            : 'Crítico'
                          }
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button className="text-primary-main hover:text-primary-dark flex items-center">
                          <Eye className="w-4 h-4 mr-1" />
                          Ver detalle
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Performance Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Categorías con Buen Desempeño</h3>
              <div className="space-y-3">
                {goodPerformance.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <span className="font-medium text-green-900">{item.category}</span>
                    <span className="text-green-600 font-bold">
                      {Math.abs(item.variancePercent).toFixed(1)}% variación
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recomendaciones</h3>
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm font-medium text-blue-900">Revisar proveedores en TI</p>
                  <p className="text-sm text-blue-700">Buscar alternativas para reducir costos</p>
                </div>
                <div className="p-3 bg-yellow-50 rounded-lg">
                  <p className="text-sm font-medium text-yellow-900">Ajustar presupuesto Construcción</p>
                  <p className="text-sm text-yellow-700">Considerar incremento para próximo período</p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <p className="text-sm font-medium text-purple-900">Optimizar proceso Mobiliario</p>
                  <p className="text-sm text-purple-700">Consolidar compras para mayor eficiencia</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BudgetAnalysis;