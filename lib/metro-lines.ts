export type MetroLineData = { color: string; name: string; stations: string[] }

export const CITY_METRO_LINES: Record<string, MetroLineData[]> = {

  // ─── РОССИЯ ───────────────────────────────────────────────────────────────
  'Москва': [
    { color: '#EF3124', name: 'Сокольническая', stations: ['Бульвар Рокоссовского','Черкизовская','Преображенская площадь','Сокольники','Красносельская','Комсомольская','Красные Ворота','Чистые пруды','Лубянка','Охотный Ряд','Библиотека имени Ленина','Кропоткинская','Парк культуры','Фрунзенская','Спортивная','Воробьёвы горы','Университет','Проспект Вернадского','Юго-Западная','Тропарёво','Румянцево','Саларьево','Филатов Луг','Прокшино','Ольховая','Коммунарка'] },
    { color: '#4DB94D', name: 'Замоскворецкая', stations: ['Речной вокзал','Водный стадион','Войковская','Сокол','Аэропорт','Динамо','Белорусская','Маяковская','Тверская','Театральная','Новокузнецкая','Павелецкая','Автозаводская','Технопарк','Коломенская','Каширская','Кантемировская','Царицыно','Орехово','Домодедовская','Красногвардейская','Алма-Атинская'] },
    { color: '#0078BE', name: 'Арбатско-Покровская', stations: ['Пятницкое шоссе','Митино','Волоколамская','Мякинино','Строгино','Крылатское','Молодёжная','Кунцевская','Славянский бульвар','Парк Победы','Киевская','Смоленская','Арбатская','Александровский сад','Площадь Революции','Курская','Бауманская','Электрозаводская','Семёновская','Партизанская','Измайловская','Первомайская','Щёлковская'] },
    { color: '#894E35', name: 'Кольцевая', stations: ['Парк культуры','Октябрьская','Добрынинская','Павелецкая','Таганская','Курская','Комсомольская','Проспект Мира','Новослободская','Белорусская','Краснопресненская','Киевская','Парк культуры'] },
    { color: '#F77F00', name: 'Калужско-Рижская', stations: ['Медведково','Бабушкинская','Свиблово','Ботанический сад','ВДНХ','Алексеевская','Рижская','Проспект Мира','Сухаревская','Тургеневская','Китай-город','Третьяковская','Октябрьская','Ленинский проспект','Шаболовская','Академическая','Профсоюзная','Новые Черёмушки','Калужская','Беляево','Коньково','Тёплый стан','Ясенево','Битцевский парк'] },
    { color: '#9A2785', name: 'Таганско-Краснопресненская', stations: ['Планерная','Сходненская','Тушинская','Спартак','Щукинская','Октябрьское поле','Полежаевская','Беговая','Улица 1905 года','Краснопресненская','Баррикадная','Пушкинская','Кузнецкий Мост','Таганская','Пролетарская','Волгоградский проспект','Текстильщики','Кузьминки','Рязанский проспект','Выхино','Лермонтовский проспект','Жулебино','Котельники'] },
    { color: '#FFD702', name: 'Калининско-Солнцевская', stations: ['Рассказовка','Новопеределкино','Боровское шоссе','Солнцево','Говорово','Мичуринский проспект','Очаково','Озёрная','Новаторская','Воронцовская','Зюзино','Нагатинский затон','Печатники','Текстильщики','Авиамоторная','Шоссе Энтузиастов','Андроновка','Нижегородская','Стахановская','Окская','Юго-Восточная','Косино','Лухмановская','Некрасовка'] },
    { color: '#999999', name: 'Серпуховско-Тимирязевская', stations: ['Алтуфьево','Бибирево','Отрадное','Владыкино','Петровско-Разумовская','Тимирязевская','Дмитровская','Савёловская','Менделеевская','Цветной бульвар','Чеховская','Боровицкая','Полянка','Серпуховская','Тульская','Нагатинская','Нагорная','Нахимовский проспект','Севастопольская','Чертановская','Южная','Пражская','Улица Академика Янгеля','Аннино','Бульвар Дмитрия Донского'] },
    { color: '#B4D445', name: 'Люблинско-Дмитровская', stations: ['Селигерская','Верхние Лихоборы','Окружная','Петровско-Разумовская','Фонвизинская','Бутырская','Марьина Роща','Достоевская','Трубная','Сретенский бульвар','Чкаловская','Римская','Крестьянская застава','Дубровка','Кожуховская','Печатники','Волжская','Люблино','Братиславская','Марьино','Борисово','Шипиловская','Зябликово'] },
    { color: '#82C0C0', name: 'Большая кольцевая', stations: ['Савёловская','Рижская','Проспект Мира','Электрозаводская','Авиамоторная','Нижегородская','Текстильщики','Печатники','Нагатинский затон','Нагорная','Варшавская','Каховская','Зюзино','Новаторская','Воронцовская','Мичуринский проспект','Аминьевская','Кунцевская','Давыдково','Можайская','Терехово','Хорошёво','Народное Ополчение','Карамышевская','Стрешнево','Балтийская','Коптево','Лихоборы'] },
    { color: '#FF0096', name: 'МЦК', stations: ['Лужники','Кутузовская','Деловой центр','Шелепиха','Хорошёво','Зорге','Балтийская','Стрешнево','Коптево','Лихоборы','Окружная','Владыкино','Ботанический сад','Белокаменная','Бульвар Рокоссовского','Локомотив','Измайлово','Соколиная Гора','Шоссе Энтузиастов','Андроновка','Нижегородская','Перово','Новохохловская','Угрешская','Дубровка','Автозаводская','ЗИЛ','Верхние Котлы','Крымская','Площадь Гагарина','Лужники'] },
  ],

  'Санкт-Петербург': [
    { color: '#EF3124', name: 'Кировско-Выборгская', stations: ['Девяткино','Гражданский проспект','Академическая','Политехническая','Площадь Мужества','Лесная','Выборгская','Площадь Ленина','Чернышевская','Площадь Восстания','Владимирская','Пушкинская','Технологический институт','Балтийская','Нарвская','Кировский завод','Автово','Ленинский проспект','Проспект Ветеранов'] },
    { color: '#0078BE', name: 'Московско-Петроградская', stations: ['Парнас','Проспект Просвещения','Озерки','Удельная','Пионерская','Чёрная речка','Петроградская','Горьковская','Невский проспект','Сенная площадь','Технологический институт','Фрунзенская','Московские ворота','Электросила','Парк Победы','Московская','Звёздная','Купчино'] },
    { color: '#4DB94D', name: 'Невско-Василеостровская', stations: ['Беговая','Новокрестовская','Приморская','Василеостровская','Гостиный двор','Маяковская','Площадь Александра Невского','Елизаровская','Ломоносовская','Пролетарская','Обухово','Рыбацкое'] },
    { color: '#F77F00', name: 'Правобережная', stations: ['Спасская','Достоевская','Лиговский проспект','Площадь Александра Невского','Новочеркасская','Ладожская','Проспект Большевиков','Улица Дыбенко'] },
    { color: '#9A2785', name: 'Фрунзенско-Приморская', stations: ['Комендантский проспект','Старая деревня','Крестовский остров','Чкаловская','Спортивная','Адмиралтейская','Садовая','Звенигородская','Обводный канал','Волковская','Бухарестская','Международная','Проспект Славы','Дунайская','Шушары'] },
  ],

  'Екатеринбург': [
    { color: '#0078BE', name: 'Екатеринбургский метрополитен', stations: ['Проспект Космонавтов','Уралмаш','Машиностроителей','Уральская','Динамо','Площадь 1905 года','Геологическая','Чкаловская','Ботаническая'] },
  ],

  'Новосибирск': [
    { color: '#EF3124', name: 'Ленинская', stations: ['Студенческая','Речной вокзал','Красный проспект','Площадь Ленина','Октябрьская','Берёзовая роща','Заельцовская'] },
    { color: '#0078BE', name: 'Дзержинская', stations: ['Площадь Гарина-Михайловского','Сибирская','Маршала Покрышкина','Берёзовая роща','Гагаринская','Дзержинская','Золотая Нива'] },
  ],

  'Казань': [
    { color: '#0078BE', name: 'Казанский метрополитен', stations: ['Авиастроительная','Северный вокзал','Яшьлек','Козья слобода','Кремлёвская','Площадь Тукая','Суконная слобода','Аметьево','Горки','Проспект Победы','Дубравная'] },
  ],

  // ─── ГЕРМАНИЯ ─────────────────────────────────────────────────────────────
  'Берлин': [
    { color: '#007A47', name: 'U1/U3', stations: ['Uhlandstraße','Kurfürstendamm','Wittenbergplatz','Nollendorfplatz','Gleisdreieck','Möckernbrücke','Hallesches Tor','Prinzenstraße','Kottbusser Tor','Görlitzer Bahnhof','Schlesisches Tor','Warschauer Straße'] },
    { color: '#EF3124', name: 'U2', stations: ['Ruhleben','Theodor-Heuss-Platz','Kaiserdamm','Sophie-Charlotte-Platz','Bismarckstraße','Deutsche Oper','Ernst-Reuter-Platz','Zoologischer Garten','Wittenbergplatz','Nollendorfplatz','Bülowstraße','Gleisdreieck','Potsdamer Platz','Stadtmitte','Hausvogteiplatz','Spittelmarkt','Märkisches Museum','Klosterstraße','Alexanderplatz','Schillingstraße','Frankfurter Tor','Samariterstraße','Frankfurter Allee','Magdalenenstraße','Lichtenberg','Pankow'] },
    { color: '#F77F00', name: 'U5', stations: ['Hauptbahnhof','Bundestag','Brandenburger Tor','Unter den Linden','Museumsinsel','Berliner Rathaus','Alexanderplatz','Schillingstraße','Frankfurter Tor','Samariterstraße','Frankfurter Allee','Magdalenenstraße','Lichtenberg','Friedrichsfelde','Tierpark','Biesdorf-Süd','Elsterwerdaer Platz','Wuhletal','Kaulsdorf-Nord','Hellersdorf','Louis-Lewin-Straße','Hönow'] },
    { color: '#9A2785', name: 'U6', stations: ['Alt-Tegel','Borsigwerke','Holzhauser Straße','Otisstraße','Scharnweberstraße','Kurt-Schumacher-Platz','Afrikanische Straße','Rehberge','Seestraße','Leopoldplatz','Wedding','Reinickendorfer Straße','Schwartzkopffstraße','Naturkundemuseum','Oranienburger Tor','Friedrichstraße','Unter den Linden','Stadtmitte','Kochstraße','Hallesches Tor','Mehringdamm','Platz der Luftbrücke','Paradestraße','Tempelhof','Alt-Tempelhof','Kaiserin-Augusta-Straße','Ullsteinstraße','Westphalweg','Alt-Mariendorf'] },
    { color: '#0078BE', name: 'U7', stations: ['Spandau','Zitadelle','Haselhorst','Paulsternstraße','Rohrdamm','Siemensdamm','Halemweg','Jakobsstraße','Jungfernheide','Mierendorffplatz','Richard-Wagner-Platz','Bismarckstraße','Wilmersdorfer Straße','Adenauerplatz','Fehrbelliner Platz','Berliner Straße','Bayerischer Platz','Eisenacher Straße','Kleistpark','Yorckstraße','Mehringdamm','Gneisenaustraße','Südstern','Hermannplatz','Rathaus Neukölln','Karl-Marx-Straße','Neukölln','Grenzallee','Blaschkoallee','Parchimer Allee','Britz-Süd','Johannisthaler Chaussee','Lipschitzallee','Wutzkyallee','Zwickauer Damm','Rudow'] },
    { color: '#B4D445', name: 'U8', stations: ['Wittenau','Rathaus Reinickendorf','Karl-Bonhoeffer-Nervenklinik','Lindauer Allee','Paracelsus-Bad','Residenzstraße','Franz-Neumann-Platz','Osloer Straße','Pankstraße','Gesundbrunnen','Voltastraße','Bernauer Straße','Rosenthaler Platz','Weinmeisterstraße','Alexanderplatz','Jannowitzbrücke','Heinrich-Heine-Straße','Moritzplatz','Kottbusser Tor','Schönleinstraße','Boddinstraße','Leinestraße','Hermannstraße'] },
    { color: '#82C0C0', name: 'U9', stations: ['Osloer Straße','Nauener Platz','Leopoldplatz','Amrumer Straße','Westhafen','Birkenstraße','Turmstraße','Hansaplatz','Zoologischer Garten','Kurfürstendamm','Spichernstraße','Güntzelstraße','Berliner Straße','Friedrich-Wilhelm-Platz','Walther-Schreiber-Platz','Rathaus Steglitz','Schloßstraße'] },
  ],

  'Мюнхен': [
    { color: '#EF3124', name: 'U1/U7', stations: ['Olympia-Einkaufszentrum','Moosach','Westfriedhof','Gern','Neuhausen','Rotkreuzplatz','Maillingerstraße','Stiglmaierplatz','Hauptbahnhof','Sendlinger Tor','Kolumbusplatz','Wettersteinplatz','Silberhornstraße','Candidstraße','Schwanseestraße','Mangfallplatz'] },
    { color: '#0078BE', name: 'U2/U8', stations: ['Feldmoching','Hasenbergl','Dülferstraße','Georg-Brauchle-Ring','Olympiazentrum','Petuelring','Scheidplatz','Josephsplatz','Königsplatz','Hauptbahnhof','Sendlinger Tor','Fraunhoferstraße','Kolumbusplatz','Silberhornstraße','Giesing','Karl-Preis-Platz','Innsbrucker Ring','Josephsburg','Kreillerstraße','Steinhausen','Messestadt West','Messestadt Ost'] },
    { color: '#F77F00', name: 'U3/U6', stations: ['Moosach','Olympia-Einkaufszentrum','Oberwiesenfeld','Olympiazentrum','Petuelring','Scheidplatz','Münchner Freiheit','Giselastraße','Universität','Odeonsplatz','Marienplatz','Sendlinger Tor','Goetheplatz','Implerstraße','Brudermühlstraße','Thalkirchen','Obersendling','Aidenbachstraße','Basler Straße','Fürstenried West'] },
    { color: '#4DB94D', name: 'U4/U5', stations: ['Westendstraße','Schwanthalerhöhe','Theresienwiese','Hauptbahnhof','Karlsplatz','Odeonsplatz','Lehel','Max-Weber-Platz','Richard-Strauss-Straße','Arabellapark','Englschalking','Quiddestraße','Neuperlach Süd'] },
    { color: '#82C0C0', name: 'U6 Nord', stations: ['Garching-Forschungszentrum','Garching','Fröttmaning','Kieferngarten','Studentenstadt','Alte Heide','Nordfriedhof','Dietlindenstraße','Münchner Freiheit','Giselastraße','Universität','Odeonsplatz','Marienplatz'] },
  ],

  'Гамбург': [
    { color: '#0078BE', name: 'U1', stations: ['Norderstedt Mitte','Garstedt','Ochsenzoll','Kiwittsmoor','Langenhorn Nord','Langenhorn Markt','Fuhlsbüttel Nord','Fuhlsbüttel','Ohlsdorf','Lattenkamp','Klein Borstel','Alsterdorf','Sengelmannstraße','Kellinghusenstraße','Klosterstern','Hallerstraße','Stephansplatz','Jungfernstieg','Hauptbahnhof Nord','Mönckebergstraße','Steinstraße','Lohmühlenstraße','Meßberg','Rödingsmarkt','Stadthausbrücke','Gänsemarkt','Schlump','Osterstraße','Hagenbecks Tierpark','Stellingen','Eidelstedt','Niendorf Nord','Niendorf Markt'] },
    { color: '#EF3124', name: 'U2/U4', stations: ['Niendorf Markt','Niendorf Nord','Hagenbecks Tierpark','Schlump','Christuskirche','Gänsemarkt','Jungfernstieg','Hauptbahnhof','Berliner Tor','Hammer Kirche','Rauhes Haus','Wandsbek Markt','Wandsbeker Chaussee','Merkenstraße','Steinfurther Allee','Mümmelmannsberg','Billstedt','Billwerder-Moorfleet','Horner Rennbahn','Legienstraße','Burgstraße','Hammerbrook','HafenCity Universität','Elbbrücken'] },
    { color: '#4DB94D', name: 'U3', stations: ['Barmbek','Habichtstraße','Mundsburg','Uhlandstraße','Wandsbek Markt','Rauhes Haus','Burgstraße','Hammerbrook','Hauptbahnhof Süd','Mönckebergstraße','Rathaus','Jungfernstieg','Rödingsmarkt','Baumwall','Landungsbrücken','Königstraße','Altona','Bahrenfeld','Othmarschen','Hausbruch','Stellingen'] },
  ],

  'Франкфурт': [
    { color: '#EF3124', name: 'U1/U2/U3', stations: ['Ginnheim','Dornbusch','Miquel-/Adickesallee','Holzhausenstraße','Eschenheimer Tor','Hauptwache','Konstablerwache','Ostendstraße','Merianplatz','Bornheim Mitte','Seckbacher Landstraße','Enkheim','Schäfflestraße'] },
    { color: '#0078BE', name: 'U4/U5', stations: ['Bockenheimer Warte','Festhalle/Messe','Römer/Paulskirche','Dom/Römer','Willy-Brandt-Platz','Konstablerwache','Merianplatz','Habsburgerallee','Seckbacher Landstraße','Preungesheim','Frankfurter Berg'] },
    { color: '#4DB94D', name: 'U6/U7', stations: ['Hausen','Industriehof','Kirchplatz','Rohrbachstraße','Praunheim','Bonames','Nieder-Eschbach','Kalbach','Riedberg','Ginnheim','Dornbusch','Hauptwache','Südbahnhof','Sachsenhausen','Stresemannallee','Südbahnhof','Fechenheim'] },
    { color: '#9A2785', name: 'U8/U9', stations: ['Nieder-Eschbach','Heddernheim','Nordwestzentrum','Weißer Stein','Praunheim','Eschenheimer Tor','Konstablerwache','Bornheim','Seckbacher Landstraße'] },
  ],

  'Кёльн': [
    { color: '#EF3124', name: 'U1/U7/U9', stations: ['Bensberg','Refrath','Frankenforst','Lustheide','Fettehenne','Moitzfeld','Herkenrath','Brück','Merheim','Ostheim','Buchforst','Mülheim Wiener Platz','Dom/Hbf','Appellhofplatz','Friesenplatz','Rudolfplatz','Zülpicher Platz','Universität/Aachener Str.','Lindenthal','Klettenberg','Sülz/Hermeskeiler Platz','Deckstein','Militärring','Dürener Straße','Maarweg','Aachener Straße/Gürtel','Weiden West'] },
    { color: '#0078BE', name: 'U3/U4', stations: ['Junkersdorf','Militärring','Weiden West','Ossendorf','Ossendorf/Industriestr','Bocklemünd','Weidenpescher Park','Longerich','Nußbaumer Straße','Neusser Straße/Gürtel','Wilhelmplatz','Ebertplatz','Dom/Hbf','Heumarkt','Deutz/Messe','Deutz/Fachhochschule','Bf Deutz/LANXESS arena','Vingst','Ostheim','Buchheim'] },
  ],

  'Дюссельдорф': [
    { color: '#EF3124', name: 'U70/U74/U75/U76/U77', stations: ['Krefeld Hbf','Krefeld Rheinstraße','Krefeld Stadtmitte','Krefeld Hauptbahnhof','Vinnhorst','Meerbusch','Düsseldorf Flughafen Terminal','Düsseldorf Flughafen','Theodor-Heuss-Brücke','Belsenplatz','Victoriaplatz','Nordstraße','Pempelforter Straße','Steinstraße/Königsallee','Heinrich-Heine-Allee','Benrather Straße','Tonhalle/Ehrenhof','Landskrone','Jan-Wellem-Platz','Kirchplatz','Bilk','Opernhaus','Schadowstraße','Corneliusstraße','Klosterstraße','Düsseldorf Hbf','Oberbilk','Philippstraße','Holthausen','Wersten','Benrath'] },
  ],

  // ─── АНГЛИЯ ───────────────────────────────────────────────────────────────
  'Лондон': [
    { color: '#0078BE', name: 'Piccadilly', stations: ['Heathrow T5','Heathrow T2&3','Hatton Cross','Hounslow West','Hounslow Central','Hounslow East','Osterley','Boston Manor','Northfields','South Ealing','Acton Town','Turnham Green','Stamford Brook','Ravenscourt Park','Hammersmith','Barons Court','West Kensington','Earls Court','Gloucester Road','South Kensington','Knightsbridge','Hyde Park Corner','Green Park','Piccadilly Circus','Leicester Square','Covent Garden','Holborn','Russell Square','King\'s Cross St Pancras','Caledonian Road','Holloway Road','Arsenal','Finsbury Park','Manor House','Turnpike Lane','Wood Green','Bounds Green','Arnos Grove','Southgate','Oakwood','Cockfosters'] },
    { color: '#EF3124', name: 'Central', stations: ['West Ruislip','Ruislip Gardens','South Ruislip','Northolt','Greenford','Perivale','Hanger Lane','North Acton','East Acton','White City','Shepherd\'s Bush','Holland Park','Notting Hill Gate','Queensway','Lancaster Gate','Marble Arch','Bond Street','Oxford Circus','Tottenham Court Road','Holborn','Chancery Lane','St Paul\'s','Bank','Liverpool Street','Bethnal Green','Mile End','Stratford','Leyton','Leytonstone','Wanstead','Redbridge','Gants Hill','Newbury Park','Barkingside','Fairlop','Hainault','Chigwell','Grange Hill','Woodford','South Woodford','Snaresbrook'] },
    { color: '#000000', name: 'Northern', stations: ['Edgware','Burnt Oak','Colindale','Hendon Central','Brent Cross','Golders Green','Hampstead','Belsize Park','Chalk Farm','Camden Town','Mornington Crescent','Euston','Warren Street','Goodge Street','Tottenham Court Road','Leicester Square','Charing Cross','Embankment','Waterloo','London Bridge','Borough','Elephant & Castle','Kennington','Oval','Stockwell','Clapham North','Clapham Common','Clapham South','Balham','Tooting Bec','Tooting Broadway','Colliers Wood','South Wimbledon','Morden'] },
    { color: '#9A2785', name: 'Jubilee', stations: ['Stanmore','Canons Park','Queensbury','Kingsbury','Wembley Park','Neasden','Dollis Hill','Willesden Green','Kilburn','West Hampstead','Finchley Road','Swiss Cottage','St John\'s Wood','Baker Street','Bond Street','Green Park','Westminster','Waterloo','London Bridge','Bermondsey','Canada Water','Canary Wharf','North Greenwich','Canning Town','West Ham','Stratford'] },
    { color: '#0077C8', name: 'Victoria', stations: ['Brixton','Stockwell','Vauxhall','Pimlico','Victoria','Green Park','Oxford Circus','Warren Street','Euston','King\'s Cross St Pancras','Highbury & Islington','Finsbury Park','Seven Sisters','Tottenham Hale','Blackhorse Road','Walthamstow Central'] },
    { color: '#F77F00', name: 'Overground/Elizabeth', stations: ['Reading','Twyford','Maidenhead','Taplow','Burnham','Slough','Langley','Iver','West Drayton','Hayes & Harlington','Southall','Hanwell','West Ealing','Ealing Broadway','Acton Main Line','West Acton','North Acton','Paddington','Bond Street','Tottenham Court Road','Farringdon','Liverpool Street','Whitechapel','Canary Wharf','Custom House','Woolwich','Abbey Wood'] },
  ],

  'Манчестер': [
    { color: '#F77F00', name: 'Metrolink', stations: ['Altrincham','Navigation Road','Timperley','Brooklands','Sale','Dane Road','Stretford','Old Trafford','Trafford Bar','Cornbrook','Deansgate-Castlefield','St Peter\'s Square','Market Street','Piccadilly Gardens','Piccadilly','Victoria','Shudehill','Exchange Square','Piccadilly Gardens','Manchester Airport','Benchill','Wythenshawe Town Centre','Woodhouse Park','Martinscroft','Altrincham'] },
  ],

  'Ливерпуль': [
    { color: '#4DB94D', name: 'Merseyrail Northern', stations: ['Southport','Meols Cop','Hillside','Birkdale','Ainsdale','Formby','Freshfield','Hall Road','Hightown','Blundellsands & Crosby','Waterloo','Seaforth & Litherland','Bootle New Strand','Bootle Oriel Road','Bank Hall','Kirkdale','Sandhills','Moorfields','Liverpool Central','James Street','Hamilton Square','Conway Park','Birkenhead Central','Birkenhead Park','Rock Ferry'] },
    { color: '#0078BE', name: 'Merseyrail Wirral', stations: ['West Kirby','Hoylake','Manor Road','Meols','Moreton','Leasowe','Bidston','Birkenhead North','Birkenhead Park','Conway Park','Hamilton Square','James Street','Liverpool Central','Moorfields','Sandhills','Liverpool Central'] },
  ],

  'Глазго': [
    { color: '#F77F00', name: 'Glasgow Subway', stations: ['Govan','Ibrox','Cessnock','Kinning Park','Shields Road','West Street','Bridge Street','St Enoch','Buchanan Street','Cowcaddens','St George\'s Cross','Kelvinbridge','Hillhead','Kelvinhall','Partick','Exhibition Centre','Govan'] },
  ],

  // ─── АМЕРИКА ──────────────────────────────────────────────────────────────
  'Нью-Йорк': [
    { color: '#EF3124', name: '1/2/3 Broadway', stations: ['Van Cortlandt Park','Marble Hill','Riverdale','Spuyten Duyvil','215 St','Inwood-207 St','207 St','Dyckman St','190 St','181 St','175 St','168 St','157 St','145 St','137 St City College','125 St','116 St Columbia','Cathedral Pkwy','103 St','96 St','86 St','79 St','72 St','66 St Lincoln Center','59 St Columbus Circle','50 St','Times Sq-42 St','34 St Penn Station','28 St','23 St','18 St','14 St','Christopher St','Houston St','Canal St','Franklin St','Chambers St','Fulton St','Wall St','Rector St','South Ferry'] },
    { color: '#4DB94D', name: '4/5/6 Lexington', stations: ['Woodlawn','Mosholu Pkwy','Norwood-205 St','Bedford Park Blvd','Kingsbridge Rd','Fordham Rd','E 180 St','177-178 Sts','174-175 Sts','Burnside Ave','170 St','167 St','161 St Yankee Stadium','149 St Grand Concourse','138 St-Grand Concourse','125 St','116 St','110 St','103 St','96 St','86 St','77 St','68 St Hunter College','59 St','51 St','Grand Central-42 St','33 St','28 St','23 St','14 St-Union Sq','Astor Pl','Bleecker St','Spring St','Canal St','Brooklyn Bridge-City Hall','Fulton St','Wall St','Bowling Green','Borough Hall','Atlantic Ave-Barclays Ctr','Nevins St','Bergen St','Carroll St','Smith-9 Sts','4 Av-9 St'] },
    { color: '#F77F00', name: 'N/Q/R/W Broadway', stations: ['Astoria-Ditmars Blvd','Astoria Blvd','30 Av','Broadway','36 Av','39 Av','Queensboro Plaza','Court Sq','Lexington Av/59 St','Queensboro Plaza','5 Av/59 St','57 St-7 Av','49 St','Times Sq-42 St','34 St Herald Sq','28 St','23 St','Union Sq','8 St-NYU','Prince St','Canal St','City Hall','Rector St','Whitehall St','Court St','Jay St','DeKalb Av','Atlantic Av','36 St','Bay Ridge Av','Bay Ridge-95 St'] },
    { color: '#0078BE', name: 'A/C/E 8th Avenue', stations: ['Inwood-207 St','Dyckman St','190 St','181 St','175 St','168 St','163 St','155 St','145 St','135 St','125 St','116 St','110 St','103 St','96 St','86 St','81 St','72 St','59 St Columbus Circle','50 St','42 St Port Authority','34 St Penn Station','23 St','14 St','W 4 St','Spring St','Canal St','Chambers St','Fulton St','Broadway-Nassau','High St','Jay St','Hoyt-Schermerhorn','Bergen St','Carroll St','Smith-9 Sts','Howard Beach','JFK Airport'] },
  ],

  'Чикаго': [
    { color: '#EF3124', name: 'Red Line', stations: ['Howard','Jarvis','Morse','Loyola','Granville','Thorndale','Bryn Mawr','Berwyn','Argyle','Lawrence','Wilson','Sheridan','Addison','Belmont','Fullerton','North/Clybourn','Clark/Division','Chicago','Grand','Lake','Monroe','Jackson','Harrison','Cermak-Chinatown','Sox-35th','47th','Garfield','63rd','69th','79th','87th','95th/Dan Ryan'] },
    { color: '#0078BE', name: 'Blue Line', stations: ['O\'Hare','Rosemont','Cumberland','Harlem','Jefferson Park','Montrose','Irving Park','Addison','Belmont','Logan Square','California','Western','Damen','Division','Chicago','Grand','Clark/Lake','Washington','Monroe','Jackson','LaSalle','Clinton','UIC-Halsted','Racine','Illinois Medical District','Western','Kedzie-Homan','Pulaski','Cicero','Austin','Oak Park','Harlem','Forest Park'] },
    { color: '#4DB94D', name: 'Green Line', stations: ['Harlem/Lake','Oak Park','Ridgeland','Austin','Central','Laramie','Cicero','Pulaski','Conservatory','Kedzie','California','Ashland','Morgan','Clinton','Lake','State/Lake','Randolph/Wabash','Adams/Wabash','Roosevelt','35th-Bronzeville-IIT','43rd','47th','51st','Garfield','Halsted','King Dr','Cottage Grove','East 63rd-Cottage Grove'] },
    { color: '#F77F00', name: 'Orange Line', stations: ['Midway','Kedzie','Western','35th-Archer','Ashland','Halsted','Roosevelt','Harold Washington Library','LaSalle/Van Buren','Quincy','Washington/Wells','Clark/Lake','State/Lake','Randolph/Wabash','Adams/Wabash','Harold Washington Library','Library'] },
  ],

  'Вашингтон': [
    { color: '#EF3124', name: 'Red Line', stations: ['Shady Grove','Rockville','Twinbrook','White Flint','Grosvenor-Strathmore','Medical Center','Bethesda','Friendship Heights','Tenleytown','Van Ness-UDC','Cleveland Park','Woodley Park','Dupont Circle','Farragut North','Metro Center','Gallery Place','Judiciary Square','Union Station','NoMa-Gallaudet','Rhode Island Ave','Brookland-CUA','Fort Totten','Takoma','Silver Spring','Forest Glen','Wheaton','Glenmont'] },
    { color: '#0078BE', name: 'Blue/Orange/Silver', stations: ['Largo Town Center','Morgan Boulevard','Addison Road','Capitol Heights','Benning Road','Stadium-Armory','Potomac Ave','Eastern Market','Capitol South','Federal Center SW','L\'Enfant Plaza','Smithsonian','Federal Triangle','Metro Center','McPherson Square','Farragut West','Foggy Bottom','Rosslyn','Court House','Clarendon','Virginia Square','Ballston','East Falls Church','West Falls Church','Dunn Loring','Vienna','Franconia-Springfield','Van Dorn Street','King Street-Old Town','Braddock Road','Reagan National Airport','Crystal City','Pentagon City','Pentagon','Arlington Cemetery'] },
    { color: '#4DB94D', name: 'Green/Yellow', stations: ['Branch Ave','Suitland','Naylor Road','Southern Avenue','Congress Heights','Anacostia','Navy Yard','Waterfront','L\'Enfant Plaza','Archives','Gallery Place','Mount Vernon Sq','Shaw-Howard U','U Street','Columbia Heights','Georgia Ave','Fort Totten','West Hyattsville','Prince George\'s Plaza','College Park','Greenbelt','Huntington','Eisenhower Ave','Van Dorn Street'] },
  ],

  'Сан-Франциско': [
    { color: '#0078BE', name: 'BART', stations: ['Antioch','Pittsburg Center','Pittsburg/Bay Point','North Concord','Concord','Pleasant Hill','Walnut Creek','Lafayette','Orinda','Rockridge','MacArthur','19th St Oakland','12th St Oakland','Lake Merritt','Fruitvale','Coliseum','San Leandro','Bay Fair','Castro Valley','West Dublin','Dublin/Pleasanton','Union City','Fremont','Warm Springs','Milpitas','Berryessa','Richmond','El Cerrito del Norte','El Cerrito Plaza','North Berkeley','Downtown Berkeley','Ashby','MacArthur','19th St Oakland','West Oakland','Embarcadero','Montgomery St','Powell St','Civic Center','16th St Mission','24th St Mission','Glen Park','Balboa Park','Daly City','Colma','South San Francisco','San Bruno','Millbrae','San Francisco Airport','Anza','San Antonio','Mountain View','Sunnyvale','Lawrence','Santa Clara','Berryessa'] },
  ],

  'Майами': [
    { color: '#F77F00', name: 'Metrorail', stations: ['Palmetto','Earlington Heights','Okeechobee','Brownsville','Dr Martin Luther King Jr','Northside','Allapattah','Santa Clara','Civic Center','Culmer','Overtown/Arena','Government Center','Brickell','Financial District','Vizcaya','Coconut Grove','Douglas Road','University','South Miami','Dadeland North','Dadeland South'] },
  ],

  // ─── КОРЕЯ ────────────────────────────────────────────────────────────────
  'Сеул': [
    { color: '#0078BE', name: 'Линия 1', stations: ['Soyosan','Dongducheon','Bosan','Dosol','Ora','Seongbuk','Deokgye','Yangju','Nakseo','Deokhak','Hoeryong','Cheongsan','Bakyangsa','Seojeong-ri','Mangwol-sa','Uijeongbu-buk','Uijeongbu','Hoeryong','Dobongsan','Mangwolsa','Dobong','Banghak','Nowon','Junggye','Hagyeong','Wolgye','Seongbuk','Chanmae','Ui-dong'] },
    { color: '#4DB94D', name: 'Линия 2 (кольцевая)', stations: ['Seongsu','Ttukseom','Konkuk University','Guui','Gangbyeon','Dangsan','Hapjeong','Hongik University','Sinchon','Ewha Womans University','Anam','City Hall','Euljiro 1-ga','Euljiro 3-ga','Euljiro 4-ga','Dongdaemun History','Sindang','Sangwangsimni','Wangsimni','Hanyang University','Ttukseom','Seongsu'] },
    { color: '#F77F00', name: 'Линия 3', stations: ['Daehwa','Juyeop','Jeongbalsan','Madu','Baekseok','Gupabal','Bul-gwang','Yeonsinnae','Eunhaeng','Suyu','Migeumjeong','Euireung','Dobongsan','Changdong','Nuri','Nowon','Taereung','Hwarang-dae','Sangbong','Jungnang','Mangu','Yongdap','Sinseol-dong','Dongmyo','Chungmuro','Gyeongbokgung','Anguk','Jongno 3-ga','Euljiro 3-ga','충무로'] },
    { color: '#0078BE', name: 'Линия 4', stations: ['Danggogae','Ssangmun','Suyu','Gireum','Hansung University','Hyehwa','Dongdaemun','Dongdaemun History','Chungmuro','Myeongdong','Hoehyeon','Seoul Station','Sookmyung Womens U','Samgakji','Ichon','Dongjak','Sadang','Nakseongdae','Seoul Nat\'l University','Bongcheon','Sillim','Sindaebang','Sanbon','Geumjeong','Gunpo','Suri','Dangjeong','Gwacheon'] },
  ],

  'Пусан': [
    { color: '#F77F00', name: 'Линия 1', stations: ['Nopo','Gupo','Deokcheon','Hwamyeong','Sujeong','Yangsan','Yangsan University','Namyangsan','Hoehwa','Beomseo','Beomcheon','Seomyeon','Jeonpo','Gaegeum','Sasang','Jurye','Sinpyeong','Danggam','Sinjeong','Mandeok','Oncheonjang','Dongrae','Minam','Geumjeong','Donam','Beomnaegol','Yangjeong','Pusan National University','Jangjeon','Guseo','Nampogoo','Jagalchi','Daechen','Toseong','Sinseon'] },
    { color: '#4DB94D', name: 'Линия 2', stations: ['Jangsan','Busan University','Dusil','센텀시티','Banyeo','Suyoung','Gwangalli','Geumnyeonsan','Namcheon','Daeyeon','Gyeongsong University','Pukyong University','Jinku','Seomun','Seomyeon','Buamsan','Dongui University','Gaya','Sasang','Mordeok','Kwidong','Nakmin','Hwamyeong','Deokcheon','Suyong','Shindorim','Nampo'] },
  ],

  'Инчхон': [
    { color: '#0078BE', name: 'Инчхонское метро', stations: ['Gyeyang','Gyulhyeon','Bupyeong-gu Office','Bupyeong','Bupyeong Market','Bucheong-ro','Juan','Dorim','Ganseok','Sinheung','Dongmak','Yonghyeon','Dongsu','Namdong-gu Office','Woninjae','Myeonghak','Sungui','Dongchun','Teogol','Incheon Grand Park','Camptown','Annam','Yeonsu','Incheon Terminal','Munhak Sports Complex','Seonhak','Gyulhyeon'] },
  ],

  'Тэгу': [
    { color: '#0078BE', name: 'Линия 1', stations: ['Daegok','Hyeonpung','Sindae-gu','Seocheon','Wolbae','Songcheun','Duryu','Naedang','Hyeongjesan','Waegwan','Chilseong Market','Myeongdeok','Daegu','Jungangno','Banwoldang','Kyungbuk Nat\'l University Hospital','Daebong','Namsan','Youngdae','Sinsegae','Munyang','Anshim','Ayanggyo'] },
    { color: '#4DB94D', name: 'Линия 2', stations: ['Munyang','Wolbae','Daewon','Sangingok','Bangogae','Dasin','Mannaenot','Gobae','Jungdong','Yonggye','Geumhowang','Bamsil','Duryu','Naedang','Igok','Myeongdeok','Gyeongdae병원','Banwoldang','Beomeo','Sangin','Manchon','Suseong못','Yeungnam University'] },
  ],

  'Тэджон': [
    { color: '#0078BE', name: 'Линия 1', stations: ['Panameoru','Oesamcheon','Banseok','Noeun','KAIST','Gungdong','Yuseong-gu Office','Gapcheon','Wolpyeong','Tanbang','Government Complex','Daejeon','Jungangno','Daejeon Jungang','Ollegilmok','Seodaejeon','Galmae','Jungchon','Maamdong','Jeongbu청사','Idong','Seogu Office','Yongmun'] },
  ],

  'Кванджу': [
    { color: '#4DB94D', name: 'Линия 1', stations: ['Sotaesan','Hodong','Nongseong','Doann','Gwangju Stadium','Gakhwa','Gwangju Terminal','Nampyeong Road','Seogu Office','Yangseon','Unam','Cultural Center','Geumnamno 4-ga','Geumnamno 5-ga','Nampyeong','Gwangju Station','Yongbong','Masan','Gyerim','Oryong','Dorisan','Hanam','Suwan','Pyeonghwa','Unnam','Sangmu'] },
  ],

  // ─── ТУРЦИЯ ───────────────────────────────────────────────────────────────
  'Стамбул': [
    { color: '#EF3124', name: 'M2 Yenikapı-Hacıosman', stations: ['Yenikapı','Vezneciler','Haliç','Şişhane','Taksim','Osmanbey','Şişli-Mecidiyeköy','Gayrettepe','Levent','4. Levent','Sanayi Mahallesi','Hacıosman'] },
    { color: '#0078BE', name: 'M4 Kadıköy-Sabiha Gökçen', stations: ['Kadıköy','Ayrılık Çeşmesi','Acıbadem','Ünalan','Göztepe','Yenisahra','Kozyatağı','Bostancı','Küçükyalı','Maltepe','Huzurevi','Gülsuyu','Esenkent','Hastane-Adnan Kahveci','İçerenköy','Kayışdağı','Yukarı Dudullu','Bostancı','Sabiha Gökçen Havalimanı'] },
    { color: '#4DB94D', name: 'M5 Üsküdar-Çekmeköy', stations: ['Üsküdar','Fıstıkağacı','Bağlarbaşı','Altunizade','Kısıklı','Bulgurlu','Ümraniye','Çarşı','Yamanevler','Çakmak','Ihlamurkuyu','Altınşehir','Dudullu','Necip Fazıl','Çekmeköy'] },
    { color: '#9A2785', name: 'M1A Yenikapı-Atatürk Havalimanı', stations: ['Yenikapı','Aksaray','Emniyet-Fatih','Topkapı-Ulubatlı','Bayrampaşa-Maltepe','Sağmalcılar','Kocatepe','Otogar','Kirazlı','İstanbul Havalimanı','Başakşehir','Kayaşehir','Olimpiyat','Bağcılar Meydan','Kirazlı'] },
    { color: '#F77F00', name: 'M7 Mecidiyeköy-Kabataş', stations: ['Mecidiyeköy','Çağlayan','Kağıthane','Nurtepe','Alibeyköy Cep Otogarı','Alibeyköy'] },
  ],

  'Анкара': [
    { color: '#EF3124', name: 'Ankaray M1', stations: ['AŞTİ','Emek','Bahçelievler','Beşevler','Anadolu','Maltepe','Akköprü','İncesu','Demetevler','Hastane','Macunköy','Portakal Çiçeği','Yenimahalle','Batıkent'] },
    { color: '#0078BE', name: 'Metro M2', stations: ['Kızılay','Kolej','Kurtuluş','Dikimevi'] },
    { color: '#4DB94D', name: 'Metro M3', stations: ['Batıkent','OSB-Törekent','Batı Merkez','Mesa','Beşyol','Macunköy','Portakal Çiçeği','Yenimahalle','Demetevler','Hastane','İncesu','Akköprü','Emek','AŞTİ'] },
    { color: '#9A2785', name: 'Metro M4', stations: ['Atatürk','Dışkapı','Meteoroloji','Belediye','Ulus','Sıhhiye','Kızılay','Necatibey','Demirtepe','Kurtuluş','Kolej','Dikimevi','İstanbul Yolu','Demetevler','Keçiören'] },
  ],

  'Бурса': [
    { color: '#0078BE', name: 'Bursaray', stations: ['Emek','Beşevler-Üniversite','Atatürk Stadyumu','Şehreküstü','Santral Garaj','Heykel','Şehreküstü','Uludağ Üniversitesi','Atatürk','Fethiye','Terminal','Acemler','Balat','Kestel'] },
  ],

  'Измир': [
    { color: '#EF3124', name: 'İzmir Metro Linia 1', stations: ['Evka 3','Evka 2','Evka 1','Atatürk','Meles','Kazımdirik','Bornova','Halkapınar','Basmane','Çankaya','Konak','Alsancak','Garnizon','Üçyol','Üçkuyular','Fahrettin Altay'] },
    { color: '#0078BE', name: 'İzmir Metro Linia 2', stations: ['Alaybey','Narlıdere','Mithatpaşa','Hatay','Hilal','Buca'] },
  ],
}

export type MetroCardData = {
  station: string
  before: (string | null)[]
  after: (string | null)[]
  color: string
  lineName: string
}

export function getMetroCardData(stationName: string, city?: string): MetroCardData | null {
  const citiesToSearch = city
    ? ([city, ...Object.keys(CITY_METRO_LINES).filter(c => c !== city)])
    : Object.keys(CITY_METRO_LINES)

  for (const cityName of citiesToSearch) {
    for (const line of (CITY_METRO_LINES[cityName] || [])) {
      const idx = line.stations.indexOf(stationName)
      if (idx === -1) continue
      const s = line.stations
      return {
        station: stationName,
        before: [
          idx >= 2 ? s[idx - 2] : null,
          idx >= 1 ? s[idx - 1] : null,
        ],
        after: [
          idx < s.length - 1 ? s[idx + 1] : null,
          idx < s.length - 2 ? s[idx + 2] : null,
        ],
        color: line.color,
        lineName: line.name,
      }
    }
  }
  return null
}
