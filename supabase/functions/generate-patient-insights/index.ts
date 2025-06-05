
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.10';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { patientId } = await req.json();
    
    if (!patientId) {
      return new Response(
        JSON.stringify({ error: 'Patient ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch patient data with medical records
    const { data: patientData, error: patientError } = await supabase
      .from('patients')
      .select(`
        *,
        user:users(*),
        medical_records(*),
        appointments(*)
      `)
      .eq('id', patientId)
      .single();

    if (patientError || !patientData) {
      console.error('Error fetching patient data:', patientError);
      return new Response(
        JSON.stringify({ error: 'Patient not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Generate AI insights based on patient data
    const insights = await generatePatientInsights(patientData);

    // Save insights to database
    const savedInsights = [];
    for (const insight of insights) {
      const { data, error } = await supabase
        .from('ai_insights')
        .insert({
          type: insight.type,
          title: insight.title,
          description: insight.description,
          recommendations: insight.recommendations,
          confidence_score: insight.confidence_score,
          target_entity_type: 'patient',
          target_entity_id: patientId,
          created_by_ai_model: 'patient-insights-v1',
          expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
        })
        .select()
        .single();

      if (!error) {
        savedInsights.push(data);
      }
    }

    return new Response(
      JSON.stringify({ insights: savedInsights }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-patient-insights function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function generatePatientInsights(patientData: any) {
  const insights = [];
  const currentDate = new Date();
  
  // Calculate patient age
  const age = Math.floor((currentDate.getTime() - new Date(patientData.date_of_birth).getTime()) / (1000 * 60 * 60 * 24 * 365.25));
  
  // Insight 1: Medication adherence and review
  if (patientData.current_medications && patientData.current_medications.length > 0) {
    insights.push({
      type: 'patient_flow',
      title: 'Medication Review Due',
      description: `Patient is currently on ${patientData.current_medications.length} medication(s). Regular review recommended.`,
      recommendations: [
        'Schedule medication review appointment',
        'Check for drug interactions',
        'Verify patient adherence and side effects',
        'Update medication list if needed'
      ],
      confidence_score: 0.85
    });
  }

  // Insight 2: Allergy management
  if (patientData.allergies && patientData.allergies.length > 0) {
    insights.push({
      type: 'patient_flow',
      title: 'Allergy Alert Active',
      description: `Patient has ${patientData.allergies.length} known allergies. Ensure all staff are aware.`,
      recommendations: [
        'Verify allergy information with patient',
        'Update emergency action plan if needed',
        'Consider allergy testing if symptoms have changed',
        'Ensure all prescriptions are checked against allergies'
      ],
      confidence_score: 0.95
    });
  }

  // Insight 3: Preventive care based on age
  if (age >= 50 && age < 75) {
    insights.push({
      type: 'patient_flow',
      title: 'Preventive Screening Recommended',
      description: `Patient is ${age} years old and may benefit from age-appropriate screenings.`,
      recommendations: [
        'Schedule colonoscopy screening',
        'Annual mammogram (if female)',
        'Bone density screening',
        'Cardiovascular risk assessment'
      ],
      confidence_score: 0.75
    });
  }

  // Insight 4: Visit frequency analysis
  const recentVisits = patientData.medical_records?.filter((record: any) => {
    const visitDate = new Date(record.visit_date);
    const sixMonthsAgo = new Date(currentDate.getTime() - 6 * 30 * 24 * 60 * 60 * 1000);
    return visitDate >= sixMonthsAgo;
  }) || [];

  if (recentVisits.length === 0) {
    insights.push({
      type: 'patient_flow',
      title: 'Follow-up Visit Recommended',
      description: 'No recent visits in the past 6 months. Consider scheduling check-up.',
      recommendations: [
        'Schedule routine check-up appointment',
        'Review current medications and dosages',
        'Update vital signs and health metrics',
        'Discuss any new symptoms or concerns'
      ],
      confidence_score: 0.70
    });
  }

  // Insight 5: Emergency contact verification
  if (!patientData.emergency_contact_name || !patientData.emergency_contact_phone) {
    insights.push({
      type: 'patient_flow',
      title: 'Emergency Contact Information Incomplete',
      description: 'Missing or incomplete emergency contact information.',
      recommendations: [
        'Update emergency contact name and phone number',
        'Verify relationship to patient',
        'Confirm contact information is current',
        'Consider adding secondary emergency contact'
      ],
      confidence_score: 0.90
    });
  }

  return insights;
}
