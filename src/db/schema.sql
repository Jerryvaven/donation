-- Database Schema for Donation Leaderboard

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Donors table
CREATE TABLE IF NOT EXISTS donors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  city TEXT, -- City name (e.g., "Los Angeles", "San Francisco")
  county TEXT, -- California county name (e.g., "Los Angeles", "San Diego")
  latitude TEXT, -- Latitude coordinate
  longitude TEXT, -- Longitude coordinate
  total_donated DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Donations table
CREATE TABLE IF NOT EXISTS donations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  donor_id UUID REFERENCES donors(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  donation_date DATE NOT NULL,
  matched BOOLEAN DEFAULT FALSE,
  matched_amount DECIMAL(10,2),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Admins table (optional, for role-based access)
CREATE TABLE IF NOT EXISTS admins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_donors_total_donated ON donors(total_donated DESC);
CREATE INDEX IF NOT EXISTS idx_donations_donor_id ON donations(donor_id);
CREATE INDEX IF NOT EXISTS idx_donations_date ON donations(donation_date);

-- Row Level Security (RLS)
DO $$
BEGIN
    IF NOT (SELECT relrowsecurity FROM pg_class WHERE relname = 'donors' AND relnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')) THEN
        ALTER TABLE donors ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT (SELECT relrowsecurity FROM pg_class WHERE relname = 'donations' AND relnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')) THEN
        ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT (SELECT relrowsecurity FROM pg_class WHERE relname = 'admins' AND relnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')) THEN
        ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Allow insert/update to donors for admins" ON donors;
DROP POLICY IF EXISTS "Allow insert/update to donations for admins" ON donations;
DROP POLICY IF EXISTS "Allow read access to donors" ON donors;
DROP POLICY IF EXISTS "Allow read access to donations" ON donations;
DROP POLICY IF EXISTS "Allow read access to admins" ON admins;
DROP POLICY IF EXISTS "Allow insert/update to donors for authenticated users" ON donors;
DROP POLICY IF EXISTS "Allow insert/update to donations for authenticated users" ON donations;

-- Policies: Allow read for everyone, write only for authenticated users
CREATE POLICY "Allow read access to donors" ON donors FOR SELECT USING (true);
CREATE POLICY "Allow insert/update to donors for authenticated users" ON donors FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Allow read access to donations" ON donations FOR SELECT USING (true);
CREATE POLICY "Allow insert/update to donations for authenticated users" ON donations FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Allow read access to admins" ON admins FOR SELECT USING (auth.uid() = user_id);