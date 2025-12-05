
CREATE POLICY "Allow insert from authenticated users"
  ON public.profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (true);  

CREATE POLICY "Insert only via system"
  ON public.profiles
  FOR INSERT
  TO anon
  WITH CHECK (auth.role() = 'system');  

CREATE POLICY "Read own or admin"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR auth.role() = 'admin');

CREATE POLICY "Users read own profile"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid()); 

CREATE POLICY "Users update own profile"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());  

CREATE POLICY "Users update their own"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());  

CREATE POLICY "admins can view all created sessions"
  ON public.consultation_sessions
  FOR SELECT
  TO authenticated
  USING (auth.role() = 'admin');  

CREATE POLICY "admins can view all sessions"
  ON public.consultation_sessions
  FOR SELECT
  TO authenticated
  USING (auth.role() = 'admin');  

CREATE POLICY "allow users to insert their own session"
  ON public.consultation_sessions
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());  

CREATE POLICY "users update their own sessions"
  ON public.consultation_sessions
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());  

CREATE POLICY "users view their own sessions"
  ON public.consultation_sessions
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid()); 

CREATE POLICY "Users view their payments"
  ON public.payments
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid()); 

CREATE POLICY "Users update their payments"
  ON public.payments
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());  
