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
  whatsapp?: string
  telegram?: string
  vk?: string
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
  status: 'active' | 'draft' | 'deleted'
  is_urgent: boolean
  is_premium: boolean
  created_at: string
  user?: User
  // legacy — не использовать в новом коде
  is_active?: boolean
  expires_at?: string
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
  city: string
  metro: string
  priceMin: string
  priceMax: string
  sort: SortOption
}

export const DEFAULT_CITY = 'Москва'

export const COUNTRIES = [
  { id: 'Россия',         flag: '🇷🇺' },
  { id: 'Казахстан',      flag: '🇰🇿' },
  { id: 'Кыргызстан',     flag: '🇰🇬' },
  { id: 'Турция',         flag: '🇹🇷' },
  { id: 'Германия',       flag: '🇩🇪' },
  { id: 'Польша',         flag: '🇵🇱' },
  { id: 'США',            flag: '🇺🇸' },
  { id: 'Канада',         flag: '🇨🇦' },
  { id: 'Южная Корея',    flag: '🇰🇷' },
  { id: 'ОАЭ',            flag: '🇦🇪' },
  { id: 'Великобритания', flag: '🇬🇧' },
  { id: 'Франция',        flag: '🇫🇷' },
  { id: 'Италия',         flag: '🇮🇹' },
  { id: 'Чехия',          flag: '🇨🇿' },
  { id: 'Австрия',        flag: '🇦🇹' },
]

export const CITIES = [
  { id: 'Москва',          flag: '🏙️', country: 'Россия',         metro: true  },
  { id: 'Санкт-Петербург', flag: '🌉', country: 'Россия',         metro: true  },
  { id: 'Екатеринбург',    flag: '🏙️', country: 'Россия',         metro: true  },
  { id: 'Новосибирск',     flag: '🏙️', country: 'Россия',         metro: true  },
  { id: 'Казань',          flag: '🏙️', country: 'Россия',         metro: true  },
  { id: 'Краснодар',       flag: '🏙️', country: 'Россия',         metro: false },
  { id: 'Алматы',          flag: '🏔️', country: 'Казахстан',      metro: false },
  { id: 'Нур-Султан',      flag: '🏙️', country: 'Казахстан',      metro: false },
  { id: 'Бишкек',          flag: '🏔️', country: 'Кыргызстан',     metro: false },
  { id: 'Стамбул',         flag: '🌉', country: 'Турция',         metro: false },
  { id: 'Анкара',          flag: '🏙️', country: 'Турция',         metro: false },
  { id: 'Берлин',          flag: '🏙️', country: 'Германия',       metro: false },
  { id: 'Мюнхен',          flag: '🏙️', country: 'Германия',       metro: false },
  { id: 'Варшава',         flag: '🏙️', country: 'Польша',         metro: false },
  { id: 'Чикаго',          flag: '🏙️', country: 'США',            metro: false },
  { id: 'Нью-Йорк',        flag: '🗽', country: 'США',            metro: false },
  { id: 'Торонто',         flag: '🏙️', country: 'Канада',         metro: false },
  { id: 'Сеул',            flag: '🏙️', country: 'Южная Корея',    metro: false },
  { id: 'Дубай',           flag: '🏙️', country: 'ОАЭ',            metro: false },
  { id: 'Лондон',          flag: '🏙️', country: 'Великобритания', metro: false },
  { id: 'Прага',           flag: '🏙️', country: 'Чехия',          metro: false },
  { id: 'Вена',            flag: '🏙️', country: 'Австрия',        metro: false },
]

export const CATEGORIES: { id: Category; label: string; icon: string; color: string }[] = [
  { id: 'housing',     label: 'Сдаю жильё',    icon: '🏠', color: 'blue'   },
  { id: 'findhousing', label: 'Сниму жильё',   icon: '🔍', color: 'indigo' },
  { id: 'jobs',        label: 'Работа',         icon: '💼', color: 'green'  },
  { id: 'sell',        label: 'Продаю/Куплю',  icon: '🛍️', color: 'amber'  },
  { id: 'services',    label: 'Услуги',         icon: '🔧', color: 'purple' },
]

