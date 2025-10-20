import { useState, useEffect } from 'react';

export const useSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    // Load sidebar state from localStorage
    const stored = localStorage.getItem('erp-sidebar-collapsed');
    if (stored) {
      try {
        setIsCollapsed(JSON.parse(stored));
      } catch {
        // If parsing fails, keep default state
      }
    }
  }, []);

  const toggleCollapsed = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem('erp-sidebar-collapsed', JSON.stringify(newState));
  };

  const toggleMobile = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  const closeMobile = () => {
    setIsMobileOpen(false);
  };

  return {
    isCollapsed,
    isMobileOpen,
    toggleCollapsed,
    toggleMobile,
    closeMobile
  };
};