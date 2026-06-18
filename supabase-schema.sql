-- ============================================
-- GenZ Era World - Complete Supabase Schema
-- ============================================
-- Run this entire file in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- CATEGORIES
-- ============================================
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- PRODUCTS
-- ============================================
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  price DECIMAL(10,2) NOT NULL,
  sale_price DECIMAL(10,2),
  stock_quantity INTEGER NOT NULL DEFAULT 0,
  sku TEXT UNIQUE NOT NULL,
  featured_image TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  is_trending BOOLEAN DEFAULT FALSE,
  is_new_arrival BOOLEAN DEFAULT FALSE,
  stock_status TEXT NOT NULL DEFAULT 'out_of_stock'
    CHECK (stock_status IN ('in_stock', 'low_stock', 'out_of_stock')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- PRODUCT IMAGES
-- ============================================
CREATE TABLE IF NOT EXISTS product_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  is_featured BOOLEAN DEFAULT FALSE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ORDERS
-- ============================================
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number TEXT UNIQUE NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  pincode TEXT NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  delivery_charge DECIMAL(10,2) NOT NULL DEFAULT 0,
  total DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending_verification'
    CHECK (status IN (
      'pending_verification','payment_verified','packed',
      'shipped','delivered','cancelled','refunded'
    )),
  payment_screenshot_url TEXT,
  transaction_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ORDER ITEMS
-- ============================================
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  product_price DECIMAL(10,2) NOT NULL,
  quantity INTEGER NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ADMIN USERS
-- ============================================
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin'
    CHECK (role IN ('admin', 'super_admin')),
  is_active BOOLEAN DEFAULT TRUE,
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ACTIVITY LOGS
-- ============================================
CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id UUID REFERENCES admin_users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT,
  entity_id TEXT,
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- SITE SETTINGS
-- ============================================
CREATE TABLE IF NOT EXISTS site_settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  low_stock_threshold INTEGER NOT NULL DEFAULT 5,
  upi_qr_image_url TEXT,
  upi_id TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT site_settings_single_row CHECK (id = 1)
);

INSERT INTO site_settings (id, low_stock_threshold) VALUES (1, 5)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER categories_updated_at BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Auto-update stock_status based on quantity
CREATE OR REPLACE FUNCTION update_stock_status()
RETURNS TRIGGER AS $$
DECLARE
  threshold INTEGER;
BEGIN
  SELECT low_stock_threshold INTO threshold FROM site_settings WHERE id = 1;
  IF threshold IS NULL THEN threshold := 5; END IF;

  IF NEW.stock_quantity = 0 THEN
    NEW.stock_status := 'out_of_stock';
  ELSIF NEW.stock_quantity <= threshold THEN
    NEW.stock_status := 'low_stock';
  ELSE
    NEW.stock_status := 'in_stock';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER products_stock_status BEFORE INSERT OR UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_stock_status();

-- Decrement stock on order
CREATE OR REPLACE FUNCTION decrement_stock(p_product_id UUID, p_quantity INTEGER)
RETURNS VOID AS $$
BEGIN
  UPDATE products
  SET stock_quantity = GREATEST(0, stock_quantity - p_quantity)
  WHERE id = p_product_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Public can read categories, products, images, settings
CREATE POLICY "Public read categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Public read products" ON products FOR SELECT USING (true);
CREATE POLICY "Public read product_images" ON product_images FOR SELECT USING (true);
CREATE POLICY "Public read site_settings" ON site_settings FOR SELECT USING (true);

-- Public can create orders and order items
CREATE POLICY "Public insert orders" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert order_items" ON order_items FOR INSERT WITH CHECK (true);
-- Public can read own order by order_number (via track-order)
CREATE POLICY "Public read orders" ON orders FOR SELECT USING (true);
CREATE POLICY "Public read order_items" ON order_items FOR SELECT USING (true);

-- Admin users can read their own profile
CREATE POLICY "Admin read own profile" ON admin_users FOR SELECT
  USING (auth.uid() = id);

-- Admin users policies (authenticated admins)
CREATE POLICY "Admin manage products" ON products
  USING (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid() AND is_active = true))
  WITH CHECK (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid() AND is_active = true));

CREATE POLICY "Admin manage categories" ON categories
  USING (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid() AND is_active = true))
  WITH CHECK (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid() AND is_active = true));

CREATE POLICY "Admin manage product_images" ON product_images
  USING (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid() AND is_active = true))
  WITH CHECK (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid() AND is_active = true));

CREATE POLICY "Admin manage orders" ON orders
  USING (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid() AND is_active = true));

CREATE POLICY "Admin update orders" ON orders FOR UPDATE
  USING (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid() AND is_active = true));

CREATE POLICY "Admin manage settings" ON site_settings
  USING (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid() AND is_active = true))
  WITH CHECK (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid() AND is_active = true));

CREATE POLICY "Admin read all admins" ON admin_users FOR SELECT
  USING (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid() AND role = 'super_admin' AND is_active = true));

CREATE POLICY "Super admin manage admins" ON admin_users FOR ALL
  USING (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid() AND role = 'super_admin' AND is_active = true));

CREATE POLICY "Admin read activity logs" ON activity_logs FOR SELECT
  USING (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid() AND is_active = true));

CREATE POLICY "Admin insert activity logs" ON activity_logs FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid() AND is_active = true));

-- ============================================
-- STORAGE BUCKETS
-- ============================================
-- Run these separately or via Supabase Dashboard

INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('payment-proofs', 'payment-proofs', false)
ON CONFLICT DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('site-assets', 'site-assets', true)
ON CONFLICT DO NOTHING;

-- Storage policies
CREATE POLICY "Public read product images" ON storage.objects
  FOR SELECT USING (bucket_id = 'product-images');

CREATE POLICY "Admin upload product images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'product-images' AND
    EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid() AND is_active = true)
  );

CREATE POLICY "Admin delete product images" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'product-images' AND
    EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid() AND is_active = true)
  );

CREATE POLICY "Public upload payment proofs" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'payment-proofs');

CREATE POLICY "Admin read payment proofs" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'payment-proofs' AND
    EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid() AND is_active = true)
  );

CREATE POLICY "Public read site assets" ON storage.objects
  FOR SELECT USING (bucket_id = 'site-assets');

CREATE POLICY "Admin manage site assets" ON storage.objects
  FOR ALL USING (
    bucket_id = 'site-assets' AND
    EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid() AND is_active = true)
  );
