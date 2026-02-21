-- Seed data for IZDIHAR Line Assembly App
-- Run this file after creating all tables
-- ============================================
-- USERS SEED DATA
-- ============================================
-- Note: For security reasons, we don't seed password hashes directly.
-- Instead, users should register through the app or you can manually insert hashes.
-- 
-- To create test users, run these commands with bcrypt hashes:
-- 
-- Admin user (password: admin123)
-- INSERT INTO users (id_user, id_user_role, username, password, created_at, updated_at) 
-- VALUES 
--   ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 1, 'admin', '$2a$10$...', NOW(), NOW());
--
-- Worker users (password: worker123)
-- INSERT INTO users (id_user, id_user_role, username, password, created_at, updated_at) 
-- VALUES 
--   ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 2, 'worker1', '$2a$10$...', NOW(), NOW()),
--   ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 2, 'worker2', '$2a$10$...', NOW(), NOW());
--
-- The easiest way: Register users through the app's registration page!
-- ============================================
-- CLIENTS SEED DATA
-- ============================================
INSERT INTO
  clients (
    client_name,
    client_email,
    client_phone,
    client_address,
    created_at,
    updated_at
  )
VALUES
  (
    'Acme Corporation',
    'contact@acme.com',
    '+1-555-0101',
    '123 Main St, New York, NY 10001',
    NOW (),
    NOW ()
  ),
  (
    'TechStart Inc',
    'info@techstart.io',
    '+1-555-0102',
    '456 Tech Blvd, San Francisco, CA 94105',
    NOW (),
    NOW ()
  ),
  (
    'Global Manufacturing',
    'sales@globalmfg.com',
    '+1-555-0103',
    '789 Industrial Ave, Detroit, MI 48201',
    NOW (),
    NOW ()
  ),
  (
    'Precision Parts Co',
    'orders@precisionparts.com',
    '+1-555-0104',
    '321 Factory Lane, Chicago, IL 60601',
    NOW (),
    NOW ()
  ),
  (
    'BuildRight Construction',
    'projects@buildright.com',
    '+1-555-0105',
    '654 Builder Way, Houston, TX 77001',
    NOW (),
    NOW ()
  ) ON CONFLICT (client_email) DO NOTHING;

-- ============================================
-- ORDERS SEED DATA
-- ============================================
INSERT INTO
  orders (
    id_client,
    order_number,
    product_name,
    quantity,
    status,
    notes,
    created_at,
    updated_at
  )
VALUES
  -- Completed orders
  (
    (
      SELECT
        id_client
      FROM
        clients
      WHERE
        client_name = 'Acme Corporation'
    ),
    'ORD-2024-001',
    'Steel Frame Assembly',
    50,
    'completed',
    'High priority order for Q1 delivery',
    NOW () - INTERVAL '30 days',
    NOW () - INTERVAL '20 days'
  ),
  (
    (
      SELECT
        id_client
      FROM
        clients
      WHERE
        client_name = 'TechStart Inc'
    ),
    'ORD-2024-002',
    'Electronic Housing Unit',
    100,
    'completed',
    'Custom colored units',
    NOW () - INTERVAL '25 days',
    NOW () - INTERVAL '15 days'
  ),
  (
    (
      SELECT
        id_client
      FROM
        clients
      WHERE
        client_name = 'Global Manufacturing'
    ),
    'ORD-2024-003',
    'Motor Mount Bracket',
    200,
    'completed',
    'Standard production run',
    NOW () - INTERVAL '20 days',
    NOW () - INTERVAL '10 days'
  ),
  -- In progress orders
  (
    (
      SELECT
        id_client
      FROM
        clients
      WHERE
        client_name = 'Precision Parts Co'
    ),
    'ORD-2024-004',
    'Control Panel Enclosure',
    75,
    'in_progress',
    'Currently at assembly stage',
    NOW () - INTERVAL '5 days',
    NOW () - INTERVAL '1 day'
  ),
  (
    (
      SELECT
        id_client
      FROM
        clients
      WHERE
        client_name = 'BuildRight Construction'
    ),
    'ORD-2024-005',
    'Structural Support Beam',
    30,
    'in_progress',
    'Large components, needs careful handling',
    NOW () - INTERVAL '3 days',
    NOW ()
  ),
  -- Pending orders
  (
    (
      SELECT
        id_client
      FROM
        clients
      WHERE
        client_name = 'Acme Corporation'
    ),
    'ORD-2024-006',
    'Pipe Fitting Set',
    500,
    'pending',
    'Bulk order for warehouse',
    NOW () - INTERVAL '2 days',
    NOW () - INTERVAL '2 days'
  ),
  (
    (
      SELECT
        id_client
      FROM
        clients
      WHERE
        client_name = 'TechStart Inc'
    ),
    'ORD-2024-007',
    'Sensor Module Case',
    150,
    'pending',
    'New product line',
    NOW () - INTERVAL '1 day',
    NOW () - INTERVAL '1 day'
  ),
  (
    (
      SELECT
        id_client
      FROM
        clients
      WHERE
        client_name = 'Global Manufacturing'
    ),
    'ORD-2024-008',
    'Gear Assembly Kit',
    80,
    'pending',
    NULL,
    NOW (),
    NOW ()
  ) ON CONFLICT (order_number) DO NOTHING;

