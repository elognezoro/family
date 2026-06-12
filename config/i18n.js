// Internationalisation (i18n) — ossature + pages traduites.
// Le français est la langue de base et le repli. Liste extensible :
// ajoutez une entrée dans LANGUAGES et la langue dans chaque clé de M.
// Structure « clé d'abord » : chaque clé regroupe ses 8 traductions (ajout d'une page = un bloc).

const LANGUAGES = [
  { code: 'fr', label: 'Français', dir: 'ltr' },
  { code: 'en', label: 'English', dir: 'ltr' },
  { code: 'ar', label: 'العربية', dir: 'rtl' },
  { code: 'es', label: 'Español', dir: 'ltr' },
  { code: 'ko', label: '한국어', dir: 'ltr' },
  { code: 'zh', label: '中文（普通话）', dir: 'ltr' },
  { code: 'ru', label: 'Русский', dir: 'ltr' },
  { code: 'uk', label: 'Українська', dir: 'ltr' },
];

const M = {
  // ───────────── Ossature (navigation, menu, aide, langue) ─────────────
  'nav.home': { fr: 'Accueil', en: 'Home', ar: 'الرئيسية', es: 'Inicio', ko: '홈', zh: '首页', ru: 'Главная', uk: 'Головна' },
  'nav.books': { fr: 'Nos ouvrages', en: 'Our books', ar: 'كتبنا', es: 'Nuestros libros', ko: '도서', zh: '我们的图书', ru: 'Наши книги', uk: 'Наші книги' },
  'nav.pricing': { fr: 'Tarifs', en: 'Pricing', ar: 'الأسعار', es: 'Tarifas', ko: '요금', zh: '价格', ru: 'Тарифы', uk: 'Тарифи' },
  'nav.about': { fr: 'À propos', en: 'About', ar: 'حول', es: 'Acerca de', ko: '소개', zh: '关于', ru: 'О нас', uk: 'Про нас' },
  'nav.login': { fr: 'Connexion', en: 'Log in', ar: 'تسجيل الدخول', es: 'Iniciar sesión', ko: '로그인', zh: '登录', ru: 'Вход', uk: 'Увійти' },
  'nav.register': { fr: 'Créer un compte', en: 'Sign up', ar: 'إنشاء حساب', es: 'Crear cuenta', ko: '회원가입', zh: '注册', ru: 'Создать аккаунт', uk: 'Створити акаунт' },

  'menu.space': { fr: 'Mon espace', en: 'My space', ar: 'مساحتي', es: 'Mi espacio', ko: '내 공간', zh: '我的空间', ru: 'Мой кабинет', uk: 'Мій кабінет' },
  'menu.messages': { fr: 'Messages', en: 'Messages', ar: 'الرسائل', es: 'Mensajes', ko: '메시지', zh: '消息', ru: 'Сообщения', uk: 'Повідомлення' },
  'menu.guide': { fr: "Guide d'utilisation", en: 'User guide', ar: 'دليل المستخدم', es: 'Guía del usuario', ko: '사용 설명서', zh: '用户指南', ru: 'Руководство пользователя', uk: 'Посібник користувача' },
  'menu.guides': { fr: "Guides d'utilisation", en: 'User guides', ar: 'أدلة المستخدم', es: 'Guías del usuario', ko: '사용 설명서', zh: '用户指南', ru: 'Руководства пользователя', uk: 'Посібники користувача' },
  'menu.searchCoach': { fr: 'Rechercher un coach', en: 'Find a coach', ar: 'البحث عن مدرب', es: 'Buscar un coach', ko: '코치 찾기', zh: '寻找教练', ru: 'Найти коуча', uk: 'Знайти коуча' },
  'menu.profile': { fr: 'Mon profil', en: 'My profile', ar: 'ملفي الشخصي', es: 'Mi perfil', ko: '내 프로필', zh: '我的资料', ru: 'Мой профиль', uk: 'Мій профіль' },
  'menu.referral': { fr: 'Parrainage & gains', en: 'Referrals & earnings', ar: 'الإحالات والأرباح', es: 'Referidos y ganancias', ko: '추천 및 수익', zh: '推荐与收益', ru: 'Рефералы и доходы', uk: 'Реферали та доходи' },
  'menu.admins': { fr: 'Administrateurs', en: 'Administrators', ar: 'المسؤولون', es: 'Administradores', ko: '관리자', zh: '管理员', ru: 'Администраторы', uk: 'Адміністратори' },
  'menu.settings': { fr: 'Paramètres', en: 'Settings', ar: 'الإعدادات', es: 'Configuración', ko: '설정', zh: '设置', ru: 'Настройки', uk: 'Налаштування' },
  'menu.users': { fr: 'Utilisateurs', en: 'Users', ar: 'المستخدمون', es: 'Usuarios', ko: '사용자', zh: '用户', ru: 'Пользователи', uk: 'Користувачі' },
  'menu.account': { fr: 'Mon compte', en: 'My account', ar: 'حسابي', es: 'Mi cuenta', ko: '내 계정', zh: '我的账户', ru: 'Мой аккаунт', uk: 'Мій акаунт' },
  'menu.viewParent': { fr: 'Vue Parent', en: 'Parent view', ar: 'عرض ولي الأمر', es: 'Vista Padre', ko: '학부모 보기', zh: '家长视图', ru: 'Просмотр (родитель)', uk: 'Перегляд (батьки)' },
  'menu.viewCoach': { fr: 'Vue Coach', en: 'Coach view', ar: 'عرض المدرب', es: 'Vista Coach', ko: '코치 보기', zh: '教练视图', ru: 'Просмотр (коуч)', uk: 'Перегляд (коуч)' },
  'menu.logout': { fr: 'Déconnexion', en: 'Log out', ar: 'تسجيل الخروج', es: 'Cerrar sesión', ko: '로그아웃', zh: '退出登录', ru: 'Выйти', uk: 'Вийти' },

  'help.title': { fr: "Besoin d'aide ?", en: 'Need help?', ar: 'تحتاج مساعدة؟', es: '¿Necesitas ayuda?', ko: '도움이 필요하세요?', zh: '需要帮助？', ru: 'Нужна помощь?', uk: 'Потрібна допомога?' },
  'help.desc': { fr: "Consultez le guide d'utilisation de votre espace.", en: 'Read the user guide for your space.', ar: 'اطّلع على دليل المستخدم الخاص بمساحتك.', es: 'Consulta la guía del usuario de tu espacio.', ko: '내 공간의 사용 설명서를 확인하세요.', zh: '查看您空间的用户指南。', ru: 'Откройте руководство пользователя вашего кабинета.', uk: 'Перегляньте посібник користувача вашого кабінету.' },
  'help.cta': { fr: 'Consulter le guide', en: 'Open the guide', ar: 'فتح الدليل', es: 'Abrir la guía', ko: '가이드 열기', zh: '打开指南', ru: 'Открыть руководство', uk: 'Відкрити посібник' },
  'lang.title': { fr: 'Langue de lecture', en: 'Reading language', ar: 'لغة القراءة', es: 'Idioma de lectura', ko: '표시 언어', zh: '阅读语言', ru: 'Язык интерфейса', uk: 'Мова відображення' },
  'lang.desc': { fr: "Choisissez la langue d'affichage de l'application.", en: 'Choose the app display language.', ar: 'اختر لغة عرض التطبيق.', es: 'Elige el idioma de la aplicación.', ko: '앱 표시 언어를 선택하세요.', zh: '选择应用显示语言。', ru: 'Выберите язык отображения приложения.', uk: 'Оберіть мову відображення застосунку.' },
  'fab.help': { fr: 'Aide', en: 'Help', ar: 'مساعدة', es: 'Ayuda', ko: '도움말', zh: '帮助', ru: 'Помощь', uk: 'Допомога' },

  // ───────────── Page d'accueil ─────────────
  'home.slogan': { fr: 'Apprendre • Progresser • Réussir ensemble', en: 'Learn • Progress • Succeed together', ar: 'نتعلّم • نتقدّم • ننجح معًا', es: 'Aprender • Progresar • Triunfar juntos', ko: '배우고 • 성장하고 • 함께 성공하기', zh: '学习 • 进步 • 共同成功', ru: 'Учиться • Развиваться • Достигать успеха вместе', uk: 'Навчатися • Розвиватися • Досягати успіху разом' },
  'home.hero.title': {
    fr: 'Un accompagnement scolaire <span>humain, qualifié</span> et de proximité',
    en: '<span>Human, qualified</span> academic support, close to you',
    ar: 'دعم دراسي <span>إنساني ومؤهَّل</span> وقريب منك',
    es: 'Un acompañamiento escolar <span>humano, cualificado</span> y cercano',
    ko: '<span>인간적이고 전문적인</span>, 가까운 학습 지원',
    zh: '<span>有温度、专业</span>且贴近您的学业辅导',
    ru: '<span>Человечная и квалифицированная</span> поддержка в учёбе рядом с вами',
    uk: '<span>Людяна та кваліфікована</span> підтримка в навчанні поруч із вами',
  },
  'home.hero.subtitle': {
    fr: "EduWeb met en relation les familles et des enseignants-coachs vérifiés, du préscolaire au lycée, en Côte d'Ivoire et au-delà. Trouvez le bon coach, près de chez vous, en toute confiance.",
    en: "EduWeb connects families with verified teacher-coaches, from preschool to high school, in Côte d'Ivoire and beyond. Find the right coach, close to home, with confidence.",
    ar: 'يربط EduWeb العائلات بمعلّمين-مدرّبين موثوقين، من الروضة إلى الثانوية، في كوت ديفوار وخارجها. اعثر على المدرّب المناسب بالقرب منك بكل ثقة.',
    es: 'EduWeb conecta a las familias con profesores-coach verificados, desde preescolar hasta bachillerato, en Costa de Marfil y más allá. Encuentra el coach adecuado, cerca de ti, con total confianza.',
    ko: 'EduWeb는 유치원부터 고등학교까지 검증된 교사-코치와 가정을 연결합니다. 코트디부아르와 그 너머에서 가까운 곳의 믿을 수 있는 코치를 찾으세요.',
    zh: 'EduWeb 将家庭与经过验证的教师教练相连接，覆盖从学前到高中，遍及科特迪瓦及其他地区。在您附近放心找到合适的教练。',
    ru: "EduWeb связывает семьи с проверенными преподавателями-коучами — от детского сада до старшей школы, в Кот-д'Ивуаре и за его пределами. Найдите подходящего коуча рядом с вами с полным доверием.",
    uk: "EduWeb об'єднує сім'ї з перевіреними викладачами-коучами — від дитсадка до старшої школи, у Кот-д'Івуарі та за його межами. Знайдіть потрібного коуча поруч із вами з повною довірою.",
  },
  'home.hero.ctaStart': { fr: 'Commencer gratuitement', en: 'Start for free', ar: 'ابدأ مجانًا', es: 'Empezar gratis', ko: '무료로 시작하기', zh: '免费开始', ru: 'Начать бесплатно', uk: 'Почати безкоштовно' },
  'home.hero.ctaMap': { fr: 'Carte des coachs', en: 'Coach map', ar: 'خريطة المدرّبين', es: 'Mapa de coaches', ko: '코치 지도', zh: '教练地图', ru: 'Карта коучей', uk: 'Карта коучів' },

  'home.live.badge': { fr: 'En temps réel', en: 'Live', ar: 'مباشر', es: 'En tiempo real', ko: '실시간', zh: '实时', ru: 'В реальном времени', uk: 'У реальному часі' },
  'home.live.visits': { fr: 'Visites du site', en: 'Site visits', ar: 'زيارات الموقع', es: 'Visitas al sitio', ko: '사이트 방문 수', zh: '网站访问量', ru: 'Посещения сайта', uk: 'Відвідування сайту' },
  'home.live.accounts': { fr: 'Comptes créés', en: 'Accounts created', ar: 'حسابات مُنشأة', es: 'Cuentas creadas', ko: '생성된 계정', zh: '已创建账户', ru: 'Созданные аккаунты', uk: 'Створені акаунти' },

  'home.stats.coaches': { fr: 'Coachs vérifiés', en: 'Verified coaches', ar: 'مدرّبون موثوقون', es: 'Coaches verificados', ko: '인증된 코치', zh: '已验证教练', ru: 'Проверенные коучи', uk: 'Перевірені коучі' },
  'home.stats.disciplines': { fr: 'Disciplines', en: 'Subjects', ar: 'المواد', es: 'Materias', ko: '과목', zh: '学科', ru: 'Дисциплины', uk: 'Дисципліни' },
  'home.stats.countries': { fr: 'Pays couverts', en: 'Countries covered', ar: 'الدول المشمولة', es: 'Países cubiertos', ko: '지원 국가', zh: '覆盖国家', ru: 'Охваченные страны', uk: 'Охоплені країни' },
  'home.stats.operators': { fr: 'Opérateurs Mobile Money', en: 'Mobile Money operators', ar: 'مشغّلو Mobile Money', es: 'Operadores de Mobile Money', ko: '모바일 머니 사업자', zh: '移动支付运营商', ru: 'Операторы Mobile Money', uk: 'Оператори Mobile Money' },

  'home.featured.title': { fr: 'Des coachs disponibles près de chez vous', en: 'Coaches available near you', ar: 'مدرّبون متاحون بالقرب منك', es: 'Coaches disponibles cerca de ti', ko: '가까운 곳의 코치', zh: '您附近的可预约教练', ru: 'Коучи рядом с вами', uk: 'Коучі поруч із вами' },
  'home.featured.sub': { fr: 'Profils vérifiés, notés par les familles et géolocalisés.', en: 'Verified profiles, rated by families and geolocated.', ar: 'ملفات موثوقة، مقيّمة من الأسر ومحدّدة جغرافيًا.', es: 'Perfiles verificados, valorados por las familias y geolocalizados.', ko: '검증되고 가정의 평가를 받은 위치 기반 프로필.', zh: '经过验证、由家庭评分并定位的资料。', ru: 'Проверенные профили, оценённые семьями, с геолокацией.', uk: 'Перевірені профілі, оцінені родинами, з геолокацією.' },
  'home.featured.spec': { fr: 'Coach scolaire', en: 'Academic coach', ar: 'مدرّب دراسي', es: 'Coach escolar', ko: '학습 코치', zh: '学业教练', ru: 'Школьный коуч', uk: 'Шкільний коуч' },
  'home.featured.view': { fr: 'Voir le profil', en: 'View profile', ar: 'عرض الملف', es: 'Ver perfil', ko: '프로필 보기', zh: '查看资料', ru: 'Посмотреть профиль', uk: 'Переглянути профіль' },

  'home.how.title': { fr: 'Comment fonctionne EduWeb', en: 'How EduWeb works', ar: 'كيف يعمل EduWeb', es: 'Cómo funciona EduWeb', ko: 'EduWeb 이용 방법', zh: 'EduWeb 如何运作', ru: 'Как работает EduWeb', uk: 'Як працює EduWeb' },
  'home.how.sub': { fr: 'Trois étapes simples pour accompagner la réussite de vos enfants.', en: "Three simple steps to support your children's success.", ar: 'ثلاث خطوات بسيطة لدعم نجاح أطفالك.', es: 'Tres pasos sencillos para acompañar el éxito de tus hijos.', ko: '자녀의 성공을 돕는 세 가지 간단한 단계.', zh: '助力孩子成功的三个简单步骤。', ru: 'Три простых шага для успеха ваших детей.', uk: 'Три прості кроки для успіху ваших дітей.' },
  'home.how.s1.t': { fr: 'Identifiez votre foyer', en: 'Set up your household', ar: 'عرّف بأسرتك', es: 'Identifica tu hogar', ko: '가정 등록', zh: '建立您的家庭', ru: 'Опишите вашу семью', uk: 'Опишіть вашу родину' },
  'home.how.s1.d': { fr: "Inscrivez vos apprenants et déclarez leurs besoins par discipline, niveau et mode d'enseignement.", en: 'Add your learners and define their needs by subject, level and teaching mode.', ar: 'أضف المتعلّمين لديك وحدّد احتياجاتهم حسب المادة والمستوى وطريقة التدريس.', es: 'Registra a tus estudiantes y define sus necesidades por materia, nivel y modalidad.', ko: '학습자를 등록하고 과목·수준·수업 방식별로 필요를 입력하세요.', zh: '添加您的学员，并按学科、年级和授课方式设定需求。', ru: 'Добавьте учеников и укажите их потребности по предмету, уровню и формату обучения.', uk: 'Додайте учнів і вкажіть їхні потреби за предметом, рівнем і форматом навчання.' },
  'home.how.s2.t': { fr: 'Localisez un coach', en: 'Locate a coach', ar: 'حدّد موقع مدرّب', es: 'Localiza un coach', ko: '코치 찾기', zh: '定位教练', ru: 'Найдите коуча', uk: 'Знайдіть коуча' },
  'home.how.s2.d': { fr: 'La carte interactive affiche les coachs vérifiés autour de vous, avec leur distance en temps réel.', en: 'The interactive map shows verified coaches around you, with their distance in real time.', ar: 'تعرض الخريطة التفاعلية المدرّبين الموثوقين من حولك مع المسافة في الوقت الفعلي.', es: 'El mapa interactivo muestra coaches verificados a tu alrededor, con su distancia en tiempo real.', ko: '인터랙티브 지도가 주변의 인증 코치와 실시간 거리를 보여줍니다.', zh: '互动地图实时显示您周围经过验证的教练及距离。', ru: 'Интерактивная карта показывает проверенных коучей рядом и расстояние в реальном времени.', uk: 'Інтерактивна карта показує перевірених коучів поруч і відстань у реальному часі.' },
  'home.how.s3.t': { fr: 'Payez par Mobile Money', en: 'Pay by Mobile Money', ar: 'ادفع عبر Mobile Money', es: 'Paga con Mobile Money', ko: '모바일 머니로 결제', zh: '通过移动支付付款', ru: 'Оплатите через Mobile Money', uk: 'Сплатіть через Mobile Money' },
  'home.how.s3.d': { fr: 'Tarifs transparents en FCFA et en euros. Payez via Wave, Orange Money, MTN MoMo ou Moov Money.', en: 'Transparent prices in FCFA and euros. Pay via Wave, Orange Money, MTN MoMo or Moov Money.', ar: 'أسعار شفّافة بالفرنك الإفريقي واليورو. ادفع عبر Wave أو Orange Money أو MTN MoMo أو Moov Money.', es: 'Precios transparentes en FCFA y euros. Paga con Wave, Orange Money, MTN MoMo o Moov Money.', ko: 'FCFA와 유로로 투명한 요금. Wave, Orange Money, MTN MoMo, Moov Money로 결제하세요.', zh: '以 FCFA 和欧元透明计价。可通过 Wave、Orange Money、MTN MoMo 或 Moov Money 付款。', ru: 'Прозрачные цены в FCFA и евро. Оплата через Wave, Orange Money, MTN MoMo или Moov Money.', uk: 'Прозорі ціни у FCFA та євро. Оплата через Wave, Orange Money, MTN MoMo або Moov Money.' },

  'home.profiles.title': { fr: 'Un espace pensé pour chacun', en: 'A space designed for everyone', ar: 'مساحة مصمّمة للجميع', es: 'Un espacio pensado para cada uno', ko: '모두를 위한 공간', zh: '为每个人打造的空间', ru: 'Пространство для каждого', uk: 'Простір для кожного' },
  'home.profiles.sub': { fr: "Parent, enseignant ou commercial : EduWeb s'adapte à vos besoins.", en: 'Parent, teacher or sales partner: EduWeb adapts to your needs.', ar: 'ولي أمر أو معلّم أو مندوب: يتكيّف EduWeb مع احتياجاتك.', es: 'Padre, profesor o comercial: EduWeb se adapta a tus necesidades.', ko: '학부모, 교사 또는 영업 파트너 — EduWeb는 당신의 필요에 맞춥니다.', zh: '家长、教师或推广伙伴：EduWeb 满足您的需求。', ru: 'Родитель, преподаватель или партнёр: EduWeb подстраивается под вас.', uk: 'Батьки, викладач чи партнер: EduWeb адаптується до ваших потреб.' },
  'home.profiles.parent.title': { fr: 'Parent / Responsable', en: 'Parent / Guardian', ar: 'ولي الأمر', es: 'Padre / Tutor', ko: '학부모 / 보호자', zh: '家长 / 监护人', ru: 'Родитель / Опекун', uk: 'Батьки / Опікун' },
  'home.profiles.parent.li1': { fr: 'Gérez plusieurs apprenants dans un même foyer', en: 'Manage several learners in one household', ar: 'أدِر عدّة متعلّمين في أسرة واحدة', es: 'Gestiona varios estudiantes en un mismo hogar', ko: '한 가정에서 여러 학습자 관리', zh: '在同一家庭中管理多名学员', ru: 'Управляйте несколькими учениками в одной семье', uk: 'Керуйте кількома учнями в одній родині' },
  'home.profiles.parent.li2': { fr: 'Trouvez des coachs vérifiés sur la carte interactive', en: 'Find verified coaches on the interactive map', ar: 'اعثر على مدرّبين موثوقين عبر الخريطة التفاعلية', es: 'Encuentra coaches verificados en el mapa interactivo', ko: '인터랙티브 지도에서 인증 코치 찾기', zh: '在互动地图上查找已验证的教练', ru: 'Находите проверенных коучей на интерактивной карте', uk: 'Знаходьте перевірених коучів на інтерактивній карті' },
  'home.profiles.parent.li3': { fr: 'Suivez la progression via le carnet numérique', en: 'Track progress with the digital logbook', ar: 'تابِع التقدّم عبر الدفتر الرقمي', es: 'Sigue el progreso con el cuaderno digital', ko: '디지털 수첩으로 진도 확인', zh: '通过数字记录册跟踪进度', ru: 'Следите за прогрессом в цифровом дневнике', uk: 'Стежте за прогресом у цифровому щоденнику' },
  'home.profiles.parent.li4': { fr: 'Payez en toute sécurité par Mobile Money', en: 'Pay securely with Mobile Money', ar: 'ادفع بأمان عبر Mobile Money', es: 'Paga de forma segura con Mobile Money', ko: '모바일 머니로 안전하게 결제', zh: '通过移动支付安全付款', ru: 'Безопасно платите через Mobile Money', uk: 'Безпечно платіть через Mobile Money' },
  'home.profiles.parent.cta': { fr: 'Espace Parent', en: 'Parent space', ar: 'مساحة ولي الأمر', es: 'Espacio Padre', ko: '학부모 공간', zh: '家长空间', ru: 'Кабинет родителя', uk: 'Кабінет батьків' },
  'home.profiles.coach.title': { fr: 'Enseignant Coach', en: 'Teacher Coach', ar: 'المعلّم المدرّب', es: 'Profesor Coach', ko: '교사 코치', zh: '教师教练', ru: 'Преподаватель-коуч', uk: 'Викладач-коуч' },
  'home.profiles.coach.li1': { fr: 'Créez un profil vérifié et certifiable', en: 'Create a verified, certifiable profile', ar: 'أنشئ ملفًا موثوقًا وقابلًا للاعتماد', es: 'Crea un perfil verificado y certificable', ko: '인증 가능한 검증 프로필 만들기', zh: '创建可认证的验证资料', ru: 'Создайте проверенный, сертифицируемый профиль', uk: 'Створіть перевірений профіль із можливістю сертифікації' },
  'home.profiles.coach.li2': { fr: 'Enseignez plusieurs niveaux et disciplines', en: 'Teach several levels and subjects', ar: 'درّس عدّة مستويات ومواد', es: 'Enseña varios niveles y materias', ko: '여러 학년과 과목 지도', zh: '教授多个年级和学科', ru: 'Преподавайте разные уровни и предметы', uk: 'Викладайте різні рівні та предмети' },
  'home.profiles.coach.li3': { fr: 'Gérez vos tarifs, zones et disponibilités', en: 'Manage your rates, areas and availability', ar: 'أدِر أسعارك ومناطقك وأوقات توفّرك', es: 'Gestiona tus tarifas, zonas y disponibilidad', ko: '요금·지역·일정 관리', zh: '管理您的价格、区域和可用时间', ru: 'Управляйте ставками, зонами и доступностью', uk: 'Керуйте тарифами, зонами та доступністю' },
  'home.profiles.coach.li4': { fr: 'Recevez des missions près de chez vous', en: 'Receive assignments near you', ar: 'استقبِل مهامًا بالقرب منك', es: 'Recibe misiones cerca de ti', ko: '가까운 곳의 미션 받기', zh: '接收您附近的任务', ru: 'Получайте задания рядом с вами', uk: 'Отримуйте завдання поруч із вами' },
  'home.profiles.coach.cta': { fr: 'Espace Coach', en: 'Coach space', ar: 'مساحة المدرّب', es: 'Espacio Coach', ko: '코치 공간', zh: '教练空间', ru: 'Кабинет коуча', uk: 'Кабінет коуча' },
  'home.profiles.commercial.title': { fr: 'Commercial', en: 'Sales partner', ar: 'مندوب', es: 'Comercial', ko: '영업 파트너', zh: '推广伙伴', ru: 'Партнёр', uk: 'Партнер' },
  'home.profiles.commercial.li1': { fr: "Obtenez un lien d'invitation unique", en: 'Get a unique invitation link', ar: 'احصل على رابط دعوة فريد', es: 'Obtén un enlace de invitación único', ko: '고유 초대 링크 받기', zh: '获取专属邀请链接', ru: 'Получите уникальную ссылку-приглашение', uk: 'Отримайте унікальне посилання-запрошення' },
  'home.profiles.commercial.li2': { fr: 'Recrutez parents & coachs sur la plateforme', en: 'Recruit parents & coaches to the platform', ar: 'استقطب أولياء الأمور والمدرّبين إلى المنصّة', es: 'Recluta padres y coaches en la plataforma', ko: '플랫폼에 학부모와 코치 모집', zh: '为平台招募家长和教练', ru: 'Привлекайте родителей и коучей на платформу', uk: 'Залучайте батьків і коучів на платформу' },
  'home.profiles.commercial.li3': { fr: 'Gagnez 10 % de la part EduWeb par mission', en: "Earn 10% of EduWeb's share per assignment", ar: 'اربح 10% من حصّة EduWeb لكل مهمة', es: 'Gana el 10 % de la parte de EduWeb por misión', ko: '미션당 EduWeb 수익의 10% 적립', zh: '每单任务赚取 EduWeb 收益的 10%', ru: 'Зарабатывайте 10% от доли EduWeb за каждое задание', uk: 'Заробляйте 10% від частки EduWeb за кожне завдання' },
  'home.profiles.commercial.li4': { fr: 'Suivez vos filleuls & vos gains en temps réel', en: 'Track your referrals & earnings in real time', ar: 'تابِع مدعويك وأرباحك في الوقت الفعلي', es: 'Sigue tus referidos y ganancias en tiempo real', ko: '추천인과 수익을 실시간으로 확인', zh: '实时跟踪您的推荐和收益', ru: 'Отслеживайте рефералов и доходы в реальном времени', uk: 'Стежте за рефералами та доходами в реальному часі' },
  'home.profiles.commercial.cta': { fr: 'Espace Commercial', en: 'Sales space', ar: 'مساحة المندوب', es: 'Espacio Comercial', ko: '영업 공간', zh: '推广空间', ru: 'Кабинет партнёра', uk: 'Кабінет партнера' },

  'home.why.title': { fr: 'Pourquoi EduWeb', en: 'Why EduWeb', ar: 'لماذا EduWeb', es: 'Por qué EduWeb', ko: 'EduWeb를 선택하는 이유', zh: '为什么选择 EduWeb', ru: 'Почему EduWeb', uk: 'Чому EduWeb' },
  'home.why.sub': { fr: 'Une plateforme conçue pour la confiance, la transparence et la réussite.', en: 'A platform built for trust, transparency and success.', ar: 'منصّة مصمّمة للثقة والشفافية والنجاح.', es: 'Una plataforma diseñada para la confianza, la transparencia y el éxito.', ko: '신뢰·투명성·성공을 위해 만든 플랫폼.', zh: '为信任、透明和成功而打造的平台。', ru: 'Платформа, созданная для доверия, прозрачности и успеха.', uk: 'Платформа, створена для довіри, прозорості та успіху.' },
  'home.why.f1.t': { fr: 'Coachs vérifiés', en: 'Verified coaches', ar: 'مدرّبون موثوقون', es: 'Coaches verificados', ko: '인증된 코치', zh: '已验证的教练', ru: 'Проверенные коучи', uk: 'Перевірені коучі' },
  'home.why.f1.d': { fr: 'Documents contrôlés, profils validés par notre équipe et badges de certification attribués.', en: 'Documents checked, profiles validated by our team and certification badges awarded.', ar: 'مستندات مُدقّقة، وملفات يعتمدها فريقنا، وشارات اعتماد ممنوحة.', es: 'Documentos verificados, perfiles validados por nuestro equipo e insignias de certificación.', ko: '서류 확인, 팀의 프로필 검증, 인증 배지 부여.', zh: '文件经审核，资料由团队验证，并授予认证徽章。', ru: 'Документы проверены, профили подтверждены нашей командой, выданы значки сертификации.', uk: 'Документи перевірені, профілі підтверджені командою, видані значки сертифікації.' },
  'home.why.f2.t': { fr: 'Carte interactive', en: 'Interactive map', ar: 'خريطة تفاعلية', es: 'Mapa interactivo', ko: '인터랙티브 지도', zh: '互动地图', ru: 'Интерактивная карта', uk: 'Інтерактивна карта' },
  'home.why.f2.d': { fr: 'Géolocalisation précise, calcul de distance et couverture étendue à travers le pays.', en: 'Precise geolocation, distance calculation and broad coverage across the country.', ar: 'تحديد جغرافي دقيق وحساب للمسافات وتغطية واسعة في أنحاء البلاد.', es: 'Geolocalización precisa, cálculo de distancia y amplia cobertura en todo el país.', ko: '정밀 위치, 거리 계산, 전국 광범위 지원.', zh: '精准定位、距离计算，覆盖全国。', ru: 'Точная геолокация, расчёт расстояния и широкое покрытие по стране.', uk: 'Точна геолокація, розрахунок відстані та широке покриття по країні.' },
  'home.why.f3.t': { fr: 'Tarifs transparents', en: 'Transparent pricing', ar: 'أسعار شفّافة', es: 'Tarifas transparentes', ko: '투명한 요금', zh: '透明价格', ru: 'Прозрачные цены', uk: 'Прозорі ціни' },
  'home.why.f3.d': { fr: "Affichage en FCFA et euros, forfaits par cycle scolaire et codes promo jusqu'à 100 %.", en: 'Prices in FCFA and euros, packages by school cycle and promo codes up to 100%.', ar: 'أسعار بالفرنك واليورو، وباقات حسب المرحلة الدراسية، ورموز خصم تصل إلى 100%.', es: 'Precios en FCFA y euros, paquetes por ciclo escolar y códigos promo hasta el 100 %.', ko: 'FCFA·유로 표시, 학교 과정별 패키지, 최대 100% 할인 코드.', zh: '以 FCFA 和欧元显示，按学段套餐，优惠码最高 100%。', ru: 'Цены в FCFA и евро, пакеты по ступеням обучения и промокоды до 100%.', uk: 'Ціни у FCFA та євро, пакети за циклами навчання та промокоди до 100%.' },
  'home.why.f4.t': { fr: 'Protection des mineurs', en: 'Child protection', ar: 'حماية القُصّر', es: 'Protección de menores', ko: '미성년자 보호', zh: '未成年人保护', ru: 'Защита несовершеннолетних', uk: 'Захист неповнолітніх' },
  'home.why.f4.d': { fr: 'Les apprenants sont enregistrés sans données personnelles nominatives, dans le respect de la vie privée.', en: 'Learners are registered without identifying personal data, respecting privacy.', ar: 'يُسجَّل المتعلّمون دون بيانات شخصية تُعرّف بهويتهم، احترامًا للخصوصية.', es: 'Los estudiantes se registran sin datos personales identificativos, respetando la privacidad.', ko: '학습자는 개인 식별 정보 없이 등록되어 개인정보를 보호합니다.', zh: '学员注册不含可识别个人身份的数据，尊重隐私。', ru: 'Ученики регистрируются без идентифицирующих персональных данных, с уважением к приватности.', uk: 'Учні реєструються без ідентифікаційних персональних даних, із повагою до приватності.' },
  'home.why.f5.t': { fr: 'Suivi pédagogique', en: 'Educational tracking', ar: 'متابعة تربوية', es: 'Seguimiento pedagógico', ko: '학습 관리', zh: '学习跟踪', ru: 'Педагогический контроль', uk: 'Педагогічний супровід' },
  'home.why.f5.d': { fr: 'Carnets numériques, comptes-rendus, notes et suivi de la progression de chaque apprenant.', en: 'Digital logbooks, reports, grades and progress tracking for each learner.', ar: 'دفاتر رقمية وتقارير ودرجات ومتابعة تقدّم كل متعلّم.', es: 'Cuadernos digitales, informes, notas y seguimiento del progreso de cada estudiante.', ko: '디지털 수첩, 보고서, 성적, 학습자별 진도 관리.', zh: '数字记录册、报告、成绩及每位学员的进度跟踪。', ru: 'Цифровые дневники, отчёты, оценки и контроль прогресса каждого ученика.', uk: 'Цифрові щоденники, звіти, оцінки та контроль прогресу кожного учня.' },
  'home.why.f6.t': { fr: 'Qualité certifiée', en: 'Certified quality', ar: 'جودة معتمَدة', es: 'Calidad certificada', ko: '인증된 품질', zh: '认证品质', ru: 'Сертифицированное качество', uk: 'Сертифікована якість' },
  'home.why.f6.d': { fr: 'Programme de certification EduWeb et évaluations laissées par les familles.', en: 'EduWeb certification program and reviews left by families.', ar: 'برنامج اعتماد EduWeb وتقييمات تتركها الأسر.', es: 'Programa de certificación EduWeb y valoraciones de las familias.', ko: 'EduWeb 인증 프로그램과 가정이 남긴 후기.', zh: 'EduWeb 认证计划及家庭留下的评价。', ru: 'Программа сертификации EduWeb и отзывы семей.', uk: 'Програма сертифікації EduWeb та відгуки родин.' },

  'home.editions.title': { fr: 'Nos ouvrages scolaires', en: 'Our school books', ar: 'كتبنا المدرسية', es: 'Nuestros libros escolares', ko: '우리의 학습 교재', zh: '我们的教辅图书', ru: 'Наши учебные пособия', uk: 'Наші навчальні посібники' },
  'home.editions.sub': { fr: 'Annales, sujets corrigés et méthodes pour viser la mention — conformes au programme officiel.', en: 'Past papers, worked solutions and methods to aim for honors — aligned with the official curriculum.', ar: 'نماذج امتحانات وحلول مصحَّحة وأساليب لتحقيق التقدير — متوافقة مع المنهج الرسمي.', es: 'Exámenes anteriores, soluciones corregidas y métodos para aspirar a la mención — conforme al programa oficial.', ko: '기출문제, 해설 풀이, 우수 성적을 위한 학습법 — 공식 교육과정 준수.', zh: '历年真题、详解答案与冲刺方法——符合官方大纲。', ru: 'Сборники заданий, разборы решений и методики для отличия — по официальной программе.', uk: "Збірники завдань, розв'язання та методики для відзнаки — за офіційною програмою." },
  'home.editions.cta': { fr: 'Découvrir tous nos ouvrages', en: 'Discover all our books', ar: 'اكتشف جميع كتبنا', es: 'Descubre todos nuestros libros', ko: '모든 교재 보기', zh: '探索我们所有图书', ru: 'Все наши книги', uk: 'Усі наші книги' },
  'home.editions.note': { fr: 'Sujets + corrigés détaillés · Méthodes & astuces · Performance maximale', en: 'Exams + detailed solutions · Methods & tips · Maximum performance', ar: 'امتحانات + حلول مفصّلة · أساليب ونصائح · أداء أقصى', es: 'Exámenes + soluciones detalladas · Métodos y trucos · Máximo rendimiento', ko: '문제 + 상세 해설 · 학습법과 팁 · 최고의 성과', zh: '试题+详细解答 · 方法与技巧 · 极致表现', ru: 'Задания + подробные решения · Методы и советы · Максимальный результат', uk: "Завдання + детальні розв'язання · Методи та поради · Максимальний результат" },

  'home.cta.title': { fr: 'Prêt à commencer ?', en: 'Ready to start?', ar: 'هل أنت مستعدّ للبدء؟', es: '¿Listo para empezar?', ko: '시작할 준비가 되셨나요?', zh: '准备好开始了吗？', ru: 'Готовы начать?', uk: 'Готові почати?' },
  'home.cta.text': { fr: 'Rejoignez EduWeb gratuitement et offrez à vos enfants un accompagnement de qualité.', en: 'Join EduWeb for free and give your children quality support.', ar: 'انضمّ إلى EduWeb مجانًا وامنح أطفالك دعمًا عالي الجودة.', es: 'Únete a EduWeb gratis y ofrece a tus hijos un acompañamiento de calidad.', ko: '무료로 EduWeb에 가입하고 자녀에게 양질의 지원을 제공하세요.', zh: '免费加入 EduWeb，为孩子提供优质辅导。', ru: 'Присоединяйтесь к EduWeb бесплатно и обеспечьте детям качественную поддержку.', uk: 'Приєднуйтесь до EduWeb безкоштовно та забезпечте дітям якісну підтримку.' },
  'home.cta.register': { fr: 'Créer un compte gratuit', en: 'Create a free account', ar: 'أنشئ حسابًا مجانيًا', es: 'Crear una cuenta gratis', ko: '무료 계정 만들기', zh: '创建免费账户', ru: 'Создать бесплатный аккаунт', uk: 'Створити безкоштовний акаунт' },
  'home.cta.explore': { fr: 'Explorer la carte', en: 'Explore the map', ar: 'استكشف الخريطة', es: 'Explorar el mapa', ko: '지도 둘러보기', zh: '探索地图', ru: 'Открыть карту', uk: 'Дослідити карту' },

  // ───────────── Inscription / Connexion ─────────────
  'auth.title.login': { fr: 'Connexion', en: 'Log in', ar: 'تسجيل الدخول', es: 'Iniciar sesión', ko: '로그인', zh: '登录', ru: 'Вход', uk: 'Вхід' },
  'auth.title.register': { fr: 'Créer un compte', en: 'Create an account', ar: 'إنشاء حساب', es: 'Crear una cuenta', ko: '계정 만들기', zh: '创建账户', ru: 'Создать аккаунт', uk: 'Створити акаунт' },
  'auth.email': { fr: 'Email', en: 'Email', ar: 'البريد الإلكتروني', es: 'Correo electrónico', ko: '이메일', zh: '邮箱', ru: 'Эл. почта', uk: 'Ел. пошта' },
  'auth.password': { fr: 'Mot de passe', en: 'Password', ar: 'كلمة المرور', es: 'Contraseña', ko: '비밀번호', zh: '密码', ru: 'Пароль', uk: 'Пароль' },
  'auth.remember': { fr: 'Me maintenir connecté (30 jours)', en: 'Keep me signed in (30 days)', ar: 'أبقِني مسجّلاً للدخول (30 يومًا)', es: 'Mantener sesión (30 días)', ko: '로그인 상태 유지 (30일)', zh: '保持登录（30天）', ru: 'Запомнить меня (30 дней)', uk: "Запам'ятати мене (30 днів)" },
  'auth.signin': { fr: 'Se connecter', en: 'Log in', ar: 'تسجيل الدخول', es: 'Iniciar sesión', ko: '로그인', zh: '登录', ru: 'Войти', uk: 'Увійти' },
  'auth.resendSummary': { fr: 'Compte non activé ? Renvoyer le lien', en: 'Account not activated? Resend the link', ar: 'الحساب غير مُفعّل؟ أعد إرسال الرابط', es: '¿Cuenta no activada? Reenviar el enlace', ko: '계정이 활성화되지 않았나요? 링크 재전송', zh: '账户未激活？重新发送链接', ru: 'Аккаунт не активирован? Отправить ссылку повторно', uk: 'Акаунт не активовано? Надіслати посилання повторно' },
  'auth.yourEmail': { fr: 'Votre email', en: 'Your email', ar: 'بريدك الإلكتروني', es: 'Tu correo', ko: '이메일', zh: '您的邮箱', ru: 'Ваша эл. почта', uk: 'Ваша ел. пошта' },
  'auth.resendBtn': { fr: "Renvoyer le lien d'activation", en: 'Resend activation link', ar: 'إعادة إرسال رابط التفعيل', es: 'Reenviar enlace de activación', ko: '활성화 링크 재전송', zh: '重新发送激活链接', ru: 'Отправить ссылку активации', uk: 'Надіслати посилання активації' },
  'auth.noAccount': { fr: 'Pas de compte ?', en: 'No account?', ar: 'لا تملك حسابًا؟', es: '¿No tienes cuenta?', ko: '계정이 없으신가요?', zh: '没有账户？', ru: 'Нет аккаунта?', uk: 'Немає акаунта?' },
  'auth.alreadyMember': { fr: 'Déjà inscrit ?', en: 'Already registered?', ar: 'مسجّل بالفعل؟', es: '¿Ya tienes cuenta?', ko: '이미 가입하셨나요?', zh: '已注册？', ru: 'Уже зарегистрированы?', uk: 'Вже зареєстровані?' },
  'auth.nom': { fr: 'NOM', en: 'LAST NAME', ar: 'اللقب', es: 'APELLIDO', ko: '성', zh: '姓', ru: 'Фамилия', uk: 'Прізвище' },
  'auth.prenom': { fr: 'Prénom(s)', en: 'First name(s)', ar: 'الاسم', es: 'Nombre(s)', ko: '이름', zh: '名字', ru: 'Имя', uk: "Ім'я" },
  'auth.confirm': { fr: 'Confirmer', en: 'Confirm', ar: 'تأكيد', es: 'Confirmar', ko: '확인', zh: '确认', ru: 'Подтвердите', uk: 'Підтвердьте' },
  'auth.gender': { fr: 'Genre', en: 'Gender', ar: 'الجنس', es: 'Género', ko: '성별', zh: '性别', ru: 'Пол', uk: 'Стать' },
  'auth.female': { fr: 'Femme', en: 'Female', ar: 'أنثى', es: 'Mujer', ko: '여성', zh: '女', ru: 'Женщина', uk: 'Жінка' },
  'auth.male': { fr: 'Homme', en: 'Male', ar: 'ذكر', es: 'Hombre', ko: '남성', zh: '男', ru: 'Мужчина', uk: 'Чоловік' },
  'auth.accountType': { fr: 'Type de compte', en: 'Account type', ar: 'نوع الحساب', es: 'Tipo de cuenta', ko: '계정 유형', zh: '账户类型', ru: 'Тип аккаунта', uk: 'Тип акаунта' },
  'auth.roleParent': { fr: 'Parent', en: 'Parent', ar: 'ولي أمر', es: 'Padre', ko: '학부모', zh: '家长', ru: 'Родитель', uk: 'Батьки' },
  'auth.roleParentDesc': { fr: 'Je cherche un coach', en: "I'm looking for a coach", ar: 'أبحث عن مدرّب', es: 'Busco un coach', ko: '코치를 찾고 있어요', zh: '我在找教练', ru: 'Ищу коуча', uk: 'Шукаю коуча' },
  'auth.roleCoach': { fr: 'Coach', en: 'Coach', ar: 'مدرّب', es: 'Coach', ko: '코치', zh: '教练', ru: 'Коуч', uk: 'Коуч' },
  'auth.roleCoachDesc': { fr: 'Je propose mes services', en: 'I offer my services', ar: 'أقدّم خدماتي', es: 'Ofrezco mis servicios', ko: '제 서비스를 제공해요', zh: '我提供服务', ru: 'Предлагаю свои услуги', uk: 'Пропоную свої послуги' },
  'auth.roleCommercial': { fr: 'Commercial', en: 'Sales partner', ar: 'مندوب', es: 'Comercial', ko: '영업 파트너', zh: '推广伙伴', ru: 'Партнёр', uk: 'Партнер' },
  'auth.roleCommercialDesc': { fr: 'Je recrute & je gagne', en: 'I recruit & earn', ar: 'أستقطب وأربح', es: 'Recluto y gano', ko: '모집하고 수익을 얻어요', zh: '我招募并赚钱', ru: 'Привлекаю и зарабатываю', uk: 'Залучаю та заробляю' },
  'auth.invited': { fr: 'Vous avez été invité(e) par un parrain. 🎁', en: 'You were invited by a referrer. 🎁', ar: 'لقد تمت دعوتك من قِبل أحد المُحيلين. 🎁', es: 'Has sido invitado por un padrino. 🎁', ko: '추천인의 초대를 받으셨습니다. 🎁', zh: '您受到了推荐人的邀请。🎁', ru: 'Вас пригласил реферер. 🎁', uk: 'Вас запросив реферер. 🎁' },
  'auth.createBtn': { fr: 'Créer mon compte', en: 'Create my account', ar: 'أنشئ حسابي', es: 'Crear mi cuenta', ko: '내 계정 만들기', zh: '创建我的账户', ru: 'Создать мой аккаунт', uk: 'Створити мій акаунт' },
  'auth.ph.passwordMin': { fr: '6 caractères min.', en: 'Min. 6 characters', ar: '6 أحرف على الأقل', es: 'Mín. 6 caracteres', ko: '최소 6자', zh: '至少6位', ru: 'Минимум 6 символов', uk: 'Мінімум 6 символів' },
  'auth.ph.repeat': { fr: 'Répétez', en: 'Repeat', ar: 'كرّر', es: 'Repite', ko: '다시 입력', zh: '重复', ru: 'Повторите', uk: 'Повторіть' },
};

function isValid(code) {
  return LANGUAGES.some((l) => l.code === code);
}

function dirFor(code) {
  const l = LANGUAGES.find((x) => x.code === code);
  return l ? l.dir : 'ltr';
}

// Traduit une clé ; repli sur le français puis sur la clé brute.
function t(lang, key) {
  const e = M[key];
  if (!e) return key;
  return e[lang] || e.fr || key;
}

module.exports = { LANGUAGES, M, isValid, dirFor, t };
