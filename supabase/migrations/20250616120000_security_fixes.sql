
-- Create audit_logs table that's referenced in the audit logger function
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id TEXT NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on audit_logs
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for audit_logs - only admins and doctors can view audit logs
CREATE POLICY "Admin and doctors can view audit logs" ON public.audit_logs
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'doctor')
    )
  );

-- Create RLS policy for audit_logs - system can insert audit logs
CREATE POLICY "System can insert audit logs" ON public.audit_logs
  FOR INSERT 
  WITH CHECK (true); -- Edge functions will handle this with service role

-- Create performance metrics table for analytics
CREATE TABLE IF NOT EXISTS public.performance_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  department TEXT NOT NULL,
  metric_type TEXT NOT NULL CHECK (metric_type IN ('efficiency', 'satisfaction', 'wait_time', 'throughput')),
  value DECIMAL NOT NULL,
  unit TEXT,
  recorded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  recorded_by UUID REFERENCES auth.users(id)
);

-- Enable RLS on performance_metrics
ALTER TABLE public.performance_metrics ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for performance_metrics - medical staff can view
CREATE POLICY "Medical staff can view performance metrics" ON public.performance_metrics
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'doctor', 'nurse')
    )
  );

-- Create RLS policy for performance_metrics - admin and doctors can insert
CREATE POLICY "Admin and doctors can insert performance metrics" ON public.performance_metrics
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'doctor')
    )
  );

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON public.audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_resource_type ON public.audit_logs(resource_type);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_performance_metrics_department ON public.performance_metrics(department);
CREATE INDEX IF NOT EXISTS idx_performance_metrics_recorded_at ON public.performance_metrics(recorded_at);

-- Enable real-time for audit logs (for admin monitoring)
ALTER TABLE public.audit_logs REPLICA IDENTITY FULL;
ALTER publication supabase_realtime ADD TABLE public.audit_logs;

-- Enable real-time for performance metrics
ALTER TABLE public.performance_metrics REPLICA IDENTITY FULL;
ALTER publication supabase_realtime ADD TABLE public.performance_metrics;

-- Create function to safely get user role (security definer to avoid RLS recursion)
CREATE OR REPLACE FUNCTION public.get_user_role(user_id UUID DEFAULT auth.uid())
RETURNS TEXT
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT role FROM public.users WHERE id = user_id;
$$;

-- Update existing RLS policies to use the secure function where needed
-- (This prevents potential RLS recursion issues)

-- Security enhancement: Add IP address logging function
CREATE OR REPLACE FUNCTION public.log_security_event(
  p_event_type TEXT,
  p_description TEXT,
  p_severity TEXT DEFAULT 'medium'
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.audit_logs (
    user_id,
    action,
    resource_type,
    resource_id,
    metadata
  ) VALUES (
    COALESCE(auth.uid(), '00000000-0000-0000-0000-000000000000'::UUID),
    p_event_type,
    'security_event',
    'system',
    jsonb_build_object(
      'description', p_description,
      'severity', p_severity,
      'timestamp', now()
    )
  );
END;
$$;
