
-- Seed with defaults:
INSERT INTO site_settings (key, value, description) VALUES
  ('default_meeting_link', 'https://meet.google.com/xxx-yyyy-zzz', 'Default meeting URL included in all booking confirmations'),
  ('business_phone', '(713) 555-1234', 'Displayed in emails and on site'),
  ('business_email', 'alexander.dodson@zanderservices.org', 'Primary contact email');

INSERT INTO call_types (slug, name, description, duration_min, price_display) VALUES
  ('discovery-call', 'Discovery Call', 'Initial consultation to discuss your needs.', 30, 'Free');

-- Insert 7 days of 24/7 availability
INSERT INTO availability_rules (day_of_week, start_time, end_time) VALUES
  (0, '00:00:00', '23:59:00'),
  (1, '00:00:00', '23:59:00'),
  (2, '00:00:00', '23:59:00'),
  (3, '00:00:00', '23:59:00'),
  (4, '00:00:00', '23:59:00'),
  (5, '00:00:00', '23:59:00'),
  (6, '00:00:00', '23:59:00');

