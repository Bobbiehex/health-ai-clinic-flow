
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('No authorization header')
    }

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(
      authHeader.replace('Bearer ', '')
    )

    if (authError || !user) {
      throw new Error('Invalid token')
    }

    const { target_entity_type, target_entity_id } = await req.json()

    // Generate AI insights based on analytics data
    const insights = await generateInsights(supabaseClient, target_entity_type, target_entity_id)

    // Store insights in the database
    for (const insight of insights) {
      await supabaseClient
        .from('ai_insights')
        .insert({
          type: insight.type,
          title: insight.title,
          description: insight.description,
          confidence_score: insight.confidence_score,
          target_entity_type,
          target_entity_id,
          recommendations: insight.recommendations,
          data_points: insight.data_points,
          created_by_ai_model: 'analytics-engine-v1'
        })
    }

    return new Response(
      JSON.stringify({ insights }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('AI insights generation error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})

async function generateInsights(supabaseClient: any, entityType: string, entityId?: string) {
  const insights = []

  // Patient Flow Optimization
  const { data: appointmentData } = await supabaseClient
    .from('appointments')
    .select('*')
    .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())

  if (appointmentData && appointmentData.length > 0) {
    const avgAppointmentsPerDay = appointmentData.length / 30
    const peakHours = analyzeAppointmentTimes(appointmentData)
    
    insights.push({
      type: 'optimization',
      title: 'Patient Flow Optimization',
      description: `Based on 30 days of data, peak appointment times are ${peakHours.join(', ')}. Consider adding staff during these hours.`,
      confidence_score: 0.85,
      recommendations: [
        'Schedule additional staff during peak hours',
        'Implement staggered appointment scheduling',
        'Consider telemedicine for routine follow-ups'
      ],
      data_points: {
        avgAppointmentsPerDay,
        peakHours,
        totalAppointments: appointmentData.length
      }
    })
  }

  // Resource Utilization Analysis
  const { data: resourceData } = await supabaseClient
    .from('resource_allocations')
    .select('*')
    .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())

  if (resourceData && resourceData.length > 0) {
    const avgUtilization = resourceData.reduce((sum, r) => sum + (r.utilization_rate || 0), 0) / resourceData.length
    
    if (avgUtilization < 0.7) {
      insights.push({
        type: 'efficiency',
        title: 'Low Resource Utilization Detected',
        description: `Current average utilization is ${Math.round(avgUtilization * 100)}%. There's potential for optimization.`,
        confidence_score: 0.78,
        recommendations: [
          'Consolidate underutilized rooms',
          'Redistribute equipment to high-demand areas',
          'Implement dynamic scheduling based on demand'
        ],
        data_points: {
          avgUtilization,
          resourceCount: resourceData.length
        }
      })
    }
  }

  // Energy Efficiency Insights
  const { data: energyData } = await supabaseClient
    .from('energy_usage')
    .select('*')
    .gte('measurement_timestamp', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())

  if (energyData && energyData.length > 0) {
    const totalConsumption = energyData.reduce((sum, e) => sum + e.consumption_kwh, 0)
    const avgEfficiency = energyData.reduce((sum, e) => sum + (e.efficiency_rating || 3), 0) / energyData.length
    
    if (avgEfficiency < 4) {
      insights.push({
        type: 'sustainability',
        title: 'Energy Efficiency Improvement Opportunity',
        description: `Current efficiency rating is ${avgEfficiency.toFixed(1)}/5. Potential savings of $${Math.round(totalConsumption * 0.15 * 0.12)} monthly.`,
        confidence_score: 0.72,
        recommendations: [
          'Upgrade to LED lighting systems',
          'Implement smart HVAC scheduling',
          'Install occupancy sensors in rooms'
        ],
        data_points: {
          totalConsumption,
          avgEfficiency,
          potentialSavings: Math.round(totalConsumption * 0.15 * 0.12)
        }
      })
    }
  }

  // Predictive Maintenance Alerts
  const { data: equipmentData } = await supabaseClient
    .from('equipment')
    .select('*')
    .lt('next_maintenance', new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString())

  if (equipmentData && equipmentData.length > 0) {
    insights.push({
      type: 'maintenance',
      title: 'Upcoming Maintenance Required',
      description: `${equipmentData.length} pieces of equipment require maintenance within the next 2 weeks.`,
      confidence_score: 0.95,
      recommendations: [
        'Schedule maintenance during off-peak hours',
        'Prepare backup equipment',
        'Notify relevant departments of planned downtime'
      ],
      data_points: {
        equipmentCount: equipmentData.length,
        equipmentList: equipmentData.map(e => e.name)
      }
    })
  }

  return insights
}

function analyzeAppointmentTimes(appointments: any[]) {
  const hourCounts: { [key: string]: number } = {}
  
  appointments.forEach(apt => {
    if (apt.start_time) {
      const hour = apt.start_time.split(':')[0]
      hourCounts[hour] = (hourCounts[hour] || 0) + 1
    }
  })
  
  const sortedHours = Object.entries(hourCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3)
    .map(([hour]) => `${hour}:00`)
  
  return sortedHours
}
