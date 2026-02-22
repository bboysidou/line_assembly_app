-- Migration: Change order_progress to item_progress
-- This migration changes progress tracking from order level to order item level

-- Step 1: Create new item_progress table
CREATE TABLE IF NOT EXISTS item_progress (
    id_progress UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_order_item UUID NOT NULL REFERENCES order_items(id_order_item) ON DELETE CASCADE,
    id_step INTEGER NOT NULL REFERENCES assembly_steps(id_step),
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    scanned_by UUID,
    barcode VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(id_order_item, id_step)
);

-- Step 2: Migrate existing data from order_progress to item_progress
-- This assumes each order has at least one order_item
INSERT INTO item_progress (id_progress, id_order_item, id_step, started_at, completed_at, scanned_by, barcode, notes, created_at)
SELECT 
    op.id_progress,
    oi.id_order_item,
    op.id_step,
    op.started_at,
    op.completed_at,
    op.scanned_by,
    op.barcode,
    op.notes,
    op.created_at
FROM order_progress op
JOIN order_items oi ON op.id_order = oi.id_order
WHERE NOT EXISTS (
    SELECT 1 FROM item_progress ip WHERE ip.id_progress = op.id_progress
);

-- Step 3: Add id_order_item column to step_time_logs
ALTER TABLE step_time_logs 
ADD COLUMN IF NOT EXISTS id_order_item UUID REFERENCES order_items(id_order_item);

-- Step 4: Update step_time_logs with id_order_item
UPDATE step_time_logs stl
SET id_order_item = ip.id_order_item
FROM item_progress ip
WHERE stl.id_order = (
    SELECT oi.id_order FROM order_items oi WHERE oi.id_order_item = ip.id_order_item
) AND stl.id_step = ip.id_step;

-- Step 5: Drop old order_progress table (uncomment after verifying migration)
-- DROP TABLE IF EXISTS order_progress;

-- Step 6: Remove old id_order column from step_time_logs (uncomment after verifying migration)
-- ALTER TABLE step_time_logs DROP COLUMN IF EXISTS id_order;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_item_progress_order_item ON item_progress(id_order_item);
CREATE INDEX IF NOT EXISTS idx_item_progress_step ON item_progress(id_step);
CREATE INDEX IF NOT EXISTS idx_step_time_logs_order_item ON step_time_logs(id_order_item);
