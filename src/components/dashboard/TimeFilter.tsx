import React from 'react';
import { TimePeriod } from '../../types';

interface TimeFilterProps {
  selectedPeriod: TimePeriod;
  onPeriodChange: (period: TimePeriod) => void;
}

const periods: TimePeriod[] = ['Semana', 'Mes', 'Trimestre'];

const TimeFilter: React.FC<TimeFilterProps> = ({ selectedPeriod, onPeriodChange }) => {
  return (
    <div className="flex space-x-2">
      {periods.map((period) => (
        <button
          key={period}
          onClick={() => onPeriodChange(period)}
          className={`chip ${
            selectedPeriod === period ? 'chip-active' : 'chip-inactive'
          }`}
        >
          {period}
        </button>
      ))}
    </div>
  );
};

export default TimeFilter;