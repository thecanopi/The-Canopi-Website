-- Fix RLS policies to be PERMISSIVE (default) instead of RESTRICTIVE

-- Drop and recreate case_studies policies
DROP POLICY IF EXISTS "Anyone can view published case studies" ON public.case_studies;
DROP POLICY IF EXISTS "Admins can manage case studies" ON public.case_studies;

CREATE POLICY "Anyone can view published case studies" 
ON public.case_studies 
FOR SELECT 
USING (is_published = true);

CREATE POLICY "Admins can manage case studies" 
ON public.case_studies 
FOR ALL 
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Drop and recreate testimonials policies
DROP POLICY IF EXISTS "Anyone can view published testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Admins can manage testimonials" ON public.testimonials;

CREATE POLICY "Anyone can view published testimonials" 
ON public.testimonials 
FOR SELECT 
USING (is_published = true);

CREATE POLICY "Admins can manage testimonials" 
ON public.testimonials 
FOR ALL 
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Drop and recreate team_members policies
DROP POLICY IF EXISTS "Anyone can view published team members" ON public.team_members;
DROP POLICY IF EXISTS "Admins can manage team members" ON public.team_members;

CREATE POLICY "Anyone can view published team members" 
ON public.team_members 
FOR SELECT 
USING (is_published = true);

CREATE POLICY "Admins can manage team members" 
ON public.team_members 
FOR ALL 
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Drop and recreate contact_inquiries policies  
DROP POLICY IF EXISTS "Anyone can create contact inquiries" ON public.contact_inquiries;
DROP POLICY IF EXISTS "Admins can manage contact inquiries" ON public.contact_inquiries;

CREATE POLICY "Anyone can create contact inquiries" 
ON public.contact_inquiries 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Admins can manage contact inquiries" 
ON public.contact_inquiries 
FOR ALL 
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Drop and recreate meeting_slots policies
DROP POLICY IF EXISTS "Anyone can view available slots" ON public.meeting_slots;
DROP POLICY IF EXISTS "Admins can view all slots" ON public.meeting_slots;
DROP POLICY IF EXISTS "Admins can manage slots" ON public.meeting_slots;

CREATE POLICY "Anyone can view available slots" 
ON public.meeting_slots 
FOR SELECT 
USING (date >= CURRENT_DATE AND is_booked = false);

CREATE POLICY "Admins can view all slots" 
ON public.meeting_slots 
FOR SELECT 
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage slots" 
ON public.meeting_slots 
FOR ALL 
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Drop and recreate meeting_requests policies
DROP POLICY IF EXISTS "Anyone can create meeting requests" ON public.meeting_requests;
DROP POLICY IF EXISTS "Admins can manage meeting requests" ON public.meeting_requests;

CREATE POLICY "Anyone can create meeting requests" 
ON public.meeting_requests 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Admins can manage meeting requests" 
ON public.meeting_requests 
FOR ALL 
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Drop and recreate site_content policies
DROP POLICY IF EXISTS "Anyone can view site content" ON public.site_content;
DROP POLICY IF EXISTS "Admins can manage site content" ON public.site_content;

CREATE POLICY "Anyone can view site content" 
ON public.site_content 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage site content" 
ON public.site_content 
FOR ALL 
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));