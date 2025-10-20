import React from 'react';
import { XAxis, YAxis, CartesianGrid, Tooltip, Area, AreaChart } from 'recharts';
import { generateChartData, EXCHANGE_RATE } from '../../data/mockData';
import { TimePeriod } from '../../types';
import ResponsiveChartContainer from '../ui/ResponsiveChartContainer';

interface ExpenseChartProps {
  period: TimePeriod;
  currency: 'PEN' | 'USD';
}

const ExpenseChart: React.FC<ExpenseChartProps> = ({ period, currency }) => {
  const data = generateChartData(period);
  
  const formatData = (data: any[]) => {
    return data.map(item => ({
      ...item,
      gasto: currency === 'USD' ? item.gasto / EXCHANGE_RATE : item.gasto,
      anterior: currency === 'USD' ? item.anterior / EXCHANGE_RATE : item.anterior
    }));
  };

  const formatTooltip = (value: number) => {
    const symbol = currency === 'USD' ? '$' : 'S/';
    return [`${symbol}${value.toLocaleString()}`, ''];
  };

  const formatYAxisTick = (value: number, isMobile: boolean = false) => {
    const symbol = currency === 'USD' ? '$' : 'S/';
    const divisor = isMobile ? 1000 : 1000;
    const suffix = isMobile ? 'k' : 'k';
    return `${symbol}${(value / divisor).toFixed(0)}${suffix}`;
  };

  const formattedData = formatData(data);

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-dark">
            Tendencia de Gastos
          </h3>
          <p className="text-sm text-gray-medium">
            Comparación con periodo anterior ({currency})
          </p>
        </div>
      </div>
      
      <ResponsiveChartContainer height={320} minHeight={250}>
        <AreaChart data={formattedData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
          <defs>
            <linearGradient id="colorGasto" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#FF6F00" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#FF6F00" stopOpacity={0.1}/>
            </linearGradient>
            <linearGradient id="colorAnterior" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#757575" stopOpacity={0.6}/>
              <stop offset="95%" stopColor="#757575" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="name" 
            stroke="#757575"
            fontSize={10}
            tick={{ fontSize: 10 }}
            interval={0}
            angle={-45}
            textAnchor="end"
            height={60}
          />
          <YAxis 
            stroke="#757575"
            fontSize={10}
            tick={{ fontSize: 10 }}
            tickFormatter={(value) => formatYAxisTick(value)}
            width={60}
          />
          <Tooltip 
            formatter={formatTooltip}
            labelStyle={{ color: '#2E2E2E', fontSize: '12px' }}
            contentStyle={{ 
              backgroundColor: 'white', 
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              fontSize: '12px'
            }}
          />
          <Area
            type="monotone"
            dataKey="anterior"
            stroke="#757575"
            strokeWidth={2}
            fill="url(#colorAnterior)"
            name="Periodo anterior"
          />
          <Area
            type="monotone"
            dataKey="gasto"
            stroke="#FF6F00"
            strokeWidth={3}
            fill="url(#colorGasto)"
            name="Periodo actual"
          />
        </AreaChart>
      </ResponsiveChartContainer>
    </div>
  );
};

export default ExpenseChart;