-- Enable RLS on users table if not already enabled
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Policy 1: Users can view and update their own profile data
CREATE POLICY "Users can manage their own profile" 
ON public.users 
FOR ALL 
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Policy 2: Medical staff can view other users (needed for operations like seeing doctor/nurse lists)
CREATE POLICY "Medical staff can view user profiles" 
ON public.users 
FOR SELECT 
USING (is_medical_staff());

-- Policy 3: Only admins can insert new users (user creation should go through proper channels)
CREATE POLICY "Admins can create users" 
ON public.users 
FOR INSERT 
WITH CHECK (get_current_user_role() = 'admin'::user_role);

-- Policy 4: Only admins can delete users
CREATE POLICY "Admins can delete users" 
ON public.users 
FOR DELETE 
USING (get_current_user_role() = 'admin'::user_role);