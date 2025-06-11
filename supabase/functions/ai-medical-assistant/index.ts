
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.10';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { queryType, patientId, medicalData, context } = await req.json();
    
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // For now, we'll generate mock insights based on the query type
    // In production, this would integrate with medical AI APIs
    let insights = [];

    switch (queryType) {
      case 'diagnosis_assistance':
        insights = [
          {
            type: 'diagnostic_suggestion',
            confidence: 0.85,
            suggestion: 'Based on symptoms, consider differential diagnosis including viral infection, bacterial infection, or allergic reaction',
            recommendations: ['Order CBC with differential', 'Consider throat culture', 'Monitor temperature trends']
          }
        ];
        break;
        
      case 'treatment_recommendations':
        insights = [
          {
            type: 'treatment_option',
            confidence: 0.78,
            suggestion: 'Evidence-based treatment protocols suggest combination therapy approach',
            recommendations: ['Start with conservative management', 'Monitor patient response', 'Consider escalation if no improvement in 48-72 hours']
          }
        ];
        break;
        
      case 'risk_assessment':
        insights = [
          {
            type: 'risk_factor',
            confidence: 0.92,
            suggestion: 'Patient shows moderate risk factors for complications',
            recommendations: ['Increase monitoring frequency', 'Patient education on warning signs', 'Schedule follow-up in 24-48 hours']
          }
        ];
        break;
        
      case 'drug_interactions':
        insights = [
          {
            type: 'interaction_check',
            confidence: 0.95,
            suggestion: 'No significant drug interactions detected with current medications',
            recommendations: ['Safe to proceed with proposed medication', 'Monitor for any unexpected side effects', 'Review medication list at next visit']
          }
        ];
        break;
        
      default:
        insights = [
          {
            type: 'general_analysis',
            confidence: 0.70,
            suggestion: 'General medical analysis completed',
            recommendations: ['Review patient history', 'Consider additional testing if indicated', 'Document findings thoroughly']
          }
        ];
    }

    // Log the AI assistance request for audit purposes
    await supabase.from('ai_insights').insert({
      type: queryType,
      title: `AI Medical Assistant - ${queryType}`,
      description: `AI-generated insights for ${queryType}`,
      recommendations: insights.map(i => i.suggestion),
      confidence_score: insights[0]?.confidence || 0.5,
      target_entity_type: 'patient',
      target_entity_id: patientId,
      created_by_ai_model: 'medical-assistant-v1'
    });

    return new Response(
      JSON.stringify({ insights }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in ai-medical-assistant function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
