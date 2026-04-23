-- Enums
CREATE TYPE lead_source AS ENUM ('contact-form', 'booking', 'referral', 'other');
CREATE TYPE lead_status AS ENUM ('new', 'contacted', 'qualified', 'proposal', 'won', 'lost');
CREATE TYPE booking_status AS ENUM ('scheduled', 'confirmed', 'completed', 'cancelled', 'no_show', 'rescheduled');
CREATE TYPE comm_type AS ENUM ('email', 'call', 'note');
CREATE TYPE comm_direction AS ENUM ('inbound', 'outbound');
CREATE TYPE exception_type AS ENUM ('block', 'open');
CREATE TYPE content_status AS ENUM ('draft', 'published', 'archived');
CREATE TYPE audit_action AS ENUM ('INSERT', 'UPDATE', 'DELETE');

-- CMS Tables
CREATE TABLE services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  subtitle text,
  description text NOT NULL,
  icon_name text,
  features jsonb DEFAULT '[]',
  display_order int DEFAULT 0,
  status content_status DEFAULT 'draft',
  og_image_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE case_studies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  client_name text,
  industry text,
  challenge text NOT NULL,
  solution text NOT NULL,
  results text NOT NULL,
  metrics jsonb DEFAULT '{}',
  cover_image_url text,
  gallery_urls jsonb DEFAULT '[]',
  testimonial_quote text,
  testimonial_author text,
  service_id uuid REFERENCES services(id),
  status content_status DEFAULT 'draft',
  published_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  excerpt text,
  body text NOT NULL,
  cover_image_url text,
  author_name text DEFAULT 'Zander Services',
  tags text[] DEFAULT '{}',
  reading_time_min int,
  status content_status DEFAULT 'draft',
  published_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE call_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  description text,
  duration_min int NOT NULL DEFAULT 30,
  buffer_before_min int DEFAULT 5,
  buffer_after_min int DEFAULT 10,
  price_display text,
  location text DEFAULT 'Remote - Zoom/Meet',
  active boolean DEFAULT true,
  display_order int DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Scheduling Tables
CREATE TABLE availability_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  day_of_week int NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  start_time time NOT NULL,
  end_time time NOT NULL,
  timezone text NOT NULL DEFAULT 'America/Chicago',
  active_from date,
  active_to date,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE availability_exceptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date_start date NOT NULL,
  date_end date NOT NULL,
  type exception_type NOT NULL,
  reason text,
  start_time time,
  end_time time,
  created_at timestamptz DEFAULT now()
);

-- Lead & Booking Tables
CREATE TABLE leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  company text,
  source lead_source DEFAULT 'other',
  status lead_status DEFAULT 'new',
  notes text,
  tags text[] DEFAULT '{}',
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_term text,
  utm_content text,
  first_contact_at timestamptz DEFAULT now(),
  last_contact_at timestamptz DEFAULT now(),
  converted_to_client_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
CREATE INDEX idx_leads_email ON leads(email);
CREATE INDEX idx_leads_status ON leads(status);

CREATE TABLE call_bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid NOT NULL REFERENCES leads(id),
  call_type_id uuid NOT NULL REFERENCES call_types(id),
  slot_start timestamptz NOT NULL,
  slot_end timestamptz NOT NULL,
  timezone text NOT NULL,
  status booking_status DEFAULT 'scheduled',
  cancel_reason text,
  cancel_datetime timestamptz,
  meeting_link text,
  prep_notes text,
  outcome_notes text,
  confirmation_token text UNIQUE NOT NULL,
  reschedule_token text UNIQUE NOT NULL,
  cancel_token text UNIQUE NOT NULL,
  tokens_expired boolean DEFAULT false,
  original_booking_id uuid REFERENCES call_bookings(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT no_double_book UNIQUE (call_type_id, slot_start)
);
CREATE INDEX idx_bookings_slot ON call_bookings(slot_start);
CREATE INDEX idx_bookings_status ON call_bookings(status);
CREATE INDEX idx_bookings_confirm_token ON call_bookings(confirmation_token);
CREATE INDEX idx_bookings_reschedule_token ON call_bookings(reschedule_token);
CREATE INDEX idx_bookings_cancel_token ON call_bookings(cancel_token);

