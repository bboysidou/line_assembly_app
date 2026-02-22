-- Order Items table (for multiple items per order)
CREATE TABLE IF NOT EXISTS order_items (
  id_order_item UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  id_order UUID NOT NULL REFERENCES orders(id_order) ON DELETE CASCADE,
  product_name VARCHAR(255) NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  notes TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(id_order);
CREATE INDEX IF NOT EXISTS idx_order_items_product ON order_items(product_name);

-- Comment on table
COMMENT ON TABLE order_items IS 'Stores individual items within an order';
