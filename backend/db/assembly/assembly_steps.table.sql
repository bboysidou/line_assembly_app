-- Assembly Steps configuration table
CREATE TABLE IF NOT EXISTS assembly_steps (
  id_step SERIAL PRIMARY KEY,
  step_name VARCHAR(100) NOT NULL,
  step_order INT NOT NULL UNIQUE,
  step_description TEXT,
  is_active BOOLEAN DEFAULT true
);

-- Insert the 6 default steps
INSERT INTO assembly_steps (step_name, step_order, step_description, is_active) VALUES
('Cutting', 1, 'Initial cutting of materials', true),
('Welding', 2, 'Welding components together', true),
('Painting', 3, 'Painting and finishing', true),
('Assembly', 4, 'Final assembly of product', true),
('Testing', 5, 'Quality testing and inspection', true),
('Packaging', 6, 'Packaging for shipping', true)
ON CONFLICT (step_order) DO NOTHING;

-- Order progress through assembly line
CREATE TABLE IF NOT EXISTS order_progress (
  id_progress UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  id_order UUID REFERENCES orders(id_order) ON DELETE CASCADE,
  id_step INT REFERENCES assembly_steps(id_step) ON DELETE RESTRICT,
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  scanned_by VARCHAR(255),
  barcode VARCHAR(100),
  notes TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_order_progress_order ON order_progress(id_order);
CREATE INDEX IF NOT EXISTS idx_order_progress_step ON order_progress(id_step);
CREATE INDEX IF NOT EXISTS idx_order_progress_barcode ON order_progress(barcode);

-- Time tracking analytics
CREATE TABLE IF NOT EXISTS step_time_logs (
  id_log UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  id_order UUID REFERENCES orders(id_order) ON DELETE CASCADE,
  id_step INT REFERENCES assembly_steps(id_step) ON DELETE RESTRICT,
  duration_seconds INT,
  completed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Index for analytics queries
CREATE INDEX IF NOT EXISTS idx_step_time_logs_step ON step_time_logs(id_step);
CREATE INDEX IF NOT EXISTS idx_step_time_logs_completed ON step_time_logs(completed_at);
