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
  { id: 'Россия',      flag: '🇷🇺' },
  { id: 'Германия',    flag: '🇩🇪' },
  { id: 'Англия',      flag: '🇬🇧' },
  { id: 'Америка',     flag: '🇺🇸' },
  { id: 'Корея',       flag: '🇰🇷' },
  { id: 'Кыргызстан',  flag: '🇰🇬' },
]

export const CITIES = [
  // Россия
  { id: 'Москва',           flag: '🏙️', country: 'Россия',      metro: true  },
  { id: 'Санкт-Петербург',  flag: '🌉', country: 'Россия',      metro: true  },
  { id: 'Екатеринбург',     flag: '🏙️', country: 'Россия',      metro: true  },
  { id: 'Новосибирск',      flag: '🏙️', country: 'Россия',      metro: true  },
  { id: 'Казань',           flag: '🏙️', country: 'Россия',      metro: true  },
  { id: 'Краснодар',        flag: '🏙️', country: 'Россия',      metro: false },
  // Германия — все крупные города имеют U-Bahn
  { id: 'Берлин',           flag: '🏙️', country: 'Германия',    metro: true  },
  { id: 'Мюнхен',           flag: '🏙️', country: 'Германия',    metro: true  },
  { id: 'Гамбург',          flag: '🌉', country: 'Германия',    metro: true  },
  { id: 'Франкфурт',        flag: '🏙️', country: 'Германия',    metro: true  },
  { id: 'Кёльн',            flag: '🏙️', country: 'Германия',    metro: true  },
  { id: 'Дюссельдорф',      flag: '🏙️', country: 'Германия',    metro: true  },
  // Англия
  { id: 'Лондон',           flag: '🏙️', country: 'Англия',      metro: true  },
  { id: 'Манчестер',        flag: '🏙️', country: 'Англия',      metro: true  },
  { id: 'Ливерпуль',        flag: '🏙️', country: 'Англия',      metro: true  },
  { id: 'Глазго',           flag: '🏙️', country: 'Англия',      metro: true  },
  { id: 'Бирмингем',        flag: '🏙️', country: 'Англия',      metro: false },
  { id: 'Лидс',             flag: '🏙️', country: 'Англия',      metro: false },
  // Америка
  { id: 'Нью-Йорк',         flag: '🗽', country: 'Америка',     metro: true  },
  { id: 'Лос-Анджелес',     flag: '🌴', country: 'Америка',     metro: true  },
  { id: 'Чикаго',           flag: '🏙️', country: 'Америка',     metro: true  },
  { id: 'Вашингтон',        flag: '🏛️', country: 'Америка',     metro: true  },
  { id: 'Сан-Франциско',    flag: '🌉', country: 'Америка',     metro: true  },
  { id: 'Майами',           flag: '🌊', country: 'Америка',     metro: true  },
  // Корея — все крупные города имеют метро
  { id: 'Сеул',             flag: '🏙️', country: 'Корея',       metro: true  },
  { id: 'Пусан',            flag: '🌊', country: 'Корея',       metro: true  },
  { id: 'Инчхон',           flag: '🏙️', country: 'Корея',       metro: true  },
  { id: 'Тэгу',             flag: '🏙️', country: 'Корея',       metro: true  },
  { id: 'Тэджон',           flag: '🏙️', country: 'Корея',       metro: true  },
  { id: 'Кванджу',          flag: '🏙️', country: 'Корея',       metro: true  },
  // Кыргызстан — метро нет
  { id: 'Бишкек',           flag: '🏔️', country: 'Кыргызстан',  metro: false },
  { id: 'Ош',               flag: '🏙️', country: 'Кыргызстан',  metro: false },
  { id: 'Джалал-Абад',      flag: '🏙️', country: 'Кыргызстан',  metro: false },
  { id: 'Кант',             flag: '🏙️', country: 'Кыргызстан',  metro: false },
  { id: 'Нарын',            flag: '🏔️', country: 'Кыргызстан',  metro: false },
  { id: 'Токмок',           flag: '🏙️', country: 'Кыргызстан',  metro: false },
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

export const METRO_BY_CITY: Record<string, string[]> = {
  'Москва': METRO_STATIONS,
  'Санкт-Петербург': [
    'Автово','Адмиралтейская','Академическая','Балтийская','Беговая',
    'Бухарестская','Василеостровская','Волковская','Выборгская','Горьковская',
    'Гостиный двор','Девяткино','Дунайская','Елизаровская','Звёздная',
    'Зенит','Кировский завод','Комендантский проспект','Купчино','Ладожская',
    'Лесная','Лиговский проспект','Ломоносовская','Международная','Московская',
    'Московские ворота','Нарвская','Невский проспект','Новочеркасская',
    'Обводный канал','Обухово','Озерки','Парк победы','Парнас',
    'Петроградская','Пионерская','Площадь Александра Невского','Площадь Восстания',
    'Площадь Мужества','Политехническая','Приморская','Пролетарская',
    'Проспект Большевиков','Проспект Ветеранов','Проспект Просвещения',
    'Рыбацкое','Садовая','Спортивная','Старая деревня',
    'Технологический институт','Удельная','Улица Дыбенко','Фрунзенская',
    'Чёрная речка','Чернышевская','Чкаловская','Шушары','Электросила',
  ].sort((a, b) => a.localeCompare(b, 'ru')),
  'Екатеринбург': [
    'Ботаническая','Геологическая','Динамо','Машиностроителей',
    'Площадь 1905 года','Проспект Космонавтов','Уралмаш','Уральская','Чкаловская',
  ],
  'Новосибирск': [
    'Берёзовая роща','Гагаринская','Золотая нива','Заельцовская',
    'Красный проспект','Маршала Покрышкина','Октябрьская',
    'Площадь Гарина-Михайловского','Площадь Ленина','Площадь Маркса',
    'Речной вокзал','Сибирская','Студенческая',
  ],
  'Казань': [
    'Авиастроительная','Аметьево','Горки','Дубравная','Козья слобода',
    'Кремлёвская','Молодёжная','Площадь Тукая','Проспект Победы',
    'Суконная слобода','Яшьлек',
  ],
  'Берлин': [
    'Alexanderplatz','Brandenburger Tor','Checkpoint Charlie',
    'Fehrbelliner Platz','Friedrichstraße','Hauptbahnhof','Hermannplatz',
    'Jannowitzbrücke','Kottbusser Tor','Kurfürstendamm','Mehringdamm',
    'Nollendorfplatz','Ostbahnhof','Potsdamer Platz','Rathaus Steglitz',
    'Schönleinstraße','Tempelhof','Unter den Linden','Warschauer Straße',
    'Westend','Zoologischer Garten',
  ].sort(),
  'Мюнхен': [
    'Candidplatz','Giesing','Hauptbahnhof','Innsbrucker Ring',
    'Karlsplatz (Stachus)','Kieferngarten','Laimer Platz','Marienplatz',
    'Max-Weber-Platz','Moosach','Münchner Freiheit','Nordfriedhof',
    'Odeonsplatz','Ostbahnhof','Scheidplatz','Schwabing Nord',
    'Sendlinger Tor','Theresienwiese','Universität','Westfriedhof',
  ].sort(),
  'Гамбург': [
    'Altona','Barmbek','Berliner Tor','Billstedt','Farmsen',
    'Hammerbrook','Hauptbahnhof','Jungfernstieg','Kellinghusenstraße',
    'Landungsbrücken','Lübecker Straße','Niendorf Nord','Rathaus',
    'Rödingsmarkt','Stephansplatz','Überseequartier','Volksdorf',
    'Wandsbek-Markt',
  ].sort(),
  'Франкфурт': [
    'Bockenheimer Warte','Bornheim Mitte','Eckenheim','Eschenheimer Tor',
    'Festhalle/Messe','Ginnheim','Hauptbahnhof','Hauptwache',
    'Konstablerwache','Nordwestzentrum','Ostend','Römer',
    'Sachsenhausen Nord','Südbahnhof','Theaterplatz',
    'Willy-Brandt-Platz',
  ].sort(),
  'Кёльн': [
    'Appellhofplatz','Barbarossaplatz','Bonner Wall','Dom/Hauptbahnhof',
    'Ebertplatz','Hauptbahnhof','Heumarkt','Kalk Post',
    'Mülheimer Freiheit','Neumarkt','Rudolfplatz','Severinstraße',
    'Wiener Platz','Zülpicher Platz',
  ].sort(),
  'Дюссельдорф': [
    'Benrath','Bilk','Düsseldorf Flughafen','Graf-Adolf-Platz',
    'Hauptbahnhof','Heinrich-Heine-Allee','Jan-Wellem-Platz',
    'Oberbilk','Oststraße','Pempelfort','Wehrhahn',
  ].sort(),
  'Лондон': [
    'Baker Street','Bank','Bond Street','Brixton','Canary Wharf',
    'Elephant & Castle','Green Park','Hammersmith','King\'s Cross St. Pancras',
    'Knightsbridge','Leicester Square','Liverpool Street','London Bridge',
    'Oxford Circus','Paddington','Piccadilly Circus','Shepherd\'s Bush',
    'Shoreditch High Street','Stratford','Victoria','Waterloo','Westminster',
  ].sort(),
  'Манчестер': [
    'Deansgate-Castlefield','Exchange Square','Market Street',
    'Piccadilly','Piccadilly Gardens','Salford Crescent',
    'Shudehill','St Peter\'s Square','Victoria',
  ],
  'Ливерпуль': [
    'Central','Conway Park','Hamilton Square','James Street',
    'Lime Street','Moorfields','Sandhills',
  ],
  'Глазго': [
    'Bridge Street','Buchanan Street','Cessnock','Cowcaddens',
    'Govan','Hillhead','Ibrox','Kelvinbridge','Kelvinhall',
    'Partick','Patrick','St. Enoch','West Street',
  ],
  'Нью-Йорк': [
    '42nd Street-Times Square','49th Street','59th Street-Columbus Circle',
    '72nd Street','86th Street','Atlantic Ave-Barclays Center',
    'Canal Street','Chambers Street','Coney Island','Court Square',
    'DeKalb Ave','Fulton Center','Grand Central-42nd Street',
    'High Street','Jamaica','JFK Airport','Lexington Ave-59th Street',
    'Penn Station','Roosevelt Island','Union Square-14th Street',
    'Wall Street','World Trade Center',
  ].sort(),
  'Лос-Анджелес': [
    '7th Street/Metro Center','Aviation/LAX','Culver City',
    'El Monte','Hollywood/Highland','Hollywood/Vine',
    'Long Beach Transit Mall','North Hollywood','Norwalk',
    'Pershing Square','Pico','Rosa Parks','Union Station',
    'Universal City','Westlake/MacArthur Park','Wilshire/Vermont',
  ].sort(),
  'Чикаго': [
    'Addison','Belmont','Chicago','Clark/Lake','Damen','Davis',
    'Evanston','Fullerton','Grand','Harold Washington Library',
    'Howard','Jackson','Midway','Monroe','O\'Hare','Oak Park',
    'Quincy','Roosevelt','State/Lake','UIC-Halsted',
  ].sort(),
  'Вашингтон': [
    'Bethesda','Branch Ave','Capitol South','Cleveland Park',
    'Columbia Heights','Dupont Circle','Eastern Market',
    'Farragut North','Farragut West','Federal Triangle',
    'Foggy Bottom','Fort Totten','Gallery Place','Greenbelt',
    'Judiciary Square','L\'Enfant Plaza','Largo Town Center',
    'McPherson Square','Metro Center','Pentagon','Reagan National Airport',
    'Rhode Island Ave','Shady Grove','Silver Spring','Union Station',
    'Vienna/Fairfax','Woodley Park',
  ].sort(),
  'Сан-Франциско': [
    '12th Street Oakland','16th Street Mission','19th Street Oakland',
    '24th Street Mission','Antioch','Balboa Park','Bay Fair',
    'Castro Valley','Civic Center','Coliseum','Concord','Daly City',
    'Dublin/Pleasanton','Embarcadero','Fremont','Fruitvale',
    'Glen Park','Lake Merritt','MacArthur','Millbrae','Montgomery',
    'North Berkeley','Oakland International Airport','Orinda',
    'Pleasant Hill','Powell','Richmond','Rockridge','San Bruno',
    'SFO Airport','South Hayward','South San Francisco','Union City',
    'Walnut Creek','West Dublin',
  ].sort(),
  'Майами': [
    'Allapattah','Airport','Brickell','Brownsville','Civic Center',
    'Coconut Grove','Culmer','Dadeland North','Dadeland South',
    'Douglas Road','Dr. Martin Luther King Jr. Plaza','Earlington Heights',
    'Government Center','Hialeah','Northside','Okeechobee',
    'Overtown/Arena','Palmetto','Santa Clara','South Miami',
    'Tri-Rail/Metrorail Transfer','Vizcaya',
  ].sort(),
  'Сеул': [
    'City Hall','Dongdaemun History & Culture Park','Express Bus Terminal',
    'Gangnam','Gimpo International Airport','Gyeongbokgung',
    'Hapjeong','Hongik University','Incheon International Airport',
    'Insadong','Itaewon','Jamsil','Jonggak','Konkuk University',
    'Mapo','Myeongdong','Samsung','Sangbong','Sascheon',
    'Seoul Station','Sinchon','Sindorim','Sinsa','Sunae',
    'Wangshipni','Yeouido',
  ].sort(),
  'Пусан': [
    'Busan Station','Centum City','Gwangalli','Haeundae',
    'Jungang','Nampo','Nampodong','Seomyeon','Shin Gyeongju',
    'Suyeong','Yangsan',
  ].sort(),
  'Инчхон': [
    'Bupyeong','Dongam','Ganseok','Incheon City Hall',
    'International Business District','Juan','Woninjae',
  ],
  'Тэгу': [
    'Banwoldang','Daegu Station','Dongdaegu Station',
    'Duryu','Myeongdeok','Sincheon',
  ],
  'Тэджон': [
    'Daejeon Station','Government Complex Daejeon',
    'Jungangno','Tongil','Yongmun',
  ],
  'Кванджу': [
    'Culture Complex','Gwangju Station','Nongseong','Sonjeong',
  ],
}
