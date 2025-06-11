
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get user from JWT
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

    const { action, resource_type, resource_id, metadata } = await req.json()

    // Get client info from headers
    const userAgent = req.headers.get('user-agent') || ''
    const xForwardedFor = req.headers.get('x-forwarded-for') || ''
    const ipAddress = xForwardedFor.split(',')[0] || req.headers.get('x-real-ip') || 'unknown'

    // Log the audit entry
    const { error: insertError } = await supabaseClient
      .from('audit_logs')
      .insert({
        user_id: user.id,
        action,
        resource_type,
        resource_id,
        ip_address: ipAddress,
        user_agent: userAgent,
        metadata,
        created_at: new Date().toISOString()
      })

    if (insertError) {
      console.error('Failed to insert audit log:', insertError)
      throw insertError
    }

    console.log(`Audit log created: ${action} on ${resource_type} by ${user.email}`)

    return new Response(
      JSON.stringify({ success: true }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Audit logger error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})
