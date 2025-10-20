import React, { useState } from 'react';
import { TimePeriod } from '../types';
import KPICards from './dashboard/KPICards';
import TimeFilter from './dashboard/TimeFilter';
import CurrencyToggle from './dashboard/CurrencyToggle';
import ExpenseChart from './dashboard/ExpenseChart';
import RecentActivity from './dashboard/RecentActivity';
import RecentOrders from './dashboard/RecentOrders';
import LowStockAlert from './dashboard/LowStockAlert';
import QuickActions from './dashboard/QuickActions';

const Dashboard: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('Mes');
  const [selectedCurrency, setSelectedCurrency] = useState<'PEN' | 'USD'>('PEN');

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Filters and Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <TimeFilter 
          selectedPeriod={selectedPeriod} 
          onPeriodChange={setSelectedPeriod} 
        />
        <CurrencyToggle 
          selectedCurrency={selectedCurrency} 
          onCurrencyChange={setSelectedCurrency} 
        />
      </div>

      {/* KPI Cards */}
      <KPICards 
        period={selectedPeriod} 
        currency={selectedCurrency} 
      />

      {/* Charts and Main Content */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
        <div className="xl:col-span-2 order-2 xl:order-1">
          <ExpenseChart 
            period={selectedPeriod} 
            currency={selectedCurrency} 
          />
        </div>
        <div className="order-1 xl:order-2">
          <QuickActions />
        </div>
      </div>

      {/* Secondary Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-1">
          <RecentActivity />
        </div>
        <div className="lg:col-span-1">
          <RecentOrders currency={selectedCurrency} />
        </div>
        <div className="lg:col-span-1">
          <LowStockAlert />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;