export type Category = 'all' | 'housing' | 'findhousing' | 'jobs' | 'sell' | 'services'

export type SortOption = 'new' | 'old' | 'pa' | 'pd' | 'pop'

export interface User {
  id: string
  name: string
  phone?: string
  avatar_url?: string
  city: string
  rating: number
  ads_count: number
  created_at: string
}

export interface Listing {
  id: string
  user_id: string
  title: string
  description: string
  category: Category
  price?: number
  metro?: string
  city: string
  phone?: string
  photos: string[]
  views: number
  is_active: boolean
  is_urgent: boolean
  is_premium: boolean
  created_at: string
  expires_at: string
  user?: User
}

export interface Message {
  id: string
  listing_id: string
  sender_id: string
  receiver_id: string
  text: string
  is_read: boolean
  created_at: string
  sender?: User
}

export interface Review {
  id: string
  reviewer_id: string
  reviewed_id: string
  listing_id: string
  rating: number
  comment: string
  created_at: string
  reviewer?: User
}

export interface Favorite {
  id: string
  user_id: string
  listing_id: string
  created_at: string
  listing?: Listing
}

export interface FilterState {
  category: Category
  query: string
  metro: string
  priceMin: string
  priceMax: string
  sort: SortOption
}

export const CATEGORIES: { id: Category; label: string; icon: string; color: string }[] = [
  { id: 'housing',     label: 'Сдаю жильё',    icon: '🏠', color: 'blue'   },
  { id: 'findhousing', label: 'Сниму жильё',   icon: '🔍', color: 'indigo' },
  { id: 'jobs',        label: 'Работа',         icon: '💼', color: 'green'  },
  { id: 'sell',        label: 'Продаю/Куплю',  icon: '🛍️', color: 'amber'  },
  { id: 'services',    label: 'Услуги',         icon: '🔧', color: 'purple' },
]

export const METRO_STATIONS = [
  'Выхино','Кузьминки','Рязанский проспект','Текстильщики','Печатники',
  'Люблино','Братиславская','Марьино','Зябликово','Красногвардейская',
  'Орехово','Домодедовская','Варшавская','Нагатинская','Нагорная',
  'Чертановская','Южная','Пражская','Улица Академика Янгеля','Аннино',
  'Бульвар Дмитрия Донского','Алма-Атинская','Медведково','Бабушкинская',
  'Свиблово','Ботанический сад','ВДНХ','Алексеевская','Рижская',
  'Проспект Мира','Комсомольская','Красные Ворота','Чистые пруды',
  'Лубянка','Охотный Ряд','Библиотека им. Ленина','Арбатская',
  'Смоленская','Киевская','Студенческая','Кутузовская','Парк Победы',
  'Минская','Ломоносовский проспект','Раменки','Мичуринский проспект',
  'Озёрная','Говорово','Солнцево','Боровское шоссе','Новопеределкино',
  'Рассказовка','Митино','Волоколамская','Мякинино','Строгино',
  'Крылатское','Молодёжная','Кунцевская','Слав. бульвар','Щёлковская',
  'Первомайская','Измайловская','Партизанская','Семёновская','Электрозаводская',
  'Бауманская','Курская','Площадь Революции','Театральная','Новокузнецкая',
  'Третьяковская','Октябрьская','Добрынинская','Серпуховская','Тульская',
  'Нагатинская','Коломенская','Каширская','Кантемировская','Царицыно',
]
