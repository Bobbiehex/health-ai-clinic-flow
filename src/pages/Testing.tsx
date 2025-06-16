
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TestSuite } from '@/components/testing/TestSuite';
import { PerformanceMonitor } from '@/components/performance/PerformanceMonitor';
import { HIPAACompliancePanel } from '@/components/HIPAACompliance';
import { useSessionManagement } from '@/hooks/useSessionManagement';
import { SessionTimeoutWarning } from '@/components/SessionTimeoutWarning';

const Testing = () => {
  const { showTimeoutWarning, timeRemaining, extendSession } = useSessionManagement();

  return (
    <div className="p-6">
      <Tabs defaultValue="testing" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="testing">Test Suite</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
        </TabsList>

        <TabsContent value="testing">
          <TestSuite />
        </TabsContent>

        <TabsContent value="performance">
          <PerformanceMonitor />
        </TabsContent>

        <TabsContent value="compliance">
          <HIPAACompliancePanel />
        </TabsContent>
      </Tabs>

      <SessionTimeoutWarning
        isOpen={showTimeoutWarning}
        timeRemaining={timeRemaining}
        onExtendSession={extendSession}
      />
    </div>
  );
};

export default Testing;
