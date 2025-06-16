
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface AnalyticsData {
  metric_name: string;
  value: number;
  date_recorded: string;
  metric_category: string;
  department?: string;
  additional_data?: any;
}

interface PerformanceMetric {
  id: string;
  metric_name: string;
  metric_value: number;
  metric_category: string;
  department?: string;
  measurement_timestamp: string;
  metadata?: any;
}

export const useAnalytics = () => {
  const { user } = useAuth();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData[]>([]);
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetric[]>([]);
  const [loading, setLoading] = useState(false);
  const [realTimeData, setRealTimeData] = useState<any[]>([]);

  const fetchAnalyticsData = async (filters?: {
    category?: string;
    department?: string;
    dateRange?: { start: string; end: string };
  }) => {
    if (!user) return;
    
    setLoading(true);
    try {
      let query = supabase
        .from('analytics_data')
        .select('*')
        .order('date_recorded', { ascending: false });

      if (filters?.category) {
        query = query.eq('metric_category', filters.category);
      }
      
      if (filters?.department) {
        query = query.eq('department', filters.department);
      }
      
      if (filters?.dateRange) {
        query = query.gte('date_recorded', filters.dateRange.start)
                     .lte('date_recorded', filters.dateRange.end);
      }

      const { data, error } = await query.limit(100);
      
      if (error) throw error;
      setAnalyticsData(data || []);
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPerformanceMetrics = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('performance_metrics')
        .select('*')
        .order('measurement_timestamp', { ascending: false })
        .limit(50);
      
      if (error) throw error;
      setPerformanceMetrics(data || []);
    } catch (error) {
      console.error('Error fetching performance metrics:', error);
    }
  };

  const generateAIInsights = async (targetType: string, targetId?: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('generate-ai-insights', {
        body: {
          target_entity_type: targetType,
          target_entity_id: targetId,
        },
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error generating AI insights:', error);
      return null;
    }
  };

  const exportAnalyticsReport = async (format: 'csv' | 'pdf', filters?: any) => {
    try {
      const { data, error } = await supabase.functions.invoke('export-analytics-report', {
        body: {
          format,
          filters,
          user_id: user?.id,
        },
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error exporting report:', error);
      return null;
    }
  };

  // Set up real-time subscriptions
  useEffect(() => {
    if (!user) return;

    const analyticsSubscription = supabase
      .channel('analytics_updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'analytics_data',
        },
        (payload) => {
          console.log('Analytics data updated:', payload);
          fetchAnalyticsData();
        }
      )
      .subscribe();

    const performanceSubscription = supabase
      .channel('performance_updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'performance_metrics',
        },
        (payload) => {
          console.log('Performance metrics updated:', payload);
          fetchPerformanceMetrics();
        }
      )
      .subscribe();

    return () => {
      analyticsSubscription.unsubscribe();
      performanceSubscription.unsubscribe();
    };
  }, [user]);

  return {
    analyticsData,
    performanceMetrics,
    realTimeData,
    loading,
    fetchAnalyticsData,
    fetchPerformanceMetrics,
    generateAIInsights,
    exportAnalyticsReport,
  };
};