-- ============================================
-- ORDER PROGRESS SEED DATA (Assembly Line Tracking)
-- ============================================
-- Order ORD-2024-004 - In Progress (at step 4 - Assembly)
INSERT INTO
  order_progress (
    id_progress,
    id_order,
    id_step,
    started_at,
    completed_at,
    scanned_by,
    barcode,
    notes,
    created_at
  )
VALUES
  (
    'p0eebc99-9c0b-4ef8-bb6d-6bb9bd380a01',
    'g0eebc99-9c0b-4ef8-bb6d-6bb9bd380a04',
    1,
    NOW () - INTERVAL '5 days',
    NOW () - INTERVAL '4 days',
    'worker1',
    'BR-001-001',
    'Cutting completed',
    NOW () - INTERVAL '5 days'
  ),
  (
    'p0eebc99-9c0b-4ef8-bb6d-6bb9bd380a02',
    'g0eebc99-9c0b-4ef8-bb6d-6bb9bd380a04',
    2,
    NOW () - INTERVAL '4 days',
    NOW () - INTERVAL '3 days',
    'worker1',
    'BR-001-002',
    'Welding completed',
    NOW () - INTERVAL '4 days'
  ),
  (
    'p0eebc99-9c0b-4ef8-bb6d-6bb9bd380a03',
    'g0eebc99-9c0b-4ef8-bb6d-6bb9bd380a04',
    3,
    NOW () - INTERVAL '3 days',
    NOW () - INTERVAL '2 days',
    'worker2',
    'BR-001-003',
    'Painted in blue',
    NOW () - INTERVAL '3 days'
  ),
  (
    'p0eebc99-9c0b-4ef8-bb6d-6bb9bd380a04',
    'g0eebc99-9c0b-4ef8-bb6d-6bb9bd380a04',
    4,
    NOW () - INTERVAL '2 days',
    NULL,
    'worker1',
    'BR-001-004',
    'Currently in assembly',
    NOW () - INTERVAL '2 days'
  ) ON CONFLICT DO NOTHING;

-- Order ORD-2024-005 - In Progress (at step 2 - Welding)
INSERT INTO
  order_progress (
    id_progress,
    id_order,
    id_step,
    started_at,
    completed_at,
    scanned_by,
    barcode,
    notes,
    created_at
  )
VALUES
  (
    'p0eebc99-9c0b-4ef8-bb6d-6bb9bd380a05',
    'h0eebc99-9c0b-4ef8-bb6d-6bb9bd380a05',
    1,
    NOW () - INTERVAL '3 days',
    NOW () - INTERVAL '2 days',
    'worker1',
    'BR-002-001',
    'Cutting completed',
    NOW () - INTERVAL '3 days'
  ),
  (
    'p0eebc99-9c0b-4ef8-bb6d-6bb9bd380a06',
    'h0eebc99-9c0b-4ef8-bb6d-6bb9bd380a05',
    2,
    NOW () - INTERVAL '2 days',
    NULL,
    'worker2',
    'BR-002-002',
    'In progress',
    NOW () - INTERVAL '2 days'
  ) ON CONFLICT DO NOTHING;

