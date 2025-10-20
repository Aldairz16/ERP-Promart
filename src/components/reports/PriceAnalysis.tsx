import React, { useState } from 'react';
import { ReportFilter } from '../../types';
import { TrendingUp, TrendingDown, DollarSign, Percent, AlertTriangle, Tag } from 'lucide-react';
import { getPriceAnalysisData } from '../../data/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, ScatterChart, Scatter } from 'recharts';

interface PriceAnalysisProps {
  filters: ReportFilter;
}

const PriceAnalysis: React.FC<PriceAnalysisProps> = ({ filters }) => {
  const [viewMode, setViewMode] = useState<'variations' | 'igv' | 'trends'>('variations');
  
  const priceData = getPriceAnalysisData(filters.currency);
  
  const formatCurrency = (amount: number) => {
    return filters.currency === 'PEN' 
      ? `S/ ${amount.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
      : `$ ${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const avgPriceIncrease = priceData.reduce((sum, item) => sum + item.priceVariation, 0) / priceData.length;
  const totalIGV = priceData.reduce((sum, item) => sum + item.igvAmount, 0);
  const avgDiscount = priceData.reduce((sum, item) => sum + item.discountApplied, 0) / priceData.length;

  const priceIncreases = priceData.filter(item => item.priceVariation > 0);
  const priceDecreases = priceData.filter(item => item.priceVariation < 0);
  const significantChanges = priceData.filter(item => Math.abs(item.priceVariation) > 5);

  const variationData = priceData.map(item => ({
    product: item.productName.substring(0, 15) + '...',
    variation: item.priceVariation,
    currentPrice: item.currentPrice,
    previousPrice: item.previousPrice
  }));

  const igvBreakdown = priceData.map(item => ({
    product: item.productName.substring(0, 15) + '...',
    netPrice: item.netPrice,
    igvAmount: item.igvAmount,
    totalPrice: item.totalPrice
  }));

  const priceComparison = [
    { month: 'Jul', avgPrice: 156.80, inflation: 2.1 },
    { month: 'Ago', avgPrice: 162.40, inflation: 3.6 },
    { month: 'Sep', avgPrice: priceData.reduce((sum, item) => sum + item.currentPrice, 0) / priceData.length, inflation: avgPriceIncrease }
  ];

  const supplierPriceMap = priceData.reduce((acc, item) => {
    if (!acc[item.supplier]) {
      acc[item.supplier] = [];
    }
    acc[item.supplier].push(item);
    return acc;
  }, {} as Record<string, typeof priceData>);

  const supplierAvgVariation = Object.entries(supplierPriceMap).map(([supplier, items]) => ({
    supplier: supplier.substring(0, 20) + '...',
    avgVariation: items.reduce((sum, item) => sum + item.priceVariation, 0) / items.length,
    itemCount: items.length
  }));

  const getVariationColor = (variation: number) => {
    if (variation > 5) return 'text-red-600';
    if (variation > 0) return 'text-yellow-600';
    if (variation < -5) return 'text-green-600';
    return 'text-gray-600';
  };

  const getVariationIcon = (variation: number) => {
    if (Math.abs(variation) <= 2) return null;
    return variation > 0 ? TrendingUp : TrendingDown;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Análisis de Precios y Costos</h2>
          <p className="text-gray-600">Variaciones de precios, descuentos e impacto del IGV</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('variations')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'variations' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Variaciones
            </button>
            <button
              onClick={() => setViewMode('igv')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'igv' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              IGV Impact
            </button>
            <button
              onClick={() => setViewMode('trends')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'trends' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Tendencias
            </button>
          </div>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Variación Prom. Precios</p>
              <p className={`text-2xl font-bold ${getVariationColor(avgPriceIncrease)}`}>
                {avgPriceIncrease > 0 ? '+' : ''}{avgPriceIncrease.toFixed(1)}%
              </p>
            </div>
            <div className="p-3 bg-orange-50 rounded-lg">
              <Percent className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total IGV</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalIGV)}</p>
              <p className="text-sm text-gray-500">18% sobre neto</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Descuento Promedio</p>
              <p className="text-2xl font-bold text-green-600">{avgDiscount.toFixed(1)}%</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <Tag className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Cambios Significativos</p>
              <p className="text-2xl font-bold text-red-600">{significantChanges.length}</p>
              <p className="text-sm text-gray-500">Variación &gt; 5%</p>
            </div>
            <div className="p-3 bg-red-50 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Based on View Mode */}
      {viewMode === 'variations' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Price Variations Chart */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Variaciones de Precio por Producto</h3>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={variationData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="product" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip formatter={(value: number) => `${value.toFixed(1)}%`} />
                  <Bar dataKey="variation" fill="#FF6F00" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Supplier Price Performance */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Variación Promedio por Proveedor</h3>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={supplierAvgVariation}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="supplier" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip formatter={(value: number) => `${value.toFixed(1)}%`} />
                  <Bar dataKey="avgVariation" fill="#2E7D32" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Price Comparison Scatter */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Correlación Precio Actual vs Variación</h3>
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
                <XAxis type="number" dataKey="currentPrice" name="Precio Actual" />
                <YAxis type="number" dataKey="variation" name="Variación %" />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                <Scatter name="Productos" data={variationData} fill="#FF6F00" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {viewMode === 'igv' && (
        <div className="space-y-6">
          {/* IGV Breakdown Chart */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Desglose de Precios (Neto + IGV)</h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={igvBreakdown}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="product" angle={-45} textAnchor="end" height={100} />
                <YAxis tickFormatter={(value) => formatCurrency(value)} />
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Legend />
                <Bar dataKey="netPrice" stackId="a" fill="#2E7D32" name="Precio Neto" />
                <Bar dataKey="igvAmount" stackId="a" fill="#FF6F00" name="IGV (18%)" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* IGV Impact Table */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Impacto del IGV por Producto</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Producto
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Precio Neto
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      IGV (18%)
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Precio Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      % IGV del Total
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {priceData.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {item.productName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(item.netPrice)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-orange-600 font-medium">
                        {formatCurrency(item.igvAmount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">
                        {formatCurrency(item.totalPrice)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {((item.igvAmount / item.totalPrice) * 100).toFixed(1)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {viewMode === 'trends' && (
        <div className="space-y-6">
          {/* Price Trend Chart */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Tendencia de Precios Promedio</h3>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={priceComparison}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" tickFormatter={(value) => formatCurrency(value)} />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="avgPrice" 
                  stroke="#FF6F00" 
                  strokeWidth={3}
                  name="Precio Promedio" 
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="inflation" 
                  stroke="#E53935" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name="Inflación %" 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Historical Price Analysis */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Análisis Histórico de Precios</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-red-50 rounded-lg">
                <p className="text-sm font-medium text-red-900">Incrementos de Precio</p>
                <p className="text-2xl font-bold text-red-600">{priceIncreases.length}</p>
                <p className="text-sm text-red-700">productos con incremento</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-sm font-medium text-green-900">Reducciones de Precio</p>
                <p className="text-2xl font-bold text-green-600">{priceDecreases.length}</p>
                <p className="text-sm text-green-700">productos con reducción</p>
              </div>
              <div className="p-4 bg-yellow-50 rounded-lg">
                <p className="text-sm font-medium text-yellow-900">Sin Cambios</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {priceData.length - priceIncreases.length - priceDecreases.length}
                </p>
                <p className="text-sm text-yellow-700">productos estables</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Detailed Price Analysis Table */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Análisis Detallado de Precios</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Producto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Proveedor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Precio Anterior
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Precio Actual
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Variación
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Descuento
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Precio Final
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Última Compra
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {priceData.map((item, index) => {
                const VariationIcon = getVariationIcon(item.priceVariation);
                
                return (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.productName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {item.supplier}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(item.previousPrice)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                      {formatCurrency(item.currentPrice)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center space-x-1">
                        <span className={`font-medium ${getVariationColor(item.priceVariation)}`}>
                          {item.priceVariation > 0 ? '+' : ''}{item.priceVariation.toFixed(1)}%
                        </span>
                        {VariationIcon && <VariationIcon className="w-4 h-4" />}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                      {item.discountApplied > 0 ? `${item.discountApplied}%` : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">
                      {formatCurrency(item.totalPrice)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.lastPurchaseDate}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Price Alerts and Recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Alertas de Precios</h3>
          <div className="space-y-3">
            {significantChanges.filter(item => item.priceVariation > 5).map((item, index) => (
              <div key={index} className="p-3 bg-red-50 rounded-lg">
                <div className="flex items-start space-x-2">
                  <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-red-900">{item.productName}</p>
                    <p className="text-sm text-red-700">
                      Incremento del {item.priceVariation.toFixed(1)}% - Revisar con proveedor
                    </p>
                  </div>
                </div>
              </div>
            ))}
            
            {priceDecreases.length > 0 && (
              <div className="p-3 bg-green-50 rounded-lg">
                <div className="flex items-start space-x-2">
                  <TrendingDown className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-green-900">Oportunidades de Ahorro</p>
                    <p className="text-sm text-green-700">
                      {priceDecreases.length} productos con reducción de precio detectada
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recomendaciones</h3>
          <div className="space-y-3">
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-sm font-medium text-blue-900">Negociación de Precios</p>
              <p className="text-sm text-blue-700">
                Revisar contratos con proveedores que muestran incrementos constantes
              </p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <p className="text-sm font-medium text-purple-900">Optimización de Descuentos</p>
              <p className="text-sm text-purple-700">
                Consolidar compras para obtener mejores descuentos por volumen
              </p>
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg">
              <p className="text-sm font-medium text-yellow-900">Análisis de Mercado</p>
              <p className="text-sm text-yellow-700">
                Buscar proveedores alternativos para productos con altos incrementos
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceAnalysis;