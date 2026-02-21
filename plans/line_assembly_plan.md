# Line Assembly App - Feature Plan

## Project Overview
Extend the Line Assembly App to include:
1. **Client Management** - Admins create/manage clients
2. **Order Tracking** - Track orders from clients through assembly line
3. **Assembly Line Tracking** - 6-step process with QR/barcode scanning
4. **Time Analytics** - Average time per step calculation

---

## 1. Database Schema Design

### Tables Required

```sql
-- Clients table
CREATE TABLE IF NOT EXISTS clients (
  id_client UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_name VARCHAR(255) NOT NULL,
  client_email VARCHAR(255) UNIQUE NOT NULL,
  client_phone VARCHAR(50),
  client_address TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id_order UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  id_client UUID REFERENCES clients(id_client),
  order_number VARCHAR(100) UNIQUE NOT NULL,
  product_name VARCHAR(255) NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  status VARCHAR(50) DEFAULT 'pending', -- pending, in_progress, completed, cancelled
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Assembly Line (the 6 steps configuration)
CREATE TABLE IF NOT EXISTS assembly_steps (
  id_step SERIAL PRIMARY KEY,
  step_name VARCHAR(100) NOT NULL,
  step_order INT NOT NULL UNIQUE, -- 1-6
  step_description TEXT,
  is_active BOOLEAN DEFAULT true
);

-- Order progress through assembly line
CREATE TABLE IF NOT EXISTS order_progress (
  id_progress UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  id_order UUID REFERENCES orders(id_order),
  id_step INT REFERENCES assembly_steps(id_step),
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  scanned_by VARCHAR(255), -- worker username from session
  barcode VARCHAR(100),
  notes TEXT
);

-- Time tracking analytics
CREATE TABLE IF NOT EXISTS step_time_logs (
  id_log UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  id_order UUID REFERENCES orders(id_order),
  id_step INT REFERENCES assembly_steps(id_step),
  duration_seconds INT, -- calculated duration
  completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 2. Backend Feature Structure

Following Clean Architecture (like existing auth feature):

```
backend/api/src/routes/
├── clients/                    # Client Management Feature
│   ├── data/
│   │   ├── datasources/remote/
│   │   │   ├── create_client.remote.datasource.ts
│   │   │   ├── get_all_clients.remote.datasource.ts
│   │   │   ├── get_client_by_id.remote.datasource.ts
│   │   │   ├── update_client.remote.datasource.ts
│   │   │   └── delete_client.remote.datasource.ts
│   │   └── repositories/
│   │       └── clients.data.repository.ts
│   ├── domain/
│   │   ├── entities/
│   │   │   └── client.entity.ts
│   │   ├── repositories/
│   │   │   └── clients.domain.repository.ts
│   │   └── usecases/
│   │       ├── create_client.usecase.ts
│   │       ├── get_all_clients.usecase.ts
│   │       ├── get_client_by_id.usecase.ts
│   │       ├── update_client.usecase.ts
│   │       └── delete_client.usecase.ts
│   └── presentation/
│       ├── clients.route.ts
│       ├── controllers/
│       │   └── clients.controller.ts
│       └── schemas/
│           └── client.schema.ts
│
├── orders/                    # Order Management Feature
│   ├── data/
│   ├── domain/
│   │   ├── entities/
│   │   │   └── order.entity.ts
│   │   ├── repositories/
│   │   │   └── orders.domain.repository.ts
│   │   └── usecases/
│   │       ├── create_order.usecase.ts
│   │       ├── get_all_orders.usecase.ts
│   │       ├── get_order_by_id.usecase.ts
│   │       ├── update_order_status.usecase.ts
│   │       └── delete_order.usecase.ts
│   └── presentation/
│       ├── orders.route.ts
│       ├── controllers/
│       │   └── orders.controller.ts
│       └── schemas/
│           └── order.schema.ts
│
└── assembly/                  # Assembly Line Feature
    ├── data/
    │   ├── datasources/remote/
    │   │   ├── scan_barcode.remote.datasource.ts    # QR/Barcode scan
    │   │   ├── start_step.remote.datasource.ts
    │   │   ├── complete_step.remote.datasource.ts
    │   │   ├── get_order_progress.remote.datasource.ts
    │   │   └── get_step_analytics.remote.datasource.ts
    │   └── repositories/
    │       └── assembly.data.repository.ts
    ├── domain/
    │   ├── entities/
    │   │   ├── assembly_step.entity.ts
    │   │   ├── order_progress.entity.ts
    │   │   └── step_time_log.entity.ts
    │   ├── repositories/
    │   │   └── assembly.domain.repository.ts
    │   └── usecases/
    │       ├── scan_barcode.usecase.ts              # Main entry point
    │       ├── start_step.usecase.ts
    │       ├── complete_step.usecase.ts
    │       ├── get_order_progress.usecase.ts
    │       └── get_step_analytics.usecase.ts        # Avg time calculation
    └── presentation/
        ├── assembly.route.ts
        ├── controllers/
        │   └── assembly.controller.ts
        └── schemas/
            └── assembly.schema.ts