export const METRO_STATIONS = [
  'Авиамоторная',
  'Автозаводская',
  'Академическая',
  'Александровский сад',
  'Алексеевская',
  'Алма-Атинская',
  'Алтуфьево',
  'Аннино',
  'Арбатская',
  'Аэропорт',
  'Бабушкинская',
  'Багратионовская',
  'Балтийская',
  'Баррикадная',
  'Бауманская',
  'Беговая',
  'Бибирево',
  'Библиотека им. Ленина',
  'Битцевский парк',
  'Борисово',
  'Боровицкая',
  'Боровское шоссе',
  'Ботанический сад',
  'Братиславская',
  'Бульвар Адмирала Ушакова',
  'Бульвар Дмитрия Донского',
  'Бульвар Рокоссовского',
  'Бунинская аллея',
  'Бутово',
  'ВДНХ',
  'Варшавская',
  'Верхние Котлы',
  'Верхние Лихоборы',
  'Владыкино',
  'Войковская',
  'Волгоградский проспект',
  'Волжская',
  'Волоколамская',
  'Воробьёвы горы',
  'Выхино',
  'Говорово',
  'Горьковская',
  'Деловой центр',
  'Дмитровская',
  'Добрынинская',
  'Домодедовская',
  'Достоевская',
  'Дубровка',
  'Зябликово',
  'Измайловская',
  'Калужская',
  'Кантемировская',
  'Каховская',
  'Каширская',
  'Киевская',
  'Китай-город',
  'Кожуховская',
  'Коломенская',
  'Комсомольская',
  'Коньково',
  'Коптево',
  'Косино',
  'Красногвардейская',
  'Красносельская',
  'Красные Ворота',
  'Краснопресненская',
  'Крестьянская застава',
  'Кропоткинская',
  'Крылатское',
  'Кузьминки',
  'Кунцевская',
  'Курская',
  'Кутузовская',
  'Ленинский проспект',
  'Лермонтовский проспект',
  'Лесопарковая',
  'Лихоборы',
  'Ломоносовский проспект',
  'Лубянка',
  'Люблино',
  'Марьина Роща',
  'Марьино',
  'Маяковская',
  'Медведково',
  'Менделеевская',
  'Мичуринский проспект',
  'Митино',
  'Молодёжная',
  'Мякинино',
  'Нагатинская',
  'Нагорная',
  'Нахимовский проспект',
  'Некрасовка',
  'Нижегородская',
  'Новогиреево',
  'Новокосино',
  'Новокузнецкая',
  'Новопеределкино',
  'Новослободская',
  'Новохохловская',
  'Новые Черёмушки',
  'Обухово',
  'Октябрьская',
  'Октябрьское поле',
  'Орехово',
  'Отрадное',
  'Охотный Ряд',
  'Павелецкая',
  'Парк Культуры',
  'Парк Победы',
  'Партизанская',
  'Первомайская',
  'Перово',
  'Петровско-Разумовская',
  'Печатники',
  'Пионерская',
  'Планерная',
  'Площадь Гагарина',
  'Площадь Ильича',
  'Площадь Революции',
  'Полежаевская',
  'Полянка',
  'Пражская',
  'Преображенская площадь',
  'Проспект Вернадского',
  'Проспект Мира',
  'Профсоюзная',
  'Пушкинская',
  'Раменки',
  'Рассказовка',
  'Рижская',
  'Румянцево',
  'Рязанский проспект',
  'Савёловская',
  'Саларьево',
  'Свиблово',
  'Семёновская',
  'Серпуховская',
  'Сетунь',
  'Славянский бульвар',
  'Смоленская',
  'Солнцево',
  'Сокол',
  'Соколиная Гора',
  'Сокольники',
  'Спартак',
  'Спортивная',
  'Строгино',
  'Студенческая',
  'Сухаревская',
  'Сходненская',
  'Таганская',
  'Тверская',
  'Театральная',
  'Текстильщики',
  'Теплый Стан',
  'Технопарк',
  'Тимирязевская',
  'Третьяковская',
  'Тропарёво',
  'Трубная',
  'Тульская',
  'Тургеневская',
  'Угрешская',
  'Улица 1905 года',
  'Улица Академика Янгеля',
  'Улица Горчакова',
  'Улица Скобелевская',
  'Улица Старокачаловская',
  'Университет',
  'Филёвский парк',
  'Фили',
  'Фонвизинская',
  'Фрунзенская',
  'Царицыно',
  'Цветной бульвар',
  'Черкизовская',
  'Чертановская',
  'Чистые пруды',
  'Чкаловская',
  'Шаболовская',
  'Шипиловская',
  'Шоссе Энтузиастов',
  'Щёлковская',
  'Щукинская',
  'Электрозаводская',
  'Юго-Западная',
  'Южная',
  'Ясенево',
].sort((a, b) => a.localeCompare(b, 'ru'))