CREATE TABLE contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  company text,
  message text NOT NULL,
  promoted_to_lead_id uuid REFERENCES leads(id),
  ip_address inet,
  created_at timestamptz DEFAULT now()
);

-- Communication, Audit, & Config Tables
CREATE TABLE communication_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid NOT NULL REFERENCES leads(id),
  type comm_type NOT NULL,
  direction comm_direction NOT NULL,
  subject text,
  body text,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);
CREATE INDEX idx_comm_lead ON communication_log(lead_id);

CREATE TABLE audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor text NOT NULL DEFAULT 'system',
  entity text NOT NULL,
  entity_id uuid NOT NULL,
  action audit_action NOT NULL,
  before_data jsonb,
  after_data jsonb,
  created_at timestamptz DEFAULT now()
);
CREATE INDEX idx_audit_entity ON audit_log(entity, entity_id);

CREATE TABLE rate_limits (
  ip_address inet NOT NULL,
  endpoint text NOT NULL,
  request_count int DEFAULT 1,
  window_start timestamptz DEFAULT now(),
  PRIMARY KEY (ip_address, endpoint)
);

CREATE TABLE site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value text NOT NULL,
  description text,
  updated_at timestamptz DEFAULT now()
);
COMMENT ON TABLE site_settings IS 'Key-value config table. Editable in Studio. Used by Edge Functions for default meeting link, business contact info, etc.';

-- Triggers
CREATE OR REPLACE FUNCTION fn_audit_trigger() RETURNS trigger AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO audit_log (actor, entity, entity_id, action, after_data)
    VALUES ('admin_studio', TG_TABLE_NAME, NEW.id, 'INSERT', to_jsonb(NEW));
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO audit_log (actor, entity, entity_id, action, before_data, after_data)
    VALUES ('admin_studio', TG_TABLE_NAME, NEW.id, 'UPDATE', to_jsonb(OLD), to_jsonb(NEW));
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO audit_log (actor, entity, entity_id, action, before_data)
    VALUES ('admin_studio', TG_TABLE_NAME, OLD.id, 'DELETE', to_jsonb(OLD));
    RETURN OLD;
  END IF;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_leads_audit AFTER INSERT OR UPDATE OR DELETE ON leads
  FOR EACH ROW EXECUTE FUNCTION fn_audit_trigger();
CREATE TRIGGER trg_bookings_audit AFTER INSERT OR UPDATE OR DELETE ON call_bookings
  FOR EACH ROW EXECUTE FUNCTION fn_audit_trigger();

CREATE OR REPLACE FUNCTION fn_updated_at() RETURNS trigger AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_services_updated BEFORE UPDATE ON services FOR EACH ROW EXECUTE FUNCTION fn_updated_at();
CREATE TRIGGER trg_case_studies_updated BEFORE UPDATE ON case_studies FOR EACH ROW EXECUTE FUNCTION fn_updated_at();
CREATE TRIGGER trg_blog_posts_updated BEFORE UPDATE ON blog_posts FOR EACH ROW EXECUTE FUNCTION fn_updated_at();
CREATE TRIGGER trg_call_types_updated BEFORE UPDATE ON call_types FOR EACH ROW EXECUTE FUNCTION fn_updated_at();
CREATE TRIGGER trg_leads_updated BEFORE UPDATE ON leads FOR EACH ROW EXECUTE FUNCTION fn_updated_at();
CREATE TRIGGER trg_bookings_updated BEFORE UPDATE ON call_bookings FOR EACH ROW EXECUTE FUNCTION fn_updated_at();
CREATE TRIGGER trg_site_settings_updated BEFORE UPDATE ON site_settings FOR EACH ROW EXECUTE FUNCTION fn_updated_at();

-- RLS Policies
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE case_studies ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE call_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE availability_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE availability_exceptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE call_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE communication_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE rate_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anon_read_published_services" ON services FOR SELECT USING (status = 'published');
CREATE POLICY "anon_read_published_case_studies" ON case_studies FOR SELECT USING (status = 'published');
CREATE POLICY "anon_read_published_blog_posts" ON blog_posts FOR SELECT USING (status = 'published');
CREATE POLICY "anon_read_active_call_types" ON call_types FOR SELECT USING (active = true);
