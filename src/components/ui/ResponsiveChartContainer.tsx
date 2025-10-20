import React from 'react';
import { ResponsiveContainer } from 'recharts';

interface ResponsiveChartContainerProps {
  children: React.ReactElement;
  height?: number | string;
  className?: string;
  minHeight?: number;
}

const ResponsiveChartContainer: React.FC<ResponsiveChartContainerProps> = ({
  children,
  height = 400,
  className = '',
  minHeight = 300
}) => {
  // Responsive height based on screen size
  const getResponsiveHeight = () => {
    if (typeof height === 'string') return height;
    
    // Mobile: reduce height by 25%
    // Tablet: reduce height by 15%
    // Desktop: use full height
    return {
      mobile: Math.max(minHeight, height * 0.75),
      tablet: Math.max(minHeight, height * 0.85),
      desktop: height
    };
  };

  const heights = getResponsiveHeight();

  return (
    <div className={`w-full ${className}`}>
      {/* Mobile */}
      <div className="sm:hidden">
        <ResponsiveContainer width="100%" height={typeof heights === 'object' ? heights.mobile : heights}>
          {children}
        </ResponsiveContainer>
      </div>
      
      {/* Tablet */}
      <div className="hidden sm:block lg:hidden">
        <ResponsiveContainer width="100%" height={typeof heights === 'object' ? heights.tablet : heights}>
          {children}
        </ResponsiveContainer>
      </div>
      
      {/* Desktop */}
      <div className="hidden lg:block">
        <ResponsiveContainer width="100%" height={typeof heights === 'object' ? heights.desktop : heights}>
          {children}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ResponsiveChartContainer;