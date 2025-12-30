-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS policies for user_roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
ON public.user_roles
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage roles"
ON public.user_roles
FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Create site_content table for CMS
CREATE TABLE public.site_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_key TEXT UNIQUE NOT NULL,
  content JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_by UUID REFERENCES auth.users(id)
);

ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

-- Public can read site content
CREATE POLICY "Anyone can view site content"
ON public.site_content
FOR SELECT
USING (true);

-- Only admins can update site content
CREATE POLICY "Admins can manage site content"
ON public.site_content
FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Create case_studies table
CREATE TABLE public.case_studies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  challenge TEXT NOT NULL,
  solution TEXT NOT NULL,
  outcome TEXT NOT NULL,
  industry TEXT,
  tags TEXT[],
  display_order INT DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.case_studies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published case studies"
ON public.case_studies
FOR SELECT
USING (is_published = true);

CREATE POLICY "Admins can manage case studies"
ON public.case_studies
FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Create testimonials table
CREATE TABLE public.testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote TEXT NOT NULL,
  author_role TEXT NOT NULL,
  display_order INT DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published testimonials"
ON public.testimonials
FOR SELECT
USING (is_published = true);

CREATE POLICY "Admins can manage testimonials"
ON public.testimonials
FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Create team_members table
CREATE TABLE public.team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  bio TEXT NOT NULL,
  image_url TEXT,
  display_order INT DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published team members"
ON public.team_members
FOR SELECT
USING (is_published = true);

CREATE POLICY "Admins can manage team members"
ON public.team_members
FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Create meeting_slots table
CREATE TABLE public.meeting_slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_booked BOOLEAN DEFAULT false,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.meeting_slots ENABLE ROW LEVEL SECURITY;

-- Anyone can view available future slots
CREATE POLICY "Anyone can view available slots"
ON public.meeting_slots
FOR SELECT
USING (date >= CURRENT_DATE AND is_booked = false);

CREATE POLICY "Admins can view all slots"
ON public.meeting_slots
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage slots"
ON public.meeting_slots
FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Create meeting_requests table
CREATE TABLE public.meeting_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  topic TEXT,
  slot_id UUID REFERENCES public.meeting_slots(id),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  meeting_link TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.meeting_requests ENABLE ROW LEVEL SECURITY;

-- Anyone can create a meeting request
CREATE POLICY "Anyone can create meeting requests"
ON public.meeting_requests
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Admins can manage meeting requests"
ON public.meeting_requests
FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Create contact_inquiries table
CREATE TABLE public.contact_inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  role_title TEXT,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.contact_inquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create contact inquiries"
ON public.contact_inquiries
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Admins can manage contact inquiries"
ON public.contact_inquiries
FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for timestamp updates
CREATE TRIGGER update_case_studies_updated_at
BEFORE UPDATE ON public.case_studies
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_testimonials_updated_at
BEFORE UPDATE ON public.testimonials
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_team_members_updated_at
BEFORE UPDATE ON public.team_members
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_site_content_updated_at
BEFORE UPDATE ON public.site_content
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert initial case studies
INSERT INTO public.case_studies (title, challenge, solution, outcome, industry, display_order) VALUES
('Transforming a Multi-Hospital System', 'Rising costs, declining margins, and operational bottlenecks.', 'Rebuilt operating model, redesigned patient pathways, and introduced analytics.', 'Eighteen percent cost reduction; improvement in throughput; reduction in length of stay.', 'Healthcare', 1),
('Scaling a Digital Health Startup', 'Strong product, limited commercialization.', 'Pricing redesign, customer segmentation, go-to-market strategy, and leadership coaching.', 'Revenue growth; successful funding; market expansion.', 'HealthTech', 2),
('Enterprise AI Readiness', 'Fragmented data and unclear use cases.', 'Built AI governance model, identified high-impact use cases, trained teams.', 'Projected multimillion-dollar value; deployed use cases; elevated data literacy.', 'Technology', 3);

-- Insert initial testimonials
INSERT INTO public.testimonials (quote, author_role, display_order) VALUES
('Canopi didn''t just advise us — they transformed how our leadership team makes decisions.', 'CEO, Regional Healthcare System', 1),
('They brought clarity to a complex problem and helped us accelerate our digital transformation in record time.', 'Chief Digital Officer, Global Services Firm', 2),
('The perfect balance of strategic depth and operational hands-on partnership.', 'Founder and CEO, HealthTech Startup', 3),
('Their ability to translate AI into real business impact is unmatched.', 'COO, B2B SaaS Company', 4);

-- Insert initial team member
INSERT INTO public.team_members (name, title, bio, display_order) VALUES
('Dr. Anupama', 'Partner, Healthcare Strategy', 'A physician-turned-consultant with experience in hospital operations and healthcare innovation. She has advised health systems, payers, and digital health companies on scaling care models that improve outcomes and reduce costs.', 1);

-- Function to book a meeting slot
CREATE OR REPLACE FUNCTION public.book_meeting_slot(
  p_slot_id UUID,
  p_name TEXT,
  p_email TEXT,
  p_company TEXT,
  p_topic TEXT
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_request_id UUID;
BEGIN
  -- Check if slot is available
  IF NOT EXISTS (
    SELECT 1 FROM public.meeting_slots 
    WHERE id = p_slot_id 
    AND is_booked = false 
    AND date >= CURRENT_DATE
  ) THEN
    RAISE EXCEPTION 'Slot is not available';
  END IF;
  
  -- Mark slot as booked
  UPDATE public.meeting_slots 
  SET is_booked = true 
  WHERE id = p_slot_id;
  
  -- Create meeting request
  INSERT INTO public.meeting_requests (slot_id, name, email, company, topic)
  VALUES (p_slot_id, p_name, p_email, p_company, p_topic)
  RETURNING id INTO v_request_id;
  
  RETURN v_request_id;
END;
$$;