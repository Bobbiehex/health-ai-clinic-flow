
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
    const { patientId, externalSystemId } = await req.json();
    
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Simulate external system integration
    // In production, this would connect to actual medical systems like Epic, Cerner, etc.
    const mockExternalData = {
      vitals: {
        bloodPressure: '120/80',
        heartRate: 72,
        temperature: 98.6,
        lastUpdated: new Date().toISOString()
      },
      labs: [
        {
          test: 'Complete Blood Count',
          result: 'Normal',
          date: new Date().toISOString()
        }
      ],
      medications: [
        {
          name: 'Lisinopril 10mg',
          dosage: 'Once daily',
          prescriber: 'Dr. Smith'
        }
      ]
    };

    // Update patient record with synchronized data
    const { data: updatedPatient, error: updateError } = await supabase
      .from('patients')
      .update({
        external_system_data: mockExternalData,
        last_sync: new Date().toISOString()
      })
      .eq('id', patientId)
      .select()
      .single();

    if (updateError) {
      throw updateError;
    }

    // Log the sync operation
    await supabase.from('system_logs').insert({
      operation: 'external_sync',
      entity_type: 'patient',
      entity_id: patientId,
      details: {
        external_system: externalSystemId,
        sync_timestamp: new Date().toISOString(),
        data_types: ['vitals', 'labs', 'medications']
      }
    });

    return new Response(
      JSON.stringify({ 
        success: true, 
        syncedData: mockExternalData,
        patient: updatedPatient 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in sync-medical-data function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
