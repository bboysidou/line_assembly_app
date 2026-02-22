-- Migration: Add unit_number to step_time_logs for quantity-level tracking
-- This allows tracking time logs for each unit of an order item separately

-- Add unit_number column to step_time_logs table
ALTER TABLE step_time_logs 
ADD COLUMN IF NOT EXISTS unit_number INTEGER NOT NULL DEFAULT 1;

-- Drop the old unique constraint if it exists
ALTER TABLE step_time_logs 
DROP CONSTRAINT IF EXISTS step_time_logs_id_order_item_id_step_key;

-- Add a unique constraint to ensure one time log per unit per step
ALTER TABLE step_time_logs 
ADD CONSTRAINT step_time_logs_unique_unit_step 
UNIQUE (id_order_item, id_step, unit_number);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_step_time_logs_unit_number 
ON step_time_logs(unit_number);

-- Create index for fetching all time logs of an order item's units
CREATE INDEX IF NOT EXISTS idx_step_time_logs_order_item_unit 
ON step_time_logs(id_order_item, unit_number);

COMMENT ON COLUMN step_time_logs.unit_number IS 'The unit number (1 to quantity) for tracking individual units within an order item';
