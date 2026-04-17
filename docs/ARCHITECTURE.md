# Мекендеш — Архитектура и методология

## Доменная модель объявлений (единственный источник истины)

```
active (30 дней) → draft (180 дней) → deleted
```

| Статус | Видимость | Кто видит |
|--------|-----------|-----------|
| `active` | Публично | Все, поиск, sitemap, SEO |
| `draft` | Приватно | Только владелец в /profile |
| `deleted` | Нет | Никто, физическое удаление cron-ом |

**Правило**: поле `status` — единственный источник истины для lifecycle объявления.
`is_active` и `expires_at` — legacy поля, не использовать в новом коде.

---

## Принципы архитектуры

1. **Один источник истины** — каждая концепция имеет одно место определения.
2. **Server first** — данные читаются на сервере, клиент только отображает и мутирует через actions.
3. **Чёткие слои** — `app/` для маршрутов, `features/` для сценариев, `shared/` для переиспользуемого.
4. **Не смешивать UI и бизнес-логику** — компонент не должен знать SQL.
5. **Auth на сервере** — сессия проверяется в middleware, не в useEffect.

---

## Правила работы с миграциями

- Все миграции хранятся в `supabase/migrations/` с нумерацией: `001_`, `002_`, ...
- Никогда не изменять уже применённую миграцию — только новая миграция.
- После добавления миграции — обновить `supabase/schema.sql` как итоговый snapshot.
- RPC функции хранятся в `supabase/functions/`.
- Перед деплоем — применить миграцию в Supabase Dashboard → SQL Editor.

---

## Правила работы с Supabase schema и RLS

- RLS политики основаны только на `status`, не на `is_active`.
- Публичное чтение: `status = 'active'`.
- Приватное чтение: `auth.uid() = user_id`.
- Каждая таблица имеет явные политики для SELECT, INSERT, UPDATE, DELETE.
- `schema.sql` всегда актуален и отражает текущее состояние базы.

```sql
-- Пример корректной политики для listings
CREATE POLICY "listings_select" ON public.listings FOR SELECT USING (
  status = 'active' OR auth.uid() = user_id
);
```

---

## Правила удаления legacy-кода

1. Найти все импорты/использования legacy-символа.
2. Убедиться что нет зависимостей (grep по проекту).
3. Удалить файл или код.
4. Обновить типы.
5. Запустить `npx tsc --noEmit` — должно быть чисто.
6. Задокументировать в commit message что и почему удалено.

**Нельзя**: оставлять мёртвый код "на всякий случай". Он становится ловушкой.

---

## Правила разделения public/private logic

| Тип страницы | Данные | Auth |
|--------------|--------|------|
| `/` главная | `status = 'active'`, анонимно | Не нужен |
| `/listings/[id]` | `status = 'active'`, анонимно | Не нужен |
| `/profile` | `user_id = auth.uid()` | **Обязателен** (middleware) |
| `/create` | INSERT с `auth.uid()` | **Обязателен** (middleware) |

---

## Правила размещения кода

```
app/actions/       → Server Actions (мутации данных)
app/(public)/      → Публичные маршруты
app/(protected)/   → Защищённые маршруты (middleware)
features/          → Логика конкретного сценария
shared/ui/         → Переиспользуемые UI-примитивы
shared/lib/        → Утилиты без бизнес-логики
types/             → Только TypeScript типы и интерфейсы
supabase/          → Всё что касается базы данных
docs/              → Документация
```

**Нельзя**:
- Писать SQL-запросы в UI-компонентах (`components/`, `features/*/components/`).
- Писать бизнес-логику в `app/layout.tsx` или `app/page.tsx`.
- Создавать новые файлы в корне проекта.

---

## Правила написания новых фич

1. Определить domain entity (что за данные).
2. Написать тип в `types/index.ts`.
3. Написать запрос в `app/actions/` (server action) или `features/*/queries.ts`.
4. Написать UI-компонент в `features/*/components/`.
5. Подключить в `app/` маршруте.
6. Обновить RLS если нужно.
7. Обновить sitemap если фича публичная.

---

## Правила по SEO и индексации

- Sitemap: только `status = 'active'` объявления.
- Metadata: заполнять `title`, `description`, `openGraph` на каждой публичной странице.
- Canonical URL: всегда указывать для объявлений.
- `robots.ts`: disallow `/profile`, `/create`, `/api`.
- Sitemap обновляется автоматически при `revalidate`.

---

## Правила по auth/session

- **Zustand** — только для UI state: `authOpen`, `toast`. Не хранить user-сессию.
- **Сессия** — определяется через `createClient()` на сервере или `middleware.ts`.
- **Protected routes** — защищать в `middleware.ts`, не в `useEffect`.
- **Server Actions** — всегда проверять `auth.uid()` перед мутацией.

```typescript
// ✓ Правильно — server action
'use server'
export async function createListing(data: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')
  // ...
}

// ✗ Неправильно — мутация в клиентском компоненте
const supabase = createClient()
await supabase.from('listings').insert({ ... })
```

---

## Правила по UI-состоянию

```typescript
// store/ui.ts — только UI state
interface UIStore {
  authOpen: boolean
  toast: { message: string; type: string } | null
  // НЕ хранить: user, session, listings
}
```

---

## Правила код-ревью

Перед merge проверить:
- [ ] `npx tsc --noEmit` — нет ошибок
- [ ] Нет `is_active` в новом коде
- [ ] Нет SQL-запросов в UI-компонентах
- [ ] RLS политики обновлены если менялась схема
- [ ] Sitemap актуален если добавлены публичные страницы
- [ ] Protected routes защищены middleware
- [ ] Commit message описывает **почему**, не только **что**
