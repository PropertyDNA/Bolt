/*
# Create PropertyDNA tables (single-tenant, no auth)

1. New Tables
- `properties` — stores each property scanned by the user
  - id (uuid, primary key)
  - name (text, not null) — user-given label for the property
  - address (text) — property street address
  - property_type (text) — single_family, multi_family, condo, townhouse, commercial
  - year_built (int) — year the property was constructed
  - square_footage (int) — living area in sq ft
  - overall_score (int) — 0-100 weighted score across all components
  - overall_grade (text) — letter grade A-F derived from score
  - estimated_total_repair_cost (numeric) — sum of all component repair estimates
  - risk_level (text) — low, moderate, high, critical
  - status (text) — draft, completed
  - created_at (timestamptz)
  - updated_at (timestamptz)
- `property_components` — individual building components scored during a scan
  - id (uuid, primary key)
  - property_id (uuid, foreign key to properties, cascade delete)
  - component_key (text) — roof, foundation, hvac, plumbing, electrical, siding, windows, insulation, water_heater, garage
  - component_name (text) — display name
  - category (text) — structural, mechanical, exterior, interior
  - condition_score (int) — 1-5 (1=critical, 5=excellent)
  - condition_label (text) — critical, poor, fair, good, excellent
  - estimated_repair_cost (numeric) — dollar estimate for repair/replacement
  - repair_urgency (text) — immediate, short_term, long_term, monitor
  - remaining_life_years (int) — estimated remaining useful life
  - notes (text) — user observations
  - created_at (timestamptz)
2. Security
- Enable RLS on both tables.
- Allow anon + authenticated CRUD because this is a single-tenant app with no sign-in.
3. Indexes
- property_components_property_id_idx for fast lookups by property
*/

CREATE TABLE IF NOT EXISTS properties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  address text,
  property_type text DEFAULT 'single_family',
  year_built int,
  square_footage int,
  overall_score int DEFAULT 0,
  overall_grade text DEFAULT 'N/A',
  estimated_total_repair_cost numeric DEFAULT 0,
  risk_level text DEFAULT 'low',
  status text DEFAULT 'draft',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS property_components (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  component_key text NOT NULL,
  component_name text NOT NULL,
  category text NOT NULL,
  condition_score int NOT NULL DEFAULT 3,
  condition_label text NOT NULL DEFAULT 'fair',
  estimated_repair_cost numeric NOT NULL DEFAULT 0,
  repair_urgency text NOT NULL DEFAULT 'monitor',
  remaining_life_years int NOT NULL DEFAULT 10,
  notes text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS property_components_property_id_idx ON property_components(property_id);

ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_components ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_properties" ON properties;
CREATE POLICY "anon_select_properties" ON properties FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_properties" ON properties;
CREATE POLICY "anon_insert_properties" ON properties FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_properties" ON properties;
CREATE POLICY "anon_update_properties" ON properties FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_properties" ON properties;
CREATE POLICY "anon_delete_properties" ON properties FOR DELETE
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_select_components" ON property_components;
CREATE POLICY "anon_select_components" ON property_components FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_components" ON property_components;
CREATE POLICY "anon_insert_components" ON property_components FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_components" ON property_components;
CREATE POLICY "anon_update_components" ON property_components FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_components" ON property_components;
CREATE POLICY "anon_delete_components" ON property_components FOR DELETE
  TO anon, authenticated USING (true);