```

---

## 3. API Endpoints

### Clients
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/clients` | List all clients |
| GET | `/api/clients/:id_client` | Get client by ID |
| POST | `/api/clients` | Create new client |
| PATCH | `/api/clients/:id_client` | Update client |
| DELETE | `/api/clients/:id_client` | Delete client |

### Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/orders` | List all orders |
| GET | `/api/orders/:id_order` | Get order by ID |
| POST | `/api/orders` | Create new order |
| PATCH | `/api/orders/:id_order` | Update order status |
| DELETE | `/api/orders/:id_order` | Delete order |

### Assembly Line (QR/Barcode Scanning)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/assembly/scan` | Scan barcode - auto route to correct step |
| POST | `/api/assembly/start/:id_order/:step` | Start specific step |
| POST | `/api/assembly/complete/:id_order/:step` | Complete step (records time) |
| GET | `/api/assembly/progress/:id_order` | Get order progress |
| GET | `/api/assembly/analytics` | Get avg time per step |

---

## 4. Frontend Feature Structure

```
frontend/src/features/
├── clients/                   # Client Management
│   ├── data/
│   ├── domain/
│   └── presentation/
│       ├── actions/
│       │   └── clients.action.ts
│       ├── components/
│       │   ├── ClientsTable.component.tsx
│       │   └── ClientForm.component.tsx
│       └── pages/
│           └── ClientsPage.page.tsx
│
├── orders/                    # Order Management
│   ├── data/
│   ├── domain/
│   └── presentation/
│       ├── actions/
│       │   └── orders.action.ts
│       ├── components/
│       │   ├── OrdersTable.component.tsx
│       │   ├── OrderForm.component.tsx
│       │   └── OrderDetail.component.tsx
│       └── pages/
│           ├── OrdersPage.page.tsx
│           └── OrderDetailPage.page.tsx
│
└── assembly/                  # Assembly Line Dashboard
    ├── data/
    ├── domain/
    └── presentation/
        ├── actions/
        │   └── assembly.action.ts
        ├── components/
        │   ├── BarcodeScanner.component.tsx    # QR/Barcode scanner
        │   ├── AssemblyLineVisual.component.tsx  # Visual step tracker
        │   ├── StepCard.component.tsx           # Current step display
        │   └── AnalyticsCharts.component.tsx     # Time analytics
        └── pages/
            └── AssemblyDashboard.page.tsx
```

---

## 5. Time Tracking Flow (QR/Barcode)

```
┌─────────────────────────────────────────────────────────────────┐
│                    Assembly Line Flow                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Order Created ─▶ Step 1 ─▶ Step 2 ─▶ Step 3 ─▶ ... ─▶ Done  │
│                      │        │        │                       │
│                      ▼        ▼        ▼                       │
│               [Scan QR]  [Scan QR]  [Scan QR]                  │
│                      │        │        │                       │
│                      ▼        ▼        ▼                       │
│            Start Timer  Start Timer  Start Timer               │
│                      │        │        │                       │
│                      ▼        ▼        ▼                       │
│            Complete    Complete    Complete                    │
│            (records    (records    (records                    │
│             time)       time)       time)                      │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Barcode Format
Each order generates a unique barcode: `ORDER-{uuid}-{step_number}`
Example: `ORDER-a1b2c3d4-e5f6-7890-abcd-ef1234567890-1`

### Time Calculation
```typescript
// On step completion:
duration_seconds = completed_at - started_at

// Store in step_time_logs
// Average calculation:
AVG(duration_seconds) GROUP BY id_step
```

---

## 6. Analytics Dashboard

### Metrics to Display
1. **Average Time per Step** - Bar chart showing avg duration for each of 6 steps
2. **Orders in Progress** - Count of active orders
3. **Completed Orders Today/Week** - Production metrics
4. **Step Bottlenecks** - Highlight steps taking longer than average

---

## 7. Implementation Priority

| Phase | Features | Description |
|-------|----------|-------------|
| 1 | Database + Clients | Setup tables + CRUD for clients |
| 2 | Orders | Full order management |
| 3 | Assembly Setup | Configure 6 steps in database |
| 4 | Assembly Tracking | Start/complete steps with QR |
| 5 | Analytics | Time tracking and reports |
| 6 | Dashboard | Visual assembly line view |

---

## 8. Next Steps

Once you confirm this plan, I'll start implementing:

1. Create database SQL files
2. Build Client feature (backend + frontend)
3. Build Order feature
4. Build Assembly Line feature
5. Add analytics

**Please provide the names of your 6 assembly steps so I can configure them properly.**
