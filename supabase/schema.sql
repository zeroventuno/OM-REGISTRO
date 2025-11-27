-- Create customers table
CREATE TABLE customers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  country TEXT NOT NULL,
  address TEXT,
  city TEXT,
  zip_code TEXT,
  UNIQUE(email)
);

-- Create products table
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE NOT NULL,
  model TEXT NOT NULL,
  serial_number TEXT NOT NULL,
  wheel_type TEXT,
  purchase_date DATE,
  notes TEXT
);

-- Enable Row Level Security
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Create policies for anonymous insert (public registration)
CREATE POLICY "Allow public insert for customers" ON customers
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public insert for products" ON products
  FOR INSERT WITH CHECK (true);

-- Restrict read access (only admins or owners should see data, but we have no auth yet)
-- For now, disable read for anon to prevent data scraping
CREATE POLICY "Allow read for authenticated users only" ON customers
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow read for authenticated users only" ON products
  FOR SELECT USING (auth.role() = 'authenticated');