-- ============================================
-- STEP TIME LOGS SEED DATA (for Analytics)
-- ============================================
-- Completed orders time logs
INSERT INTO
  step_time_logs (id_order, id_step, duration_seconds, completed_at)
VALUES
  -- Order 1 - Steel Frame Assembly
  (
    'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a01',
    1,
    28800,
    NOW () - INTERVAL '30 days'
  ), -- 8 hours
  (
    'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a01',
    2,
    43200,
    NOW () - INTERVAL '29 days'
  ), -- 12 hours
  (
    'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a01',
    3,
    21600,
    NOW () - INTERVAL '28 days'
  ), -- 6 hours
  (
    'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a01',
    4,
    36000,
    NOW () - INTERVAL '27 days'
  ), -- 10 hours
  (
    'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a01',
    5,
    14400,
    NOW () - INTERVAL '26 days'
  ), -- 4 hours
  (
    'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a01',
    6,
    7200,
    NOW () - INTERVAL '25 days'
  ), -- 2 hours
  -- Order 2 - Electronic Housing Unit
  (
    'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a02',
    1,
    32400,
    NOW () - INTERVAL '25 days'
  ), -- 9 hours
  (
    'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a02',
    2,
    54000,
    NOW () - INTERVAL '24 days'
  ), -- 15 hours
  (
    'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a02',
    3,
    28800,
    NOW () - INTERVAL '23 days'
  ), -- 8 hours
  (
    'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a02',
    4,
    39600,
    NOW () - INTERVAL '22 days'
  ), -- 11 hours
  (
    'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a02',
    5,
    18000,
    NOW () - INTERVAL '21 days'
  ), -- 5 hours
  (
    'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a02',
    6,
    10800,
    NOW () - INTERVAL '20 days'
  ), -- 3 hours
  -- Order 3 - Motor Mount Bracket
  (
    'f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a03',
    1,
    25200,
    NOW () - INTERVAL '20 days'
  ), -- 7 hours
  (
    'f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a03',
    2,
    36000,
    NOW () - INTERVAL '19 days'
  ), -- 10 hours
  (
    'f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a03',
    3,
    18000,
    NOW () - INTERVAL '18 days'
  ), -- 5 hours
  (
    'f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a03',
    4,
    28800,
    NOW () - INTERVAL '17 days'
  ), -- 8 hours
  (
    'f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a03',
    5,
    10800,
    NOW () - INTERVAL '16 days'
  ), -- 3 hours
  (
    'f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a03',
    6,
    5400,
    NOW () - INTERVAL '15 days'
  ), -- 1.5 hours
  -- Order 4 - Control Panel Enclosure (in progress)
  (
    'g0eebc99-9c0b-4ef8-bb6d-6bb9bd380a04',
    1,
    36000,
    NOW () - INTERVAL '5 days'
  ), -- 10 hours
  (
    'g0eebc99-9c0b-4ef8-bb6d-6bb9bd380a04',
    2,
    43200,
    NOW () - INTERVAL '4 days'
  ), -- 12 hours
  (
    'g0eebc99-9c0b-4ef8-bb6d-6bb9bd380a04',
    3,
    28800,
    NOW () - INTERVAL '3 days'
  ), -- 8 hours
  -- Order 5 - Structural Support Beam (in progress)
  (
    'h0eebc99-9c0b-4ef8-bb6d-6bb9bd380a05',
    1,
    43200,
    NOW () - INTERVAL '3 days'
  ), -- 12 hours
  (
    'h0eebc99-9c0b-4ef8-bb6d-6bb9bd380a05',
    2,
    21600,
    NOW () - INTERVAL '2 days'
  ) -- 6 hours
  ON CONFLICT DO NOTHING;

-- ============================================
-- Verify Data
-- ============================================
SELECT
  'Clients inserted:' AS message,
  COUNT(*) AS count
FROM
  clients
UNION ALL
SELECT
  'Orders inserted:',
  COUNT(*)
FROM
  orders
UNION ALL
SELECT
  'Order Progress inserted:',
  COUNT(*)
FROM
  order_progress
UNION ALL
SELECT
  'Step Time Logs inserted:',
  COUNT(*)
FROM
  step_time_logs;

-- Note: User roles are already seeded in user_role.table.sql
-- Register users through the app to create login credentials
