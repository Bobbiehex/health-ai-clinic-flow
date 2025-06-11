
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AIInsightRequest {
  patientId?: string;
  medicalData?: any;
  queryType: 'diagnosis_assistance' | 'treatment_recommendations' | 'risk_assessment' | 'drug_interactions';
  context?: string;
}

export const useAIAssistant = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const generateMedicalInsights = async (request: AIInsightRequest) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-medical-assistant', {
        body: request
      });

      if (error) throw error;

      return { success: true, insights: data.insights };
    } catch (error: any) {
      toast({
        title: 'AI Analysis Failed',
        description: error.message || 'Failed to generate medical insights',
        variant: 'destructive'
      });
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const generatePatientSummary = async (patientId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-patient-summary', {
        body: { patientId }
      });

      if (error) throw error;

      return { success: true, summary: data.summary };
    } catch (error: any) {
      toast({
        title: 'Summary Generation Failed',
        description: error.message || 'Failed to generate patient summary',
        variant: 'destructive'
      });
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    generateMedicalInsights,
    generatePatientSummary
  };
};
