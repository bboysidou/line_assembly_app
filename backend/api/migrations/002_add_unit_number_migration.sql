-- Migration: Add unit_number to item_progress for quantity-level tracking
-- This allows tracking each unit of an order item separately through assembly steps

-- Add unit_number column to item_progress table
ALTER TABLE item_progress 
ADD COLUMN IF NOT EXISTS unit_number INTEGER NOT NULL DEFAULT 1;

-- Add a unique constraint to ensure one progress record per unit per step
ALTER TABLE item_progress 
DROP CONSTRAINT IF EXISTS item_progress_id_order_item_id_step_key;

ALTER TABLE item_progress 
ADD CONSTRAINT item_progress_unique_unit_step 
UNIQUE (id_order_item, id_step, unit_number);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_item_progress_unit_number 
ON item_progress(unit_number);

-- Create index for fetching all units of an order item
CREATE INDEX IF NOT EXISTS idx_item_progress_order_item_unit 
ON item_progress(id_order_item, unit_number);

COMMENT ON COLUMN item_progress.unit_number IS 'The unit number (1 to quantity) for tracking individual units within an order item';
