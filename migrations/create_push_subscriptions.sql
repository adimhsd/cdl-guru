-- ==========================================
-- Migrasi: Tabel Push Subscriptions untuk PWA
-- ==========================================
-- Jalankan script ini SEKALI di database PostgreSQL Anda:
--   psql -U <user> -d <database> -f migrations/create_push_subscriptions.sql
-- 
-- Catatan: user_id bertipe TEXT karena Prisma menggunakan CUID (string) sebagai primary key.
-- ==========================================

CREATE TABLE IF NOT EXISTS push_subscriptions (
  id          SERIAL PRIMARY KEY,
  user_id     TEXT NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
  endpoint    TEXT NOT NULL UNIQUE,
  p256dh      TEXT NOT NULL,
  auth        TEXT NOT NULL,
  created_at  TIMESTAMP DEFAULT NOW(),
  updated_at  TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_push_subscriptions_user_id
  ON push_subscriptions(user_id);

-- Fungsi dan trigger untuk auto-update kolom updated_at
CREATE OR REPLACE FUNCTION update_push_subscriptions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_push_subscriptions_updated_at ON push_subscriptions;

CREATE TRIGGER trg_push_subscriptions_updated_at
  BEFORE UPDATE ON push_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_push_subscriptions_updated_at();
