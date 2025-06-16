
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { useAnalytics } from '@/hooks/useAnalytics';
import { format } from 'date-fns';
import { KeyMetricsGrid } from './KeyMetricsGrid';
import { AIInsightsPanel } from './AIInsightsPanel';
import { OverviewTab } from './OverviewTab';
import { PatientFlowTab } from './PatientFlowTab';
import { PerformanceTab } from './PerformanceTab';
import { ResourcesTab } from './ResourcesTab';

export const AnalyticsDashboard: React.FC = () => {
  const { 
    analyticsData, 
    performanceMetrics, 
    loading, 
    fetchAnalyticsData, 
    fetchPerformanceMetrics,
    generateAIInsights,
    exportAnalyticsReport
  } = useAnalytics();
  
  const [insights, setInsights] = useState<any[]>([]);

  useEffect(() => {
    fetchAnalyticsData();
    fetchPerformanceMetrics();
    loadAIInsights();
  }, []);

  const loadAIInsights = async () => {
    const insightsData = await generateAIInsights('dashboard');
    if (insightsData) {
      setInsights(insightsData.insights || []);
    }
  };

  const handleExportReport = async (reportFormat: 'csv' | 'pdf') => {
    const report = await exportAnalyticsReport(reportFormat, {});
    if (report?.url) {
      window.open(report.url, '_blank');
    }
  };

  const patientFlowData = analyticsData
    .filter(d => d.metric_category === 'patient_flow')
    .slice(0, 7)
    .map(d => ({
      date: format(new Date(d.date_recorded), 'MMM dd'),
      patients: d.value,
      appointments: Math.floor(d.value * 0.8)
    }));

  const departmentPerformance = performanceMetrics
    .filter(m => m.department)
    .reduce((acc: any, metric) => {
      const dept = metric.department!;
      if (!acc[dept]) {
        acc[dept] = { department: dept, efficiency: 0, satisfaction: 0 };
      }
      if (metric.metric_name.includes('efficiency')) {
        acc[dept].efficiency = metric.metric_value;
      }
      if (metric.metric_name.includes('satisfaction')) {
        acc[dept].satisfaction = metric.metric_value;
      }
      return acc;
    }, {});

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analytics & Insights</h1>
          <p className="text-muted-foreground">
            Real-time dashboard with AI-powered insights and performance analytics
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => handleExportReport('csv')}
            disabled={loading}
          >
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button 
            variant="outline"
            onClick={() => handleExportReport('pdf')}
            disabled={loading}
          >
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      <KeyMetricsGrid />

      <AIInsightsPanel insights={insights} />

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="patient-flow">Patient Flow</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <OverviewTab patientFlowData={patientFlowData} />
        </TabsContent>

        <TabsContent value="patient-flow" className="space-y-4">
          <PatientFlowTab patientFlowData={patientFlowData} />
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <PerformanceTab departmentPerformance={Object.values(departmentPerformance)} />
        </TabsContent>

        <TabsContent value="resources" className="space-y-4">
          <ResourcesTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};
