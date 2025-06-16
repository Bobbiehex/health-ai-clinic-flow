
import React from 'react';
import { AnalyticsDashboard } from '@/components/analytics/AnalyticsDashboard';
import { useSessionManagement } from '@/hooks/useSessionManagement';
import { SessionTimeoutWarning } from '@/components/SessionTimeoutWarning';

const Analytics = () => {
  const { showTimeoutWarning, timeRemaining, extendSession } = useSessionManagement();

  return (
    <div className="p-6">
      <AnalyticsDashboard />
      
      <SessionTimeoutWarning
        isOpen={showTimeoutWarning}
        timeRemaining={timeRemaining}
        onExtendSession={extendSession}
      />
    </div>
  );
};

export default Analytics;
