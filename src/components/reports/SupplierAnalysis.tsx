import React, { useState } from 'react';
import { ReportFilter } from '../../types';
import { Star, TrendingUp, TrendingDown, Clock, AlertTriangle, CheckCircle, Award } from 'lucide-react';
import { getSupplierPerformanceMetrics } from '../../data/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ScatterChart, Scatter } from 'recharts';

interface SupplierAnalysisProps {
  filters: ReportFilter;
}

const SupplierAnalysis: React.FC<SupplierAnalysisProps> = ({ filters }) => {
  const [sortBy, setSortBy] = useState<'rating' | 'volume' | 'otd' | 'quality'>('rating');
  
  const supplierData = getSupplierPerformanceMetrics();
  
  const formatCurrency = (amount: number) => {
    return filters.currency === 'PEN' 
      ? `S/ ${amount.toLocaleString('es-PE', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
      : `$ ${amount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  };

  const sortedSuppliers = [...supplierData].sort((a, b) => {
    switch (sortBy) {
      case 'volume':
        return b.totalValue - a.totalValue;
      case 'otd':
        return b.onTimeDeliveryRate - a.onTimeDeliveryRate;
      case 'quality':
        return b.qualityScore - a.qualityScore;
      default:
        return b.onTimeDeliveryRate - a.onTimeDeliveryRate;
    }
  });

  const avgMetrics = {
    otd: supplierData.reduce((sum, s) => sum + s.onTimeDeliveryRate, 0) / supplierData.length,
    fillRate: supplierData.reduce((sum, s) => sum + s.fillRate, 0) / supplierData.length,
    leadTime: supplierData.reduce((sum, s) => sum + s.averageLeadTime, 0) / supplierData.length,
    quality: supplierData.reduce((sum, s) => sum + s.qualityScore, 0) / supplierData.length,
    defectRate: supplierData.reduce((sum, s) => sum + s.defectRate, 0) / supplierData.length
  };

  const excellentSuppliers = supplierData.filter(s => s.rating === 'Excelente');
  const goodSuppliers = supplierData.filter(s => s.rating === 'Bueno');
  const regularSuppliers = supplierData.filter(s => s.rating === 'Regular');
  const poorSuppliers = supplierData.filter(s => s.rating === 'Deficiente');

  const performanceDistribution = [
    { rating: 'Excelente', count: excellentSuppliers.length, color: '#2E7D32' },
    { rating: 'Bueno', count: goodSuppliers.length, color: '#FF6F00' },
    { rating: 'Regular', count: regularSuppliers.length, color: '#FFA000' },
    { rating: 'Deficiente', count: poorSuppliers.length, color: '#E53935' }
  ];

  // Radar chart data for top suppliers
  const radarData = sortedSuppliers.slice(0, 3).map(supplier => ({
    supplier: supplier.supplierName.split(' ')[0],
    'OTD Rate': supplier.onTimeDeliveryRate,
    'Fill Rate': supplier.fillRate,
    'Quality Score': supplier.qualityScore,
    'Lead Time': (10 - supplier.averageLeadTime) * 10, // Inverted for visualization
    'Cost Efficiency': Math.max(0, 100 - supplier.defectRate * 10)
  }));

  const performanceScatter = supplierData.map(supplier => ({
    x: supplier.onTimeDeliveryRate,
    y: supplier.qualityScore,
    z: supplier.totalValue / 1000,
    name: supplier.supplierName.split(' ')[0]
  }));

  const getRatingIcon = (rating: string) => {
    switch (rating) {
      case 'Excelente':
        return <Award className="w-5 h-5 text-green-600" />;
      case 'Bueno':
        return <CheckCircle className="w-5 h-5 text-orange-600" />;
      case 'Regular':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
    }
  };

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case 'Excelente':
        return 'bg-green-100 text-green-800';
      case 'Bueno':
        return 'bg-orange-100 text-orange-800';
      case 'Regular':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-red-100 text-red-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Análisis de Desempeño de Proveedores</h2>
          <p className="text-gray-600">Evaluación integral de rendimiento y calidad</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-gray-600">Ordenar por:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-main focus:border-transparent"
          >
            <option value="rating">Rating General</option>
            <option value="volume">Volumen de Compras</option>
            <option value="otd">OTD Rate</option>
            <option value="quality">Puntuación de Calidad</option>
          </select>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">OTD Promedio</p>
              <p className="text-2xl font-bold text-gray-900">{avgMetrics.otd.toFixed(1)}%</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Fill Rate</p>
              <p className="text-2xl font-bold text-gray-900">{avgMetrics.fillRate.toFixed(1)}%</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <CheckCircle className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Lead Time Prom.</p>
              <p className="text-2xl font-bold text-gray-900">{avgMetrics.leadTime.toFixed(1)}</p>
              <p className="text-sm text-gray-500">días</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <Clock className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Calidad Promedio</p>
              <p className="text-2xl font-bold text-gray-900">{avgMetrics.quality.toFixed(1)}</p>
              <p className="text-sm text-gray-500">puntos</p>
            </div>
            <div className="p-3 bg-orange-50 rounded-lg">
              <Star className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tasa de Defectos</p>
              <p className="text-2xl font-bold text-gray-900">{avgMetrics.defectRate.toFixed(1)}%</p>
            </div>
            <div className="p-3 bg-red-50 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Distribution */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribución de Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={performanceDistribution}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="rating" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#FF6F00" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top Suppliers Radar */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Comparativo Top 3 Proveedores</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="supplier" />
              <PolarRadiusAxis domain={[0, 100]} />
              <Radar
                name="OTD Rate"
                dataKey="OTD Rate"
                stroke="#FF6F00"
                fill="#FF6F00"
                fillOpacity={0.1}
              />
              <Radar
                name="Quality Score"
                dataKey="Quality Score"
                stroke="#2E7D32"
                fill="#2E7D32"
                fillOpacity={0.1}
              />
              <Tooltip />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Performance Matrix */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Matriz de Desempeño (OTD vs Calidad)</h3>
          <p className="text-sm text-gray-500">Tamaño de burbuja = Volumen de compras</p>
        </div>
        <ResponsiveContainer width="100%" height={400}>
          <ScatterChart
            margin={{
              top: 20,
              right: 20,
              bottom: 20,
              left: 20,
            }}
          >
            <CartesianGrid />
            <XAxis type="number" dataKey="x" name="OTD Rate" unit="%" domain={[80, 100]} />
            <YAxis type="number" dataKey="y" name="Quality Score" unit="pts" domain={[75, 100]} />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} />
            <Scatter name="Proveedores" data={performanceScatter} fill="#FF6F00" />
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      {/* Detailed Supplier Table */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Detalle de Proveedores</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Proveedor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rating
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  OTD Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fill Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lead Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Calidad
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Defectos
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Volumen
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Órdenes
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedSuppliers.map((supplier, index) => (
                <tr key={supplier.supplierId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8 flex items-center justify-center bg-gray-100 rounded-full">
                        <span className="text-sm font-medium text-gray-600">
                          {supplier.supplierName.charAt(0)}
                        </span>
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">
                          {supplier.supplierName}
                        </div>
                        <div className="text-sm text-gray-500">
                          Última eval: {supplier.lastEvaluation}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {getRatingIcon(supplier.rating)}
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRatingColor(supplier.rating)}`}>
                        {supplier.rating}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{supplier.onTimeDeliveryRate.toFixed(1)}%</span>
                      {supplier.onTimeDeliveryRate >= avgMetrics.otd ? (
                        <TrendingUp className="w-4 h-4 text-green-500" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-500" />
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {supplier.fillRate.toFixed(1)}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {supplier.averageLeadTime.toFixed(1)} días
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      <span className="mr-2">{supplier.qualityScore.toFixed(1)}</span>
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-orange-600 h-2 rounded-full" 
                          style={{ width: `${supplier.qualityScore}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`font-medium ${
                      supplier.defectRate <= 2 ? 'text-green-600' : 
                      supplier.defectRate <= 4 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {supplier.defectRate.toFixed(1)}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(supplier.totalValue)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {supplier.orderCount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Action Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Acciones Recomendadas</h3>
          <div className="space-y-3">
            {poorSuppliers.length > 0 && (
              <div className="p-3 bg-red-50 rounded-lg">
                <p className="text-sm font-medium text-red-900">Revisión Urgente</p>
                <p className="text-sm text-red-700">
                  {poorSuppliers.length} proveedor(es) con rating deficiente requieren atención inmediata
                </p>
              </div>
            )}
            {regularSuppliers.length > 0 && (
              <div className="p-3 bg-yellow-50 rounded-lg">
                <p className="text-sm font-medium text-yellow-900">Plan de Mejora</p>
                <p className="text-sm text-yellow-700">
                  {regularSuppliers.length} proveedor(es) necesitan plan de desarrollo
                </p>
              </div>
            )}
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-sm font-medium text-blue-900">Programa de Reconocimiento</p>
              <p className="text-sm text-blue-700">
                Implementar incentivos para proveedores excelentes
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performers</h3>
          <div className="space-y-3">
            {excellentSuppliers.slice(0, 3).map((supplier, index) => (
              <div key={supplier.supplierId} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-6 h-6 bg-green-600 text-white rounded-full text-xs font-bold">
                    {index + 1}
                  </div>
                  <span className="font-medium text-green-900">{supplier.supplierName}</span>
                </div>
                <span className="text-green-600 font-bold">{supplier.onTimeDeliveryRate.toFixed(1)}% OTD</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplierAnalysis;