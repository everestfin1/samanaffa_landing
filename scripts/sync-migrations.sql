-- Create __drizzle_migrations table if it doesn't exist
CREATE TABLE IF NOT EXISTS "__drizzle_migrations" (
  id SERIAL PRIMARY KEY,
  hash text NOT NULL UNIQUE,
  created_at bigint
);

-- Insert the 4 already-applied migrations
INSERT INTO "__drizzle_migrations" (hash, created_at) VALUES
  ('0000_clever_hellion', 1761665267201),
  ('0001_living_moira_mactaggert', 1761665703396),
  ('0002_strange_rawhide_kid', 1764666264367),
  ('0003_youthful_electro', 1765442243776)
ON CONFLICT (hash) DO NOTHING;

-- Verify
SELECT * FROM "__drizzle_migrations" ORDER BY id;
