
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

    const { format, filters, user_id } = await req.json()

    // Fetch analytics data based on filters
    let query = supabaseClient
      .from('analytics_data')
      .select('*')
      .order('date_recorded', { ascending: false })

    if (filters?.category) {
      query = query.eq('metric_category', filters.category)
    }
    
    if (filters?.department) {
      query = query.eq('department', filters.department)
    }
    
    if (filters?.dateRange) {
      query = query.gte('date_recorded', filters.dateRange.start)
                   .lte('date_recorded', filters.dateRange.end)
    }

    const { data: analyticsData, error: fetchError } = await query.limit(1000)
    
    if (fetchError) throw fetchError

    // Also fetch performance metrics
    const { data: performanceData } = await supabaseClient
      .from('performance_metrics')
      .select('*')
      .order('measurement_timestamp', { ascending: false })
      .limit(500)

    let reportContent: string
    let mimeType: string
    let fileName: string

    if (format === 'csv') {
      reportContent = generateCSVReport(analyticsData || [], performanceData || [])
      mimeType = 'text/csv'
      fileName = `analytics_report_${new Date().toISOString().split('T')[0]}.csv`
    } else {
      reportContent = generatePDFReport(analyticsData || [], performanceData || [])
      mimeType = 'application/pdf'
      fileName = `analytics_report_${new Date().toISOString().split('T')[0]}.pdf`
    }

    // Create a data URL for the report
    const base64Content = btoa(reportContent)
    const dataUrl = `data:${mimeType};base64,${base64Content}`

    console.log(`Generated ${format.toUpperCase()} report for user ${user.email}`)

    return new Response(
      JSON.stringify({ 
        url: dataUrl,
        fileName,
        success: true 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Report export error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})

function generateCSVReport(analyticsData: any[], performanceData: any[]): string {
  let csv = 'Report Type,Date,Metric Name,Value,Category,Department\n'
  
  // Add analytics data
  analyticsData.forEach(item => {
    csv += `Analytics,${item.date_recorded},${item.metric_name},${item.value},${item.metric_category},${item.department || 'N/A'}\n`
  })
  
  // Add performance data
  performanceData.forEach(item => {
    csv += `Performance,${item.measurement_timestamp},${item.metric_name},${item.metric_value},${item.metric_category},${item.department || 'N/A'}\n`
  })
  
  return csv
}

function generatePDFReport(analyticsData: any[], performanceData: any[]): string {
  // Simple HTML-based PDF content (in a real implementation, you'd use a proper PDF library)
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Analytics Report</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
        h1 { color: #333; }
        .summary { background-color: #f9f9f9; padding: 15px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <h1>ClinicManager Analytics Report</h1>
      <p>Generated on: ${new Date().toLocaleDateString()}</p>
      
      <div class="summary">
        <h2>Summary</h2>
        <p>Total Analytics Records: ${analyticsData.length}</p>
        <p>Total Performance Metrics: ${performanceData.length}</p>
      </div>
      
      <h2>Analytics Data</h2>
      <table>
        <tr>
          <th>Date</th>
          <th>Metric Name</th>
          <th>Value</th>
          <th>Category</th>
          <th>Department</th>
        </tr>
        ${analyticsData.slice(0, 50).map(item => `
          <tr>
            <td>${item.date_recorded}</td>
            <td>${item.metric_name}</td>
            <td>${item.value}</td>
            <td>${item.metric_category}</td>
            <td>${item.department || 'N/A'}</td>
          </tr>
        `).join('')}
      </table>
      
      <h2>Performance Metrics</h2>
      <table>
        <tr>
          <th>Timestamp</th>
          <th>Metric Name</th>
          <th>Value</th>
          <th>Category</th>
          <th>Department</th>
        </tr>
        ${performanceData.slice(0, 50).map(item => `
          <tr>
            <td>${item.measurement_timestamp}</td>
            <td>${item.metric_name}</td>
            <td>${item.metric_value}</td>
            <td>${item.metric_category}</td>
            <td>${item.department || 'N/A'}</td>
          </tr>
        `).join('')}
      </table>
    </body>
    </html>
  `
  
  return html
}
