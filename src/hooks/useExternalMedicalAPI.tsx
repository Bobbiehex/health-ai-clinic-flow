
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface MedicalAPIResponse {
  success: boolean;
  data?: any;
  error?: string;
}

export const useExternalMedicalAPI = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const syncPatientData = async (patientId: string, externalSystemId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('sync-medical-data', {
        body: { patientId, externalSystemId }
      });

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Patient data synchronized successfully'
      });

      return { success: true, data };
    } catch (error: any) {
      toast({
        title: 'Sync Failed',
        description: error.message || 'Failed to sync patient data',
        variant: 'destructive'
      });
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const sendHL7Message = async (messageData: any, destinationSystem: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-hl7-message', {
        body: { messageData, destinationSystem }
      });

      if (error) throw error;

      return { success: true, data };
    } catch (error: any) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    syncPatientData,
    sendHL7Message
  };
};
