-- ============================================================
-- ЖЕРДЕШ — Supabase SQL Schema
-- Выполни в Supabase Dashboard → SQL Editor
-- ============================================================

-- 1. Профили пользователей
CREATE TABLE IF NOT EXISTS public.users (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name        TEXT NOT NULL DEFAULT '',
  phone       TEXT,
  avatar_url  TEXT,
  city        TEXT DEFAULT 'Москва',
  rating      DECIMAL(2,1) DEFAULT 5.0,
  ads_count   INT DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Объявления
CREATE TABLE IF NOT EXISTS public.listings (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title        TEXT NOT NULL,
  description  TEXT DEFAULT '',
  category     TEXT NOT NULL CHECK (category IN ('housing','findhousing','jobs','sell','services')),
  price        INT,
  metro        TEXT,
  city         TEXT DEFAULT 'Москва',
  phone        TEXT,
  photos       TEXT[] DEFAULT '{}',
  views        INT DEFAULT 0,
  is_active    BOOLEAN DEFAULT TRUE,
  is_urgent    BOOLEAN DEFAULT FALSE,
  is_premium   BOOLEAN DEFAULT FALSE,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW(),
  expires_at   TIMESTAMPTZ DEFAULT NOW() + INTERVAL '30 days'
);

-- 3. Избранное
CREATE TABLE IF NOT EXISTS public.favorites (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  listing_id  UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, listing_id)
);

-- 4. Сообщения (чат)
CREATE TABLE IF NOT EXISTS public.messages (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id   UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  sender_id    UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  receiver_id  UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  text         TEXT NOT NULL,
  is_read      BOOLEAN DEFAULT FALSE,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Отзывы
CREATE TABLE IF NOT EXISTS public.reviews (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reviewer_id  UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  reviewed_id  UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  listing_id   UUID REFERENCES public.listings(id) ON DELETE SET NULL,
  rating       INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment      TEXT DEFAULT '',
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(reviewer_id, listing_id)
);

-- ============================================================
-- ИНДЕКСЫ — для быстрого поиска
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_listings_category   ON public.listings(category);
CREATE INDEX IF NOT EXISTS idx_listings_metro       ON public.listings(metro);
CREATE INDEX IF NOT EXISTS idx_listings_user_id     ON public.listings(user_id);
CREATE INDEX IF NOT EXISTS idx_listings_is_active   ON public.listings(is_active);
CREATE INDEX IF NOT EXISTS idx_listings_created_at  ON public.listings(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_listings_premium     ON public.listings(is_premium);
CREATE INDEX IF NOT EXISTS idx_messages_listing_id  ON public.messages(listing_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender      ON public.messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_favorites_user_id    ON public.favorites(user_id);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE public.users     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listings  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews   ENABLE ROW LEVEL SECURITY;

-- Users
CREATE POLICY "users_select_all"   ON public.users FOR SELECT USING (true);
CREATE POLICY "users_insert_own"   ON public.users FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "users_update_own"   ON public.users FOR UPDATE USING (auth.uid() = id);

-- Listings
-- Публичные: только активные. Владелец видит все свои (включая черновики)
CREATE POLICY "listings_select_active" ON public.listings FOR SELECT USING (
  status = 'active' OR auth.uid() = user_id
);
CREATE POLICY "listings_insert_auth"   ON public.listings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "listings_update_own"    ON public.listings FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "listings_delete_own"    ON public.listings FOR DELETE USING (auth.uid() = user_id);

-- Favorites
CREATE POLICY "favorites_select_own"  ON public.favorites FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "favorites_insert_auth" ON public.favorites FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "favorites_delete_own"  ON public.favorites FOR DELETE USING (auth.uid() = user_id);

-- Messages
CREATE POLICY "messages_select_own" ON public.messages FOR SELECT
  USING (auth.uid() = sender_id OR auth.uid() = receiver_id);
CREATE POLICY "messages_insert_auth" ON public.messages FOR INSERT
  WITH CHECK (auth.uid() = sender_id);

-- Reviews
CREATE POLICY "reviews_select_all"   ON public.reviews FOR SELECT USING (true);
CREATE POLICY "reviews_insert_auth"  ON public.reviews FOR INSERT WITH CHECK (auth.uid() = reviewer_id);

-- ============================================================
-- REALTIME — включить для чата
-- ============================================================
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;

-- ============================================================
-- TRIGGER — автоматически создавать профиль при регистрации
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'name', 'Пользователь'))
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- STORAGE BUCKETS — создать в Supabase Dashboard → Storage
-- ============================================================
-- Bucket: "listings"  — публичный, max 5MB, image/*
-- Bucket: "avatars"   — публичный, max 2MB, image/*
