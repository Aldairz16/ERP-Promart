import React, { useState } from 'react';
import { X, Download, FileText, FileSpreadsheet, Calendar, Clock } from 'lucide-react';
import { ReportFilter } from '../../types';

interface ExportModalProps {
  reportType: string;
  filters: ReportFilter;
  onClose: () => void;
}

const ExportModal: React.FC<ExportModalProps> = ({ reportType, filters, onClose }) => {
  const [exportFormat, setExportFormat] = useState<'pdf' | 'excel'>('pdf');
  const [includeCharts, setIncludeCharts] = useState(true);
  const [includeComments, setIncludeComments] = useState(false);
  const [scheduleExport, setScheduleExport] = useState(false);
  const [schedulePeriod, setSchedulePeriod] = useState<'daily' | 'weekly' | 'monthly'>('monthly');
  const [emailRecipients, setEmailRecipients] = useState('');
  const [isExporting, setIsExporting] = useState(false);

  const reportNames: Record<string, string> = {
    overview: 'Resumen Ejecutivo',
    budget: 'Presupuesto vs Real',
    suppliers: 'Desempeño Proveedores',
    process: 'Eficiencia Procesos',
    inventory: 'Rotación Inventario',
    pricing: 'Análisis de Precios'
  };

  const handleExport = async () => {
    setIsExporting(true);
    
    // Simulate export process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Create a mock download
    const fileName = `${reportNames[reportType]}_${filters.period}_${new Date().toISOString().split('T')[0]}.${exportFormat}`;
    
    // In a real app, this would generate and download the file
    console.log('Exporting:', {
      format: exportFormat,
      reportType,
      filters,
      includeCharts,
      includeComments,
      fileName
    });

    setIsExporting(false);
    
    // Show success message
    alert(`Reporte "${fileName}" exportado exitosamente`);
    
    if (scheduleExport) {
      alert(`Exportación programada configurada: ${schedulePeriod}`);
    }
    
    onClose();
  };

  const getCurrentDateTime = () => {
    return new Date().toLocaleString('es-PE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl m-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Exportar Reporte</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Report Information */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">{reportNames[reportType]}</h4>
            <div className="text-sm text-gray-600 space-y-1">
              <div>Período: <span className="font-medium">{filters.period}</span></div>
              <div>Moneda: <span className="font-medium">{filters.currency}</span></div>
              <div>Categoría: <span className="font-medium">{filters.category}</span></div>
              {filters.warehouse && filters.warehouse !== 'Todos' && (
                <div>Almacén: <span className="font-medium">{filters.warehouse}</span></div>
              )}
              <div>Generado: <span className="font-medium">{getCurrentDateTime()}</span></div>
            </div>
          </div>

          {/* Export Format */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Formato de Exportación
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setExportFormat('pdf')}
                className={`p-4 border rounded-lg transition-all ${
                  exportFormat === 'pdf'
                    ? 'border-primary-main bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <FileText className={`w-6 h-6 ${
                    exportFormat === 'pdf' ? 'text-primary-main' : 'text-gray-400'
                  }`} />
                  <div className="text-left">
                    <div className="font-medium text-gray-900">PDF</div>
                    <div className="text-sm text-gray-500">Para presentaciones</div>
                  </div>
                </div>
              </button>

              <button
                onClick={() => setExportFormat('excel')}
                className={`p-4 border rounded-lg transition-all ${
                  exportFormat === 'excel'
                    ? 'border-primary-main bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <FileSpreadsheet className={`w-6 h-6 ${
                    exportFormat === 'excel' ? 'text-primary-main' : 'text-gray-400'
                  }`} />
                  <div className="text-left">
                    <div className="font-medium text-gray-900">Excel</div>
                    <div className="text-sm text-gray-500">Para análisis</div>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Export Options */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Opciones de Contenido
            </label>
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={includeCharts}
                  onChange={(e) => setIncludeCharts(e.target.checked)}
                  className="h-4 w-4 text-primary-main focus:ring-primary-main border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Incluir gráficos y visualizaciones</span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={includeComments}
                  onChange={(e) => setIncludeComments(e.target.checked)}
                  className="h-4 w-4 text-primary-main focus:ring-primary-main border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Incluir comentarios y notas</span>
              </label>
            </div>
          </div>

          {/* Schedule Export */}
          <div>
            <label className="flex items-center mb-3">
              <input
                type="checkbox"
                checked={scheduleExport}
                onChange={(e) => setScheduleExport(e.target.checked)}
                className="h-4 w-4 text-primary-main focus:ring-primary-main border-gray-300 rounded"
              />
              <span className="ml-2 text-sm font-medium text-gray-700">Programar envío automático</span>
            </label>

            {scheduleExport && (
              <div className="space-y-4 pl-6 border-l-2 border-gray-200">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Frecuencia
                  </label>
                  <select
                    value={schedulePeriod}
                    onChange={(e) => setSchedulePeriod(e.target.value as any)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-main focus:border-transparent"
                  >
                    <option value="daily">Diario</option>
                    <option value="weekly">Semanal</option>
                    <option value="monthly">Mensual</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Destinatarios (separados por coma)
                  </label>
                  <textarea
                    value={emailRecipients}
                    onChange={(e) => setEmailRecipients(e.target.value)}
                    placeholder="gerencia@empresa.com, compras@empresa.com"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-main focus:border-transparent"
                  />
                </div>

                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <Clock className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-blue-900">Programación Automática</p>
                      <p className="text-sm text-blue-700">
                        El reporte se enviará automáticamente cada {
                          schedulePeriod === 'daily' ? 'día' : 
                          schedulePeriod === 'weekly' ? 'semana' : 'mes'
                        } con los datos más recientes.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Preview Information */}
          <div className="p-4 bg-yellow-50 rounded-lg">
            <div className="flex items-start space-x-2">
              <Calendar className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-yellow-900">Información del Reporte</p>
                <div className="text-sm text-yellow-700 mt-1 space-y-1">
                  <div>• Portada con logo y rango de fechas</div>
                  <div>• Resumen ejecutivo con KPIs principales</div>
                  <div>• {includeCharts ? 'Gráficos incluidos' : 'Solo tablas de datos'}</div>
                  <div>• Firma digital y timestamp de generación</div>
                  {includeComments && <div>• Comentarios y observaciones</div>}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end space-x-3 p-6 border-t">
          <button
            onClick={onClose}
            className="btn-secondary"
            disabled={isExporting}
          >
            Cancelar
          </button>
          <button
            onClick={handleExport}
            disabled={isExporting || (scheduleExport && !emailRecipients.trim())}
            className="btn-primary flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isExporting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Exportando...
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                {scheduleExport ? 'Exportar y Programar' : 'Exportar'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportModal;