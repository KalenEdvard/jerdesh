# Мекендеш — Security Methodology

## 1. Security Principles

- **База = первая линия защиты.** RLS должен быть настроен правильно. UI — не защита.
- **Минимальный доступ.** Каждая политика даёт ровно столько, сколько нужно для сценария.
- **Явные поля в запросах.** Никогда `select('*')` в публичных контекстах.
- **Синхронизация.** RLS, код приложения и типы должны описывать одну и ту же модель доступа.
- **status — источник истины.** Видимость объявления определяется только полем `status`.

---

## 2. Public vs Private Data

| Данные | Публично | Только владелец |
|--------|----------|-----------------|
| `listings` (status=active) | ✓ | — |
| `listings` (status=draft) | ✗ | ✓ |
| `users.name, avatar_url, rating, city` | ✓ | — |
| `users.phone, whatsapp, telegram, vk` | ✗ | ✓ |
| `favorites` | ✗ | ✓ |
| `messages` | ✗ | sender + receiver |
| `reviews` | ✓ (чтение) | ✓ (запись) |

---

## 3. RLS Rules

**Listings:**
```sql
-- Читать: активные публично + все свои
SELECT USING (status = 'active' OR auth.uid() = user_id)
-- Писать: только свои
INSERT WITH CHECK (auth.uid() = user_id)
UPDATE USING (auth.uid() = user_id)
DELETE USING (auth.uid() = user_id)
```

**Users:**
```sql
-- Строки: читать публично (но в коде выбирать только безопасные поля)
SELECT USING (true)
-- Изменять только свои
UPDATE USING (auth.uid() = id)
```

**Favorites:**
```sql
SELECT USING (auth.uid() = user_id)
INSERT WITH CHECK (auth.uid() = user_id)
DELETE USING (auth.uid() = user_id)
```

**Messages:**
```sql
SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id)
INSERT WITH CHECK (auth.uid() = sender_id)
```

**Reviews:**
```sql
SELECT USING (true)
INSERT WITH CHECK (auth.uid() = reviewer_id AND reviewer_id != reviewed_id)
```

---

## 4. Policy Design Rules

- Одна политика = один сценарий. Не объединять INSERT и UPDATE в одну.
- Всегда явно перечислять FOR SELECT / FOR INSERT / FOR UPDATE / FOR DELETE.
- При переходе на новую модель — DROP старую политику, CREATE новую. Не оставлять обе.
- Тестировать политики в Supabase Dashboard → Table Editor → RLS.

---

## 5. Query Design Rules

**Публичные запросы** (главная, карточки, sitemap):
```typescript
// ✓ Явные безопасные поля
supabase.from('listings')
  .select('id,title,category,price,metro,city,photos,views,status,created_at,user:users(id,name,avatar_url,rating)')
  .eq('status', 'active')

// ✗ Нельзя — раскрывает все поля включая phone
supabase.from('listings').select('*, user:users(*)')
```

**Приватные запросы** (профиль, настройки):
```typescript
// ✓ Читать весь профиль только для себя
supabase.from('users').select('*').eq('id', user.id)
```

**Правило**: если запрос может вернуть данные любого пользователя — явно перечислять безопасные поля.

---

## 6. Handling User Profile Data

| Поле | Публичное | Приватное |
|------|-----------|-----------|
| id | ✓ | — |
| name | ✓ | — |
| avatar_url | ✓ | — |
| rating | ✓ | — |
| city | ✓ | — |
| ads_count | ✓ | — |
| created_at | ✓ | — |
| phone | ✗ | ✓ |
| whatsapp | ✗ | ✓ |
| telegram | ✗ | ✓ |
| vk | ✗ | ✓ |

В публичных запросах (карточки объявлений, страница объявления): `user:users(id,name,avatar_url,rating,city)`

В профиле владельца: `select('*')` допустим только для `auth.uid() = id`.

---

## 7. Handling Listing Statuses

```
active  → публично: поиск, главная, sitemap, SEO
draft   → только владелец в /profile
deleted → никто, удаляется cron-ом
```

**В коде:**
- Публичные страницы: всегда `.eq('status', 'active')`
- Профиль: `.in('status', ['active', 'draft']).eq('user_id', user.id)`
- Создание: `status: 'active'`
- Архивирование: `status: 'draft'`
- Никогда не использовать `is_active` в новом коде

---

## 8. Auth/Session Security Rules

- Middleware проверяет сессию на сервере перед рендером `/profile`, `/create`.
- Server Actions всегда вызывают `supabase.auth.getUser()` перед мутацией.
- Zustand хранит только UI state, не сессию.
- Никогда не доверять `user.id` из клиентского state без проверки на сервере.

---

## 9. SEO and Sitemap Safety Rules

- Sitemap включает только `status = 'active'` объявления.
- `generateMetadata` для `listings/[id]` добавляет `noindex` если объявление не active.
- robots.ts запрещает индексацию `/profile`, `/create`, `/api`.

---

## 10. Legacy Removal Rules

1. Найти все использования устаревшего поля (`is_active`, `expires_at`).
2. Убедиться что нет runtime-зависимостей.
3. Удалить из кода и типов.
4. Обновить RLS политики.
5. Написать миграцию.
6. Задокументировать в commit.

---

## 11. Security Review Checklist

Перед каждым деплоем:
- [ ] Нет `select('*')` в публичных запросах к `users`
- [ ] Нет `is_active` в новом коде
- [ ] `status = 'active'` в публичных запросах к `listings`
- [ ] RLS политики обновлены если менялась схема
- [ ] Middleware защищает protected routes
- [ ] Server Actions проверяют `auth.uid()` перед мутацией
- [ ] Sitemap читает только `status = 'active'`
- [ ] Phone/whatsapp/telegram не попадают в публичные выборки
- [ ] `npx tsc --noEmit` — без ошибок
