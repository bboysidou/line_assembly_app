CREATE TABLE IF NOT EXISTS clients (
  id_client UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
  client_name VARCHAR(255) NOT NULL,
  client_email VARCHAR(255) UNIQUE NOT NULL,
  client_phone VARCHAR(50),
  client_address TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_clients_email ON clients (client_email);

CREATE INDEX IF NOT EXISTS idx_clients_name ON clients (client_name);
