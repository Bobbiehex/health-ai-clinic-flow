
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useBackupSystem = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const createBackup = async (backupType: 'full' | 'incremental' | 'patient_data') => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-backup', {
        body: { backupType, timestamp: new Date().toISOString() }
      });

      if (error) throw error;

      toast({
        title: 'Backup Created',
        description: `${backupType} backup created successfully`
      });

      return { success: true, backupId: data.backupId };
    } catch (error: any) {
      toast({
        title: 'Backup Failed',
        description: error.message || 'Failed to create backup',
        variant: 'destructive'
      });
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const restoreFromBackup = async (backupId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('restore-backup', {
        body: { backupId }
      });

      if (error) throw error;

      toast({
        title: 'Restore Complete',
        description: 'Data restored successfully from backup'
      });

      return { success: true };
    } catch (error: any) {
      toast({
        title: 'Restore Failed',
        description: error.message || 'Failed to restore from backup',
        variant: 'destructive'
      });
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const getBackupHistory = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('get-backup-history');
      
      if (error) throw error;
      
      return { success: true, backups: data.backups };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  return {
    loading,
    createBackup,
    restoreFromBackup,
    getBackupHistory
  };
};
