import React from 'react';
import { getKPIsByPeriod, EXCHANGE_RATE } from '../../data/mockData';
import { TimePeriod, KPIData } from '../../types';
import KPICard from '../ui/KPICard';

interface KPICardsProps {
  period: TimePeriod;
  currency: 'PEN' | 'USD';
}

const KPICards: React.FC<KPICardsProps> = ({ period, currency }) => {
  const kpis = getKPIsByPeriod(period);
  
  const formatKPIForCurrency = (kpi: KPIData): KPIData => {
    if (!kpi.title.includes('Gasto')) {
      return kpi;
    }
    
    const numValue = parseFloat(kpi.value.replace(/,/g, ''));
    if (currency === 'USD') {
      const convertedValue = numValue / EXCHANGE_RATE;
      return {
        ...kpi,
        value: `$${convertedValue.toLocaleString('en-US', { 
          minimumFractionDigits: 0,
          maximumFractionDigits: 0 
        })}`
      };
    }
    
    return {
      ...kpi,
      value: `S/${kpi.value}`
    };
  };

  const kpiArray = [
    formatKPIForCurrency(kpis.proveedores),
    formatKPIForCurrency(kpis.ordenesPendientes),
    formatKPIForCurrency(kpis.alertasStock),
    formatKPIForCurrency(kpis.gastoMes)
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
      {kpiArray.map((kpi, index) => (
        <KPICard key={index} data={kpi} />
      ))}
    </div>
  );
};

export default KPICards;