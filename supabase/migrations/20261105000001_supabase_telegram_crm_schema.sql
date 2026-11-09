-- =============================================================================
-- NGUYÊN AGENCY – SUPABASE POSTGRESQL MIGRATION (CRM + TELEGRAM BOT + WEBSITE)
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Helper trigger for automatic updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- -----------------------------------------------------------------------------
-- 1. CUSTOMERS
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE,
  full_name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  telegram_user_id TEXT UNIQUE,
  telegram_username TEXT,
  company_name TEXT,
  address TEXT,
  notes TEXT,
  source TEXT NOT NULL DEFAULT 'WEBSITE' CHECK (source IN ('WEBSITE', 'TELEGRAM', 'ADMIN', 'OTHER')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_customers_phone ON public.customers(phone) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_customers_email ON public.customers(email) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_customers_telegram_user_id ON public.customers(telegram_user_id);
CREATE INDEX IF NOT EXISTS idx_customers_source ON public.customers(source);

DROP TRIGGER IF EXISTS trg_customers_updated_at ON public.customers;
CREATE TRIGGER trg_customers_updated_at
BEFORE UPDATE ON public.customers
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- -----------------------------------------------------------------------------
-- 2. SERVICES (Unified with Website CMS)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL DEFAULT 'TECH', -- MEDIA | TECH | LAB
  short_description TEXT NOT NULL,
  description TEXT,
  thumbnail TEXT,
  price_type TEXT NOT NULL DEFAULT 'CUSTOM' CHECK (price_type IN ('FIXED', 'STARTING_FROM', 'CUSTOM')),
  base_price NUMERIC(15, 2),
  price_label TEXT DEFAULT 'Liên hệ báo giá',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_services_category_active ON public.services(category, is_active);
CREATE INDEX IF NOT EXISTS idx_services_slug ON public.services(slug);

DROP TRIGGER IF EXISTS trg_services_updated_at ON public.services;
CREATE TRIGGER trg_services_updated_at
BEFORE UPDATE ON public.services
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- -----------------------------------------------------------------------------
-- 3. SERVICE BOOKINGS
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.service_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_code TEXT NOT NULL UNIQUE,
  customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE RESTRICT,
  service_id UUID REFERENCES public.services(id) ON DELETE SET NULL,
  service_name TEXT,
  source TEXT NOT NULL DEFAULT 'WEBSITE' CHECK (source IN ('WEBSITE', 'TELEGRAM', 'ADMIN', 'OTHER')),
  project_title TEXT NOT NULL,
  project_description TEXT NOT NULL,
  budget_range TEXT,
  budget_min NUMERIC(15, 2),
  budget_max NUMERIC(15, 2),
  preferred_start_date TEXT,
  preferred_contact_time TEXT,
  customer_notes TEXT,
  page_source TEXT,
  status TEXT NOT NULL DEFAULT 'NEW' CHECK (
    status IN ('NEW', 'CONFIRMED', 'CONSULTING', 'QUOTATION_SENT', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED')
  ),
  assigned_to TEXT,
  confirmed_by TEXT,
  confirmed_at TIMESTAMPTZ,
  telegram_chat_id TEXT,
  telegram_message_id BIGINT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_service_bookings_customer_id ON public.service_bookings(customer_id);
CREATE INDEX IF NOT EXISTS idx_service_bookings_service_id ON public.service_bookings(service_id);
CREATE INDEX IF NOT EXISTS idx_service_bookings_status ON public.service_bookings(status);
CREATE INDEX IF NOT EXISTS idx_service_bookings_source ON public.service_bookings(source);

DROP TRIGGER IF EXISTS trg_service_bookings_updated_at ON public.service_bookings;
CREATE TRIGGER trg_service_bookings_updated_at
BEFORE UPDATE ON public.service_bookings
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- -----------------------------------------------------------------------------
-- 4. LEADS
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES public.service_bookings(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  source TEXT NOT NULL DEFAULT 'WEBSITE' CHECK (source IN ('WEBSITE', 'TELEGRAM', 'ADMIN', 'OTHER')),
  status TEXT NOT NULL DEFAULT 'NEW' CHECK (
    status IN ('NEW', 'CONTACTED', 'QUALIFIED', 'PROPOSAL', 'NEGOTIATION', 'WON', 'LOST')
  ),
  assigned_to TEXT,
  confirmed_by TEXT,
  confirmed_at TIMESTAMPTZ,
  telegram_chat_id TEXT,
  telegram_message_id BIGINT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_leads_customer_id ON public.leads(customer_id);
CREATE INDEX IF NOT EXISTS idx_leads_booking_id ON public.leads(booking_id);
CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads(status);

DROP TRIGGER IF EXISTS trg_leads_updated_at ON public.leads;
CREATE TRIGGER trg_leads_updated_at
BEFORE UPDATE ON public.leads
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- -----------------------------------------------------------------------------
-- 5. QUOTATIONS & QUOTATION ITEMS
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.quotations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quotation_code TEXT NOT NULL UNIQUE,
  customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE RESTRICT,
  booking_id UUID REFERENCES public.service_bookings(id) ON DELETE SET NULL,
  subtotal NUMERIC(15, 2) NOT NULL DEFAULT 0,
  discount NUMERIC(15, 2) NOT NULL DEFAULT 0,
  total NUMERIC(15, 2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'NEW' CHECK (
    status IN ('NEW', 'REVIEWING', 'QUOTED', 'NEGOTIATING', 'APPROVED', 'REJECTED', 'COMPLETED', 'REVISION')
  ),
  valid_until TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_quotations_customer_id ON public.quotations(customer_id);
CREATE INDEX IF NOT EXISTS idx_quotations_booking_id ON public.quotations(booking_id);
CREATE INDEX IF NOT EXISTS idx_quotations_status ON public.quotations(status);

DROP TRIGGER IF EXISTS trg_quotations_updated_at ON public.quotations;
CREATE TRIGGER trg_quotations_updated_at
BEFORE UPDATE ON public.quotations
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE IF NOT EXISTS public.quotation_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quotation_id UUID NOT NULL REFERENCES public.quotations(id) ON DELETE CASCADE,
  service_id UUID REFERENCES public.services(id) ON DELETE SET NULL,
  item_name TEXT NOT NULL,
  description TEXT,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price NUMERIC(15, 2) NOT NULL DEFAULT 0,
  total_price NUMERIC(15, 2) NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_quotation_items_quotation_id ON public.quotation_items(quotation_id);

-- -----------------------------------------------------------------------------
-- 6. TELEGRAM ADMINS, CONVERSATIONS & IDEMPOTENCY LOG
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.telegram_admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  telegram_user_id TEXT NOT NULL UNIQUE,
  telegram_username TEXT,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'ADMIN' CHECK (role IN ('SUPER_ADMIN', 'ADMIN', 'STAFF')),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  permissions JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_telegram_admins_user_id ON public.telegram_admins(telegram_user_id);

DROP TRIGGER IF EXISTS trg_telegram_admins_updated_at ON public.telegram_admins;
CREATE TRIGGER trg_telegram_admins_updated_at
BEFORE UPDATE ON public.telegram_admins
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE IF NOT EXISTS public.telegram_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  telegram_user_id TEXT NOT NULL UNIQUE,
  chat_id TEXT NOT NULL,
  current_step TEXT NOT NULL DEFAULT 'IDLE',
  conversation_state TEXT NOT NULL DEFAULT 'IDLE',
  temporary_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_telegram_conversations_user_id ON public.telegram_conversations(telegram_user_id);

DROP TRIGGER IF EXISTS trg_telegram_conversations_updated_at ON public.telegram_conversations;
CREATE TRIGGER trg_telegram_conversations_updated_at
BEFORE UPDATE ON public.telegram_conversations
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE IF NOT EXISTS public.telegram_processed_updates (
  update_id BIGINT PRIMARY KEY,
  chat_id TEXT,
  processed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 7. NOTIFICATIONS
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'INFO',
  channel TEXT NOT NULL DEFAULT 'INTERNAL' CHECK (channel IN ('INTERNAL', 'TELEGRAM', 'BOTH')),
  customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
  booking_id UUID REFERENCES public.service_bookings(id) ON DELETE SET NULL,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  delivery_status TEXT NOT NULL DEFAULT 'SENT',
  error_log TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON public.notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON public.notifications(is_read);

-- -----------------------------------------------------------------------------
-- 8. ACTIVITY LOGS
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_type TEXT NOT NULL DEFAULT 'ADMIN',
  actor_id TEXT,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  before_data JSONB,
  after_data JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON public.activity_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_logs_entity ON public.activity_logs(entity_type, entity_id);

-- =============================================================================
-- 9. ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================================================
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotation_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.telegram_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.telegram_processed_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- Public can ONLY read active public services
DROP POLICY IF EXISTS "public_read_active_services" ON public.services;
CREATE POLICY "public_read_active_services"
  ON public.services
  FOR SELECT
  TO anon, authenticated
  USING (is_active = TRUE);

-- Authenticated Customers can read only their own customer record, bookings & quotations
DROP POLICY IF EXISTS "customer_read_own_profile" ON public.customers;
CREATE POLICY "customer_read_own_profile"
  ON public.customers
  FOR SELECT
  TO authenticated
  USING (auth.jwt() ->> 'email' = email);

DROP POLICY IF EXISTS "customer_read_own_bookings" ON public.service_bookings;
CREATE POLICY "customer_read_own_bookings"
  ON public.service_bookings
  FOR SELECT
  TO authenticated
  USING (
    customer_id IN (
      SELECT id FROM public.customers WHERE email = (auth.jwt() ->> 'email')
    )
  );

DROP POLICY IF EXISTS "customer_read_own_quotations" ON public.quotations;
CREATE POLICY "customer_read_own_quotations"
  ON public.quotations
  FOR SELECT
  TO authenticated
  USING (
    customer_id IN (
      SELECT id FROM public.customers WHERE email = (auth.jwt() ->> 'email')
    )
  );

-- Admin / Staff (via app_metadata.role in ('SUPER_ADMIN', 'ADMIN', 'STAFF')) have full access
-- Note: service_role automatically bypasses RLS on server-side API & Telegram Webhook.

-- =============================================================================
-- 10. SUPABASE STORAGE BUCKETS & ACCESS POLICIES
-- =============================================================================
INSERT INTO storage.buckets (id, name, public)
VALUES
  ('agency-assets', 'agency-assets', true),
  ('customer-uploads', 'customer-uploads', false),
  ('project-files', 'project-files', false),
  ('quotation-files', 'quotation-files', false)
ON CONFLICT (id) DO NOTHING;

-- Public read access ONLY for agency-assets bucket
DROP POLICY IF EXISTS "Public read agency-assets" ON storage.objects;
CREATE POLICY "Public read agency-assets"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'agency-assets');

