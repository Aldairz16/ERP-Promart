import React from 'react';
import { ReportFilter } from '../../types';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Package, 
  Users, 
  Clock,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { 
  getBudgetVarianceByPeriod, 
  getSupplierPerformanceMetrics,
  getMonthlySpendingTrend 
} from '../../data/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

interface ReportOverviewProps {
  filters: ReportFilter;
}

const ReportOverview: React.FC<ReportOverviewProps> = ({ filters }) => {
  const budgetData = getBudgetVarianceByPeriod(filters.period || 'Mes', filters.currency);
  const supplierMetrics = getSupplierPerformanceMetrics();
  const spendingTrend = getMonthlySpendingTrend(filters.currency);
  
  // Calculate executive KPIs
  const totalSpent = budgetData.reduce((sum, item) => sum + item.actual, 0);
  const totalBudget = budgetData.reduce((sum, item) => sum + item.budgeted, 0);
  const budgetVariance = ((totalSpent - totalBudget) / totalBudget * 100);
  const avgSupplierRating = supplierMetrics.reduce((sum, s) => sum + s.onTimeDeliveryRate, 0) / supplierMetrics.length;
  
  const formatCurrency = (amount: number) => {
    return filters.currency === 'PEN' 
      ? `S/ ${amount.toLocaleString('es-PE', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
      : `$ ${amount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  };

  const kpiCards = [
    {
      title: 'Gasto Total del Período',
      value: formatCurrency(totalSpent),
      change: budgetVariance > 0 ? `+${budgetVariance.toFixed(1)}%` : `${budgetVariance.toFixed(1)}%`,
      trend: budgetVariance > 0 ? 'up' : budgetVariance < 0 ? 'down' : 'neutral',
      icon: DollarSign,
      color: budgetVariance > 0 ? 'text-red-600' : 'text-green-600'
    },
    {
      title: 'Eficiencia Presupuestaria',
      value: `${(100 - Math.abs(budgetVariance)).toFixed(1)}%`,
      change: budgetVariance < 0 ? 'Bajo presupuesto' : 'Sobre presupuesto',
      trend: budgetVariance < 0 ? 'up' : 'down',
      icon: TrendingUp,
      color: budgetVariance < 0 ? 'text-green-600' : 'text-red-600'
    },
    {
      title: 'Proveedores Activos',
      value: supplierMetrics.length.toString(),
      change: 'OTD promedio: ' + avgSupplierRating.toFixed(1) + '%',
      trend: 'up',
      icon: Users,
      color: 'text-blue-600'
    },
    {
      title: 'Órdenes Procesadas',
      value: supplierMetrics.reduce((sum, s) => sum + s.orderCount, 0).toString(),
      change: 'Tiempo prom: 5.2 días',
      trend: 'neutral',
      icon: Package,
      color: 'text-purple-600'
    }
  ];

  const categoryPerformance = budgetData.map(item => ({
    category: item.category,
    efficiency: (100 - Math.abs(item.variancePercent)).toFixed(1),
    variance: item.variancePercent,
    actual: item.actual
  }));

  const topSuppliers = supplierMetrics
    .sort((a, b) => b.totalValue - a.totalValue)
    .slice(0, 5)
    .map(supplier => ({
      name: supplier.supplierName.substring(0, 20) + (supplier.supplierName.length > 20 ? '...' : ''),
      value: supplier.totalValue,
      rating: supplier.onTimeDeliveryRate,
      orders: supplier.orderCount
    }));

  const COLORS = ['#FF6F00', '#2E7D32', '#E53935', '#1976D2', '#7B1FA2'];

  return (
    <div className="space-y-6">
      {/* Executive Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiCards.map((kpi, index) => {
          const Icon = kpi.icon;
          const TrendIcon = kpi.trend === 'up' ? TrendingUp : kpi.trend === 'down' ? TrendingDown : Clock;
          
          return (
            <div key={index} className="card">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-1">{kpi.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
                  <div className={`flex items-center mt-2 ${kpi.color}`}>
                    <TrendIcon className="w-4 h-4 mr-1" />
                    <span className="text-sm font-medium">{kpi.change}</span>
                  </div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <Icon className="w-6 h-6 text-gray-600" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Spending Trend Chart */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Tendencia de Gasto vs Presupuesto</h3>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span>Últimos 9 meses</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={spendingTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(value) => formatCurrency(value)} />
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="gasto" 
                stroke="#FF6F00" 
                strokeWidth={3}
                name="Gasto Real" 
              />
              <Line 
                type="monotone" 
                dataKey="presupuesto" 
                stroke="#2E7D32" 
                strokeWidth={2}
                strokeDasharray="5 5"
                name="Presupuesto" 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Top Suppliers */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Top 5 Proveedores por Volumen</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={topSuppliers}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {topSuppliers.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Performance */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Eficiencia por Categoría</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryPerformance}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="efficiency" fill="#FF6F00" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Key Alerts & Insights */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Alertas e Insights Clave</h3>
          <div className="space-y-4">
            {budgetVariance > 10 && (
              <div className="flex items-start space-x-3 p-3 bg-red-50 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-800">Desviación Presupuestaria Alta</p>
                  <p className="text-sm text-red-600">
                    El gasto supera el presupuesto en {budgetVariance.toFixed(1)}%. Revisar categorías con mayor variación.
                  </p>
                </div>
              </div>
            )}
            
            {avgSupplierRating > 90 && (
              <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-green-800">Excelente Desempeño de Proveedores</p>
                  <p className="text-sm text-green-600">
                    OTD promedio del {avgSupplierRating.toFixed(1)}% indica una cadena de suministro saludable.
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
              <TrendingUp className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-800">Oportunidad de Ahorro</p>
                <p className="text-sm text-blue-600">
                  Revisar contratos en categoría TI para optimizar términos comerciales.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg">
              <Clock className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-yellow-800">Proceso de Aprobación</p>
                <p className="text-sm text-yellow-600">
                  Tiempo promedio de aprobación ha aumentado. Considerar automatización.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Table */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Métricas Rápidas por Categoría</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Categoría
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Gasto Real
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Presupuesto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Variación
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
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
                    {formatCurrency(item.actual)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(item.budgeted)}
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReportOverview;