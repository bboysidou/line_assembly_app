-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id_order UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  id_client UUID REFERENCES clients(id_client) ON DELETE SET NULL,
  order_number VARCHAR(100) UNIQUE NOT NULL,
  product_name VARCHAR(255) NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  status VARCHAR(50) DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_orders_client ON orders(id_client);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_number ON orders(order_number);

-- Enum-like check for status
ALTER TABLE orders 
ADD CONSTRAINT chk_order_status 
CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled'));
