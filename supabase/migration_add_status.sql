-- ============================================================
-- МИГРАЦИЯ: добавить status, убрать зависимость от expires_at
-- Выполни в Supabase Dashboard → SQL Editor
-- ============================================================

-- 1. Добавить колонку status
ALTER TABLE public.listings
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'active'
  CHECK (status IN ('active', 'draft', 'deleted'));

-- 2. Перенести существующие данные
-- Активные и не истёкшие → active
UPDATE public.listings
  SET status = 'active'
  WHERE is_active = true
    AND (expires_at IS NULL OR expires_at > NOW());

-- Истёкшие → draft (хранятся у владельца)
UPDATE public.listings
  SET status = 'draft'
  WHERE is_active = true
    AND expires_at IS NOT NULL
    AND expires_at <= NOW();

-- Неактивные → draft
UPDATE public.listings
  SET status = 'draft'
  WHERE is_active = false;

-- 3. Индексы для быстрых запросов
CREATE INDEX IF NOT EXISTS idx_listings_status
  ON public.listings(status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_listings_user_status
  ON public.listings(user_id, status);

-- 4. Включить pg_cron (если не включён)
-- В Supabase Dashboard → Database → Extensions → pg_cron → Enable

-- 5. Cron-job: каждую ночь в 3:00
-- active → draft после 30 дней
-- draft удаляется после 180 дней
SELECT cron.schedule(
  'expire-listings',
  '0 3 * * *',
  $$
    UPDATE public.listings
      SET status = 'draft'
      WHERE status = 'active'
        AND created_at < NOW() - INTERVAL '30 days';

    DELETE FROM public.listings
      WHERE status = 'draft'
        AND created_at < NOW() - INTERVAL '180 days';
  $$
);
