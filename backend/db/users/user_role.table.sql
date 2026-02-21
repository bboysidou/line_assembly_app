CREATE TABLE IF NOT EXISTS user_role (
  id_user_role SERIAL PRIMARY KEY,
  role VARCHAR(255) NOT NULL UNIQUE
);

INSERT INTO
  user_role (id_user_role, role)
VALUES
  (1, 'admin');

INSERT INTO
  user_role (id_user_role, role)
VALUES
  (2, 'worker');
