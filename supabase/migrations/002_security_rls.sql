-- ============================================================
-- MIGRATION 002: Безопасные RLS политики
-- Запустить в Supabase Dashboard → SQL Editor
-- ============================================================

-- ============================================================
-- TABLE: listings
-- Публично: только status = 'active'
-- Владелец: все свои (active + draft)
-- ============================================================
DROP POLICY IF EXISTS "listings_select_active" ON public.listings;
DROP POLICY IF EXISTS "listings_insert_auth"   ON public.listings;
DROP POLICY IF EXISTS "listings_update_own"    ON public.listings;

CREATE POLICY "listings_select" ON public.listings FOR SELECT USING (
  status = 'active' OR auth.uid() = user_id
);
CREATE POLICY "listings_insert" ON public.listings FOR INSERT
  WITH CHECK (auth.uid() = user_id AND status = 'active');
CREATE POLICY "listings_update" ON public.listings FOR UPDATE
  USING (auth.uid() = user_id);
CREATE POLICY "listings_delete" ON public.listings FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================
-- TABLE: users
-- Публично: только безопасные поля через политику строк
-- Приватно (сам пользователь): все поля
-- Примечание: column-level защита — на уровне запросов в коде
-- ============================================================
DROP POLICY IF EXISTS "users_select_all"  ON public.users;
DROP POLICY IF EXISTS "users_insert_own"  ON public.users;
DROP POLICY IF EXISTS "users_update_own"  ON public.users;

-- Публично читать профиль можно (для карточек объявлений)
-- Но в коде НИКОГДА не делать select('*') для чужих пользователей
CREATE POLICY "users_select" ON public.users FOR SELECT USING (true);

-- Обновлять только свой профиль
CREATE POLICY "users_update" ON public.users FOR UPDATE
  USING (auth.uid() = id);

-- Создавать профиль только для себя (триггер это делает автоматически)
CREATE POLICY "users_insert" ON public.users FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ============================================================
-- TABLE: favorites
-- Только владелец читает и управляет своими избранными
-- ============================================================
DROP POLICY IF EXISTS "favorites_select_own" ON public.favorites;
DROP POLICY IF EXISTS "favorites_insert_own" ON public.favorites;
DROP POLICY IF EXISTS "favorites_delete_own" ON public.favorites;

CREATE POLICY "favorites_select" ON public.favorites FOR SELECT
  USING (auth.uid() = user_id);
CREATE POLICY "favorites_insert" ON public.favorites FOR INSERT
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "favorites_delete" ON public.favorites FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================
-- TABLE: messages
-- Только отправитель и получатель
-- ============================================================
DROP POLICY IF EXISTS "messages_select_participants" ON public.messages;
DROP POLICY IF EXISTS "messages_insert_auth"         ON public.messages;

CREATE POLICY "messages_select" ON public.messages FOR SELECT
  USING (auth.uid() = sender_id OR auth.uid() = receiver_id);
CREATE POLICY "messages_insert" ON public.messages FOR INSERT
  WITH CHECK (auth.uid() = sender_id);
CREATE POLICY "messages_update" ON public.messages FOR UPDATE
  USING (auth.uid() = receiver_id); -- только получатель может пометить as read

-- ============================================================
-- TABLE: reviews
-- Читать публично (часть продукта)
-- Писать — только авторизованный, один отзыв на объявление
-- ============================================================
DROP POLICY IF EXISTS "reviews_select_all"  ON public.reviews;
DROP POLICY IF EXISTS "reviews_insert_auth" ON public.reviews;

CREATE POLICY "reviews_select" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "reviews_insert" ON public.reviews FOR INSERT
  WITH CHECK (
    auth.uid() = reviewer_id AND
    reviewer_id != reviewed_id  -- нельзя писать отзыв самому себе
  );
