-- ============================================================
-- MIGRATION 003: Storage buckets and policies
-- Run in Supabase Dashboard → SQL Editor
-- ============================================================

-- Убеждаемся что bucket listings существует и публичный
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'listings',
  'listings',
  true,
  5242880, -- 5MB
  ARRAY['image/jpeg','image/png','image/webp']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg','image/png','image/webp'];

-- Удаляем старые политики если есть (безопасно)
DROP POLICY IF EXISTS "auth users upload avatars" ON storage.objects;
DROP POLICY IF EXISTS "auth users update avatars" ON storage.objects;
DROP POLICY IF EXISTS "public read listings" ON storage.objects;
DROP POLICY IF EXISTS "auth insert listings" ON storage.objects;
DROP POLICY IF EXISTS "auth update listings" ON storage.objects;
DROP POLICY IF EXISTS "auth delete listings" ON storage.objects;

-- Публичное чтение всего бакета
CREATE POLICY "public read listings"
ON storage.objects FOR SELECT
USING (bucket_id = 'listings');

-- Авторизованный пользователь может загружать в свою папку и avatars/
CREATE POLICY "auth insert listings"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'listings'
  AND (
    name LIKE (auth.uid()::text || '/%')
    OR name LIKE 'avatars/%'
  )
);

-- Авторизованный пользователь может обновлять свои файлы
CREATE POLICY "auth update listings"
ON storage.objects FOR UPDATE TO authenticated
USING (
  bucket_id = 'listings'
  AND (
    name LIKE (auth.uid()::text || '/%')
    OR name LIKE 'avatars/%'
  )
);

-- Авторизованный пользователь может удалять свои файлы
CREATE POLICY "auth delete listings"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'listings'
  AND name LIKE (auth.uid()::text || '/%')
);
