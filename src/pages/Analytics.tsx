
import React from 'react';
import { AnalyticsDashboard } from '@/components/analytics/AnalyticsDashboard';
import { useSessionManagement } from '@/hooks/useSessionManagement';
import { SessionTimeoutWarning } from '@/components/SessionTimeoutWarning';

const Analytics = () => {
  // Initialize session management (the hook handles everything internally)
  useSessionManagement();

  return (
    <div className="p-6">
      <AnalyticsDashboard />
      <SessionTimeoutWarning />
    </div>
  );
};

export default Analytics;
