
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export const useRealtimeAnalytics = () => {
  const { user } = useAuth();
  const [liveMetrics, setLiveMetrics] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;

    // Real-time subscription for performance metrics
    const metricsSubscription = supabase
      .channel('live_metrics')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'performance_metrics',
        },
        (payload) => {
          console.log('New performance metric:', payload);
          setLiveMetrics(prev => [payload.new, ...prev.slice(0, 9)]);
        }
      )
      .subscribe();

    // Real-time subscription for resource alerts
    const alertsSubscription = supabase
      .channel('live_alerts')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'resource_alerts',
        },
        (payload) => {
          console.log('New alert:', payload);
          setAlerts(prev => [payload.new, ...prev]);
        }
      )
      .subscribe();

    // Simulate real-time metrics for demo
    const interval = setInterval(() => {
      const mockMetric = {
        id: Date.now().toString(),
        metric_name: 'cpu_usage',
        metric_value: Math.random() * 100,
        metric_category: 'system',
        measurement_timestamp: new Date().toISOString(),
      };
      setLiveMetrics(prev => [mockMetric, ...prev.slice(0, 9)]);
    }, 5000);

    return () => {
      metricsSubscription.unsubscribe();
      alertsSubscription.unsubscribe();
      clearInterval(interval);
    };
  }, [user]);

  return {
    liveMetrics,
    alerts,
  };
};
