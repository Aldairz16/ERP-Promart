import React from 'react';
import { MoreVertical } from 'lucide-react';

interface TableColumn {
  key: string;
  label: string;
  className?: string;
  render?: (value: any, row: any) => React.ReactNode;
}

interface ResponsiveTableProps {
  columns: TableColumn[];
  data: any[];
  onRowAction?: (row: any) => void;
  mobileCardRenderer?: (row: any, index: number) => React.ReactNode;
  emptyMessage?: string;
  className?: string;
}

const ResponsiveTable: React.FC<ResponsiveTableProps> = ({
  columns,
  data,
  onRowAction,
  mobileCardRenderer,
  emptyMessage = 'No hay datos disponibles',
  className = ''
}) => {
  const renderMobileCard = (row: any, index: number) => {
    if (mobileCardRenderer) {
      return mobileCardRenderer(row, index);
    }

    // Default mobile card layout
    return (
      <div key={index} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <div className="space-y-2">
          {columns.slice(0, 4).map((column) => (
            <div key={column.key} className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-500">{column.label}:</span>
              <span className="text-sm text-gray-900">
                {column.render ? column.render(row[column.key], row) : row[column.key]}
              </span>
            </div>
          ))}
        </div>
        
        {onRowAction && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <button
              onClick={() => onRowAction(row)}
              className="text-sm text-primary-main hover:text-primary-dark transition-colors"
            >
              Ver más
            </button>
          </div>
        )}
      </div>
    );
  };

  if (data.length === 0) {
    return (
      <div className={`bg-white rounded-lg border border-gray-200 p-8 text-center ${className}`}>
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Desktop Table */}
      <div className="hidden md:block bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${column.className || ''}`}
                  >
                    {column.label}
                  </th>
                ))}
                {onRowAction && (
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-12">
                    Acciones
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((row, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={`px-6 py-4 whitespace-nowrap text-sm ${column.className || ''}`}
                    >
                      {column.render ? column.render(row[column.key], row) : row[column.key]}
                    </td>
                  ))}
                  {onRowAction && (
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => onRowAction(row)}
                        className="p-1 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-main"
                        aria-label="Más opciones"
                      >
                        <MoreVertical size={16} className="text-gray-500" />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {data.map((row, index) => renderMobileCard(row, index))}
      </div>
    </div>
  );
};

export default ResponsiveTable;