
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface AuditLogEntry {
  id: string;
  user_id: string;
  action: string;
  resource_type: string;
  resource_id: string;
  ip_address?: string;
  user_agent?: string;
  metadata?: any;
  created_at: string;
}

export const useAuditLog = () => {
  const { user } = useAuth();
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(false);

  const logAction = async (
    action: string,
    resourceType: string,
    resourceId: string,
    metadata?: any
  ) => {
    if (!user) return;

    try {
      const { error } = await supabase.functions.invoke('audit-logger', {
        body: {
          action,
          resource_type: resourceType,
          resource_id: resourceId,
          metadata,
        },
      });

      if (error) {
        console.error('Audit log error:', error);
      }
    } catch (error) {
      console.error('Failed to log audit action:', error);
    }
  };

  const fetchLogs = async (filters?: {
    resource_type?: string;
    user_id?: string;
    date_range?: { start: string; end: string };
  }) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('get-audit-logs', {
        body: filters,
      });

      if (error) throw error;
      setLogs(data?.logs || []);
    } catch (error) {
      console.error('Failed to fetch audit logs:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    logs,
    loading,
    logAction,
    fetchLogs,
  };
};
