import React from 'react';
import { ReportFilter } from '../../types';
import { Clock, TrendingUp, TrendingDown, AlertTriangle, Target, Zap } from 'lucide-react';
import { getProcessEfficiencyData } from '../../data/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, FunnelChart, Funnel, LabelList } from 'recharts';

interface ProcessAnalysisProps {
  filters: ReportFilter;
}

const ProcessAnalysis: React.FC<ProcessAnalysisProps> = ({ filters }) => {
  const processData = getProcessEfficiencyData();
  
  const avgEfficiency = processData.reduce((sum, p) => sum + p.efficiency, 0) / processData.length;
  const totalOrders = processData.reduce((sum, p) => sum + p.orderCount, 0);
  const bottlenecks = processData.filter(p => p.bottleneckRisk === 'Alto');
  const efficientProcesses = processData.filter(p => p.efficiency >= 85);

  const funnelData = processData.map(stage => ({
    name: stage.stage,
    value: stage.orderCount,
    efficiency: stage.efficiency
  }));

  const efficiencyTrend = [
    { month: 'Jul', efficiency: 82.5, target: 85 },
    { month: 'Ago', efficiency: 84.2, target: 85 },
    { month: 'Sep', efficiency: avgEfficiency, target: 85 }
  ];

  const getBottleneckColor = (risk: string) => {
    switch (risk) {
      case 'Alto':
        return 'bg-red-100 text-red-800';
      case 'Medio':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-green-100 text-green-800';
    }
  };

  const getEfficiencyIcon = (efficiency: number) => {
    if (efficiency >= 85) return <TrendingUp className="w-5 h-5 text-green-600" />;
    if (efficiency >= 70) return <Target className="w-5 h-5 text-yellow-600" />;
    return <TrendingDown className="w-5 h-5 text-red-600" />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-gray-900">Análisis de Eficiencia de Procesos</h2>
        <p className="text-gray-600">Evaluación de tiempos y cuellos de botella en el proceso de OC</p>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Eficiencia Promedio</p>
              <p className="text-2xl font-bold text-gray-900">{avgEfficiency.toFixed(1)}%</p>
              <p className="text-sm text-gray-500">Target: 85%</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <Zap className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Órdenes Procesadas</p>
              <p className="text-2xl font-bold text-gray-900">{totalOrders}</p>
              <p className="text-sm text-gray-500">Este período</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <Target className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Cuellos de Botella</p>
              <p className="text-2xl font-bold text-red-600">{bottlenecks.length}</p>
              <p className="text-sm text-gray-500">Alto riesgo</p>
            </div>
            <div className="p-3 bg-red-50 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Procesos Eficientes</p>
              <p className="text-2xl font-bold text-green-600">{efficientProcesses.length}</p>
              <p className="text-sm text-gray-500">Eficiencia ≥ 85%</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Process Efficiency Chart */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Eficiencia por Etapa del Proceso</h3>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={processData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="stage" 
                angle={-45}
                textAnchor="end"
                height={100}
                interval={0}
              />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Bar dataKey="efficiency" fill="#FF6F00" />
              <Bar dataKey={85} fill="transparent" stroke="#2E7D32" strokeDasharray="3 3" name="Target (85%)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Processing Funnel */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Embudo de Procesamiento</h3>
          <ResponsiveContainer width="100%" height={350}>
            <FunnelChart>
              <Tooltip />
              <Funnel
                dataKey="value"
                data={funnelData}
                isAnimationActive
              >
                <LabelList position="center" fill="#fff" stroke="none" />
              </Funnel>
            </FunnelChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Process Table */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Detalle por Etapa del Proceso</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Etapa del Proceso
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tiempo Promedio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tiempo Target
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Eficiencia
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Órdenes
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Riesgo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {processData.map((process, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getEfficiencyIcon(process.efficiency)}
                      <span className="ml-3 text-sm font-medium text-gray-900">
                        {process.stage}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {process.averageTime.toFixed(1)} días
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {process.targetTime.toFixed(1)} días
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center">
                      <span className={`font-medium mr-2 ${
                        process.efficiency >= 85 ? 'text-green-600' : 
                        process.efficiency >= 70 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {process.efficiency.toFixed(1)}%
                      </span>
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            process.efficiency >= 85 ? 'bg-green-600' : 
                            process.efficiency >= 70 ? 'bg-yellow-600' : 'bg-red-600'
                          }`}
                          style={{ width: `${Math.min(process.efficiency, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {process.orderCount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getBottleneckColor(process.bottleneckRisk)}`}>
                      {process.bottleneckRisk}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      process.efficiency >= 85 ? 'bg-green-100 text-green-800' :
                      process.efficiency >= 70 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {process.efficiency >= 85 ? 'Óptimo' : 
                       process.efficiency >= 70 ? 'Aceptable' : 'Requiere mejora'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottleneck Analysis */}
      {bottlenecks.length > 0 && (
        <div className="card border-l-4 border-red-500 bg-red-50">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-6 h-6 text-red-600 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-red-800">Cuellos de Botella Identificados</h3>
              <p className="text-red-600 mb-3">
                Las siguientes etapas requieren atención inmediata para mejorar el flujo del proceso
              </p>
              <div className="space-y-2">
                {bottlenecks.map((bottleneck, index) => (
                  <div key={index} className="flex items-center justify-between bg-white p-3 rounded-lg">
                    <div>
                      <span className="font-medium text-gray-900">{bottleneck.stage}</span>
                      <p className="text-sm text-gray-600">
                        Tiempo actual: {bottleneck.averageTime.toFixed(1)} días (Target: {bottleneck.targetTime.toFixed(1)})
                      </p>
                    </div>
                    <span className="text-red-600 font-bold">
                      {bottleneck.efficiency.toFixed(1)}% eficiencia
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Acciones Recomendadas</h3>
          <div className="space-y-3">
            <div className="p-3 bg-red-50 rounded-lg">
              <p className="text-sm font-medium text-red-900">Optimizar Confirmación de Proveedor</p>
              <p className="text-sm text-red-700">
                Implementar sistema automático de confirmación para reducir tiempo de espera
              </p>
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg">
              <p className="text-sm font-medium text-yellow-900">Agilizar Proceso de Aprobación</p>
              <p className="text-sm text-yellow-700">
                Establecer límites automáticos y flujo de aprobación por monto
              </p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-sm font-medium text-blue-900">Digitalizar Validación</p>
              <p className="text-sm text-blue-700">
                Implementar validación digital para acelerar el cierre de órdenes
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Mejores Prácticas</h3>
          <div className="space-y-3">
            {efficientProcesses.map((process, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <span className="font-medium text-green-900">{process.stage}</span>
                <span className="text-green-600 font-bold">{process.efficiency.toFixed(1)}%</span>
              </div>
            ))}
          </div>
          <div className="mt-3 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm font-medium text-blue-900">Replicar Buenas Prácticas</p>
            <p className="text-sm text-blue-700">
              Analizar y aplicar métodos exitosos a procesos con menor eficiencia
            </p>
          </div>
        </div>
      </div>

      {/* Efficiency Trend */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Tendencia de Eficiencia</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={efficiencyTrend}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis domain={[70, 90]} />
            <Tooltip />
            <Legend />
            <Bar dataKey="efficiency" fill="#FF6F00" name="Eficiencia Real" />
            <Bar dataKey="target" fill="#2E7D32" name="Target" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ProcessAnalysis;