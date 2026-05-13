CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS classes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  grade TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS students (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  class_id UUID REFERENCES classes(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS notices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO classes (name, grade) VALUES
  ('Math 101', 'Freshman'),
  ('Science 201', 'Sophomore')
ON CONFLICT DO NOTHING;

INSERT INTO students (name, email, class_id)
VALUES
  ('Sofia Hamilton', 'sofia.hamilton@example.com', (SELECT id FROM classes WHERE name='Math 101' LIMIT 1)),
  ('Marcus Lee', 'marcus.lee@example.com', (SELECT id FROM classes WHERE name='Science 201' LIMIT 1))
ON CONFLICT DO NOTHING;

INSERT INTO notices (title, description)
VALUES
  ('Campus calendar update', 'The academic calendar has been updated with the spring term schedule.'),
  ('New staff orientation', 'Orientation for new staff members will be held in the main hall next Monday.')
ON CONFLICT DO NOTHING;
