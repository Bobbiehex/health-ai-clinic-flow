
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

    // Check if user has admin role
    const { data: userProfile } = await supabaseClient
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!userProfile || !['admin', 'doctor'].includes(userProfile.role)) {
      throw new Error('Insufficient permissions')
    }

    const filters = await req.json().catch(() => ({}))
    
    let query = supabaseClient
      .from('audit_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100)

    // Apply filters
    if (filters.resource_type) {
      query = query.eq('resource_type', filters.resource_type)
    }
    
    if (filters.user_id) {
      query = query.eq('user_id', filters.user_id)
    }
    
    if (filters.date_range) {
      query = query.gte('created_at', filters.date_range.start)
                   .lte('created_at', filters.date_range.end)
    }

    const { data: logs, error: fetchError } = await query

    if (fetchError) {
      throw fetchError
    }

    console.log(`Fetched ${logs?.length || 0} audit logs for user ${user.email}`)

    return new Response(
      JSON.stringify({ logs: logs || [] }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Get audit logs error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})
