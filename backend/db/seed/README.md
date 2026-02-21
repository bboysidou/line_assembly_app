# Database Seed Data

This file contains seed data for testing the IZDIHAR Line Assembly App.

## Seed Data Overview

### Clients (5 sample clients)
- Acme Corporation
- TechStart Inc
- Global Manufacturing
- Precision Parts Co
- BuildRight Construction

### Orders (8 sample orders)
- 3 completed orders
- 2 in-progress orders
- 3 pending orders

### Assembly Progress
- Order ORD-2024-004: At step 4 (Assembly)
- Order ORD-2024-005: At step 2 (Welding)

### Analytics Data
- Time logs for all completed orders across all 6 assembly steps

## How to Run

### Option 1: Using Docker
```bash
# Start PostgreSQL container
cd backend
docker-compose up -d db

# Wait for PostgreSQL to be ready, then run:
docker exec -i db_line_assembly psql -U postgres -d izdihar_app < db/seed/seed_data.sql
```

### Option 2: Direct PostgreSQL Connection
```bash
# Connect to PostgreSQL
psql -U postgres -d izdihar_app -f db/seed/seed_data.sql
```

### Option 3: Using pgAdmin or DBeaver
1. Open your PostgreSQL GUI tool
2. Connect to the izdihar_app database
3. Open and execute the seed_data.sql file

## Verify Data

After running the seed, you can verify with:
```sql
-- Check all tables have data
SELECT 'Clients:' AS table_name, COUNT(*) AS row_count FROM clients
UNION ALL
SELECT 'Orders:', COUNT(*) FROM orders
UNION ALL
SELECT 'Order Progress:', COUNT(*) FROM order_progress
UNION ALL
SELECT 'Step Time Logs:', COUNT(*) FROM step_time_logs;
```

## Creating Users

**Important**: For security reasons, passwords are not seeded directly. Instead:

1. **Register through the app**:
   - Start the backend and frontend
   - Navigate to the registration page
   - Create users with role "admin" (role_id = 1) or "worker" (role_id = 2)

2. **Or insert directly**:
   - Register a user through the app first to get a valid bcrypt hash
   - Then insert more users using that hash format

### Test Credentials (after registration)
Create users with these credentials:
- **Admin**: role_id = 1 (admin)
- **Worker**: role_id = 2 (worker)

Example SQL after you have a valid password hash:
```sql
INSERT INTO users (id_user, id_user_role, username, password, created_at, updated_at) 
VALUES 
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 1, 'admin', '$2a$10$YOUR_HASH_HERE', NOW(), NOW());
```

## Assembly Steps (already seeded)

The assembly_steps table is already populated with:
1. Cutting
2. Welding
3. Painting
4. Assembly
5. Testing
6. Packaging
